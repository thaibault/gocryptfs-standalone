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
import {
    cp, lstat, mkdir, mkdtemp, readdir, readFile, readlink, rm, writeFile
} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'

import {afterAll, beforeAll, describe, expect, test} from '@jest/globals'

import {deriveContentKey} from '../content'
import {createExcludeMatcher} from '../exclude'
import {
    decryptFile,
    decryptTree,
    encryptFile,
    encryptTree,
    findSampleFile,
    isInternalPath
} from '../tree'
import {
    PLAIN_FIXTURE_PATH, VAULT_FIXTURE_MASTER_KEY, VAULT_FIXTURE_PATH
} from '../fixture'
// endregion
const KEY = deriveContentKey(Buffer.from(VAULT_FIXTURE_MASTER_KEY, 'hex'))

const listTree = async (root: string): Promise<Array<string>> =>
    (await readdir(root, {recursive: true})).map(String).sort()

describe('tree', () => {
    let temporaryDirectory = ''
    beforeAll(async () => {
        temporaryDirectory =
            await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
    })
    afterAll(async () => {
        await rm(temporaryDirectory, {force: true, recursive: true})
    })

    test('isInternalPath', () => {
        expect(isInternalPath('gocryptfs.conf')).toStrictEqual(true)
        expect(isInternalPath('a/gocryptfs.conf')).toStrictEqual(false)
        expect(isInternalPath('a/.gocryptfs-standalone-1234-b'))
            .toStrictEqual(true)
        expect(isInternalPath('a/b')).toStrictEqual(false)
    })
    test('decryptTree reproduces the gocryptfs mount view', async () => {
        const target = join(temporaryDirectory, 'decrypted')
        const progress: Array<string> = []

        const result = await decryptTree(
            KEY,
            VAULT_FIXTURE_PATH,
            target,
            undefined,
            (path) => progress.push(path)
        )

        expect(result).toStrictEqual({
            directories: 2, files: 7, skipped: [], symbolicLinks: 1
        })
        expect(progress).toContain('nested/deeper/multi-block.bin')
        expect(await listTree(target))
            .toStrictEqual(await listTree(PLAIN_FIXTURE_PATH))

        for (const path of await listTree(PLAIN_FIXTURE_PATH)) {
            const expectedStats = await lstat(join(PLAIN_FIXTURE_PATH, path))
            const stats = await lstat(join(target, path))

            if (expectedStats.isSymbolicLink())
                expect(await readlink(join(target, path))).toStrictEqual(
                    await readlink(join(PLAIN_FIXTURE_PATH, path))
                )
            else if (expectedStats.isFile()) {
                expect(await readFile(join(target, path))).toStrictEqual(
                    await readFile(join(PLAIN_FIXTURE_PATH, path))
                )
                // NOTE: Git does not preserve modification times, so compare
                // against the encrypted counterpart gocryptfs mirrors them
                // from.
                expect(Math.abs(
                    stats.mtimeMs -
                    (await lstat(join(VAULT_FIXTURE_PATH, path))).mtimeMs
                )).toBeLessThan(0.01)
                expect(stats.mode).toStrictEqual(expectedStats.mode)
            }
        }
    })
    test('encryptFile / decryptFile round trip', async () => {
        const plainPath = join(temporaryDirectory, 'plain.txt')
        const cipherPath = join(temporaryDirectory, 'cipher.txt')
        const decryptedPath = join(temporaryDirectory, 'decrypted.txt')
        await writeFile(plainPath, 'round trip\n')

        await encryptFile(KEY, plainPath, cipherPath)
        await decryptFile(KEY, cipherPath, decryptedPath)

        expect(await readFile(decryptedPath, {encoding: 'utf-8'}))
            .toStrictEqual('round trip\n')
        expect(Math.abs(
            (await lstat(decryptedPath)).mtimeMs -
            (await lstat(plainPath)).mtimeMs
        )).toBeLessThan(0.01)
        // No temporary files are left behind.
        expect((await readdir(temporaryDirectory)).filter((name) =>
            name.startsWith('.gocryptfs-standalone-')
        )).toStrictEqual([])
    })
    test('encryptTree / decryptTree round trip', async () => {
        const source = join(temporaryDirectory, 'source')
        const vault = join(temporaryDirectory, 'vault')
        const target = join(temporaryDirectory, 'target')
        await cp(PLAIN_FIXTURE_PATH, source, {
            preserveTimestamps: true, recursive: true, verbatimSymlinks: true
        })
        // Reserved and temporary names must not end up in the vault.
        await writeFile(join(source, 'gocryptfs.conf'), 'reserved')
        await writeFile(join(source, '.gocryptfs-standalone-1-x'), 'tmp')
        await mkdir(join(source, 'empty directory'))

        const result = await encryptTree(KEY, source, vault)

        expect(result).toStrictEqual({
            directories: 3,
            files: 7,
            skipped: [{
                path: 'gocryptfs.conf',
                reason: 'The name "gocryptfs.conf" is reserved in the vault ' +
                    'root.'
            }],
            symbolicLinks: 1
        })
        expect((await readdir(vault)).sort()).not.toContain(
            '.gocryptfs-standalone-1-x'
        )
        // Content is really encrypted.
        expect(await readFile(join(vault, 'hello.txt'))).not.toStrictEqual(
            await readFile(join(source, 'hello.txt'))
        )

        await rm(join(source, 'gocryptfs.conf'))
        await rm(join(source, '.gocryptfs-standalone-1-x'))
        await decryptTree(KEY, vault, target)

        expect(await listTree(target)).toStrictEqual(await listTree(source))
        for (const path of await listTree(source))
            if ((await lstat(join(source, path))).isFile())
                expect(await readFile(join(target, path)))
                    .toStrictEqual(await readFile(join(source, path)))
    })
    test('findSampleFile', async () => {
        expect(await findSampleFile(VAULT_FIXTURE_PATH)).toMatch(
            /\/(block-exact|block-plus-one|hello|sparse)\.(bin|txt)$/
        )

        const emptyVault = join(temporaryDirectory, 'empty-vault')
        await mkdir(join(emptyVault, 'sub'), {recursive: true})
        await writeFile(join(emptyVault, 'gocryptfs.conf'), '{}')
        await writeFile(join(emptyVault, 'sub/empty'), '')
        expect(await findSampleFile(emptyVault)).toStrictEqual(null)
    })
    test('decryptTree with excludes', async () => {
        const target = join(temporaryDirectory, 'partially-decrypted')

        const result = await decryptTree(
            KEY,
            VAULT_FIXTURE_PATH,
            target,
            createExcludeMatcher(['*.bin', 'deeper/'])
        )

        expect(result.files).toStrictEqual(3)
        expect(await listTree(target)).toStrictEqual([
            'empty.txt',
            'hello.txt',
            'link-to-hello',
            'nested',
            'nested/Ünïcödé name.txt'
        ])
    })
})
