// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module keychain */
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
import {spawn} from 'child_process'
import {mkdir, readFile, rm, writeFile} from 'fs/promises'
import {join} from 'path'

import {APPLICATION_NAME, getConfigurationDirectory} from './state'
// endregion
/*
    Stores passwords in the operating system's credential store without
    native modules by using the tools every user can run:

    - macOS: "security" (login keychain)
    - Linux: "secret-tool" (Secret Service, e.g. GNOME Keyring, KWallet)
    - Windows: PowerShell's DPAPI binding ("ConvertFrom-SecureString"), only
      the current user on the current machine can decrypt the stored blob.

    Secrets are always handed over via standard input, never as command line
    argument (visible in process listings). They are stored hex encoded to
    avoid any quoting or console encoding issues.
*/
export interface CommandResult {
    code: null | number
    stderr: string
    stdout: string
}
export type CommandRunner = (
    command: string, parameters: Array<string>, input?: string
) => Promise<CommandResult>

export class KeychainError extends Error {
    name = 'KeychainError'
}
/**
 * Runs given command without shell, feeding given input to it.
 * @param command - Program to run.
 * @param parameters - Its arguments.
 * @param input - Standard input content.
 * @returns Exit code and outputs.
 */
export const runCommand: CommandRunner = (command, parameters, input) =>
    new Promise((resolve, reject) => {
        const child = spawn(command, parameters, {
            stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true
        })
        const stdout: Array<Buffer> = []
        const stderr: Array<Buffer> = []
        child.stdout.on('data', (chunk: Buffer) => stdout.push(chunk))
        child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk))
        child.on('error', (error: Error & {code?: string}) => {
            reject(error.code === 'ENOENT' ?
                new KeychainError(
                    `"${command}" is not available on this system, use a ` +
                    'password file or command instead.'
                ) :
                error
            )
        })
        child.on('close', (code) => {
            resolve({
                code,
                stderr: Buffer.concat(stderr).toString('utf-8'),
                stdout: Buffer.concat(stdout).toString('utf-8')
            })
        })
        child.stdin.end(input ?? '')
    })

export interface Keychain {
    delete: (name: string) => Promise<void>
    load: (name: string) => Promise<string>
    store: (name: string, password: string) => Promise<void>
}

const encode = (password: string): string =>
    Buffer.from(password, 'utf-8').toString('hex')
const decode = (secret: string): string => {
    const hex = secret.trim()
    if (!/^(?:[0-9a-f]{2})+$/.test(hex))
        throw new KeychainError('Stored password has an unexpected format.')

    return Buffer.from(hex, 'hex').toString('utf-8')
}
const check = (
    result: CommandResult, action: string, name: string
): CommandResult => {
    if (result.code !== 0)
        throw new KeychainError(
            `Could not ${action} the password of "${name}" ` +
            `(${result.stderr.trim() || `exit code ${String(result.code)}`}).`
        )

    return result
}
/**
 * Creates a keychain for the macOS login keychain.
 * @param run - Command runner.
 * @returns Keychain.
 */
export const createMacOSKeychain = (
    run: CommandRunner = runCommand
): Keychain => ({
    delete: async (name) => {
        check(
            await run(
                'security',
                ['delete-generic-password', '-a', name, '-s', APPLICATION_NAME]
            ),
            'delete',
            name
        )
    },
    load: async (name) => decode(check(
        await run(
            'security',
            ['find-generic-password', '-a', name, '-s', APPLICATION_NAME, '-w']
        ),
        'load',
        name
    ).stdout),
    store: async (name, password) => {
        // NOTE: Interactive mode reads the command (with secret) from stdin.
        check(
            await run(
                'security',
                ['-i'],
                `add-generic-password -U -a ${name} -s ${APPLICATION_NAME} ` +
                `-l ${APPLICATION_NAME}-${name} -w ${encode(password)}\n`
            ),
            'store',
            name
        )
    }
})
/**
 * Creates a keychain for the freedesktop Secret Service.
 * @param run - Command runner.
 * @returns Keychain.
 */
export const createLinuxKeychain = (
    run: CommandRunner = runCommand
): Keychain => {
    const attributes = (name: string) =>
        ['service', APPLICATION_NAME, 'account', name]

    return {
        delete: async (name) => {
            check(
                await run('secret-tool', ['clear', ...attributes(name)]),
                'delete',
                name
            )
        },
        load: async (name) => decode(check(
            await run('secret-tool', ['lookup', ...attributes(name)]),
            'load',
            name
        ).stdout),
        store: async (name, password) => {
            check(
                await run(
                    'secret-tool',
                    [
                        'store',
                        `--label=${APPLICATION_NAME} ${name}`,
                        ...attributes(name)
                    ],
                    encode(password)
                ),
                'store',
                name
            )
        }
    }
}
/**
 * Creates a keychain storing DPAPI protected blobs in the configuration
 * directory.
 * @param configurationDirectory - Application configuration directory.
 * @param run - Command runner.
 * @returns Keychain.
 */
export const createWindowsKeychain = (
    configurationDirectory: string = getConfigurationDirectory(),
    run: CommandRunner = runCommand
): Keychain => {
    const getPath = (name: string) =>
        join(configurationDirectory, 'credentials', `${name}.dpapi`)
    const powerShell = (script: string, input: string) =>
        run(
            'powershell.exe',
            ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', script],
            `${input}\n`
        )

    return {
        delete: (name) => rm(getPath(name), {force: true}),
        load: async (name) => {
            let blob: string
            try {
                blob = await readFile(getPath(name), {encoding: 'utf-8'})
            } catch {
                throw new KeychainError(
                    `No password of "${name}" stored in the keychain.`
                )
            }

            return decode(check(
                await powerShell(
                    '$secure = ConvertTo-SecureString -String ' +
                    '(@($input)[0]); ' +
                    '(New-Object ' +
                    'System.Management.Automation.PSCredential \'x\',' +
                    ' $secure).GetNetworkCredential().Password',
                    blob.trim()
                ),
                'load',
                name
            ).stdout)
        },
        store: async (name, password) => {
            const blob = check(
                await powerShell(
                    'ConvertTo-SecureString -String (@($input)[0]) ' +
                    '-AsPlainText -Force | ConvertFrom-SecureString',
                    encode(password)
                ),
                'store',
                name
            ).stdout.trim()

            await mkdir(join(configurationDirectory, 'credentials'), {
                recursive: true
            })
            await writeFile(getPath(name), `${blob}\n`, {mode: 0o600})
        }
    }
}
/**
 * Creates the keychain of the current platform.
 * @param platform - Operating system.
 * @param configurationDirectory - Application configuration directory.
 * @param run - Command runner.
 * @returns Keychain.
 */
export const createKeychain = (
    platform: NodeJS.Platform = process.platform,
    configurationDirectory?: string,
    run: CommandRunner = runCommand
): Keychain => {
    if (platform === 'darwin')
        return createMacOSKeychain(run)
    if (platform === 'win32')
        return createWindowsKeychain(configurationDirectory, run)

    return createLinuxKeychain(run)
}
