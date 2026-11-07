// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module cli */
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
import {join, resolve} from 'path'
import {parseArgs} from 'util'

import packageConfiguration from '../package.json'

import {
    DEFAULT_SCRYPT_LOG_N,
    formatMasterKey,
    initializeVault,
    loadConfiguration,
    parseMasterKey,
    UnsupportedVaultError,
    unlockMasterKey,
    WrongPasswordError
} from './configuration'
import {
    CorruptFileError, decryptFileContent, deriveContentKey
} from './content'
import {createExcludeMatcher} from './exclude'
import {getPassword} from './password'
import {DEFAULT_TRASH_RETENTION_IN_DAYS, LockedError} from './state'
import {synchronize} from './synchronize'
import {
    decryptTree, encryptTree, findSampleFile, isInternalPath
} from './tree'
import type {Action, TreeResult} from './type'
// endregion
// Exit codes aligned with gocryptfs where an equivalent exists.
export const EXIT_CODES = {
    error: 1,
    usage: 2,
    unsupportedVault: 3,
    locked: 4,
    wrongPassword: 12
} as const

export const USAGE = `Usage: gocryptfs-standalone <command> [options]

Works with gocryptfs vaults created with "gocryptfs -init -plaintextnames"
without FUSE.

Commands:
  init <vault>                   Create a new vault (directory must be empty).
  info <vault>                   Show vault configuration.
  cat <vault> <path>             Decrypt one file to standard output.
  decrypt <vault> <target>       Decrypt the whole vault into target.
  encrypt <source> <vault>       Encrypt the whole source into the vault.
  sync <plaintext> <vault>       Synchronize both directions (see below).

Options:
  --passfile <path>              Read the password from the file's first line.
  --extpass <command>            Read the password from a command's output.
  --masterkey <hex>              Use the master key instead of a password.
  --scryptn <number>             Scrypt cost as binary logarithm for "init"
                                 (default ${String(DEFAULT_SCRYPT_LOG_N)}).
  --exclude <pattern>            Leave out matching entries on both sides
                                 (repeatable, see below).
  --dry-run                      Only show what "sync" would do.
  --trash-days <number>          Days to keep entries "sync" moved into the
                                 trash (default ${String(
        DEFAULT_TRASH_RETENTION_IN_DAYS
    )}).
  -h, --help                     Show this help.
  -v, --version                  Show the version.

The password can also be given via the environment variable
"GOCRYPTFS_PASSWORD". Without any source it is asked for interactively.

"sync" remembers the state after each run (in the user's configuration
directory). Changes on one side are copied to the other side, deletions are
moved into a trash directory there, and changes on both sides keep both
versions (the older one as conflict copy).

Exclude patterns follow gitignore conventions: without a slash they match
names at any depth ("*.tmp", ".DS_Store"), with a slash paths relative to
the root ("docs/*.pdf", "/build"), a trailing slash only matches directories
("cache/"). Supported globs: "*", "**", "?", "[...]" and "{a,b}".
`

export interface Output {
    error: (text: string) => void
    // Secrets like the master key are only shown on a terminal.
    isTerminal: boolean
    log: (text: string) => void
    write: (data: Buffer) => Promise<void>
}

export const defaultOutput: Output = {
    error: (text) => {
        process.stderr.write(`${text}\n`)
    },
    isTerminal: process.stderr.isTTY,
    log: (text) => {
        process.stderr.write(`${text}\n`)
    },
    write: (data) => new Promise((resolve, reject) => {
        process.stdout.write(data, (error) => {
            if (error)
                reject(error)
            else
                resolve()
        })
    })
}

class UsageError extends Error {
    name = 'UsageError'
}
/**
 * Checks whether one of given paths is located inside the other one.
 * @param first - First absolute path.
 * @param second - Second absolute path.
 * @returns Indicates whether the paths overlap.
 */
export const isNested = (first: string, second: string): boolean =>
    first === second ||
    first.startsWith(join(second, '/')) ||
    second.startsWith(join(first, '/'))
/**
 * Prints a summary of given tree transformation.
 * @param output - Output channels.
 * @param verb - Describes the transformation.
 * @param result - Transformation result.
 * @returns Exit code.
 */
/**
 * Describes given synchronisation action for humans.
 * @param action - Action to describe.
 * @returns Description or null for pure bookkeeping actions.
 */
