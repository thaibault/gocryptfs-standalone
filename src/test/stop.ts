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
import {spawn} from 'child_process'
import {existsSync} from 'fs'
import {mkdtemp, rm, writeFile} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'

import {describe, expect, test} from '@jest/globals'

import type {CommandRunner} from '../keychain'
import {
    createProcessControl,
    getSealingPath,
    getStopRequestPath,
    isDaemonCommandLine,
    stopDaemon
} from '../stop'
import type {ProcessControl} from '../stop'
// endregion
describe('stop', () => {
    test.each([
        ['/usr/bin/node /usr/bin/gocryptfs-standalone daemon', true],
        [
            'node /opt/gocryptfs-standalone/dist/index.js daemon docs ' +
            '--background-child',
            true
        ],
        ['"C:\\gocryptfs-standalone-windows-x64.exe" "daemon"', true],
        ['/usr/bin/node /usr/bin/gocryptfs-standalone sync', false],
        ['/usr/bin/node /usr/bin/gocryptfs-standalone daemons', false],
        ['/usr/sbin/sshd daemon', false]
    ])('isDaemonCommandLine("%s") -> %s', (commandLine, expected) => {
        expect(isDaemonCommandLine(commandLine)).toStrictEqual(expected)
    })
    test('getCommandLine queries the platform', async () => {
        const calls: Array<string> = []
        const run: CommandRunner = (command, parameters) => {
            calls.push([command, ...parameters].join(' '))

            return Promise.resolve({
                code: parameters.includes('2') ? 1 : 0,
                stderr: '',
                stdout: 'gocryptfs-standalone daemon\n'
            })
        }

        expect(await createProcessControl(run, 'linux').getCommandLine(1))
            .toStrictEqual('gocryptfs-standalone daemon')
        expect(await createProcessControl(run, 'darwin').getCommandLine(2))
            .toBeNull()
        expect(await createProcessControl(run, 'win32').getCommandLine(3))
            .toStrictEqual('gocryptfs-standalone daemon')
        expect(calls).toStrictEqual([
            'ps -ww -o command= -p 1',
            'ps -ww -o command= -p 2',
            'powershell.exe -NoLogo -NoProfile -NonInteractive -Command ' +
            '(Get-CimInstance Win32_Process -Filter "ProcessId=3")' +
            '.CommandLine'
        ])

        expect(await createProcessControl(
            () => Promise.reject(new Error('missing')), 'linux'
        ).getCommandLine(1)).toBeNull()
    })
    test('windows daemons are asked to stop via file', async () => {
        const directory =
            await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
        try {
            createProcessControl(undefined, 'win32', directory).terminate(42)
            expect(existsSync(getStopRequestPath(42, directory)))
                .toStrictEqual(true)
            expect(getStopRequestPath(42, directory))
                .toStrictEqual(join(directory, 'daemon-42.stop'))
        } finally {
            await rm(directory, {force: true, recursive: true})
        }
    })
    test('sealing daemons are recognized via file', async () => {
        const directory =
            await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
        try {
            const control = createProcessControl(undefined, 'linux', directory)
            expect(control.isSealing(42)).toStrictEqual(false)

            await writeFile(getSealingPath(42, directory), '')
            expect(control.isSealing(42)).toStrictEqual(true)
            expect(getSealingPath(42, directory))
                .toStrictEqual(join(directory, 'daemon-42.sealing'))
        } finally {
            await rm(directory, {force: true, recursive: true})
        }
    })
    test('stops a real process', async () => {
        const child = spawn(
            process.execPath,
            ['-e', 'setInterval(() => {}, 1000)', 'gocryptfs-standalone', 'daemon'],
            {stdio: 'ignore'}
        )
        const pid = child.pid as number
        const exited = new Promise((resolve) => child.once('exit', resolve))
        const control = createProcessControl()

        try {
            expect(isDaemonCommandLine(
                await control.getCommandLine(pid) as string
            )).toStrictEqual(true)

            expect(await stopDaemon(pid, control)).toStrictEqual('stopped')
            expect(control.isRunning(pid)).toStrictEqual(false)
            await exited
        } finally {
            child.kill('SIGKILL')
        }
    })
    test('stopDaemon times out', async () => {
        const terminated: Array<number> = []
        const control: ProcessControl = {
            getCommandLine: () => Promise.resolve(null),
            isRunning: () => true,
            isSealing: () => false,
            terminate: (pid) => terminated.push(pid)
        }

        await expect(stopDaemon(42, control, 50, 10)).rejects.toThrow(
            'Daemon (process 42) did not stop within 0.05s.'
        )
        expect(terminated).toStrictEqual([42])

        // A long running seal is no failure.
        expect(await stopDaemon(42, {...control, isSealing: () => true}, 50, 10))
            .toStrictEqual('sealing')
    })
})
