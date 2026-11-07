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
    lstat,
    mkdir,
    mkdtemp,
    readdir,
    readFile,
    readlink,
    rm,
    symlink,
    utimes,
    writeFile
} from 'fs/promises'
import {tmpdir} from 'os'
import {dirname, join} from 'path'

import {afterAll, beforeEach, describe, expect, test} from '@jest/globals'

import {initializeVault} from '../configuration'
import {createExcludeMatcher} from '../exclude'
import {
    decryptFileContent, deriveContentKey, encryptFileContent
} from '../content'
import {
    acquireLock, getPairDirectory, LockedError, purgeTrash
} from '../state'
import {
    findCaseCollisions, hasSameContent, synchronize
} from '../synchronize'
import {transformFile} from '../tree'
import type {Action} from '../type'
// endregion
const DATE = new Date(2026, 10, 7, 13, 4, 5)
const CONFLICT_SUFFIX = '(conflict host 2026-11-07 13-04-05)'

let root = ''
let plain = ''
let vault = ''
let configurationDirectory = ''
let key: Buffer = Buffer.alloc(0)
// Increasing modification times make every write detectable.
let time = 1_700_000_000

const write = async (path: string, content: string) => {
    await mkdir(dirname(path), {recursive: true})
    await writeFile(path, content)
    time += 10
    await utimes(path, time, time)
}
const writePlain = (path: string, content: string) =>
    write(join(plain, path), content)
// Simulates a change made by another machine in the synchronized vault.
const writeCipher = async (path: string, content: string) => {
    const source = join(root, 'source')
    await write(source, content)
    await mkdir(dirname(join(vault, path)), {recursive: true})
    await transformFile(encryptFileContent, key, source, join(vault, path))
}
const readCipher = async (path: string): Promise<string> => {
    const target = join(root, 'target')
    await transformFile(decryptFileContent, key, join(vault, path), target)

    return readFile(target, {encoding: 'utf-8'})
}
const readPlain = (path: string) =>
    readFile(join(plain, path), {encoding: 'utf-8'})
const exists = async (path: string) => {
    try {
        await lstat(path)

        return true
    } catch {
        return false
    }
}

const sync = async (dryRun = false, excludes: Array<string> = []) => {
    const actions: Array<Action> = []
    const result = await synchronize({
        configurationDirectory,
        date: DATE,
        dryRun,
        excludes: createExcludeMatcher(excludes),
        host: 'host',
        key,
        onAction: (action) => actions.push(action),
        plainPath: plain,
        vaultPath: vault
    })

    expect(result.failed).toStrictEqual([])

    return actions.filter(({type}) => !['forget', 'record'].includes(type))
}

