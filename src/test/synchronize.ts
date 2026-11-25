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
    chmod,
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
    acquireLock,
    getPairDirectory,
    loadState,
    LockedError,
    purgeTrash,
    saveState,
    STATE_FILE_NAME
} from '../state'
import {
    findCaseCollisions,
    hasSameContent,
    isSynchronized,
    removePlaintext,
    synchronize
} from '../synchronize'
import {transformFile} from '../tree'
import type {Action, Change, SynchronizationResult} from '../type'
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

const syncWithResult = async (
    seal = false, excludes: Array<string> = []
): Promise<SynchronizationResult & {changes: Array<Action>}> => {
    const changes: Array<Action> = []
    const result = await synchronize({
        configurationDirectory,
        date: DATE,
        excludes: createExcludeMatcher(excludes),
        host: 'host',
        key,
        onAction: (action) => {
            if (!['forget', 'record'].includes(action.type))
                changes.push(action)
        },
        plainPath: plain,
        seal,
        vaultPath: vault
    })

    expect(result.failed).toStrictEqual([])

    return {...result, changes}
}
const getState = async () => (await loadState(
    getPairDirectory(plain, vault, configurationDirectory), plain, vault
)).state
const setState = async (
    change: (state: Awaited<ReturnType<typeof getState>>) => void
) => {
    const state = await getState()
    change(state)
    await saveState(
        getPairDirectory(plain, vault, configurationDirectory), state
    )
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

    test('initial synchronization merges both sides', async () => {
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
    test('change time only changes are verified by content', async () => {
        await writePlain('a.txt', 'abc')
        await sync()

        await chmod(join(plain, 'a.txt'), 0o600)

        expect(await sync()).toStrictEqual([])
        expect(await readCipher('a.txt')).toStrictEqual('abc')
    })
    test('same sized edits keeping their mtime are transferred', async () => {
        await writePlain('a.txt', 'abc')
        await sync()

        const path = join(plain, 'a.txt')
        const {atimeMs, mtimeMs} = await lstat(path)
        await writeFile(path, 'xyz')
        await utimes(path, atimeMs / 1000, mtimeMs / 1000)
        expect((await lstat(path)).mtimeMs).toStrictEqual(mtimeMs)

        expect(await sync())
            .toStrictEqual([{type: 'transfer', path: 'a.txt', from: 'plain'}])
        expect(await readCipher('a.txt')).toStrictEqual('xyz')
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
            .toStrictEqual(['conflict other.txt'])
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
    test('a running synchronization locks the pair', async () => {
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
    test('isSynchronized only accepts our own changes', async () => {
        const check = (...changes: Array<Change>) => isSynchronized(
            {configurationDirectory, plainPath: plain, vaultPath: vault},
            changes
        )

        // Without any state nothing counts as synchronized.
        await writePlain('dir/a.txt', 'a')
        expect(await check({path: 'dir/a.txt', side: 'plain'}))
            .toStrictEqual(false)

        await sync()
        // Everything the synchronization wrote, including directories.
        expect(await check(
            {path: 'dir', side: 'cipher'},
            {path: 'dir/a.txt', side: 'cipher'},
            {path: 'dir/a.txt', side: 'plain'},
            // Gone entries the state does not know either.
            {path: 'gone.txt', side: 'plain'}
        )).toStrictEqual(true)

        // Unknown paths could be anything.
        expect(await check({path: null, side: 'plain'})).toStrictEqual(false)
        expect(await check({path: '', side: 'cipher'})).toStrictEqual(false)

        await writePlain('dir/b.txt', 'b')
        expect(await check(
            {path: 'dir/a.txt', side: 'plain'},
            {path: 'dir/b.txt', side: 'plain'}
        )).toStrictEqual(false)

        await writeCipher('dir/a.txt', 'changed')
        expect(await check({path: 'dir/a.txt', side: 'cipher'}))
            .toStrictEqual(false)

        await rm(join(plain, 'dir'), {recursive: true})
        expect(await check({path: 'dir', side: 'plain'})).toStrictEqual(false)
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
    test('sealing removes synchronized plaintext, a run restores it', async () => {
        await writePlain('a.txt', 'a')
        await writePlain('dir/b.txt', 'b')
        await writePlain('dir/nested/c.txt', 'c')
        await writePlain('note.log', 'excluded')
        await symlink('a.txt', join(plain, 'link'))

        const sealed = await syncWithResult(true, ['*.log'])
        expect(sealed.changes).toHaveLength(6)
        expect(sealed.unsealed).toBeUndefined()
        expect(sealed.seal).toStrictEqual({
            kept: [{path: 'note.log', reason: 'Excluded from synchronization.'}],
            removed: 6
        })
        expect(await readdir(plain)).toStrictEqual(['note.log'])
        expect((await getState()).seal).toStrictEqual('sealed')

        // Missing plaintext is restored, nothing gets deleted in the vault.
        await writeCipher('dir/b.txt', 'remote')
        const restored = await syncWithResult(false, ['*.log'])
        expect(restored.unsealed).toStrictEqual(true)
        expect(restored.changes).toStrictEqual([
            {type: 'createDirectory', path: 'dir', side: 'plain'},
            {type: 'createDirectory', path: 'dir/nested', side: 'plain'},
            {type: 'transfer', path: 'a.txt', from: 'cipher'},
            {type: 'transfer', path: 'dir/b.txt', from: 'cipher'},
            {type: 'transfer', path: 'dir/nested/c.txt', from: 'cipher'},
            {type: 'transfer', path: 'link', from: 'cipher'}
        ])
        expect(await readPlain('dir/b.txt')).toStrictEqual('remote')
        expect(await readPlain('dir/nested/c.txt')).toStrictEqual('c')
        expect(await readlink(join(plain, 'link'))).toStrictEqual('a.txt')
        expect(await readPlain('note.log')).toStrictEqual('excluded')
        expect((await getState()).seal).toBeUndefined()

        expect((await syncWithResult(false, ['*.log'])).changes)
            .toStrictEqual([])
    })
    test('sealing keeps plaintext the vault does not hold', async () => {
        await writePlain('changed.txt', 'one')
        await writePlain('remote.txt', 'one')
        await writePlain('same.txt', 'one')
        await sync()

        await writePlain('changed.txt', 'two')
        await writeCipher('remote.txt', 'two')
        await writePlain('new/new.txt', 'new')

        expect(await removePlaintext(
            {cipher: vault, plain}, (await getState()).entries
        )).toStrictEqual({
            kept: [
                {
                    path: 'changed.txt',
                    reason: 'Changed since the last synchronization.'
                },
                {
                    path: 'new/new.txt',
                    reason: 'Not synchronized to the vault (yet).'
                },
                {
                    path: 'remote.txt',
                    reason: 'The vault version changed since the last ' +
                        'synchronization.'
                }
            ],
            removed: 1
        })
        expect((await readdir(plain)).sort())
            .toStrictEqual(['changed.txt', 'new', 'remote.txt'])
    })
    test('an interrupted seal restores instead of deleting', async () => {
        await writePlain('removed.txt', 'removed')
        await writePlain('kept.txt', 'kept')
        await writePlain('deleted-remotely.txt', 'deleted')
        await sync()

        // Crashed while removing: only parts of the plaintext are gone.
        await setState((state) => {
            state.seal = 'sealing'
        })
        await rm(join(plain, 'removed.txt'))
        await rm(join(vault, 'deleted-remotely.txt'))

        const result = await syncWithResult()
        expect(result.changes).toStrictEqual([
            {type: 'trash', path: 'deleted-remotely.txt', side: 'plain'},
            {type: 'transfer', path: 'removed.txt', from: 'cipher'}
        ])
        expect(result.unsealed).toStrictEqual(true)
        expect(await readPlain('removed.txt')).toStrictEqual('removed')
        expect(await readCipher('removed.txt')).toStrictEqual('removed')

        // Afterwards deletions count again.
        await rm(join(plain, 'removed.txt'))
        expect(await sync()).toStrictEqual(
            [{type: 'trash', path: 'removed.txt', side: 'cipher'}]
        )
    })
    test('failed restores keep the seal', async () => {
        await writePlain('a.txt', 'a')
        await syncWithResult(true)

        // Destroys the encrypted content, so decrypting fails.
        await writeFile(join(vault, 'a.txt'), 'corrupt')
        const result = await synchronize({
            configurationDirectory,
            date: DATE,
            host: 'host',
            key,
            plainPath: plain,
            vaultPath: vault
        })
        expect(result.failed).toHaveLength(1)
        expect(result.unsealed).toBeUndefined()
        expect((await getState()).seal).toStrictEqual('sealed')
        expect(await exists(join(vault, 'a.txt'))).toStrictEqual(true)
    })
    test('states of version 1 are taken over, unknown seals refused', async () => {
        await writePlain('a.txt', 'a')
        await sync()

        const path = join(
            getPairDirectory(plain, vault, configurationDirectory),
            STATE_FILE_NAME
        )
        const state = JSON.parse(await readFile(path, {encoding: 'utf-8'})) as
            Record<string, unknown>
        expect(state.version).toStrictEqual(2)

        await writeFile(path, JSON.stringify({...state, version: 1}))
        expect(await loadState(
            getPairDirectory(plain, vault, configurationDirectory), plain, vault
        )).toStrictEqual({state: {...state, version: 2}})

        await writeFile(path, JSON.stringify({...state, seal: 'unknown'}))
        expect((await loadState(
            getPairDirectory(plain, vault, configurationDirectory), plain, vault
        )).warning).toContain('Ignoring unusable synchronization state')
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
