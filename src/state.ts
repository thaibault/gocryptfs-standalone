// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module state */
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
import {createHash} from 'crypto'
import {
    cp, mkdir, readdir, readFile, rename, rm, writeFile
} from 'fs/promises'
import {homedir} from 'os'
import {dirname, join} from 'path'

import type {Side, SynchronizationState} from './type'
// endregion
export const APPLICATION_NAME = 'gocryptfs-standalone'
export const CONFIGURATION_DIRECTORY_ENVIRONMENT_VARIABLE_NAME =
    'GOCRYPTFS_STANDALONE_CONFIGURATION_DIRECTORY'
export const STATE_FILE_NAME = 'state.json'
export const LOCK_FILE_NAME = 'lock'
// Held by a daemon as long as it watches the pair.
export const DAEMON_LOCK_FILE_NAME = 'daemon.lock'
export const TRASH_DIRECTORY_NAME = 'trash'
export const DEFAULT_TRASH_RETENTION_IN_DAYS = 30

export class LockedError extends Error {
    name = 'LockedError'
}
/**
 * Determines the user specific configuration directory of this application:
 * "%APPDATA%" on windows, "$XDG_CONFIG_HOME" or "~/.config" elsewhere.
 * @param environment - Environment variables.
 * @param platform - Operating system.
 * @param home - Home directory of the current user.
 * @returns Absolute directory path.
 */
export const getConfigurationDirectory = (
    environment: NodeJS.ProcessEnv = process.env,
    platform: NodeJS.Platform = process.platform,
    home: string = homedir()
): string => {
    const explicitPath =
        environment[CONFIGURATION_DIRECTORY_ENVIRONMENT_VARIABLE_NAME]
    if (explicitPath)
        return explicitPath

    if (platform === 'win32')
        return join(
            environment.APPDATA ?? join(home, 'AppData', 'Roaming'),
            APPLICATION_NAME
        )

    return join(
        environment.XDG_CONFIG_HOME ?? join(home, '.config'),
        APPLICATION_NAME
    )
}
/**
 * Determines the directory holding state, lock and trash of given pair.
 * @param plainPath - Absolute plaintext directory path.
 * @param vaultPath - Absolute vault directory path.
 * @param configurationDirectory - Application configuration directory.
 * @returns Absolute directory path.
 */
export const getPairDirectory = (
    plainPath: string,
    vaultPath: string,
    configurationDirectory: string = getConfigurationDirectory()
): string =>
    join(
        configurationDirectory,
        'pairs',
        createHash('sha256')
            .update(`${plainPath}\0${vaultPath}`)
            .digest('hex')
            .slice(0, 16)
    )
/**
 * Creates an empty state for given pair.
 * @param plainPath - Absolute plaintext directory path.
 * @param vaultPath - Absolute vault directory path.
 * @returns Empty state.
 */
export const createState = (
    plainPath: string, vaultPath: string
): SynchronizationState => ({
    entries: {},
    plainPath,
    synchronizedAt: null,
    vaultPath,
    version: 1
})
/**
 * Loads the state of the last synchronization. A missing or unreadable state
 * results in an empty one, which only merges both sides and never deletes.
 * @param pairDirectory - Directory of the pair.
 * @param plainPath - Absolute plaintext directory path.
 * @param vaultPath - Absolute vault directory path.
 * @returns State and a warning if an existing state could not be used.
 */
export const loadState = async (
    pairDirectory: string, plainPath: string, vaultPath: string
): Promise<{state: SynchronizationState, warning?: string}> => {
    let content: string
    try {
        content = await readFile(
            join(pairDirectory, STATE_FILE_NAME), {encoding: 'utf-8'}
        )
    } catch (error) {
        if ((error as {code?: string}).code === 'ENOENT')
            return {state: createState(plainPath, vaultPath)}

        throw error
    }

    try {
        const state = JSON.parse(content) as Partial<SynchronizationState>
        if (
            state.version !== 1 ||
            typeof state.entries !== 'object' ||
            state.plainPath !== plainPath ||
            state.vaultPath !== vaultPath
        )
            throw new Error('Unexpected content.')

        return {state: state as SynchronizationState}
    } catch {
        return {
            state: createState(plainPath, vaultPath),
            warning: 'Ignoring unusable synchronization state, both sides ' +
                'get merged without deleting anything.'
        }
    }
}
/**
 * Saves given state atomically.
 * @param pairDirectory - Directory of the pair.
 * @param state - State to save.
 * @returns Promise resolving when saved.
 */
