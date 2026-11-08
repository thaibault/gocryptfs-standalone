// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module settings */
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
import {mkdir, readFile, rename, writeFile} from 'fs/promises'
import {join} from 'path'

import {getConfigurationDirectory} from './state'
// endregion
export const SETTINGS_FILE_NAME = 'configuration.json'
export const DEFAULT_INTERVAL = '10m'
export const MINIMAL_INTERVAL_IN_MILLISECONDS = 10 * 1000
// Typical operating system and office leftovers not worth synchronizing.
export const DEFAULT_EXCLUDES = [
    '.DS_Store',
    '._*',
    '.~lock.*#',
    'Thumbs.db',
    'desktop.ini',
    '~$*'
]
export const PAIR_NAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/
/**
 * Where a pair's password comes from:
 * - "keychain": operating system's credential store (see "keychain" module)
 * - "prompt": asked interactively (once per daemon start)
 * - "environment": environment variable "GOCRYPTFS_PASSWORD"
 * - {file}: first line of given file
 * - {command}: first line of given command's output.
 */
export type PasswordSource =
    'environment' | 'keychain' | 'prompt' | {command: string} | {file: string}

export interface PairSettings {
    // Configuration file located outside of the vault directory.
    config?: string
    excludes?: Array<string>
    interval?: number | string
    password?: PasswordSource
    plaintext: string
    trashDays?: number
    vault: string
}

export interface Settings {
    defaults: {
        excludes: Array<string>
        interval: number | string
        trashDays: number
    }
    pairs: Record<string, PairSettings>
}
// A pair with all defaults applied.
export interface ResolvedPair {
    config?: string
    excludes: Array<string>
    intervalInMilliseconds: number
    name: string
    password: PasswordSource
    plaintext: string
    trashDays: number
    vault: string
}
/**
 * Creates the settings of a fresh installation.
 * @returns Default settings.
 */
export const createSettings = (): Settings => ({
    defaults: {
        excludes: [...DEFAULT_EXCLUDES],
        interval: DEFAULT_INTERVAL,
        trashDays: 30
    },
    pairs: {}
})
/**
 * Parses an interval like "30s", "10m", "2h" or a number of minutes.
 * @param value - Interval representation.
 * @returns Interval in milliseconds.
 */
export const parseInterval = (value: number | string): number => {
    const match = /^\s*(\d+(?:\.\d+)?)\s*(s|m|h)?\s*$/.exec(String(value))
    if (!match)
        throw new Error(
            `Invalid interval "${String(value)}" (examples: 30s, 10m, 2h).`
        )

    const milliseconds = Number(match[1]) * {h: 3600, m: 60, s: 1}[
        ((match[2] as string | undefined) ?? 'm') as 'h' | 'm' | 's'
    ] * 1000
    if (milliseconds < MINIMAL_INTERVAL_IN_MILLISECONDS)
        throw new Error(
            `Interval "${String(value)}" is shorter than the minimum of ` +
            `${String(MINIMAL_INTERVAL_IN_MILLISECONDS / 1000)} seconds.`
        )

    return milliseconds
}
/**
 * Validates a password source.
 * @param value - Value to check.
 * @returns Given value typed.
 */
export const validatePasswordSource = (value: unknown): PasswordSource => {
    if (
        value === 'environment' || value === 'keychain' || value === 'prompt'
    )
        return value
    if (typeof value === 'object' && value !== null) {
        const {command, file} = value as {command?: unknown, file?: unknown}
        if (typeof file === 'string' && file !== '' && command === undefined)
            return {file}
        if (typeof command === 'string' && command !== '' && file === undefined)
            return {command}
    }

    throw new Error(
        `Invalid password source ${JSON.stringify(value)}, use "keychain", ` +
        '"prompt", "environment", {"file": "<path>"} or ' +
        '{"command": "<command line>"}.'
    )
}
/**
 * Applies defaults to given pair and validates it.
 * @param settings - All settings.
 * @param name - Name of the pair.
 * @returns Resolved pair.
 */
export const resolvePair = (settings: Settings, name: string): ResolvedPair => {
    if (!Object.prototype.hasOwnProperty.call(settings.pairs, name))
        throw new Error(
            `Unknown pair "${name}" (known: ${
                Object.keys(settings.pairs).join(', ') || 'none'}).`
        )

    const pair = settings.pairs[name]
    if (typeof pair.plaintext !== 'string' || typeof pair.vault !== 'string')
        throw new Error(
            `Pair "${name}" needs a "plaintext" and a "vault" path.`
        )

    if (
        pair.config !== undefined &&
        (typeof pair.config !== 'string' || pair.config === '')
    )
        throw new Error(`Pair "${name}": "config" has to be a path.`)

    const trashDays = pair.trashDays ?? settings.defaults.trashDays
    if (!Number.isInteger(trashDays) || trashDays < 0)
        throw new Error(
            `Pair "${name}": "trashDays" has to be a non negative integer.`
        )

    return {
        ...(pair.config === undefined ? {} : {config: pair.config}),
        excludes: [...settings.defaults.excludes, ...pair.excludes ?? []],
        intervalInMilliseconds:
            parseInterval(pair.interval ?? settings.defaults.interval),
        name,
        password: validatePasswordSource(pair.password ?? 'prompt'),
        plaintext: pair.plaintext,
        trashDays,
        vault: pair.vault
    }
}
/**
 * Determines the settings file path.
 * @param configurationDirectory - Application configuration directory.
 * @returns Absolute file path.
 */
export const getSettingsPath = (
    configurationDirectory: string = getConfigurationDirectory()
): string => join(configurationDirectory, SETTINGS_FILE_NAME)
/**
 * Loads the settings, a missing file results in default settings.
 * @param configurationDirectory - Application configuration directory.
 * @returns Settings.
 */
export const loadSettings = async (
    configurationDirectory: string = getConfigurationDirectory()
): Promise<Settings> => {
    const path = getSettingsPath(configurationDirectory)

    let content: string
    try {
        content = await readFile(path, {encoding: 'utf-8'})
    } catch (error) {
        if ((error as {code?: string}).code === 'ENOENT')
            return createSettings()

        throw error
    }

    let given: Partial<Settings>
    try {
        given = JSON.parse(content) as Partial<Settings>
    } catch (error) {
        throw new Error(
            `Invalid json in "${path}": ${(error as Error).message}`,
            {cause: error}
        )
    }

    const defaults = createSettings().defaults
    const settings: Settings = {
        defaults: {...defaults, ...given.defaults},
        pairs: given.pairs ?? {}
    }
    // Validate everything early to fail on start, not later in a daemon.
    for (const name of Object.keys(settings.pairs))
        resolvePair(settings, name)

    return settings
}
/**
 * Saves given settings atomically.
 * @param settings - Settings to save.
 * @param configurationDirectory - Application configuration directory.
 * @returns Promise resolving when saved.
 */
export const saveSettings = async (
    settings: Settings,
    configurationDirectory: string = getConfigurationDirectory()
): Promise<void> => {
    await mkdir(configurationDirectory, {recursive: true})

    const path = getSettingsPath(configurationDirectory)
    await writeFile(
        `${path}.tmp`, `${JSON.stringify(settings, null, 4)}\n`, {mode: 0o600}
    )
    await rename(`${path}.tmp`, path)
}
