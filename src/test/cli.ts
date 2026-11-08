// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {existsSync} from 'fs'
import {mkdir, mkdtemp, readFile, rm, writeFile} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'

import {afterAll, beforeAll, describe, expect, test} from '@jest/globals'

import type {Output} from '../cli'
import {EXIT_CODES, isNested, run} from '../cli'
import {initializeVault} from '../configuration'
import type {Keychain} from '../keychain'
import type {Service} from '../service'
import {
    PLAIN_FIXTURE_PATH,
    VAULT_FIXTURE_MASTER_KEY,
    VAULT_FIXTURE_PASSWORD,
    VAULT_FIXTURE_PATH
} from '../fixture'
// endregion
const createOutput = (isTerminal = false) => {
    const result = {
        errors: [] as Array<string>,
        logs: [] as Array<string>,
        written: [] as Array<Buffer>
    }
    const output: Output = {
        error: (text) => result.errors.push(text),
        isTerminal,
        log: (text) => result.logs.push(text),
        write: (data) => {
            result.written.push(data)

            return Promise.resolve()
        }
    }

    return {output, result}
}

describe('cli', () => {
    let temporaryDirectory = ''
    let passwordFile = ''
    beforeAll(async () => {
        temporaryDirectory =
            await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
        passwordFile = join(temporaryDirectory, 'password')
        await writeFile(passwordFile, `${VAULT_FIXTURE_PASSWORD}\nignored\n`)
    })
    afterAll(async () => {
        await rm(temporaryDirectory, {force: true, recursive: true})
    })

    test('info', async () => {
        const {output, result} = createOutput()

        expect(await run(['info', VAULT_FIXTURE_PATH], output))
            .toStrictEqual(0)
        expect(result.logs[0]).toContain('HKDF GCMIV128 PlaintextNames')
    })
    test.each([
        ['--passfile', () => passwordFile],
        ['--masterkey', () => VAULT_FIXTURE_MASTER_KEY],
        ['--extpass', () => `echo ${VAULT_FIXTURE_PASSWORD}`]
    ])('cat with %s', async (option, getValue) => {
        const {output, result} = createOutput()

        expect(await run(
            ['cat', VAULT_FIXTURE_PATH, 'hello.txt', option, getValue()],
            output
        )).toStrictEqual(0)
        expect(Buffer.concat(result.written)).toStrictEqual(
            await readFile(join(PLAIN_FIXTURE_PATH, 'hello.txt'))
        )
    })
    test('decrypt', async () => {
        const {output, result} = createOutput()
        const target = join(temporaryDirectory, 'decrypted')

        expect(await run(
            ['decrypt', VAULT_FIXTURE_PATH, target, '--passfile', passwordFile],
            output
        )).toStrictEqual(0)
        expect(result.logs[0]).toStrictEqual(
            'Decrypted 7 files, 2 directories and 1 symbolic links.'
        )
        expect(await readFile(join(target, 'nested/Ünïcödé name.txt')))
            .toStrictEqual(await readFile(
                join(PLAIN_FIXTURE_PATH, 'nested/Ünïcödé name.txt')
            ))
    })
    test.each([
        [[], EXIT_CODES.usage],
        [['unknown'], EXIT_CODES.usage],
        [['info'], EXIT_CODES.usage],
        [['--unknown-option'], EXIT_CODES.usage],
        [['cat', 'vault', 'gocryptfs.conf'], EXIT_CODES.usage],
        [['decrypt', 'vault', 'vault/inside'], EXIT_CODES.usage],
        [['encrypt', 'source/vault', 'source'], EXIT_CODES.usage],
        [['sync', 'a', 'b', '--trash-days', '-1'], EXIT_CODES.usage],
        [['sync', 'a', 'b', '--trash-days', 'x'], EXIT_CODES.usage],
        [['info', '/not/existing'], EXIT_CODES.error],
        [['--help'], 0],
        [['--version'], 0]
    ])('run(%p) exits with %i', async (argv, code) => {
        expect(await run(argv, createOutput().output)).toStrictEqual(code)
    })
    test('wrong password', async () => {
        const {output, result} = createOutput()
        const wrongPasswordFile = join(temporaryDirectory, 'wrong')
        await writeFile(wrongPasswordFile, 'wrong\n')

        expect(await run(
            [
                'cat',
                VAULT_FIXTURE_PATH,
                'hello.txt',
                '--passfile',
                wrongPasswordFile
            ],
            output
        )).toStrictEqual(EXIT_CODES.wrongPassword)
        expect(result.errors).toStrictEqual(['Password incorrect.'])
    })
    test('isNested', () => {
        expect(isNested('/a', '/a')).toStrictEqual(true)
        expect(isNested('/a', '/a/b')).toStrictEqual(true)
        expect(isNested('/a/b', '/a')).toStrictEqual(true)
        expect(isNested('/a', '/ab')).toStrictEqual(false)
    })
    test('init, encrypt and decrypt round trip', async () => {
        const vault = join(temporaryDirectory, 'new-vault')
        const target = join(temporaryDirectory, 'round-trip')
        const options = ['--passfile', passwordFile]

        const initialization = createOutput(true)
        expect(await run(
            ['init', vault, '--scryptn', '10', ...options],
            initialization.output
        )).toStrictEqual(0)
        expect(initialization.result.logs[1]).toMatch(
            /Your master key is:\n\n {4}([0-9a-f]{8}-){4}\n {4}([0-9a-f]{8}-){3}[0-9a-f]{8}\n/
        )

        const encryption = createOutput()
        expect(await run(
            ['encrypt', PLAIN_FIXTURE_PATH, vault, ...options],
            encryption.output
        )).toStrictEqual(0)
        expect(encryption.result.logs).toStrictEqual(
            ['Encrypted 7 files, 2 directories and 1 symbolic links.']
        )

        expect(await run(
            ['decrypt', vault, target, ...options], createOutput().output
        )).toStrictEqual(0)
        expect(await readFile(join(target, 'nested/deeper/multi-block.bin')))
            .toStrictEqual(await readFile(
                join(PLAIN_FIXTURE_PATH, 'nested/deeper/multi-block.bin')
            ))
    })
    test('init', async () => {
        const nonEmpty = join(temporaryDirectory, 'non-empty')
        await mkdir(nonEmpty)
        await writeFile(join(nonEmpty, 'file'), '')

        const {output, result} = createOutput()
        expect(await run(
            ['init', nonEmpty, '--scryptn', '10', '--passfile', passwordFile],
            output
        )).toStrictEqual(EXIT_CODES.error)
        expect(result.errors[0]).toContain('is not empty')

        // The master key is never shown when not running in a terminal.
        const quiet = createOutput()
        expect(await run(
            [
                'init',
                join(temporaryDirectory, 'quiet-vault'),
                '--scryptn',
                '10',
                '--passfile',
                passwordFile
            ],
            quiet.output
        )).toStrictEqual(0)
        expect(quiet.result.logs.join('')).not.toContain('master key')

        expect(await run(
            [
                'init',
                join(temporaryDirectory, 'any'),
                '--masterkey',
                VAULT_FIXTURE_MASTER_KEY
            ],
            createOutput().output
        )).toStrictEqual(EXIT_CODES.usage)
        const invalid = join(temporaryDirectory, 'invalid-scrypt-cost')
        expect(await run(
            ['init', invalid, '--scryptn', '5', '--passfile', passwordFile],
            createOutput().output
        )).toStrictEqual(EXIT_CODES.error)
        // Invalid parameters never leave a directory behind.
        expect(existsSync(invalid)).toStrictEqual(false)
    })
    test('encrypt refuses a wrong master key', async () => {
        const {output, result} = createOutput()

        expect(await run(
            [
                'encrypt',
                PLAIN_FIXTURE_PATH,
                VAULT_FIXTURE_PATH,
                '--masterkey',
                '00'.repeat(32)
            ],
            output
        )).toStrictEqual(EXIT_CODES.wrongPassword)
        expect(result.errors)
            .toStrictEqual(['Master key does not match the vault content.'])
    })
    describe('configured pairs', () => {
        const passwords = new Map<string, string>()
        const keychain: Keychain = {
            delete: (name) => {
                passwords.delete(name)

                return Promise.resolve()
            },
            load: (name) => Promise.resolve(passwords.get(name) ?? ''),
            store: (name, password) => {
                passwords.set(name, password)

                return Promise.resolve()
            }
        }
        const serviceCalls: Array<string> = []
        const service: Service = {
            install: () => Promise.resolve(String(serviceCalls.push('install'))),
            status: () => Promise.resolve(String(serviceCalls.push('status'))),
            uninstall: () =>
                Promise.resolve(String(serviceCalls.push('uninstall')))
        }
        const runWithPairs = (argv: Array<string>, signal?: AbortSignal) => {
            const {output, result} = createOutput()

            return run(argv, output, {keychain, service, signal})
                .then((code) => ({code, ...result}))
        }

        let vault = ''
        let plain = ''
        beforeAll(async () => {
            process.env.GOCRYPTFS_STANDALONE_CONFIGURATION_DIRECTORY =
                join(temporaryDirectory, 'configuration')
            vault = join(temporaryDirectory, 'pair-vault')
            plain = join(temporaryDirectory, 'pair-plain')
            await initializeVault(vault, Buffer.from('secret'), 10)
        })
        afterAll(() => {
            delete process.env.GOCRYPTFS_STANDALONE_CONFIGURATION_DIRECTORY
            delete process.env.GOCRYPTFS_PASSWORD
        })

        test('pair add, list, sync, daemon and remove', async () => {
            expect((await runWithPairs(['sync'])).errors[0])
                .toContain('No pairs configured')

            // Wrong passwords are never stored.
            process.env.GOCRYPTFS_PASSWORD = 'wrong'
            expect((await runWithPairs(['pair', 'add', 'docs', plain, vault])).code)
                .toStrictEqual(EXIT_CODES.wrongPassword)
            expect(passwords.size).toStrictEqual(0)

            process.env.GOCRYPTFS_PASSWORD = 'secret'
            expect((await runWithPairs([
                'pair', 'add', 'docs', plain, vault, '--interval', '1h',
                '--exclude', '*.tmp'
            ])).code).toStrictEqual(0)
            delete process.env.GOCRYPTFS_PASSWORD
            expect(passwords.get('docs')).toStrictEqual('secret')

            expect((await runWithPairs(['pair', 'add', 'docs', plain, vault]))
                .errors).toStrictEqual(['Pair "docs" already exists.'])
            expect((await runWithPairs(['pair', 'add', 'a b', plain, vault]))
                .code).toStrictEqual(EXIT_CODES.usage)

            const listing = await runWithPairs(['pair', 'list'])
            expect(listing.logs[0]).toContain('interval:  3600s')
            expect(listing.logs[0]).toContain('password:  "keychain"')
            expect(listing.logs[0]).toContain('.DS_Store')
            expect(listing.logs[0]).toContain('*.tmp')

            // Password comes from the keychain now.
            await writeFile(join(temporaryDirectory, 'note.txt'), 'note')
            await mkdir(plain, {recursive: true})
            await writeFile(join(plain, 'a.txt'), 'a')
            await writeFile(join(plain, 'ignored.tmp'), 'tmp')
            const synchronisation = await runWithPairs(['sync', 'docs'])
            expect(synchronisation.code).toStrictEqual(0)
            expect(synchronisation.logs)
                .toStrictEqual(['encrypt a.txt', 'Applied 1 changes.'])

            expect((await runWithPairs(['sync', 'unknown'])).errors[0])
                .toContain('Unknown pair "unknown"')

            // The daemon runs until stopped.
            const controller = new AbortController()
            await writeFile(join(plain, 'b.txt'), 'b')
            setTimeout(() => {
                controller.abort()
            }, 200)
            const daemon = await runWithPairs(['daemon'], controller.signal)
            expect(daemon.code).toStrictEqual(0)
            expect(daemon.logs.map((line) => line.replace(/^\S+ /, '')))
                .toStrictEqual([
                    'Started synchronizing "docs" every 3600s.',
                    '"docs": encrypt b.txt',
                    '"docs": Applied 1 changes.',
                    'Stopped.'
                ])

            expect((await runWithPairs(['service', 'install'])).code)
                .toStrictEqual(0)
            expect((await runWithPairs(['service', 'unknown'])).code)
                .toStrictEqual(EXIT_CODES.usage)

            expect((await runWithPairs(['pair', 'remove', 'docs'])).code)
                .toStrictEqual(0)
            expect(passwords.size).toStrictEqual(0)
            expect((await runWithPairs(['pair', 'list'])).logs)
                .toStrictEqual(['No pairs configured.'])
        })
        test('service refuses pairs needing interactive passwords', async () => {
            expect((await runWithPairs([
                'pair', 'add', 'interactive', plain, vault, '--password', 'prompt'
            ])).code).toStrictEqual(0)

            const installation = await runWithPairs(['service', 'install'])
            expect(installation.code).toStrictEqual(EXIT_CODES.usage)
            expect(installation.errors[0]).toContain('"interactive"')

            await runWithPairs(['pair', 'remove', 'interactive'])
        })
    })
})
