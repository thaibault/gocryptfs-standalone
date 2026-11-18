// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module stop */
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
import {runCommand} from './keychain'
import type {CommandRunner} from './keychain'
import {APPLICATION_NAME, isRunning} from './state'
// endregion
// Gives a daemon this long to finish a running synchronization.
export const STOP_TIMEOUT_IN_MILLISECONDS = 60 * 1000
export const STOP_POLL_INTERVAL_IN_MILLISECONDS = 100

export interface ProcessControl {
    // Resolves with the command line or null if it can not be determined.
    getCommandLine: (pid: number) => Promise<null | string>
    isRunning: (pid: number) => boolean
    // NOTE: Ends processes immediately on windows.
    terminate: (pid: number) => void
}
/**
 * Creates process controls of the current platform.
 * @param run - Runs helper programs ("ps" or PowerShell).
 * @param platform - Operating system.
 * @returns Process controls.
 */
export const createProcessControl = (
    run: CommandRunner = runCommand,
    platform: NodeJS.Platform = process.platform
): ProcessControl => ({
    getCommandLine: async (pid) => {
        try {
            const result = platform === 'win32' ?
                await run(
                    'powershell.exe',
                    [
                        '-NoLogo',
                        '-NoProfile',
                        '-NonInteractive',
                        '-Command',
                        '(Get-CimInstance Win32_Process -Filter ' +
                        `"ProcessId=${String(pid)}").CommandLine`
                    ]
                ) :
                // NOTE: "-ww" avoids truncating long command lines.
                await run('ps', ['-ww', '-o', 'command=', '-p', String(pid)])
            const commandLine = result.stdout.trim()

            return result.code === 0 && commandLine ? commandLine : null
        } catch {
            return null
        }
    },
    isRunning,
    terminate: (pid) => {
        process.kill(pid, 'SIGTERM')
    }
})
/**
 * Checks whether given command line belongs to a daemon of this
 * application, so a reused process id of a stale lock never hits an
 * unrelated process.
 * @param commandLine - Command line of the process.
 * @returns Indicates a daemon of this application.
 */
export const isDaemonCommandLine = (commandLine: string): boolean =>
    commandLine.includes(APPLICATION_NAME) &&
    /(^|[\s"'])daemon($|[\s"'])/.test(commandLine)
/**
 * Asks given daemon to stop and waits until it did, it finishes a running
 * synchronization first.
 * @param pid - Process id of the daemon.
 * @param control - Process controls.
 * @param timeoutInMilliseconds - Time to wait for the stop.
 * @param pollIntervalInMilliseconds - Time between checks.
 * @returns Promise resolving when the process stopped.
 */
export const stopDaemon = async (
    pid: number,
    control: ProcessControl,
    timeoutInMilliseconds = STOP_TIMEOUT_IN_MILLISECONDS,
    pollIntervalInMilliseconds = STOP_POLL_INTERVAL_IN_MILLISECONDS
): Promise<void> => {
    control.terminate(pid)

    const end = Date.now() + timeoutInMilliseconds
    while (control.isRunning(pid)) {
        if (Date.now() > end)
            throw new Error(
                `Daemon (process ${String(pid)}) did not stop within ` +
                `${String(timeoutInMilliseconds / 1000)}s.`
            )

        await new Promise((resolve) =>
            setTimeout(resolve, pollIntervalInMilliseconds)
        )
    }
}
