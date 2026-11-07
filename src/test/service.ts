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
    const createPair = (name: string, interval: number): ResolvedPair => ({
        excludes: [],
        intervalInMilliseconds: interval,
        name,
        password: 'keychain',
        plaintext: '/a',
        trashDays: 30,
        vault: '/b'
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
})
