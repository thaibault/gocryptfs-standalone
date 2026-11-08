// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module plan */
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
import {posix} from 'path'

import {getPlainSize} from './content'
import type {
    Action, ConflictResolution, Side, Snapshot, Snapshots, StateEntry
} from './type'
// endregion
// Order in which planned actions have to be applied.
export const ACTION_ORDER: Array<Action['type']> = [
    'skip',
    // NOTE: Deletions first, so case-only renames on case insensitive file
    // systems do not trash freshly transferred files.
    'trash',
    'removeDirectory',
    'createDirectory',
    'conflict',
    'compare',
    'transfer',
    'record',
    'forget'
]
/**
 * Checks whether two snapshots describe the same entry state.
 * @param first - First snapshot.
 * @param second - Second snapshot.
 * @returns Indicates equality.
 */
export const isSameSnapshot = (
    first: Snapshot | undefined, second: Snapshot | undefined
): boolean =>
    first === second || (
        first !== undefined &&
        second !== undefined &&
        first.type === second.type &&
        first.size === second.size &&
        first.mtimeMs === second.mtimeMs &&
        first.target === second.target
    )
/**
 * Returns the other side of a pair.
 * @param side - Given side.
 * @returns Opposite side.
 */
export const getOtherSide = (side: Side): Side =>
    side === 'plain' ? 'cipher' : 'plain'
/**
 * Formats given date for conflict file names (local time, no characters
 * which are invalid on any supported platform).
 * @param date - Date to format.
 * @returns Formatted date.
 */
export const formatConflictDate = (date: Date): string => {
    const pad = (value: number) => String(value).padStart(2, '0')

    return `${String(date.getFullYear())}-${pad(date.getMonth() + 1)}-` +
        `${pad(date.getDate())} ${pad(date.getHours())}-` +
        `${pad(date.getMinutes())}-${pad(date.getSeconds())}`
}
/**
 * Derives a not yet taken conflict copy name for given path.
 * @param path - Relative (posix) path of the conflicting entry.
 * @param host - Name of this machine.
 * @param date - Time of the synchronization.
 * @param isTaken - Checks whether a relative path is already in use.
 * @returns Relative conflict copy path.
 */
export const getConflictPath = (
    path: string,
    host: string,
    date: Date,
    isTaken: (path: string) => boolean
): string => {
    const directory = posix.dirname(path)
    const name = posix.basename(path)
    // NOTE: Dot files like ".bashrc" have no extension.
    const extension = posix.extname(name)
    const stem = name.slice(0, name.length - extension.length)

    for (let counter = 1; ; counter += 1) {
        const candidate = posix.join(
            directory,
            `${stem} (conflict ${host} ${formatConflictDate(date)}` +
            `${counter > 1 ? ` ${String(counter)}` : ''})${extension}`
        )
        if (!isTaken(candidate))
            return candidate
    }
}
/**
 * Decides how to synchronize both sides based on their current state and
 * the state after the last synchronization.
 * @param plain - Current entries of the plaintext directory.
 * @param cipher - Current entries of the vault.
 * @param state - Entries after the last synchronization.
 * @param host - Name of this machine (used for conflict copies).
 * @param date - Time of the synchronization (used for conflict copies).
 * @returns Actions sorted in the order to apply them.
 */
