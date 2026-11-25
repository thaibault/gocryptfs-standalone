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
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/
// region imports
import {
    lstat, mkdir, open, readdir, readlink, rename, rm, rmdir, symlink,
    writeFile
} from 'fs/promises'
import {hostname} from 'os'
import {dirname, join, posix, resolve} from 'path'

import {CONFIGURATION_FILE_NAMES} from './configuration'
import {decryptFileContent, encryptFileContent} from './content'
import {excludeNothing} from './exclude'
import type {ExcludeMatcher} from './exclude'
import {createPlan, getOtherSide, isSameSnapshot} from './plan'
import {
    acquireLock,
    DEFAULT_MAXIMAL_DELETION_PERCENTAGE,
    DEFAULT_TRASH_RETENTION_IN_DAYS,
    getConfigurationDirectory,
    getPairDirectory,
    getTrashDirectory,
    loadState,
    MASS_DELETION_MINIMUM,
    MassDeletionError,
    move,
    purgeTrash,
    saveState
} from './state'
import {
    isInternalPath, isTemporaryPath, TEMPORARY_FILE_PREFIX, transformFile
} from './tree'
import type {
    Action,
    Change,
    ConflictResolution,
    SealResult,
    Side,
    Snapshot,
    Snapshots,
    StateEntry,
    SynchronizationResult
} from './type'
// endregion
export interface SynchronizationOptions {
    // Applies deletions even if they exceed "maximalDeletionPercentage".
    allowMassDeletion?: boolean
    configurationDirectory?: string
    date?: Date
    dryRun?: boolean
    // Entries to leave out on both sides (as if they did not exist).
    excludes?: ExcludeMatcher
    host?: string
    key: Buffer
    /*
        Refuses to delete more than this share of all synchronized entries
        because they are missing in the vault (100 disables the check, an
        empty vault is refused anyway).
    */
    maximalDeletionPercentage?: number
    onAction?: (action: Action) => void
    plainPath: string
    /*
        Removes the plaintext directory's content after synchronizing (see
        "seal"), the next synchronization restores it.
    */
    seal?: boolean
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
        return {ctimeMs: 0, mtimeMs: 0, size: 0, type: 'directory'}
    if (stats.isSymbolicLink())
        return {
            ctimeMs: 0,
            mtimeMs: 0,
            size: 0,
            target: await readlink(path),
            type: 'symbolicLink'
        }
    if (stats.isFile())
        return {
            ctimeMs: stats.ctimeMs,
            mtimeMs: stats.mtimeMs,
            size: stats.size,
            type: 'file'
        }

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
            if (side === 'plain' && CONFIGURATION_FILE_NAMES.includes(path)) {
                result.skipped.push({
                    path,
                    reason: `The name "${path}" is reserved in the vault root.`
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
 * Checks whether all given changed entries still look like after the last
 * synchronization, which is the case for changes made by the synchronization
 * itself. Unknown paths and an unusable state never count as synchronized.
 * @param options - Pair locations.
 * @param changes - Reported changes.
 * @returns Indicates whether a synchronization would find nothing to do for
 * given changes.
 */
export const isSynchronized = async (
    options: Pick<
        SynchronizationOptions,
        'configurationDirectory' | 'plainPath' | 'vaultPath'
    >,
    changes: Iterable<Change>
): Promise<boolean> => {
    const roots: Record<Side, string> = {
        cipher: resolve(options.vaultPath), plain: resolve(options.plainPath)
    }
    const pairDirectory = getPairDirectory(
        roots.plain,
        roots.cipher,
        options.configurationDirectory ?? getConfigurationDirectory()
    )

    const {state, warning} =
        await loadState(pairDirectory, roots.plain, roots.cipher)
    if (warning)
        return false

    for (const {path, side} of changes) {
        if (!path)
            return false

        /*
            NOTE: Synchronizing refreshes the state of all touched entries
            from disk, so only foreign changes differ from it.
        */
        const entry: StateEntry | undefined =
            Object.prototype.hasOwnProperty.call(state.entries, path) ?
                state.entries[path] :
                undefined
        if (!isSameSnapshot(
            await getSnapshot(join(roots[side], ...path.split('/'))),
            entry?.[side]
        ))
            return false
    }

    return true
}
/**
 * Removes all plaintext entries the vault holds in exactly the version known
 * from the last synchronization, keeps everything else (changed afterwards,
 * excluded, not synchronizable, failed). Directories are removed when they
 * end up empty, the plaintext directory itself stays. The state has to be
 * marked as "sealing" before, so missing entries never count as deletions.
 * NOTE: Removing only unlinks files, it does not wipe their content from the
 * storage.
 * @param roots - Plaintext and vault directory.
 * @param entries - State after the last synchronization.
 * @param isExcluded - Decides which relative paths are left out.
 * @returns Number of removed entries and kept ones with their reason.
 */
export const removePlaintext = async (
    roots: Record<Side, string>,
    entries: Record<string, StateEntry>,
    isExcluded: ExcludeMatcher = excludeNothing
): Promise<SealResult> => {
    const getPath = (side: Side, path: string) =>
        join(roots[side], ...path.split('/'))
    const kept = new Map<string, string>()
    let removed = 0

    // NOTE: Reverse order visits nested entries before their parents.
    const paths = Object.keys(entries).sort().reverse()
    for (const path of paths) {
        const entry = entries[path]
        if (entry.plain.type === 'directory')
            continue

        try {
            const current = await getSnapshot(getPath('plain', path))
            if (!current)
                continue

            if (!isSameSnapshot(current, entry.plain)) {
                kept.set(path, 'Changed since the last synchronization.')

                continue
            }
            if (!isSameSnapshot(
                await getSnapshot(getPath('cipher', path)), entry.cipher
            )) {
                kept.set(
                    path,
                    'The vault version changed since the last ' +
                    'synchronization.'
                )

                continue
            }

            await rm(getPath('plain', path))
            removed += 1
        } catch (error) {
            kept.set(
                path, error instanceof Error ? error.message : String(error)
            )
        }
    }

    for (const path of paths)
        if (entries[path].plain.type === 'directory')
            try {
                await rmdir(getPath('plain', path))
                removed += 1
            } catch (error) {
                // NOTE: Kept if something remained inside.
                if (!['ENOENT', 'ENOTEMPTY', 'EEXIST'].includes(
                    (error as {code?: string}).code ?? ''
                ))
                    kept.set(
                        path,
                        error instanceof Error ? error.message : String(error)
                    )
            }

    // Reports everything left behind, not only what we decided to keep.
    const remaining = await scan(roots.plain, 'plain')
    for (const [path, snapshot] of remaining.snapshots)
        if (snapshot.type !== 'directory' && !kept.has(path))
            kept.set(
                path,
                isExcluded(path, false) ?
                    'Excluded from synchronization.' :
                    'Not synchronized to the vault (yet).'
            )
    for (const {path, reason} of remaining.skipped)
        if (!kept.has(path))
            kept.set(path, reason)

    return {
        kept: [...kept]
            .sort(([first], [second]) =>
                first < second ? -1 : first > second ? 1 : 0
            )
            .map(([path, reason]) => ({path, reason})),
        removed
    }
}
/**
 * Checks whether given actions would delete a suspiciously large part of the
 * plaintext directory because entries are missing in the vault. This happens
 * if a cloud client did not synchronize the vault (completely) yet or a drive
 * is not mounted, rarely on purpose.
 * @param actions - Planned actions.
 * @param knownEntries - Number of entries synchronized before.
 * @param vaultEntries - Number of entries currently in the vault.
 * @param maximalPercentage - Share of known entries allowed to be deleted.
 * @returns Reason to refuse the synchronization or null.
 */
export const getMassDeletionReason = (
    actions: Array<Action>,
    knownEntries: number,
    vaultEntries: number,
    maximalPercentage: number = DEFAULT_MAXIMAL_DELETION_PERCENTAGE
): null | string => {
    const deletions = actions.filter((action) =>
        ['removeDirectory', 'trash'].includes(action.type) &&
        'side' in action &&
        action.side === 'plain'
    ).length
    if (deletions === 0 || knownEntries === 0)
        return null

    const hint = 'nothing was changed (cloud client not synchronized yet or ' +
        'drive not mounted?). Synchronize with "--allow-mass-delete" if ' +
        'this is intended.'
    if (vaultEntries === 0)
        return `The vault is empty although ${String(knownEntries)} ` +
            `entries were synchronized before, ${hint}`

    const percentage = deletions / knownEntries * 100
    if (deletions > MASS_DELETION_MINIMUM && percentage > maximalPercentage)
        return `${String(deletions)} of ${String(knownEntries)} ` +
            `synchronized entries (${String(Math.round(percentage))}%) are ` +
            'missing in the vault, more than the allowed ' +
            `${String(maximalPercentage)}%, ${hint}`

    return null
}
/**
 * Synchronizes a plaintext directory with a vault in both directions.
 * Missing plaintext entries of a sealed pair (see "seal" option) get restored
 * instead of being deleted in the vault. Refuses to delete large parts of the
 * plaintext directory missing in the vault (see "getMassDeletionReason").
 * @param options - Pair, key and behavior.
 * @returns Planned (or applied) actions and failures.
 */
export const synchronize = async (
    options: SynchronizationOptions
): Promise<SynchronizationResult & {warning?: string}> => {
    const {
        allowMassDeletion = false,
        dryRun = false,
        excludes = excludeNothing,
        key,
        maximalDeletionPercentage = DEFAULT_MAXIMAL_DELETION_PERCENTAGE,
        onAction = () => {
            // Nothing to report by default.
        },
        seal = false,
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

        /*
            NOTE: An empty plaintext directory most likely got lost (e.g. a
            RAM disk after a reboot or an unmounted drive) and is restored
            like a sealed one instead of deleting the whole vault.
        */
        let emptyPlaintextWarning: string | undefined
        if (
            state.seal === undefined &&
            snapshots.plain.size === 0 &&
            Object.keys(state.entries).length > 0
        ) {
            emptyPlaintextWarning = 'The plaintext directory is empty, ' +
                'restoring it from the vault instead of deleting everything ' +
                'there.'
            state.seal = 'sealed'
            // NOTE: Keeps restoring if this run gets interrupted.
            if (!dryRun)
                await saveState(pairDirectory, state)
        }

        const wasSealed = state.seal !== undefined
        const plannedActions = createPlan(
            snapshots.plain,
            snapshots.cipher,
            state.entries,
            host,
            date,
            wasSealed
        )
        const actions: Array<Action> = [
            ...[...excluded].map(([path, reason]): Action =>
                ({type: 'skip', path, reason})
            ),
            ...plannedActions.filter((action) => !excluded.has(action.path))
        ]

        if (!allowMassDeletion) {
            const reason = getMassDeletionReason(
                actions,
                Object.keys(state.entries).length,
                snapshots.cipher.size,
                maximalDeletionPercentage
            )
            // NOTE: Thrown before anything (including the state) changes.
            if (reason)
                throw new MassDeletionError(reason)
        }

        const result: SynchronizationResult & {warning?: string} = {
            actions, failed: [], warning: warning ?? emptyPlaintextWarning
        }
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
                    'during synchronization, it will be retried.'
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
            // NOTE: Renaming changes the change time.
            const conflictSnapshot =
                await getSnapshot(getPath(loser, conflictPath))
            // Winner replaces the loser's version on the loser side.
            await transfer(
                path, winner, snapshots[winner].get(path), undefined
            )
            // The loser's version is kept as conflict copy on both sides.
            await transfer(conflictPath, loser, conflictSnapshot, undefined)
        }

        const apply = async (action: Action) => {
            switch (action.type) {
            case 'transfer':
            case 'verify':
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
        for (const [index, plannedAction] of actions.entries()) {
            let action = plannedAction
            try {
                /*
                    NOTE: Comparisons are reported once decided, so equal
                    copies stay silent and only written conflicts or
                    transfers show up.
                */
                if (action.type === 'compare' || action.type === 'verify')
                    action = actions[index] = await hasSameContent(
                        key,
                        getPath('plain', action.path),
                        getPath('cipher', action.path)
                    ) ?
                        {type: 'record', path: action.path} :
                        action.type === 'compare' ?
                            {...action, type: 'conflict'} :
                            {...action, type: 'transfer'}

                onAction(action)
                if (action.type === 'skip')
                    continue

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

        /*
            NOTE: Failed restores keep the seal, so their missing plaintext
            entries still do not count as deletions next time.
        */
        if (wasSealed && result.failed.length === 0) {
            delete state.seal
            result.unsealed = true
        }

        state.synchronizedAt = date.toISOString()
        await saveState(pairDirectory, state)

        if (seal) {
            // NOTE: Saved first, so an interruption never looks like deletes.
            state.seal = 'sealing'
            await saveState(pairDirectory, state)

            result.seal =
                await removePlaintext(roots, state.entries, excludes)

            state.seal = 'sealed'
            await saveState(pairDirectory, state)
        }

        return result
    } finally {
        await releaseLock()
    }
}
