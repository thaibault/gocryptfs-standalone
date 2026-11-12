// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module service */
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
import {spawn} from 'child_process'
import {mkdir, rm, stat, writeFile} from 'fs/promises'
import {homedir, userInfo} from 'os'
import {join, resolve} from 'path'

import {runCommand} from './keychain'
import type {CommandRunner} from './keychain'
import {
    APPLICATION_NAME,
    CONFIGURATION_DIRECTORY_ENVIRONMENT_VARIABLE_NAME,
    getConfigurationDirectory
} from './state'
// endregion
/*
    Per user autostart of "daemon" without admin rights:

    - macOS: launchd agent in "~/Library/LaunchAgents"
    - Linux: systemd user unit in "~/.config/systemd/user"
    - Windows: command file in the user's startup folder (Task Scheduler log
      on triggers need admin rights)
*/
export const LAUNCHD_LABEL = `com.tsickert.${APPLICATION_NAME}`
export const LOG_FILE_NAME = 'daemon.log'

export interface ServiceEnvironment {
    configurationDirectory: string
    // Explicitly configured configuration directory to hand over.
    configurationDirectoryOverride?: string
    environment: NodeJS.ProcessEnv
    home: string
    platform: NodeJS.Platform
    // Program and arguments starting this application.
    program: Array<string>
    run: CommandRunner
    uid: number
}

export interface Service {
    install: () => Promise<string>
    status: () => Promise<string>
    uninstall: () => Promise<string>
}
/**
 * Determines how this application was started: a single executable or a
 * script run by node.
 * @param execPath - Path of the running executable.
 * @param argv - Process arguments.
 * @returns Program and arguments to start it again.
 */
export const getProgram = (
    execPath: string = process.execPath, argv: Array<string> = process.argv
): Array<string> =>
    argv[1] && resolve(argv[1]) !== execPath ?
        [execPath, resolve(argv[1])] :
        [execPath]
/**
 * Escapes given text for xml content.
 * @param text - Text to escape.
 * @returns Escaped text.
 */
const escapeXML = (text: string): string =>
    text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
/**
 * Creates the launchd agent definition.
 * @param program - Program and arguments to run.
 * @param logPath - File to write output to.
 * @param environment - Environment variables to set.
 * @returns Property list content.
 */