export const createPlan = (
    plain: Snapshots,
    cipher: Snapshots,
    state: Record<string, StateEntry>,
    host: string,
    date: Date
): Array<Action> => {
    const actions: Array<Action> = []
    const conflictPaths = new Set<string>()

    const resolveConflict = (
        path: string, plainSnapshot: Snapshot, cipherSnapshot: Snapshot
    ): ConflictResolution => {
        const conflictPath = getConflictPath(
            path,
            host,
            date,
            (candidate) =>
                plain.has(candidate) ||
                cipher.has(candidate) ||
                Object.prototype.hasOwnProperty.call(state, candidate) ||
                conflictPaths.has(candidate)
        )
        conflictPaths.add(conflictPath)

        return {
            conflictPath,
            // The older version gets renamed (local version wins ties).
            loser: plainSnapshot.mtimeMs < cipherSnapshot.mtimeMs ?
                'plain' :
                'cipher'
        }
    }
    // Both sides exist and differ from the last known state (or are new).
    const planDivergence = (
        path: string, plainSnapshot: Snapshot, cipherSnapshot: Snapshot
    ) => {
        if (plainSnapshot.type === 'directory')
            actions.push({type: 'record', path})
        else if (plainSnapshot.type === 'symbolicLink')
            actions.push(
                plainSnapshot.target === cipherSnapshot.target ?
                    {type: 'record', path} :
                    {
                        type: 'conflict',
                        path,
                        ...resolveConflict(path, plainSnapshot, cipherSnapshot)
                    }
            )
        else
            actions.push({
                // Different sizes can never have the same content.
                type: getPlainSize(cipherSnapshot.size) === plainSnapshot.size ?
                    'compare' :
                    'conflict',
                path,
                ...resolveConflict(path, plainSnapshot, cipherSnapshot)
            })
    }
    // Entry only exists on given side.
    const planCopy = (path: string, snapshot: Snapshot, from: Side) => {
        actions.push(snapshot.type === 'directory' ?
            {type: 'createDirectory', path, side: getOtherSide(from)} :
            {type: 'transfer', path, from}
        )
    }
    // Entry was deleted on the other side than given.
    const planDeletion = (
        path: string, snapshot: Snapshot, side: Side, changed: boolean
    ) => {
        if (changed)
            // NOTE: A modification beats a deletion, nothing gets lost.
            planCopy(path, snapshot, side)
        else
            actions.push({
                type: snapshot.type === 'directory' ?
                    'removeDirectory' :
                    'trash',
                path,
                side
            })
    }

    const paths = new Set([...plain.keys(), ...cipher.keys()])
    for (const path of Object.keys(state))
        paths.add(path)

    for (const path of [...paths].sort()) {
        const plainSnapshot = plain.get(path)
        const cipherSnapshot = cipher.get(path)
        const entry: StateEntry | undefined =
            Object.prototype.hasOwnProperty.call(state, path) ?
                state[path] :
                undefined

        if (
            plainSnapshot &&
            cipherSnapshot &&
            plainSnapshot.type !== cipherSnapshot.type
        ) {
            actions.push({
                type: 'skip',
                path,
                reason: `Type differs: ${plainSnapshot.type} in plaintext ` +
                    `directory, ${cipherSnapshot.type} in vault.`
            })

            continue
        }

        if (!entry) {
            if (plainSnapshot && cipherSnapshot)
                planDivergence(path, plainSnapshot, cipherSnapshot)
            else if (plainSnapshot)
                planCopy(path, plainSnapshot, 'plain')
            else if (cipherSnapshot)
                planCopy(path, cipherSnapshot, 'cipher')

            continue
        }

        if (!plainSnapshot && !cipherSnapshot)
            actions.push({type: 'forget', path})
        else if (!plainSnapshot && cipherSnapshot)
            planDeletion(
                path,
                cipherSnapshot,
                'cipher',
                !isSameSnapshot(cipherSnapshot, entry.cipher)
            )
        else if (plainSnapshot && !cipherSnapshot)
            planDeletion(
                path,
                plainSnapshot,
                'plain',
                !isSameSnapshot(plainSnapshot, entry.plain)
            )
        else if (plainSnapshot && cipherSnapshot) {
            const plainChanged = !isSameSnapshot(plainSnapshot, entry.plain)
            const cipherChanged = !isSameSnapshot(cipherSnapshot, entry.cipher)

            if (plainChanged && cipherChanged)
                planDivergence(path, plainSnapshot, cipherSnapshot)
            else if (plainChanged)
                actions.push({type: 'transfer', path, from: 'plain'})
            else if (cipherChanged)
                actions.push({type: 'transfer', path, from: 'cipher'})
        }
    }

    const getRank = (action: Action): number =>
        ACTION_ORDER.indexOf(action.type)
    const getDepth = (path: string): number => path.split('/').length

    return actions.sort((first, second) =>
        getRank(first) - getRank(second) ||
        // Remove nested directories before their parents.
        (first.type === 'removeDirectory' ?
            getDepth(second.path) - getDepth(first.path) :
            0) ||
        (first.path < second.path ? -1 : first.path > second.path ? 1 : 0)
    )
}
