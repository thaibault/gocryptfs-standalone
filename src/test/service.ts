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
import {mkdtemp, readFile, rm, stat} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'

import {afterAll, beforeAll, describe, expect, test} from '@jest/globals'

import {runDaemon, sleep} from '../daemon'
import type {CommandRunner} from '../keychain'
import {
    createLaunchdPlist,
    createService,
    createSystemdUnit,
    createWindowsStartupScript,
    getProgram
} from '../service'
import type {ResolvedPair} from '../settings'
import {LockedError} from '../state'
import type {Change} from '../type'
// endregion
const PROGRAM = ['/opt/node', '/opt/app/index.js']

const createRunner = () => {
    const calls: Array<string> = []
    const run: CommandRunner = (command, parameters) => {
        calls.push([command, ...parameters].join(' '))

        return Promise.resolve({
            code: 0, stderr: '', stdout: '\tstate = running\nactive\n'
        })
    }

    return {calls, run}
}
const exists = async (path: string) => {
    try {
        await stat(path)

        return true
    } catch {
        return false
    }
}

describe('service', () => {
    let home = ''
    beforeAll(async () => {
        home = await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
    })
    afterAll(async () => {
        await rm(home, {force: true, recursive: true})
    })

    test('getProgram', () => {
        expect(getProgram('/opt/node', ['/opt/node', '/opt/app/index.js']))
            .toStrictEqual(PROGRAM)
        // Single executable application.
        expect(getProgram('/opt/app', ['/opt/app', '/opt/app']))
            .toStrictEqual(['/opt/app'])
    })
    test('createLaunchdPlist', () => {
        const plist = createLaunchdPlist(
            PROGRAM, '/log & more', {DIRECTORY: '/a<b>'}
        )

        expect(plist).toContain(
            '        <string>/opt/node</string>\n' +
            '        <string>/opt/app/index.js</string>\n' +
            '        <string>daemon</string>'
        )
        expect(plist).toContain('<string>/log &amp; more</string>')
        expect(plist).toContain('<string>/a&lt;b&gt;</string>')
    })
    test('createSystemdUnit', () => {
        expect(createSystemdUnit(['/opt/my "app"'], {A: 'b c'})).toContain(
            'ExecStart="/opt/my \\"app\\"" "daemon"\n' +
            'Environment="A=b c"\n'
        )
    })
    test('createWindowsStartupScript', () => {
        expect(createWindowsStartupScript(
            ['C:\\app.exe'], 'C:\\log.txt', {A: 'b'}
        )).toStrictEqual(
            '@echo off\r\nset "A=b"\r\nstart "gocryptfs-standalone" /min ' +
            'cmd /c ""C:\\app.exe" "daemon" >> "C:\\log.txt" 2>&1"\r\n'
        )
    })
    test.each<[NodeJS.Platform, string, Array<string>]>([
        [
            'darwin',
            'Library/LaunchAgents/com.tsickert.gocryptfs-standalone.plist',
            [
                'launchctl bootout gui/501/com.tsickert.gocryptfs-standalone',
                'launchctl bootstrap gui/501 <path>'
            ]
        ],
        [
            'linux',
            '.config/systemd/user/gocryptfs-standalone.service',
            [
                'systemctl --user daemon-reload',
                'systemctl --user enable --now gocryptfs-standalone.service',
                'systemctl --user restart gocryptfs-standalone.service'
            ]
        ]
    ])('%s install, status and uninstall', async (
        platform, relativePath, installCalls
    ) => {
        const {calls, run} = createRunner()
        const path = join(home, platform, relativePath)
        const service = createService({
            configurationDirectory: join(home, platform, 'configuration'),
            environment: {},
            home: join(home, platform),
            platform,
            program: PROGRAM,
            run,
            uid: 501
        })

        expect(await service.status()).toStrictEqual('Not installed.')

        expect(await service.install()).toContain(path)
        expect(await exists(path)).toStrictEqual(true)
        expect(await readFile(path, {encoding: 'utf-8'}))
            .toContain('/opt/app/index.js')
        expect(calls).toStrictEqual(
            installCalls.map((call) => call.replace('<path>', path))
        )

        expect(await service.status()).toMatch(/running|active/)

        await service.uninstall()
        expect(await exists(path)).toStrictEqual(false)
    })
})