export const saveState = async (
    pairDirectory: string, state: SynchronizationState
): Promise<void> => {
    await mkdir(pairDirectory, {recursive: true})

    const filePath = join(pairDirectory, STATE_FILE_NAME)
    const temporaryFilePath = `${filePath}.tmp`
    await writeFile(temporaryFilePath, JSON.stringify(state), {mode: 0o600})
    await rename(temporaryFilePath, filePath)
}
/**
 * Checks whether a process with given id is running.
 * @param pid - Process id.
 * @returns Indicates whether the process exists.
 */
const isRunning = (pid: number): boolean => {
    try {
        process.kill(pid, 0)

        return true
    } catch (error) {
        // NOTE: "EPERM" means it exists but belongs to someone else.
        return (error as {code?: string}).code === 'EPERM'
    }
}
/**
 * Acquires the lock of given pair so only one synchronization (or with
 * another lock file name one daemon) runs at a time. Locks of no longer
 * running processes get taken over.
 * @param pairDirectory - Directory of the pair.
 * @param fileName - Name of the lock file.
 * @param holder - Describes the process holding the lock for errors.
 * @returns Function to release the lock.
 */
export const acquireLock = async (
    pairDirectory: string,
    fileName = LOCK_FILE_NAME,
    holder = 'Another synchronization of this pair is running'
): Promise<() => Promise<void>> => {
    await mkdir(pairDirectory, {recursive: true})
    const filePath = join(pairDirectory, fileName)

    for (let attempt = 0; attempt < 2; attempt += 1)
        try {
            await writeFile(filePath, String(process.pid), {flag: 'wx'})

            return () => rm(filePath, {force: true})
        } catch (error) {
            if ((error as {code?: string}).code !== 'EEXIST')
                throw error

            const pid = Number(await readFile(filePath, {encoding: 'utf-8'}))
            if (Number.isInteger(pid) && pid > 0 && isRunning(pid))
                throw new LockedError(`${holder} (process ${String(pid)}).`)

            await rm(filePath, {force: true})
        }

    throw new LockedError('Could not acquire the synchronization lock.')
}
/**
 * Moves given path, falling back to copy and delete across file systems.
 * @param source - Path to move.
 * @param target - New path.
 * @returns Promise resolving when moved.
 */
export const move = async (source: string, target: string): Promise<void> => {
    await mkdir(dirname(target), {recursive: true})

    try {
        await rename(source, target)
    } catch (error) {
        if ((error as {code?: string}).code !== 'EXDEV')
            throw error

        await cp(source, target, {
            preserveTimestamps: true, recursive: true, verbatimSymlinks: true
        })
        await rm(source, {force: true, recursive: true})
    }
}
/**
 * Determines the trash directory for given side and synchronization run.
 * Vault files stay encrypted in the trash.
 * @param pairDirectory - Directory of the pair.
 * @param date - Time of the synchronization.
 * @param side - Side the trashed entries belong to.
 * @returns Absolute directory path.
 */
export const getTrashDirectory = (
    pairDirectory: string, date: Date, side: Side
): string =>
    join(
        pairDirectory,
        TRASH_DIRECTORY_NAME,
        // NOTE: Sortable and valid on every platform.
        date.toISOString().replace(/:/g, '-'),
        side === 'plain' ? 'plaintext' : 'vault'
    )
/**
 * Removes trash of synchronization runs older than given number of days.
 * @param pairDirectory - Directory of the pair.
 * @param retentionInDays - Days to keep trashed entries.
 * @param now - Current time.
 * @returns Promise resolving when purged.
 */
export const purgeTrash = async (
    pairDirectory: string,
    retentionInDays: number = DEFAULT_TRASH_RETENTION_IN_DAYS,
    now: Date = new Date()
): Promise<void> => {
    const trashPath = join(pairDirectory, TRASH_DIRECTORY_NAME)
    let names: Array<string>
    try {
        names = await readdir(trashPath)
    } catch {
        return
    }

    const limit = now.getTime() - retentionInDays * 24 * 60 * 60 * 1000
    for (const name of names) {
        const timestamp = Date.parse(
            name.replace(/T(\d\d)-(\d\d)-(\d\d)/, 'T$1:$2:$3')
        )
        if (!Number.isNaN(timestamp) && timestamp < limit)
            await rm(join(trashPath, name), {force: true, recursive: true})
    }
}
