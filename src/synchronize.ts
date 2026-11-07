// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module synchronize */
'use strict'
/* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

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
    lstat, mkdir, open, readdir, readlink, rename, rm, rmdir, symlink,
    writeFile
} from 'fs/promises'
import {hostname} from 'os'
import {dirname, join, posix, resolve} from 'path'

import {CONFIGURATION_FILE_NAME} from './configuration'
import {decryptFileContent, encryptFileContent} from './content'
import {excludeNothing} from './exclude'
import type {ExcludeMatcher} from './exclude'
import {createPlan, getOtherSide, isSameSnapshot} from './plan'
import {
    acquireLock,
    DEFAULT_TRASH_RETENTION_IN_DAYS,
    getConfigurationDirectory,
    getPairDirectory,
    getTrashDirectory,
    loadState,
    move,
    purgeTrash,
    saveState
} from './state'
import {
    isInternalPath, isTemporaryPath, TEMPORARY_FILE_PREFIX, transformFile
} from './tree'
import type {
    Action,
    ConflictResolution,
    Side,
    Snapshot,
    Snapshots,
    SynchronisationResult
} from './type'
// endregion
export interface SynchronisationOptions {
    configurationDirectory?: string
    date?: Date
    dryRun?: boolean
    // Entries to leave out on both sides (as if they did not exist).
    excludes?: ExcludeMatcher
    host?: string
    key: Buffer
    onAction?: (action: Action) => void
    plainPath: string
    trashRetentionInDays?: number
    vaultPath: string
}

export interface ScanResult {
    skipped: Array<{path: string, reason: string}>
    snapshots: Snapshots
}
/**
 * Creates the snapshot of given file system entry.
 * @param path - Absolute path.
 * @returns Snapshot or undefined if the entry does not exist or has an
 * unsupported type.
 */
export const getSnapshot = async (
    path: string
): Promise<Snapshot | undefined> => {
    let stats
    try {
        stats = await lstat(path)
    } catch (error) {
        if ((error as {code?: string}).code === 'ENOENT')
            return undefined

        throw error
    }

    // NOTE: Directory meta data changes with its content, so it is ignored.
    if (stats.isDirectory())
        return {mtimeMs: 0, size: 0, type: 'directory'}
    if (stats.isSymbolicLink())
        return {
            mtimeMs: 0,
            size: 0,
            target: await readlink(path),
            type: 'symbolicLink'
        }
    if (stats.isFile())
        return {mtimeMs: stats.mtimeMs, size: stats.size, type: 'file'}

    return undefined
}
/**
 * Collects snapshots of all entries below given root.
 * @param root - Directory to scan.
 * @param side - Side the directory belongs to.
 * @param isExcluded - Decides which relative paths to leave out.
 * @returns Snapshots by relative posix path and skipped entries.
 */
export const scan = async (
    root: string, side: Side, isExcluded: ExcludeMatcher = excludeNothing
): Promise<ScanResult> => {
    const result: ScanResult = {skipped: [], snapshots: new Map()}

    const walk = async (directory: string, prefix: string) => {
        for (const entry of await readdir(directory, {withFileTypes: true})) {
            const path = prefix ? `${prefix}/${entry.name}` : entry.name
            if (
                (side === 'cipher' ?
                    isInternalPath(path) :
                    isTemporaryPath(path)) ||
                isExcluded(path, entry.isDirectory())
            )
                continue
            if (side === 'plain' && path === CONFIGURATION_FILE_NAME) {
                result.skipped.push({
                    path,
                    reason: `The name "${CONFIGURATION_FILE_NAME}" is ` +
                        'reserved in the vault root.'
                })

                continue
            }

            const snapshot = await getSnapshot(join(directory, entry.name))
            if (!snapshot) {
                result.skipped.push({path, reason: 'Unsupported file type.'})

                continue
            }

            result.snapshots.set(path, snapshot)
            if (snapshot.type === 'directory')
                await walk(join(directory, entry.name), path)
        }
    }

    await walk(root, '')

    return result
}
/**
 * Detects whether given directory lives on a case insensitive file system.
 * @param directory - Existing writable directory.
 * @returns Indicates case insensitivity.
 */