describe('synchronize', () => {
    beforeEach(async () => {
        root = await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
        plain = join(root, 'plain')
        vault = join(root, 'vault')
        configurationDirectory = join(root, 'configuration')
        key = deriveContentKey(
            await initializeVault(vault, Buffer.from('secret'), 10)
        )
    })
    afterAll(async () => {
        await rm(root, {force: true, recursive: true})
    })

    test('initial synchronisation merges both sides', async () => {
        await writeCipher('remote/a.txt', 'remote')
        await writePlain('local/b.txt', 'local')
        await mkdir(join(plain, 'empty'))

        expect(await sync()).toStrictEqual([
            {type: 'createDirectory', path: 'empty', side: 'cipher'},
            {type: 'createDirectory', path: 'local', side: 'cipher'},
            {type: 'createDirectory', path: 'remote', side: 'plain'},
            {type: 'transfer', path: 'local/b.txt', from: 'plain'},
            {type: 'transfer', path: 'remote/a.txt', from: 'cipher'}
        ])
        expect(await readPlain('remote/a.txt')).toStrictEqual('remote')
        expect(await readCipher('local/b.txt')).toStrictEqual('local')
        expect(await exists(join(vault, 'empty'))).toStrictEqual(true)
        // Modification times are mirrored.
        expect((await lstat(join(vault, 'local/b.txt'))).mtimeMs)
            .toStrictEqual((await lstat(join(plain, 'local/b.txt'))).mtimeMs)

        // Nothing left to do afterwards.
        expect(await sync()).toStrictEqual([])
    })
    test('changes propagate in both directions', async () => {
        await writePlain('a.txt', 'one')
        await writePlain('b.txt', 'one')
        await sync()

        await writePlain('a.txt', 'two')
        await writeCipher('b.txt', 'three')

        expect(await sync()).toStrictEqual([
            {type: 'transfer', path: 'a.txt', from: 'plain'},
            {type: 'transfer', path: 'b.txt', from: 'cipher'}
        ])
        expect(await readCipher('a.txt')).toStrictEqual('two')
        expect(await readPlain('b.txt')).toStrictEqual('three')
        expect(await sync()).toStrictEqual([])
    })
    test('deletions are moved into the trash', async () => {
        await writePlain('a.txt', 'a')
        await writePlain('dir/b.txt', 'b')
        await sync()

        await rm(join(plain, 'a.txt'))
        await rm(join(vault, 'dir'), {recursive: true})

        expect(await sync()).toStrictEqual([
            {type: 'trash', path: 'a.txt', side: 'cipher'},
            {type: 'trash', path: 'dir/b.txt', side: 'plain'},
            {type: 'removeDirectory', path: 'dir', side: 'plain'}
        ])
        expect(await exists(join(vault, 'a.txt'))).toStrictEqual(false)
        expect(await exists(join(plain, 'dir'))).toStrictEqual(false)

        const trash = join(
            getPairDirectory(plain, vault, configurationDirectory),
            'trash',
            DATE.toISOString().replace(/:/g, '-')
        )
        expect(await readFile(
            join(trash, 'plaintext/dir/b.txt'), {encoding: 'utf-8'}
        )).toStrictEqual('b')
        // Vault files stay encrypted in the trash.
        expect(await exists(join(trash, 'vault/a.txt'))).toStrictEqual(true)

        expect(await sync()).toStrictEqual([])
    })
    test('changes on both sides keep both versions', async () => {
        await writePlain('a.txt', 'base')
        await sync()

        await writePlain('a.txt', 'local change')
        await writeCipher('a.txt', 'remote change, newer')

        expect(await sync()).toStrictEqual([{
            type: 'conflict',
            path: 'a.txt',
            conflictPath: `a ${CONFLICT_SUFFIX}.txt`,
            loser: 'plain'
        }])
        expect(await readPlain('a.txt')).toStrictEqual('remote change, newer')
        expect(await readCipher('a.txt')).toStrictEqual('remote change, newer')
        expect(await readPlain(`a ${CONFLICT_SUFFIX}.txt`))
            .toStrictEqual('local change')
        expect(await readCipher(`a ${CONFLICT_SUFFIX}.txt`))
            .toStrictEqual('local change')

        expect(await sync()).toStrictEqual([])
    })
    test('existing equal copies are recognized without state', async () => {
        await writePlain('same.txt', 'equal')
        await writeCipher('same.txt', 'equal')
        await writePlain('other.txt', 'abc')
        await writeCipher('other.txt', 'xyz')

        const actions = await sync()

        expect(actions.map(({path, type}) => `${type} ${path}`))
            .toStrictEqual(['compare other.txt', 'compare same.txt'])
        expect((await readdir(plain)).sort()).toStrictEqual([
            'other (conflict host 2026-11-07 13-04-05).txt',
            'other.txt',
            'same.txt'
        ])
        expect(await readPlain('other.txt')).toStrictEqual('xyz')
        expect(await sync()).toStrictEqual([])
    })
    test('dry run changes nothing', async () => {
        await writePlain('a.txt', 'a')

        expect(await sync(true)).toStrictEqual(
            [{type: 'transfer', path: 'a.txt', from: 'plain'}]
        )
        expect(await exists(join(vault, 'a.txt'))).toStrictEqual(false)
        expect(await sync(true)).toHaveLength(1)
    })
    test('symbolic links are synchronized', async () => {
        await writePlain('a.txt', 'a')
        await sync()
        await rm(join(vault, 'a.txt'))
        await symlink('target', join(plain, 'link'))

        expect(await sync()).toStrictEqual([
            {type: 'trash', path: 'a.txt', side: 'plain'},
            {type: 'transfer', path: 'link', from: 'plain'}
        ])
        expect(await readlink(join(vault, 'link'))).toStrictEqual('target')
    })
    test('a running synchronisation locks the pair', async () => {
        const release = await acquireLock(
            getPairDirectory(plain, vault, configurationDirectory)
        )

        await expect(synchronize({
            configurationDirectory, key, plainPath: plain, vaultPath: vault
        })).rejects.toThrow(LockedError)

        await release()
        await expect(synchronize({
            configurationDirectory, key, plainPath: plain, vaultPath: vault
        })).resolves.toBeDefined()
    })
    test('hasSameContent', async () => {
        await writePlain('a', 'x'.repeat(5000))
        await writeCipher('a', 'x'.repeat(5000))
        await writePlain('b', 'x'.repeat(5000))
        await writeCipher('b', `${'x'.repeat(4999)}y`)

        expect(await hasSameContent(key, join(plain, 'a'), join(vault, 'a')))
            .toStrictEqual(true)
        expect(await hasSameContent(key, join(plain, 'b'), join(vault, 'b')))
            .toStrictEqual(false)
    })
    test('findCaseCollisions', () => {
        expect(findCaseCollisions(['a/B.txt', 'a/b.txt', 'c']))
            .toStrictEqual(new Set(['a/B.txt', 'a/b.txt']))
    })
    test('excluded entries are left alone on both sides', async () => {
        await writePlain('a.txt', 'a')
        await writePlain('cache/big.bin', 'big')
        await writeCipher('remote.tmp', 'tmp')
        const excludes = ['*.tmp', 'cache/']

        expect(await sync(false, excludes)).toStrictEqual(
            [{type: 'transfer', path: 'a.txt', from: 'plain'}]
        )
        expect(await exists(join(vault, 'cache'))).toStrictEqual(false)
        expect(await exists(join(plain, 'remote.tmp'))).toStrictEqual(false)

        // Excluding something already synchronized never deletes it.
        expect(await sync(false, [...excludes, 'a.txt'])).toStrictEqual([])
        expect(await exists(join(vault, 'a.txt'))).toStrictEqual(true)
        expect(await exists(join(plain, 'a.txt'))).toStrictEqual(true)
        // Without the pattern again it is still known as synchronized.
        expect(await sync(false, excludes)).toStrictEqual([])
        expect((await readdir(plain)).sort())
            .toStrictEqual(['a.txt', 'cache'])
    })
    test('purgeTrash keeps entries for the configured time', async () => {
        const pairDirectory =
            getPairDirectory(plain, vault, configurationDirectory)
        const trash = join(pairDirectory, 'trash')
        const old = new Date(2026, 9, 1)
        const recent = new Date(2026, 10, 1)
        for (const date of [old, recent])
            await write(
                join(trash, date.toISOString().replace(/:/g, '-'), 'x'), ''
            )

        await purgeTrash(pairDirectory, 30, DATE)
        expect(await readdir(trash)).toStrictEqual(
            [recent.toISOString().replace(/:/g, '-')]
        )

        await purgeTrash(pairDirectory, 0, DATE)
        expect(await readdir(trash)).toStrictEqual([])
    })
})
