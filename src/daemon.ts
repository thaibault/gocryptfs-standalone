// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module daemon */
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
import type {ResolvedPair} from './settings'
// endregion
export interface DaemonOptions {
    log: (text: string) => void
    pairs: Array<ResolvedPair>
    // Synchronizes one pair, resolves with a summary or null if idle.
    synchronizePair: (pair: ResolvedPair) => Promise<null | string>
    signal: AbortSignal
}
/**
 * Waits given time or until given signal aborts.
 * @param milliseconds - Time to wait.
 * @param signal - Abort signal.
 * @returns Promise resolving after the time or on abort.
 */
export const sleep = (
    milliseconds: number, signal: AbortSignal
): Promise<void> =>
    new Promise((resolve) => {
        if (signal.aborted) {
            resolve()

            return
        }

        const done = () => {
            clearTimeout(timer)
            signal.removeEventListener('abort', done)
            resolve()
        }
        const timer = setTimeout(done, milliseconds)
        signal.addEventListener('abort', done)
    })
/**
 * Synchronizes all given pairs right away and afterwards each one in its
 * own interval until given signal aborts. Runs never overlap, so a slow pair
 * delays the others instead of competing for disk and cpu. Failures are
 * logged and retried in the next interval.
 * @param options - Pairs, synchronization and logging.
 * @returns Promise resolving after the abort when no run is active anymore.
 */
export const runDaemon = async (options: DaemonOptions): Promise<void> => {
    const {log, pairs, signal, synchronizePair} = options
    const dueAt = new Map(pairs.map((pair) => [pair.name, 0]))

    log(
        `Started synchronizing ${pairs.map(({intervalInMilliseconds, name}) =>
            `"${name}" every ${String(intervalInMilliseconds / 1000)}s`
        ).join(', ')}.`
    )

    // NOTE: A function to not let the compiler narrow the flag once.
    const isStopped = () => signal.aborted

    while (!isStopped()) {
        for (const pair of pairs) {
            if (isStopped())
                break
            if ((dueAt.get(pair.name) ?? 0) > Date.now())
                continue

            try {
                const summary = await synchronizePair(pair)
                if (summary)
                    log(`"${pair.name}": ${summary}`)
            } catch (error) {
                log(
                    `"${pair.name}" failed: ` +
                    (error instanceof Error ? error.message : String(error))
                )
            }

            dueAt.set(pair.name, Date.now() + pair.intervalInMilliseconds)
        }

        await sleep(
            Math.max(0, Math.min(...dueAt.values()) - Date.now()), signal
        )
    }

    log('Stopped.')
}