export const isCaseInsensitive = async (
    directory: string
): Promise<boolean> => {
    const name = `${TEMPORARY_FILE_PREFIX}case-probe-${String(process.pid)}`
    const path = join(directory, name)
    await writeFile(path, '')
    try {
        return (await getSnapshot(join(directory, name.toUpperCase()))) !==
            undefined
    } finally {
        await rm(path, {force: true})
    }
}
/**
 * Finds entries whose paths only differ in case.
 * @param paths - Relative paths.
 * @returns Colliding paths.
 */
export const findCaseCollisions = (paths: Iterable<string>): Set<string> => {
    const byLowerCase = new Map<string, Array<string>>()
    for (const path of paths) {
        const key = path.toLowerCase()
        byLowerCase.set(key, [...(byLowerCase.get(key) ?? []), path])
    }

    return new Set([...byLowerCase.values()]
        .filter((group) => group.length > 1)
        .flat())
}
/**
 * Checks whether a decrypted file equals its plaintext counterpart.
 * @param key - Content key.
 * @param plainPath - Plaintext file.
 * @param cipherPath - Encrypted file.
 * @returns Indicates equal content.
 */
export const hasSameContent = async (
    key: Buffer, plainPath: string, cipherPath: string
): Promise<boolean> => {
    const fileHandle = await open(plainPath, 'r')
    try {
        let position = 0
        for await (const block of decryptFileContent(key, cipherPath)) {
            const buffer = Buffer.alloc(block.length)
            const {bytesRead} =
                await fileHandle.read(buffer, 0, block.length, position)
            if (bytesRead !== block.length || !buffer.equals(block))
                return false
            position += block.length
        }

        const {bytesRead} =
            await fileHandle.read(Buffer.alloc(1), 0, 1, position)

        return bytesRead === 0
    } finally {
        await fileHandle.close()
    }
}
/**
 * Synchronizes a plaintext directory with a vault in both directions.
 * @param options - Pair, key and behaviour.
 * @returns Planned (or applied) actions and failures.
 */