describe('daemon', () => {
    const createPair = (
        name: string, interval: number, watch = false
    ): ResolvedPair => ({
        excludes: [],
        intervalInMilliseconds: interval,
        name,
        password: 'keychain',
        plaintext: '/a',
        trashDays: 30,
        vault: '/b',
        watch
    })

    test('sleep ends early on abort', async () => {
        const controller = new AbortController()
        const start = Date.now()
        setTimeout(() => {
            controller.abort()
        }, 20)

        await sleep(10000, controller.signal)
        expect(Date.now() - start).toBeLessThan(1000)
        // Already aborted signals return immediately.
        await sleep(10000, controller.signal)
    })
    test('runDaemon synchronizes in intervals and survives failures', async () => {
        const controller = new AbortController()
        const runs: Array<string> = []
        const logs: Array<string> = []

        await runDaemon({
            log: (text) => logs.push(text),
            pairs: [createPair('fast', 20), createPair('slow', 100000)],
            signal: controller.signal,
            synchronizePair: (pair) => {
                runs.push(pair.name)
                if (runs.length === 2)
                    return Promise.reject(new Error('Vault not reachable.'))
                if (runs.length >= 4)
                    controller.abort()

                return Promise.resolve(runs.length === 1 ? 'Applied 1 changes.' : null)
            },
            // Pairs not to watch are never watched.
            watchPair: () => {
                throw new Error('Unexpected watching.')
            }
        })

        expect(runs).toStrictEqual(['fast', 'slow', 'fast', 'fast'])
        expect(logs).toStrictEqual([
            'Started synchronizing "fast" every 0.02s, "slow" every 100s.',
            '"fast": Applied 1 changes.',
            '"slow" failed: Vault not reachable.',
            'Stopped.'
        ])
    })
    test('runDaemon synchronizes shortly after changes', async () => {
        const controller = new AbortController()
        const logs: Array<string> = []
        const runTimes: Array<number> = []
        let closed = 0
        let onChange = (_: Change) => undefined as void
        const change = () => {
            onChange({path: 'a.txt', side: 'plain'})
        }
        let changeTimer: ReturnType<typeof setInterval> | undefined

        await runDaemon({
            log: (text) => logs.push(text),
            maximalChangeDelayInMilliseconds: 100,
            pairs: [createPair('docs', 100000, true)],
            quietPeriodInMilliseconds: 20,
            signal: controller.signal,
            synchronizePair: () => {
                runTimes.push(Date.now())
                if (runTimes.length === 1)
                    // One single change.
                    setTimeout(change, 10)
                else if (runTimes.length === 2)
                    // Changes keep coming.
                    changeTimer = setInterval(change, 5)
                else {
                    clearInterval(changeTimer)
                    controller.abort()
                }

                return Promise.resolve(null)
            },
            watchPair: (_, givenOnChange) => {
                onChange = givenOnChange

                return {
                    close: () => {
                        closed += 1
                    }
                }
            }
        })

        expect(runTimes).toHaveLength(3)
        // Waits for the quiet period after the change.
        expect(runTimes[1] - runTimes[0]).toBeGreaterThanOrEqual(25)
        expect(runTimes[1] - runTimes[0]).toBeLessThan(5000)
        // Continuous changes delay a run at most the maximal delay.
        expect(runTimes[2] - runTimes[1]).toBeGreaterThanOrEqual(95)
        expect(runTimes[2] - runTimes[1]).toBeLessThan(5000)
        expect(closed).toStrictEqual(1)
        expect(logs).toStrictEqual([
            'Started synchronizing "docs" every 100s and on changes.',
            'Stopped.'
        ])
    })
    test('runDaemon skips runs caused by its own changes', async () => {
        const controller = new AbortController()
        const checked: Array<Array<Change>> = []
        let runs = 0
        let onChange = (_: Change) => undefined as void

        await runDaemon({
            isSynchronized: (_, changes) => {
                checked.push(changes)
                if (checked.length === 1)
                    // Our own write shortly after the run, so another change.
                    setTimeout(() => {
                        onChange({path: 'b.txt', side: 'cipher'})
                    }, 5)
                if (checked.length === 3)
                    return Promise.reject(new Error('State not readable.'))

                return Promise.resolve(checked.length === 1)
            },
            log: () => undefined,
            pairs: [createPair('docs', 100000, true)],
            quietPeriodInMilliseconds: 10,
            signal: controller.signal,
            synchronizePair: () => {
                runs += 1
                if (runs === 1)
                    setTimeout(() => {
                        // Collected once per side and path.
                        onChange({path: 'a.txt', side: 'cipher'})
                        onChange({path: 'a.txt', side: 'cipher'})
                        onChange({path: 'a.txt', side: 'plain'})
                    }, 5)
                else if (runs === 2)
                    setTimeout(() => {
                        onChange({path: 'c.txt', side: 'plain'})
                    }, 5)
                else
                    controller.abort()

                return Promise.resolve(null)
            },
            watchPair: (_, givenOnChange) => {
                onChange = givenOnChange

                return {close: () => undefined}
            }
        })

        // Besides the initial run only foreign changes and doubts run.
        expect(runs).toStrictEqual(3)
        expect(checked).toStrictEqual([
            [{path: 'a.txt', side: 'cipher'}, {path: 'a.txt', side: 'plain'}],
            [{path: 'b.txt', side: 'cipher'}],
            [{path: 'c.txt', side: 'plain'}]
        ])
    })
    test('runDaemon retries shortly while the pair is locked', async () => {
        const controller = new AbortController()
        const logs: Array<string> = []
        const runTimes: Array<number> = []

        await runDaemon({
            lockedRetryIntervalInMilliseconds: 20,
            log: (text) => logs.push(text),
            pairs: [createPair('docs', 100000)],
            signal: controller.signal,
            synchronizePair: () => {
                runTimes.push(Date.now())
                if (runTimes.length === 1)
                    return Promise.reject(new LockedError(
                        'Another synchronization of this pair is running ' +
                        '(process 1).'
                    ))

                controller.abort()

                return Promise.resolve(null)
            }
        })

        // Far before the interval.
        expect(runTimes).toHaveLength(2)
        expect(runTimes[1] - runTimes[0]).toBeGreaterThanOrEqual(15)
        expect(runTimes[1] - runTimes[0]).toBeLessThan(5000)
        expect(logs).toStrictEqual([
            'Started synchronizing "docs" every 100s.',
            '"docs": Another synchronization of this pair is running ' +
            '(process 1). Retrying in 0.02s.',
            'Stopped.'
        ])
    })
    test('runDaemon restarts failed watchers', async () => {
        const controller = new AbortController()
        const logs: Array<string> = []
        let runs = 0
        let watchCalls = 0
        let closed = 0
        let onError = (_: Error) => undefined as void

        await runDaemon({
            log: (text) => logs.push(text),
            pairs: [createPair('docs', 100000, true)],
            signal: controller.signal,
            synchronizePair: () => {
                runs += 1
                if (runs === 2)
                    setTimeout(() => {
                        onError(new Error('Watch lost.'))
                        // Both sides may report the same problem.
                        onError(new Error('Watch lost.'))
                    }, 5)
                else if (runs === 3)
                    controller.abort()

                return Promise.resolve(null)
            },
            watchPair: (_, __, givenOnError) => {
                watchCalls += 1
                if (watchCalls === 1)
                    throw new Error('No space left.')

                onError = givenOnError

                return {
                    close: () => {
                        closed += 1
                    }
                }
            },
            watchRetryIntervalInMilliseconds: 30
        })

        // Each successful restart catches up with missed changes.
        expect(runs).toStrictEqual(3)
        expect(watchCalls).toStrictEqual(3)
        expect(closed).toStrictEqual(2)
        expect(logs).toStrictEqual([
            'Started synchronizing "docs" every 100s and on changes.',
            '"docs": watching for changes failed (No space left.), ' +
            'synchronizing in its interval until watching works again.',
            '"docs": watching for changes again.',
            '"docs": watching for changes failed (Watch lost.), ' +
            'synchronizing in its interval until watching works again.',
            '"docs": watching for changes again.',
            'Stopped.'
        ])
    })
})
