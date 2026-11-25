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
import {existsSync, writeFileSync} from 'fs'
import {join} from 'path'

import {runCommand} from './keychain'
import type {CommandRunner} from './keychain'
import {
    APPLICATION_NAME, getConfigurationDirectory, isRunning
} from './state'
// endregion
// Gives a daemon this long to finish a running synchronization.
export const STOP_TIMEOUT_IN_MILLISECONDS = 60 * 1000
export const STOP_POLL_INTERVAL_IN_MILLISECONDS = 100
// A daemon checks this often whether it has been asked to stop via file.
export const STOP_REQUEST_POLL_INTERVAL_IN_MILLISECONDS = 1000
/**
 * Determines the file asking given daemon to stop. Used on windows where
 * signals end processes immediately without any chance to clean up.
 * @param pid - Process id of the daemon.
 * @param configurationDirectory - Application configuration directory.
 * @returns Absolute file path.
 */
export const getStopRequestPath = (
    pid: number,
    configurationDirectory: string = getConfigurationDirectory()
): string => join(configurationDirectory, `daemon-${String(pid)}.stop`)

/**
 * Determines the file a daemon keeps while sealing its pairs on stop, so
 * "stop" can tell a long running seal from a hanging daemon.
 * @param pid - Process id of the daemon.
 * @param configurationDirectory - Application configuration directory.
 * @returns Absolute file path.
 */
export const getSealingPath = (
    pid: number,
    configurationDirectory: string = getConfigurationDirectory()
): string => join(configurationDirectory, `daemon-${String(pid)}.sealing`)

export interface ProcessControl {
    // Resolves with the command line or null if it can not be determined.
    getCommandLine: (pid: number) => Promise<null | string>
    isRunning: (pid: number) => boolean
    // Whether given daemon currently seals its pairs before stopping.
    isSealing: (pid: number) => boolean
    // Asks given process to stop (gracefully, see "getStopRequestPath").
    terminate: (pid: number) => void
}
/**
 * Creates process controls of the current platform.
 * @param run - Runs helper programs ("ps" or PowerShell).
 * @param platform - Operating system.
 * @param configurationDirectory - Application configuration directory
 * (holds stop requests on windows).
 * @returns Process controls.
 */
export const createProcessControl = (
    run: CommandRunner = runCommand,
    platform: NodeJS.Platform = process.platform,
    configurationDirectory: string = getConfigurationDirectory()
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
    isSealing: (pid) =>
        existsSync(getSealingPath(pid, configurationDirectory)),
    terminate: (pid) => {
        /*
            NOTE: "SIGTERM" ends processes immediately on windows, the
            daemon would not finish (or seal) its pairs.
        */
        if (platform === 'win32')
            writeFileSync(getStopRequestPath(pid, configurationDirectory), '')
        else
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
 * synchronization first. A daemon still sealing its pairs after the timeout
 * is left to finish on its own.
 * @param pid - Process id of the daemon.
 * @param control - Process controls.
 * @param timeoutInMilliseconds - Time to wait for the stop.
 * @param pollIntervalInMilliseconds - Time between checks.
 * @returns Promise resolving with "stopped" when the process stopped or
 * "sealing" if it still seals after the timeout.
 */
export const stopDaemon = async (
    pid: number,
    control: ProcessControl,
    timeoutInMilliseconds = STOP_TIMEOUT_IN_MILLISECONDS,
    pollIntervalInMilliseconds = STOP_POLL_INTERVAL_IN_MILLISECONDS
): Promise<'sealing' | 'stopped'> => {
    control.terminate(pid)

    const end = Date.now() + timeoutInMilliseconds
    while (control.isRunning(pid)) {
        if (Date.now() > end) {
            // NOTE: Removing large plaintext directories may take a while.
            if (control.isSealing(pid))
                return 'sealing'

            throw new Error(
                `Daemon (process ${String(pid)}) did not stop within ` +
                `${String(timeoutInMilliseconds / 1000)}s.`
            )
        }

        await new Promise((resolve) =>
            setTimeout(resolve, pollIntervalInMilliseconds)
        )
    }

    return 'stopped'
}
