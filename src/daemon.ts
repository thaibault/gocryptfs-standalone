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
import type {Watcher} from './watch'
// endregion
// Waits for this long without further changes before synchronizing.
export const QUIET_PERIOD_IN_MILLISECONDS = 2 * 1000
// Synchronizes at the latest after this long while changes keep coming.
export const MAXIMAL_CHANGE_DELAY_IN_MILLISECONDS = 30 * 1000
// Restarts a failed watcher after this long.
export const WATCH_RETRY_INTERVAL_IN_MILLISECONDS = 5 * 60 * 1000

export interface DaemonOptions {
    log: (text: string) => void
    // Timing of change triggered runs (replaceable for testing).
    maximalChangeDelayInMilliseconds?: number
    quietPeriodInMilliseconds?: number
    watchRetryIntervalInMilliseconds?: number
    pairs: Array<ResolvedPair>
    // Synchronizes one pair, resolves with a summary or null if idle.
    synchronizePair: (pair: ResolvedPair) => Promise<null | string>
    signal: AbortSignal
    /*
        Watches a pair for changes (see "watch" module), pairs are only
        synchronized in their interval without it.
    */
    watchPair?: (
        pair: ResolvedPair,
        onChange: () => void,
        onError: (error: Error) => void
    ) => Watcher
}

interface PairState {
    // First and last change not synchronized yet.
    changedAt?: number
    lastChangedAt?: number
    // Next synchronization by interval.
    dueAt: number
    // Whether the last attempt to watch failed.
    watchFailed: boolean
    watcher?: Watcher
    // When to (re)start watching, undefined while watching or disabled.
    watchAt?: number
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
 * Synchronizes all given pairs right away and afterwards each one shortly
 * after changes (if watched) or at the latest in its own interval until given
 * signal aborts. Runs never overlap, so a slow pair delays the others instead
 * of competing for disk and cpu. Failures are logged and retried in the next
 * interval, failed watchers get restarted periodically.
 * @param options - Pairs, synchronization, watching and logging.
 * @returns Promise resolving after the abort when no run is active anymore.
 */
export const runDaemon = async (options: DaemonOptions): Promise<void> => {
    const MAXIMAL_CHANGE_DELAY = MAXIMAL_CHANGE_DELAY_IN_MILLISECONDS
    const QUIET_PERIOD = QUIET_PERIOD_IN_MILLISECONDS
    const WATCH_RETRY_INTERVAL = WATCH_RETRY_INTERVAL_IN_MILLISECONDS
    const {
        log,
        maximalChangeDelayInMilliseconds = MAXIMAL_CHANGE_DELAY,
        pairs,
        quietPeriodInMilliseconds = QUIET_PERIOD,
        signal,
        synchronizePair,
        watchPair,
        watchRetryIntervalInMilliseconds = WATCH_RETRY_INTERVAL
    } = options
    const states = new Map<string, PairState>(pairs.map((pair) => [
        pair.name,
        {
            dueAt: 0,
            watchAt: watchPair && pair.watch ? 0 : undefined,
            watchFailed: false
        }
    ]))
    const getState = (pair: ResolvedPair) => states.get(pair.name) as PairState

    // Interrupts waiting when something changed.
    let wakeUp = new AbortController()

    const getMessage = (error: unknown) =>
        error instanceof Error ? error.message : String(error)
    const getSynchronizationDueAt = (state: PairState): number =>
        state.changedAt === undefined ?
            state.dueAt :
            Math.min(
                state.dueAt,
                (state.lastChangedAt ?? state.changedAt) +
                    quietPeriodInMilliseconds,
                state.changedAt + maximalChangeDelayInMilliseconds
            )

    const stopWatching = (pair: ResolvedPair, error: unknown) => {
        const state = getState(pair)
        // NOTE: Both sides may report the same problem.
        if (!state.watcher)
            return

        state.watcher.close()
        state.watcher = undefined
        state.watchAt = Date.now() + watchRetryIntervalInMilliseconds
        state.watchFailed = true
        log(
            `"${pair.name}": watching for changes failed ` +
            `(${getMessage(error)}), synchronizing in its interval until ` +
            'watching works again.'
        )
        wakeUp.abort()
    }
    const startWatching = (pair: ResolvedPair) => {
        const state = getState(pair)
        try {
            const watcher = (watchPair as Required<DaemonOptions>['watchPair'])(
                pair,
                () => {
                    const now = Date.now()
                    state.changedAt ??= now
                    state.lastChangedAt = now
                    wakeUp.abort()
                },
                (error) => {
                    stopWatching(pair, error)
                }
            )
            state.watcher = watcher
            state.watchAt = undefined

            if (state.watchFailed) {
                state.watchFailed = false
                log(`"${pair.name}": watching for changes again.`)
                // Catch up with changes missed in the meantime.
                state.dueAt = Date.now()
            }
        } catch (error) {
            state.watchAt = Date.now() + watchRetryIntervalInMilliseconds
            // Repeated failures are only logged once.
            if (!state.watchFailed) {
                state.watchFailed = true
                log(
                    `"${pair.name}": watching for changes failed ` +
                    `(${getMessage(error)}), synchronizing in its interval ` +
                    'until watching works again.'
                )
            }
        }
    }

    log(
        `Started synchronizing ${pairs.map((pair) =>
            `"${pair.name}" every ` +
            `${String(pair.intervalInMilliseconds / 1000)}s` +
            (getState(pair).watchAt === undefined ? '' : ' and on changes')
        ).join(', ')}.`
    )

    // NOTE: A function to not let the compiler narrow the flag once.
    const isStopped = () => signal.aborted

    try {
        while (!isStopped()) {
            for (const pair of pairs) {
                if (isStopped())
                    break

                const state = getState(pair)
                if (getSynchronizationDueAt(state) <= Date.now()) {
                    /*
                        NOTE: Changes during the run (including our own
                        writes) lead to another run which normally finds
                        nothing to do.
                    */
                    state.changedAt = undefined
                    state.lastChangedAt = undefined

                    try {
                        const summary = await synchronizePair(pair)
                        if (summary)
                            log(`"${pair.name}": ${summary}`)
                    } catch (error) {
                        log(`"${pair.name}" failed: ${getMessage(error)}`)
                    }

                    state.dueAt = Date.now() + pair.intervalInMilliseconds
                }

                // NOTE: Started after the first run created missing roots.
                if (
                    !isStopped() &&
                    state.watchAt !== undefined &&
                    state.watchAt <= Date.now()
                )
                    startWatching(pair)
            }

            const nextAt = Math.min(...[...states.values()].map((state) =>
                Math.min(
                    getSynchronizationDueAt(state), state.watchAt ?? Infinity
                )
            ))
            await sleep(
                Math.max(0, nextAt - Date.now()),
                AbortSignal.any([signal, wakeUp.signal])
            )
            if (wakeUp.signal.aborted)
                wakeUp = new AbortController()
        }
    } finally {
        for (const state of states.values())
            state.watcher?.close()
    }

    log('Stopped.')
}
