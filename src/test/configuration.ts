// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/
// region imports
import {
    copyFile, mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile
} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'

import {afterAll, beforeAll, describe, expect, test} from '@jest/globals'

import {
    createConfiguration,
    formatMasterKey,
    initializeVault,
    loadConfiguration,
    parseConfiguration,
    parseMasterKey,
    serializeConfiguration,
    UnsupportedVaultError,
    unlockMasterKey,
    WrongPasswordError
} from '../configuration'
import {
    VAULT_FIXTURE_MASTER_KEY,
    VAULT_FIXTURE_PASSWORD,
    VAULT_FIXTURE_PATH
} from '../fixture'
// endregion
const loadRawFixture = async (): Promise<Record<string, unknown>> =>
    JSON.parse(await readFile(
        join(VAULT_FIXTURE_PATH, 'gocryptfs.conf'), {encoding: 'utf-8'}
    )) as Record<string, unknown>

describe('configuration', () => {
    test('loadConfiguration', async () => {
        const configuration = await loadConfiguration(VAULT_FIXTURE_PATH)

        expect(configuration.creator).toStrictEqual('gocryptfs v2.6.1')
        expect(configuration.version).toStrictEqual(2)
        expect([...configuration.featureFlags].sort()).toStrictEqual(
            ['GCMIV128', 'HKDF', 'PlaintextNames']
        )
        expect(configuration.scrypt.n).toStrictEqual(1024)
        expect(configuration.scrypt.salt).toHaveLength(32)
    })
    test.each([
        [
            'encrypted names',
            {
                FeatureFlags: [
                    'HKDF', 'GCMIV128', 'DirIV', 'EMENames', 'LongNames',
                    'Raw64'
                ]
            },
            /misses: PlaintextNames; additionally uses: DirIV/
        ],
        [
            'xchacha',
            {FeatureFlags: ['HKDF', 'XChaCha20Poly1305', 'PlaintextNames']},
            /misses: GCMIV128; additionally uses: XChaCha20Poly1305/
        ],
        ['unknown flag', {FeatureFlags: ['Foo']}, /Unknown feature flag/],
        ['old version', {Version: 1}, /on-disk format version "1"/],
        [
            'weak scrypt',
            {
                ScryptObject: {
                    KeyLen: 32,
                    N: 512,
                    P: 1,
                    R: 8,
                    Salt: Buffer.alloc(32).toString('base64')
                }
            },
            /Invalid scrypt parameters/
        ]
    ])('parseConfiguration rejects %s', async (_, change, message) => {
        const content = JSON.stringify({...await loadRawFixture(), ...change})

        expect(() => parseConfiguration(content))
            .toThrow(UnsupportedVaultError)
        expect(() => parseConfiguration(content)).toThrow(message)
    })
    test('unlockMasterKey', async () => {
        const configuration = await loadConfiguration(VAULT_FIXTURE_PATH)

        expect((await unlockMasterKey(
            configuration, Buffer.from(VAULT_FIXTURE_PASSWORD)
        )).toString('hex')).toStrictEqual(VAULT_FIXTURE_MASTER_KEY)

        await expect(unlockMasterKey(configuration, Buffer.from('wrong')))
            .rejects.toThrow(WrongPasswordError)
    })
    test('parseMasterKey', () => {
        const grouped = VAULT_FIXTURE_MASTER_KEY.replace(/(.{8})(?!$)/g, '$1-')

        expect(parseMasterKey(grouped).toString('hex'))
            .toStrictEqual(VAULT_FIXTURE_MASTER_KEY)
        expect(() => parseMasterKey('abc')).toThrow('64 hex digits')
    })
    describe('creation', () => {
        let temporaryDirectory = ''
        beforeAll(async () => {
            temporaryDirectory =
                await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
        })
        afterAll(async () => {
            await rm(temporaryDirectory, {force: true, recursive: true})
        })

        test('createConfiguration / serializeConfiguration', async () => {
            const password = Buffer.from('secret')
            const {configuration, masterKey} =
                await createConfiguration(password, 10)
            const content = serializeConfiguration(configuration)

            // Same layout gocryptfs writes.
            const fixture = await readFile(
                join(VAULT_FIXTURE_PATH, 'gocryptfs.conf'), {encoding: 'utf-8'}
            )
            const getKeyPaths = (text: string) =>
                text.split('\n').map((line) => line.replace(/:.*/, ''))
            expect(getKeyPaths(content)).toStrictEqual(getKeyPaths(fixture))

            const parsed = parseConfiguration(content)
            expect(parsed.featureFlags)
                .toStrictEqual(['HKDF', 'GCMIV128', 'PlaintextNames'])
            expect(await unlockMasterKey(parsed, password))
                .toStrictEqual(masterKey)

            await expect(createConfiguration(password, 9))
                .rejects.toThrow('scrypt cost')
            await expect(createConfiguration(Buffer.alloc(0), 10))
                .rejects.toThrow('empty')
        })
        test('initializeVault', async () => {
            const vaultPath = join(temporaryDirectory, 'vault')
            const masterKey =
                await initializeVault(vaultPath, Buffer.from('secret'), 10)

            const configurationPath = join(vaultPath, 'gocryptfs.conf')
            expect((await stat(configurationPath)).mode & 0o777)
                .toStrictEqual(0o400)
            expect(await unlockMasterKey(
                await loadConfiguration(vaultPath), Buffer.from('secret')
            )).toStrictEqual(masterKey)

            await expect(
                initializeVault(vaultPath, Buffer.from('secret'), 10)
            ).rejects.toThrow('is not empty')

            const otherPath = join(temporaryDirectory, 'other')
            await mkdir(otherPath)
            await writeFile(join(otherPath, 'gocryptfs.conf.tmp'), '')
            await expect(
                initializeVault(otherPath, Buffer.from('secret'), 10)
            ).rejects.toThrow('is not empty')
        })
        test('initializeVault with a separate configuration file', async () => {
            const vaultPath = join(temporaryDirectory, 'separate-vault')
            const configurationPath =
                join(temporaryDirectory, 'separate.conf')
            const masterKey = await initializeVault(
                vaultPath, Buffer.from('secret'), 10, configurationPath
            )

            expect(await readdir(vaultPath)).toStrictEqual([])
            await expect(loadConfiguration(vaultPath))
                .rejects.toThrow('"--config"')
            expect(await unlockMasterKey(
                await loadConfiguration(vaultPath, configurationPath),
                Buffer.from('secret')
            )).toStrictEqual(masterKey)
        })
        test('loadConfiguration finds a hidden configuration file', async () => {
            const vaultPath = join(temporaryDirectory, 'hidden-vault')
            await mkdir(vaultPath)
            await copyFile(
                join(VAULT_FIXTURE_PATH, 'gocryptfs.conf'),
                join(vaultPath, '.gocryptfs.conf')
            )

            expect(await unlockMasterKey(
                await loadConfiguration(vaultPath),
                Buffer.from(VAULT_FIXTURE_PASSWORD)
            )).toStrictEqual(Buffer.from(VAULT_FIXTURE_MASTER_KEY, 'hex'))

            // The visible one takes precedence.
            await writeFile(join(vaultPath, 'gocryptfs.conf'), '{}')
            await expect(loadConfiguration(vaultPath)).rejects.toThrow()
        })
        test('formatMasterKey', () => {
            expect(formatMasterKey(
                Buffer.from(VAULT_FIXTURE_MASTER_KEY, 'hex')
            )).toStrictEqual(
                'b3ebda84-2b4858e9-29069755-1743b661-\n' +
                '1ef8f0ab-b924fd67-c90565a9-2c673654'
            )
        })
    })
})