export const describeAction = (action: Action): null | string => {
    const sideName = (side: 'cipher' | 'plain') =>
        side === 'plain' ? 'plaintext' : 'vault'

    switch (action.type) {
    case 'transfer':
        return `${action.from === 'plain' ? 'encrypt' : 'decrypt'} ` +
            action.path
    case 'createDirectory':
        return `create directory in ${sideName(action.side)} ${action.path}`
    case 'trash':
        return `trash in ${sideName(action.side)} ${action.path}`
    case 'removeDirectory':
        return `remove directory in ${sideName(action.side)} ${action.path}`
    case 'compare':
    case 'conflict':
        return (action.type === 'compare' ? 'compare (on difference: ' : '') +
            `conflict ${action.path} -> ${sideName(action.loser)} version ` +
            `kept as "${action.conflictPath}"` +
            (action.type === 'compare' ? ')' : '')
    case 'skip':
        return `skip ${action.path}: ${action.reason}`
    default:
        return null
    }
}
const report = (output: Output, verb: string, result: TreeResult): number => {
    output.log(
        `${verb} ${String(result.files)} files, ` +
        `${String(result.directories)} directories and ` +
        `${String(result.symbolicLinks)} symbolic links.`
    )
    for (const {path, reason} of result.skipped)
        output.error(`Skipped "${path}": ${reason}`)

    return result.skipped.length > 0 ? EXIT_CODES.error : 0
}
/**
 * Runs the command line interface.
 * @param argv - Arguments without node and script path.
 * @param output - Output channels.
 * @returns Exit code.
 */