export const createLaunchdPlist = (
    program: Array<string>,
    logPath: string,
    environment: Record<string, string>
): string => {
    const strings = (values: Array<string>) =>
        values.map((value) => `        <string>${escapeXML(value)}</string>`)
            .join('\n')
    const variables = Object.entries(environment).map(([key, value]) =>
        `        <key>${escapeXML(key)}</key>\n` +
        `        <string>${escapeXML(value)}</string>`
    ).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>${LAUNCHD_LABEL}</string>
    <key>ProgramArguments</key>
    <array>
${strings([...program, 'daemon'])}
    </array>
    <key>EnvironmentVariables</key>
    <dict>
${variables}
    </dict>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <dict>
        <key>SuccessfulExit</key>
        <false/>
    </dict>
    <key>ThrottleInterval</key>
    <integer>60</integer>
    <key>ProcessType</key>
    <string>Background</string>
    <key>StandardOutPath</key>
    <string>${escapeXML(logPath)}</string>
    <key>StandardErrorPath</key>
    <string>${escapeXML(logPath)}</string>
</dict>
</plist>
`
}
/**
 * Creates the systemd user unit.
 * @param program - Program and arguments to run.
 * @param environment - Environment variables to set.
 * @returns Unit file content.
 */
export const createSystemdUnit = (
    program: Array<string>, environment: Record<string, string>
): string => {
    const quote = (value: string) =>
        `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`

    return `[Unit]
Description=${APPLICATION_NAME}: synchronizes gocryptfs vaults

[Service]
ExecStart=${[...program, 'daemon'].map(quote).join(' ')}
${Object.entries(environment).map(([key, value]) =>
        `Environment=${quote(`${key}=${value}`)}\n`
    ).join('')}Restart=on-failure
RestartSec=60

[Install]
WantedBy=default.target
`
}
/**
 * Creates the windows startup command file starting the daemon minimized.
 * @param program - Program and arguments to run.
 * @param logPath - File to write output to.
 * @param environment - Environment variables to set.
 * @returns Command file content.
 */
export const createWindowsStartupScript = (
    program: Array<string>,
    logPath: string,
    environment: Record<string, string>
): string =>
    '@echo off\r\n' +
    Object.entries(environment).map(([key, value]) =>
        `set "${key}=${value}"\r\n`
    ).join('') +
    `start "${APPLICATION_NAME}" /min cmd /c "` +
    [...program, 'daemon'].map((value) => `"${value}"`).join(' ') +
    ` >> "${logPath}" 2>&1"\r\n`
/**
 * Checks whether given path exists.
 * @param path - Path to check.
 * @returns Indicates existence.
 */
const exists = async (path: string): Promise<boolean> => {
    try {
        await stat(path)

        return true
    } catch {
        return false
    }
}
/**
 * Creates the autostart service of the current platform.
 * @param givenEnvironment - Platform details (defaults to the running one).
 * @returns Service controls, each resolving with a message for the user.
 */
export const createService = (
    givenEnvironment: Partial<ServiceEnvironment> = {}
): Service => {
    const environment: ServiceEnvironment = {
        configurationDirectory: getConfigurationDirectory(),
        configurationDirectoryOverride:
            process.env[CONFIGURATION_DIRECTORY_ENVIRONMENT_VARIABLE_NAME],
        environment: process.env,
        home: homedir(),
        platform: process.platform,
        program: getProgram(),
        run: runCommand,
        uid: process.getuid?.() ?? userInfo().uid,
        ...givenEnvironment
    }
    const {configurationDirectory, home, platform, program, run, uid} =
        environment
    const logPath = join(configurationDirectory, LOG_FILE_NAME)
    const variables: Record<string, string> =
        environment.configurationDirectoryOverride ?
            {
                [CONFIGURATION_DIRECTORY_ENVIRONMENT_VARIABLE_NAME]:
                    environment.configurationDirectoryOverride
            } :
            {}

    if (platform === 'darwin') {
        const path =
            join(home, 'Library/LaunchAgents', `${LAUNCHD_LABEL}.plist`)
        const target = `gui/${String(uid)}`
        const service = `${target}/${LAUNCHD_LABEL}`

        return {
            install: async () => {
                await mkdir(join(home, 'Library/LaunchAgents'), {
                    recursive: true
                })
                await mkdir(configurationDirectory, {recursive: true})
                await writeFile(
                    path, createLaunchdPlist(program, logPath, variables)
                )
                // NOTE: Replaces an already loaded (older) definition.
                await run('launchctl', ['bootout', service])
                const result =
                    await run('launchctl', ['bootstrap', target, path])
                if (result.code !== 0)
                    throw new Error(
                        `Could not load "${path}": ${result.stderr.trim()}`
                    )

                return `Installed and started "${path}", logging to ` +
                    `"${logPath}".`
            },
            status: async () => {
                if (!await exists(path))
                    return 'Not installed.'

                const result =
                    await run('launchctl', ['print', service])
                const state = /^\s*state = (.+)$/m.exec(result.stdout)?.[1]

                return `Installed ("${path}"), ` +
                    (result.code === 0 ?
                        `state: ${state ?? 'unknown'}` :
                        'not loaded') +
                    `, log: "${logPath}".`
            },
            uninstall: async () => {
                await run('launchctl', ['bootout', service])
                await rm(path, {force: true})

                return `Stopped and removed "${path}".`
            }
        }
    }

    if (platform === 'win32') {
        const path = join(
            environment.environment.APPDATA ?? join(home, 'AppData/Roaming'),
            'Microsoft/Windows/Start Menu/Programs/Startup',
            `${APPLICATION_NAME}.cmd`
        )

        return {
            install: async () => {
                await mkdir(configurationDirectory, {recursive: true})
                await writeFile(
                    path,
                    createWindowsStartupScript(program, logPath, variables)
                )
                spawn('cmd.exe', ['/c', path], {
                    detached: true, stdio: 'ignore', windowsHide: true
                }).unref()

                return `Installed and started "${path}", logging to ` +
                    `"${logPath}".`
            },
            status: async () =>
                await exists(path) ?
                    `Installed ("${path}"), log: "${logPath}".` :
                    'Not installed.',
            uninstall: async () => {
                await rm(path, {force: true})

                return `Removed "${path}". A running daemon stops with the ` +
                    'next log off or can be ended in the task manager.'
            }
        }
    }

    const unitName = `${APPLICATION_NAME}.service`
    const path = join(
        environment.environment.XDG_CONFIG_HOME ?? join(home, '.config'),
        'systemd/user',
        unitName
    )
    const systemctl = async (parameters: Array<string>) => {
        const result = await run('systemctl', ['--user', ...parameters])
        if (result.code !== 0)
            throw new Error(
                `"systemctl --user ${parameters.join(' ')}" failed: ` +
                result.stderr.trim()
            )

        return result
    }

    return {
        install: async () => {
            await mkdir(join(path, '..'), {recursive: true})
            await writeFile(path, createSystemdUnit(program, variables))
            await systemctl(['daemon-reload'])
            await systemctl(['enable', '--now', unitName])
            await systemctl(['restart', unitName])

            return `Installed and started "${path}" (log: "journalctl ` +
                `--user -u ${unitName}"). To keep it running while logged ` +
                'out: "loginctl enable-linger".'
        },
        status: async () => {
            if (!await exists(path))
                return 'Not installed.'

            const result =
                await run('systemctl', ['--user', 'is-active', unitName])

            return `Installed ("${path}"), state: ${result.stdout.trim()}.`
        },
        uninstall: async () => {
            await run('systemctl', ['--user', 'disable', '--now', unitName])
            await rm(path, {force: true})
            await run('systemctl', ['--user', 'daemon-reload'])

            return `Stopped and removed "${path}".`
        }
    }
}
