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

import {describe, expect, test} from '@jest/globals'

import type {CommandRunner} from '../keychain'
import {
    createProcessControl, isDaemonCommandLine, stopDaemon
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

            await stopDaemon(pid, control)
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
            terminate: (pid) => terminated.push(pid)
        }

        await expect(stopDaemon(42, control, 50, 10)).rejects.toThrow(
            'Daemon (process 42) did not stop within 0.05s.'
        )
        expect(terminated).toStrictEqual([42])
    })
})