export const run = async (
    argv: Array<string>, output: Output = defaultOutput
): Promise<number> => {
    try {
        const {positionals, values} = parseArgs({
            allowPositionals: true,
            args: argv,
            options: {
                extpass: {type: 'string'},
                help: {short: 'h', type: 'boolean'},
                masterkey: {type: 'string'},
                passfile: {type: 'string'},
                scryptn: {type: 'string'},
                'dry-run': {type: 'boolean'},
                exclude: {multiple: true, type: 'string'},
                'trash-days': {type: 'string'},
                version: {short: 'v', type: 'boolean'}
            }
        })

        if (values.version) {
            output.log(packageConfiguration.version)

            return 0
        }

        const [command, ...parameters] = positionals
        if (values.help || !command) {
            output.log(USAGE)

            return values.help ? 0 : EXIT_CODES.usage
        }

        const isExcluded = createExcludeMatcher(values.exclude ?? [])

        const expectParameters = (names: Array<string>) => {
            if (parameters.length !== names.length)
                throw new UsageError(
                    `Command "${command}" expects: ` +
                    names.map((name) => `<${name}>`).join(' ')
                )
        }

        const getPasswordBuffer = async (confirm = false) =>
            Buffer.from(await getPassword({
                confirm,
                externalProgram: values.extpass,
                file: values.passfile
            }))

        const getContentKey = async (vaultPath: string): Promise<Buffer> => {
            const configuration = await loadConfiguration(vaultPath)
            const masterKey = values.masterkey ?
                parseMasterKey(values.masterkey) :
                await unlockMasterKey(configuration, await getPasswordBuffer())
            const contentKey = deriveContentKey(masterKey)
            masterKey.fill(0)

            if (values.masterkey) {
                /*
                    NOTE: A wrong master key can not be detected via the
                    configuration file, so we check it against existing
                    content to never write unreadable files into the vault.
                */
                const samplePath = await findSampleFile(vaultPath)
                if (samplePath)
                    try {
                        for await (const _ of decryptFileContent(
                            contentKey, samplePath
                        ))
                            break
                    } catch (error) {
                        if (error instanceof CorruptFileError)
                            throw new WrongPasswordError(
                                'Master key does not match the vault content.'
                            )

                        throw error
                    }
            }

            return contentKey
        }

        switch (command) {
        case 'init': {
            expectParameters(['vault'])
            if (values.masterkey)
                throw new UsageError(
                    'A new vault always gets a new random master key.'
                )

            const masterKey = await initializeVault(
                parameters[0],
                await getPasswordBuffer(true),
                values.scryptn === undefined ?
                    undefined :
                    Number(values.scryptn)
            )
            output.log(`Created vault in "${parameters[0]}".`)
            if (output.isTerminal)
                output.log(
                    '\nYour master key is:\n\n    ' +
                    formatMasterKey(masterKey).replace('\n', '\n    ') +
                    '\n\nIf the configuration file gets lost or the ' +
                    'password forgotten, it is\nthe only way to access the ' +
                    'data. Keep it somewhere safe.'
                )
            masterKey.fill(0)

            return 0
        }
        case 'info': {
            expectParameters(['vault'])
            const configuration = await loadConfiguration(parameters[0])
            output.log(
                `Creator:       ${configuration.creator}\n` +
                    `Version:       ${String(configuration.version)}\n` +
                    'Feature flags: ' +
                    `${configuration.featureFlags.join(' ')}\n` +
                    `Scrypt:        N=${String(configuration.scrypt.n)} ` +
                    `R=${String(configuration.scrypt.r)} ` +
                    `P=${String(configuration.scrypt.p)}`
            )

            return 0
        }
        case 'cat': {
            expectParameters(['vault', 'path'])
            const [vaultPath, path] = parameters
            if (isInternalPath(path))
                throw new UsageError(`"${path}" is internal vault data.`)

            const contentKey = await getContentKey(vaultPath)
            for await (const block of decryptFileContent(
                contentKey, join(vaultPath, path)
            ))
                await output.write(block)

            return 0
        }
        case 'decrypt': {
            expectParameters(['vault', 'target'])
            const [vaultPath, targetPath] = parameters.map((path) =>
                resolve(path)
            )
            if (isNested(vaultPath, targetPath))
                throw new UsageError(
                    'Vault and target must not be located inside each other.'
                )

            const contentKey = await getContentKey(vaultPath)
            const result = await decryptTree(
                contentKey, vaultPath, targetPath, isExcluded
            )
            contentKey.fill(0)

            return report(output, 'Decrypted', result)
        }
        case 'encrypt': {
            expectParameters(['source', 'vault'])
            const [sourcePath, vaultPath] = parameters.map((path) =>
                resolve(path)
            )
            if (isNested(sourcePath, vaultPath))
                throw new UsageError(
                    'Source and vault must not be located inside each other.'
                )

            const contentKey = await getContentKey(vaultPath)
            const result = await encryptTree(
                contentKey, sourcePath, vaultPath, isExcluded
            )
            contentKey.fill(0)

            return report(output, 'Encrypted', result)
        }
        case 'sync': {
            expectParameters(['plaintext', 'vault'])
            const [plainPath, vaultPath] = parameters.map((path) =>
                resolve(path)
            )
            if (isNested(plainPath, vaultPath))
                throw new UsageError(
                    'Plaintext directory and vault must not be located ' +
                    'inside each other.'
                )

            const trashRetentionInDays = values['trash-days'] === undefined ?
                DEFAULT_TRASH_RETENTION_IN_DAYS :
                Number(values['trash-days'])
            if (
                !Number.isInteger(trashRetentionInDays) ||
                trashRetentionInDays < 0
            )
                throw new UsageError(
                    '"--trash-days" has to be a non negative integer.'
                )

            const contentKey = await getContentKey(vaultPath)
            const dryRun = Boolean(values['dry-run'])
            const result = await synchronize({
                dryRun,
                excludes: isExcluded,
                key: contentKey,
                onAction: (action) => {
                    const description = describeAction(action)
                    if (description)
                        output.log(description)
                },
                plainPath,
                trashRetentionInDays,
                vaultPath
            })
            contentKey.fill(0)

            if (result.warning)
                output.error(result.warning)
            for (const {path, reason} of result.failed)
                output.error(`Failed "${path}": ${reason}`)

            const changes = result.actions.filter((action) =>
                !['forget', 'record', 'skip'].includes(action.type)
            ).length
            output.log(
                `${dryRun ? 'Would apply' : 'Applied'} ` +
                `${String(changes - result.failed.length)} changes` +
                (result.failed.length > 0 ?
                    `, ${String(result.failed.length)} failed` :
                    '') +
                '.'
            )

            return result.failed.length > 0 ||
                result.actions.some((action) => action.type === 'skip') ?
                EXIT_CODES.error :
                0
        }
        default:
            throw new UsageError(`Unknown command "${command}".`)
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        output.error(message)

        if (
            error instanceof UsageError ||
            (error as null | {code?: unknown})?.code?.toString()
                .startsWith('ERR_PARSE_ARGS')
        )
            return EXIT_CODES.usage
        if (error instanceof UnsupportedVaultError)
            return EXIT_CODES.unsupportedVault
        if (error instanceof WrongPasswordError)
            return EXIT_CODES.wrongPassword
        if (error instanceof LockedError)
            return EXIT_CODES.locked

        return EXIT_CODES.error
    }
}
