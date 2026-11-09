// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module watch */
'use strict'
/* !
    region header
    [Project page](https://tsickert.com/gocryptfs-standalone)

    Copyright Torben Sickert (info["~at~"]tsickert.com) 09.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {watch} from 'fs'
import {sep} from 'path'

import {createExcludeMatcher} from './exclude'
import type {ExcludeMatcher} from './exclude'
import type {ResolvedPair} from './settings'
import {isInternalPath, isTemporaryPath} from './tree'
import type {Change, Side} from './type'
// endregion
export interface Watcher {
    close: () => void
}
/**
 * Watches given directory recursively.
 * @param path - Directory to watch.
 * @param onChange - Called with the changed path relative to given directory
 * (posix separated) or null if the operating system does not tell.
 * @param onError - Called when watching does not work anymore.
 * @returns Watcher to stop watching.
 */
export type WatchDirectory = (
    path: string,
    onChange: (relativePath: null | string) => void,
    onError: (error: Error) => void
) => Watcher
/**
 * Watches given directory recursively via the operating system's file
 * system events (FSEvents, ReadDirectoryChangesW or inotify).
 * @param path - Directory to watch.
 * @param onChange - Called with the changed relative posix path or null.
 * @param onError - Called when watching does not work anymore.
 * @returns Watcher to stop watching.
 */
export const watchDirectory: WatchDirectory = (path, onChange, onError) => {
    // NOTE: Not persistent, the daemon's timers keep the process alive.
    const watcher = watch(
        path,
        {encoding: 'utf-8', persistent: false, recursive: true},
        (_, fileName) => {
            onChange(fileName === null ? null : fileName.split(sep).join('/'))
        }
    )
    watcher.on('error', onError)

    return {
        close: () => {
            watcher.close()
        }
    }
}
/**
 * Decides whether a change of given path can affect the synchronization.
 * Our own temporary files, internal vault data and excluded entries
 * (including everything inside excluded directories) are irrelevant.
 * @param relativePath - Changed posix path relative to the side's root or
 * null if unknown.
 * @param side - Side the path belongs to.
 * @param isExcluded - Decides which relative paths are left out.
 * @returns Indicates whether a synchronization is needed.
 */
export const isRelevantChange = (
    relativePath: null | string, side: Side, isExcluded: ExcludeMatcher
): boolean => {
    // An unknown path could be anything.
    if (relativePath === null || relativePath === '')
        return true

    if (
        isTemporaryPath(relativePath) ||
        (side === 'cipher' && isInternalPath(relativePath))
    )
        return false

    const segments = relativePath.split('/')
    for (let index = 1; index <= segments.length; index += 1) {
        const path = segments.slice(0, index).join('/')
        /*
            NOTE: Whether the changed entry itself is a directory is unknown
            (it may be gone already), so both variants are checked.
        */
        if (
            isExcluded(path, true) ||
            (index === segments.length && isExcluded(path, false))
        )
            return false
    }

    return true
}
/**
 * Watches both sides of given pair for relevant changes.
 * @param pair - Pair to watch.
 * @param onChange - Called with each relevant change.
 * @param onError - Called when watching does not work anymore.
 * @param watchGivenDirectory - Watches one directory (replaceable for
 * testing).
 * @returns Watcher to stop watching both sides.
 */
export const watchPair = (
    pair: ResolvedPair,
    onChange: (change: Change) => void,
    onError: (error: Error) => void,
    watchGivenDirectory: WatchDirectory = watchDirectory
): Watcher => {
    const isExcluded = createExcludeMatcher(pair.excludes)
    const watchers: Array<Watcher> = []
    const close = () => {
        for (const watcher of watchers)
            watcher.close()
    }

    try {
        for (const [side, path] of [
            ['plain', pair.plaintext], ['cipher', pair.vault]
        ] as const)
            watchers.push(watchGivenDirectory(
                path,
                (relativePath) => {
                    if (isRelevantChange(relativePath, side, isExcluded))
                        onChange({path: relativePath, side})
                },
                onError
            ))
    } catch (error) {
        close()

        throw error
    }

    return {close}
}