export const synchronize = async (
    options: SynchronisationOptions
): Promise<SynchronisationResult & {warning?: string}> => {
    const {
        dryRun = false,
        excludes = excludeNothing,
        key,
        onAction = () => {
            // Nothing to report by default.
        },
        trashRetentionInDays = DEFAULT_TRASH_RETENTION_IN_DAYS
    } = options
    const date = options.date ?? new Date()
    const host = options.host ?? hostname().replace(/\..*$/, '')
    const roots: Record<Side, string> = {
        cipher: resolve(options.vaultPath), plain: resolve(options.plainPath)
    }
    const pairDirectory = getPairDirectory(
        roots.plain,
        roots.cipher,
        options.configurationDirectory ?? getConfigurationDirectory()
    )

    await mkdir(roots.plain, {recursive: true})
    const releaseLock = await acquireLock(pairDirectory)
    try {
        if (!dryRun)
            await purgeTrash(pairDirectory, trashRetentionInDays, date)

        const {state, warning} =
            await loadState(pairDirectory, roots.plain, roots.cipher)
        const scans: Record<Side, ScanResult> = {
            cipher: await scan(roots.cipher, 'cipher', excludes),
            plain: await scan(roots.plain, 'plain', excludes)
        }
        const snapshots: Record<Side, Snapshots> = {
            cipher: scans.cipher.snapshots, plain: scans.plain.snapshots
        }

        // Never act on entries we could not (fully) see.
        const excluded = new Map<string, string>()
        for (const {path, reason} of [
            ...scans.cipher.skipped, ...scans.plain.skipped
        ])
            excluded.set(path, reason)
        if (await isCaseInsensitive(roots.plain))
            for (const path of findCaseCollisions(snapshots.cipher.keys()))
                excluded.set(
                    path,
                    'Names only differ in case in the vault, which the ' +
                    'plaintext file system can not represent.'
                )

        const plannedActions = createPlan(
            snapshots.plain, snapshots.cipher, state.entries, host, date
        )
        const actions: Array<Action> = [
            ...[...excluded].map(([path, reason]): Action =>
                ({type: 'skip', path, reason})
            ),
            ...plannedActions.filter((action) => !excluded.has(action.path))
        ]

        const result: SynchronisationResult & {warning?: string} =
            {actions, failed: [], warning}
        if (dryRun) {
            for (const action of actions)
                onAction(action)

            return result
        }

        const getPath = (side: Side, path: string) =>
            join(roots[side], ...path.split('/'))
        // Ensures an entry did not change since it was scanned.
        const assertUnchanged = async (
            side: Side, path: string, expected: Snapshot | undefined
        ) => {
            if (!isSameSnapshot(
                await getSnapshot(getPath(side, path)), expected
            ))
                throw new Error(
                    `Changed in ${side === 'plain' ? 'plaintext' : 'vault'} ` +
                    'during synchronisation, it will be retried.'
                )
        }

        // NOTE: An undefined expected snapshot means "must not exist".
        const transfer = async (
            path: string,
            from: Side,
            expectedSource: Snapshot | undefined,
            expectedTarget: Snapshot | undefined
        ) => {
            const to = getOtherSide(from)
            const sourcePath = getPath(from, path)
            const targetPath = getPath(to, path)
            await mkdir(dirname(targetPath), {recursive: true})

            if (expectedSource?.type === 'symbolicLink') {
                await assertUnchanged(from, path, expectedSource)
                await assertUnchanged(to, path, expectedTarget)
                await rm(targetPath, {force: true})
                await symlink(expectedSource.target ?? '', targetPath)

                return
            }

            await transformFile(
                from === 'plain' ? encryptFileContent : decryptFileContent,
                key,
                sourcePath,
                targetPath,
                async () => {
                    await assertUnchanged(from, path, expectedSource)
                    await assertUnchanged(to, path, expectedTarget)
                }
            )
        }

        const resolveConflict = async (
            path: string, {conflictPath, loser}: ConflictResolution
        ) => {
            const winner = getOtherSide(loser)
            const loserSnapshot = snapshots[loser].get(path)

            await assertUnchanged(loser, path, loserSnapshot)
            await rename(getPath(loser, path), getPath(loser, conflictPath))
            // Winner replaces the loser's version on the loser side.
            await transfer(
                path, winner, snapshots[winner].get(path), undefined
            )
            // The loser's version is kept as conflict copy on both sides.
            await transfer(conflictPath, loser, loserSnapshot, undefined)
        }

        const apply = async (action: Action) => {
            switch (action.type) {
            case 'transfer':
                await transfer(
                    action.path,
                    action.from,
                    snapshots[action.from].get(action.path),
                    snapshots[getOtherSide(action.from)].get(action.path)
                )
                break
            case 'createDirectory':
                await mkdir(
                    getPath(action.side, action.path), {recursive: true}
                )
                break
            case 'trash':
                await assertUnchanged(
                    action.side,
                    action.path,
                    snapshots[action.side].get(action.path)
                )
                await move(
                    getPath(action.side, action.path),
                    join(
                        getTrashDirectory(pairDirectory, date, action.side),
                        ...action.path.split('/')
                    )
                )
                break
            case 'removeDirectory':
                try {
                    await rmdir(getPath(action.side, action.path))
                } catch (error) {
                    // NOTE: Kept if new content arrived on this side.
                    if (!['ENOENT', 'ENOTEMPTY', 'EEXIST'].includes(
                        (error as {code?: string}).code ?? ''
                    ))
                        throw error
                }
                break
            case 'compare':
                if (!await hasSameContent(
                    key,
                    getPath('plain', action.path),
                    getPath('cipher', action.path)
                ))
                    await resolveConflict(action.path, action)
                break
            case 'conflict':
                await resolveConflict(action.path, action)
                break
            case 'record':
            case 'forget':
            case 'skip':
                break
            }
        }

        // Updates the state of given path from what is on disk now.
        const refresh = async (path: string) => {
            const plain = await getSnapshot(getPath('plain', path))
            const cipher = await getSnapshot(getPath('cipher', path))

            if (plain && cipher && plain.type === cipher.type)
                state.entries[path] = {cipher, plain}
            else if (!plain && !cipher)

                delete state.entries[path]
            // NOTE: One sided leftovers keep their old state to be retried.
        }

        const touched = new Set<string>()
        for (const action of actions) {
            onAction(action)
            if (action.type === 'skip')
                continue

            try {
                await apply(action)
            } catch (error) {
                result.failed.push({
                    path: action.path,
                    reason: error instanceof Error ?
                        error.message :
                        String(error)
                })
            }

            for (const path of [
                action.path,
                ...('conflictPath' in action ? [action.conflictPath] : [])
            ])
                for (
                    let current = path;
                    current !== '.';
                    current = posix.dirname(current)
                )
                    touched.add(current)
        }

        for (const path of touched)
            await refresh(path)

        state.synchronizedAt = date.toISOString()
        await saveState(pairDirectory, state)

        return result
    } finally {
        await releaseLock()
    }
}
