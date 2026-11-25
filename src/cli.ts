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
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
    endregion
*/
// region imports
import {existsSync} from 'fs'
import {mkdir, open, readFile, rm, writeFile} from 'fs/promises'
import {dirname, join, resolve} from 'path'
import type {Readable} from 'stream'
import {parseArgs} from 'util'

import packageConfiguration from '../package.json'

import {
    BACKGROUND_CHILD_OPTION_NAME,
    BackgroundStartError,
    READY_SIGNAL,
    receiveContentKeys,
    startInBackground
} from './background'
import type {BackgroundOptions} from './background'
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
import {runDaemon} from './daemon'
import {createExcludeMatcher} from './exclude'
import {createKeychain} from './keychain'
import type {Keychain} from './keychain'
import {getPairPassword, getPassword} from './password'
import {createService, getProgram, LOG_FILE_NAME} from './service'
import type {Service} from './service'
import {
    isPercentage,
    loadSettings,
    parseInterval,
    PAIR_NAME_PATTERN,
    resolvePair,
    saveSettings,
    validatePasswordSource
} from './settings'
import type {PairSettings, PasswordSource, ResolvedPair} from './settings'
import {
    acquireLock,
    DAEMON_LOCK_FILE_NAME,
    DEFAULT_MAXIMAL_DELETION_PERCENTAGE,
    DEFAULT_TRASH_RETENTION_IN_DAYS,
    getConfigurationDirectory,
    getLockHolder,
    getPairDirectory,
    LockedError,
    MassDeletionError
} from './state'
import {
    createProcessControl,
    getSealingPath,
    getStopRequestPath,
    isDaemonCommandLine,
    STOP_REQUEST_POLL_INTERVAL_IN_MILLISECONDS,
    stopDaemon
} from './stop'
import type {ProcessControl} from './stop'
import {isSynchronized, synchronize} from './synchronize'
import {
    decryptTree, encryptTree, findSampleFile, isInternalPath
} from './tree'
import type {Action, TreeResult} from './type'
import {watchPair} from './watch'
// endregion
// Exit codes aligned with gocryptfs where an equivalent exists.
export const EXIT_CODES = {
    error: 1,
    usage: 2,
    unsupportedVault: 3,
    locked: 4,
    massDeletion: 5,
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
  sync <vault> <plaintext>       Synchronize both directions (see below).
  sync [<pair>]                  Synchronize given or all configured pairs.

  pair add <name> <vault> <plaintext>
                                 Configure a pair. Verifies the password and,
                                 with the default source "keychain", stores
                                 it there for later runs.
  pair remove <name>             Remove a pair (keeps its trash).
  pair list                      Show configured pairs.
  daemon [<pair>...]             Synchronize pairs shortly after changes and
                                 in their intervals until stopped.
                                 "--run-in-background" synchronizes once,
                                 then continues detached.
  stop [<pair>...]               Stop the daemons watching given or all
                                 configured pairs.
  service install|uninstall|status
                                 Start "daemon" automatically after log in
                                 (per user, no admin rights needed).

Options:
  --config <path>                Configuration file of the vault (default:
                                 "gocryptfs.conf" or ".gocryptfs.conf" in
                                 the vault, "init" creates the former).
  --passfile <path>              Read the password from the file's first line.
  --extpass <command>            Read the password from a command's output.
  --masterkey <hex>              Use the master key instead of a password.
  --scryptn <number>             Scrypt cost as binary logarithm for "init"
                                 (default ${String(DEFAULT_SCRYPT_LOG_N)}).
  --exclude <pattern>            Leave out matching entries on both sides
                                 (repeatable, see below).
  --dry-run                      Only show what "sync" would do.
  --max-delete-percent <number>  Refuse synchronizations deleting more than
                                 this share of a pair's entries since they
                                 are missing in the vault (default ${String(
        DEFAULT_MAXIMAL_DELETION_PERCENTAGE
    )}, 100
                                 disables it, an empty vault is always
                                 refused).
  --allow-mass-delete            Let "sync" apply such deletions once.
  --trash-days <number>          Days to keep entries "sync" moved into the
                                 trash (default ${String(
        DEFAULT_TRASH_RETENTION_IN_DAYS
    )}).
  --interval <duration>          Synchronization interval of a pair, e.g.
                                 "30s", "10m" (default) or "2h".
  --no-watch                     Synchronize a pair only in its interval, not
                                 shortly after file system changes.
  --seal-on-stop                 Let "daemon" remove the plaintext copies the
                                 vault holds when it stops and restore them
                                 on its next start (see readme for limits).
  --run-in-background            Let "daemon" ask for passwords and run the
                                 initial synchronization, then continue as
                                 detached process logging to "daemon.log" in
                                 the configuration directory.
  --log-file <path>              Log file of "--run-in-background" instead
                                 of "daemon.log".
  --password <source>            Where "sync", "daemon" and the service get
                                 the password of a pair from later:
                                 "keychain" (default, "pair add" asks for it
                                 once and stores it there), "prompt" (asked
                                 when started) or "environment"
                                 ("GOCRYPTFS_PASSWORD"). "--passfile" and
                                 "--extpass" configure a file or command
                                 instead.
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

Pairs, their intervals, excludes and password sources are configured in
"configuration.json" in the user's configuration directory (see readme).
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

export interface Dependencies {
    // Standard input of a daemon started in the background.
    input: Readable
    keychain: Keychain
    // Finds and stops daemons for "stop".
    processControl: ProcessControl
    service: Service
    // Stops a running daemon (defaults to SIGINT and SIGTERM).
    signal?: AbortSignal
    // Time "stop" waits for a daemon (see "stop" module).
    stopTimeoutInMilliseconds?: number
    // Continues a daemon detached, resolves with its process id.
    startInBackground: (options: BackgroundOptions) => Promise<number>
    watchPair: typeof watchPair
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
 * Finds two pairs whose directories (plaintext or vault) are located inside
 * each other, so they would synchronize each other's files.
 * @param pairs - Configured pairs by name.
 * @returns Names of the first two overlapping pairs or null.
 */
export const findOverlappingPairs = (
    pairs: Record<string, Pick<PairSettings, 'plaintext' | 'vault'>>
): [string, string] | null => {
    const entries = Object.entries(pairs)
    for (const [index, [firstName, first]] of entries.entries())
        for (const [secondName, second] of entries.slice(index + 1))
            for (const firstPath of [first.plaintext, first.vault])
                for (const secondPath of [second.plaintext, second.vault])
                    if (isNested(resolve(firstPath), resolve(secondPath)))
                        return [firstName, secondName]

    return null
}
/**
 * Ensures that no configured pairs overlap.
 * @param pairs - Configured pairs by name.
 */
const assertNoOverlappingPairs = (
    pairs: Record<string, Pick<PairSettings, 'plaintext' | 'vault'>>
) => {
    const overlapping = findOverlappingPairs(pairs)
    if (overlapping)
        throw new UsageError(
            `Pairs "${overlapping[0]}" and "${overlapping[1]}" overlap, ` +
            'their directories must not be located inside each other.'
        )
}
/**
 * Describes given synchronization action for humans.
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
    case 'verify':
        return `verify ${action.path} (on difference: ` +
            `${action.from === 'plain' ? 'encrypt' : 'decrypt'})`
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
/**
 * Prints a summary of given tree transformation.
 * @param output - Output channels.
 * @param verb - Describes the transformation.
 * @param result - Transformation result.
 * @returns Exit code.
 */
const report =(output: Output, verb: string, result: TreeResult): number => {
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
 * @param givenDependencies - Replaces platform integrations (for testing).
 * @returns Exit code.
 */
export const run = async (
    argv: Array<string>,
    output: Output = defaultOutput,
    givenDependencies: Partial<Dependencies> = {}
): Promise<number> => {
    const getKeychain = () => givenDependencies.keychain ?? createKeychain()

    try {
        const {positionals, values} = parseArgs({
            // NOTE: Allows "--no-watch".
            allowNegative: true,
            allowPositionals: true,
            args: argv,
            options: {
                config: {type: 'string'},
                extpass: {type: 'string'},
                help: {short: 'h', type: 'boolean'},
                masterkey: {type: 'string'},
                passfile: {type: 'string'},
                scryptn: {type: 'string'},
                'allow-mass-delete': {type: 'boolean'},
                'dry-run': {type: 'boolean'},
                'max-delete-percent': {type: 'string'},
                // NOTE: Internal, see "background" module.
                [BACKGROUND_CHILD_OPTION_NAME]: {type: 'boolean'},
                'run-in-background': {type: 'boolean'},
                'seal-on-stop': {type: 'boolean'},
                exclude: {multiple: true, type: 'string'},
                'trash-days': {type: 'string'},
                interval: {type: 'string'},
                'log-file': {type: 'string'},
                password: {type: 'string'},
                version: {short: 'v', type: 'boolean'},
                watch: {type: 'boolean'}
            }
        })

        if (values.version) {
            await output.write(Buffer.from(`${packageConfiguration.version}\n`))

            return 0
        }

        const [command, ...parameters] = positionals
        if (values.help) {
            await output.write(Buffer.from(USAGE))

            return 0
        }
        if (!command) {
            output.error(USAGE)

            return EXIT_CODES.usage
        }

        const isExcluded = createExcludeMatcher(values.exclude ?? [])

        const isBackgroundChild = Boolean(values[BACKGROUND_CHILD_OPTION_NAME])
        if (
            (values['run-in-background'] || isBackgroundChild) &&
            command !== 'daemon'
        )
            throw new UsageError(
                '"--run-in-background" applies to "daemon" only.'
            )
        if (values['allow-mass-delete'] && command !== 'sync')
            throw new UsageError(
                '"--allow-mass-delete" applies to "sync" only.'
            )
        if (
            values['seal-on-stop'] !== undefined &&
            !['daemon', 'pair'].includes(command)
        )
            throw new UsageError(
                '"--seal-on-stop" applies to "daemon" and "pair add" only.'
            )
        if (values['log-file'] !== undefined && !values['run-in-background'])
            throw new UsageError(
                '"--log-file" applies to "daemon --run-in-background" only.'
            )

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

        const hasExplicitPassword = Boolean(
            values.extpass ?? values.masterkey ?? values.passfile
        )
        /*
            NOTE: Password options given on the command line take precedence
            over the one configured for a pair.
        */
        const getContentKey = async (
            vaultPath: string,
            pair?: ResolvedPair,
            configurationPath = pair ? pair.config : values.config
        ): Promise<Buffer> => {
            const configuration =
                await loadConfiguration(vaultPath, configurationPath)
            const masterKey = values.masterkey ?
                parseMasterKey(values.masterkey) :
                await unlockMasterKey(
                    configuration,
                    pair && !hasExplicitPassword ?
                        Buffer.from(await getPairPassword(
                            pair.password, pair.name, getKeychain()
                        )) :
                        await getPasswordBuffer()
                )
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

        const parseTrashDays = (): number | undefined => {
            if (values['trash-days'] === undefined)
                return undefined

            const days = Number(values['trash-days'])
            if (!Number.isInteger(days) || days < 0)
                throw new UsageError(
                    '"--trash-days" has to be a non negative integer.'
                )

            return days
        }

        const parseMaximalDeletionPercentage = (): number | undefined => {
            if (values['max-delete-percent'] === undefined)
                return undefined

            const percentage = Number(values['max-delete-percent'])
            if (!isPercentage(percentage))
                throw new UsageError(
                    '"--max-delete-percent" has to be a number between 0 ' +
                    'and 100.'
                )

            return percentage
        }

        const synchronizePair = async (
            pair: ResolvedPair,
            contentKey: Buffer,
            log: (text: string) => void,
            dryRun = false,
            seal = false
        ) => {
            const result = await synchronize({
                allowMassDeletion: Boolean(values['allow-mass-delete']),
                dryRun,
                excludes: createExcludeMatcher(pair.excludes),
                key: contentKey,
                maximalDeletionPercentage: pair.maxDeletePercent,
                onAction: (action) => {
                    const description = describeAction(action)
                    if (description)
                        log(description)
                },
                plainPath: pair.plaintext,
                seal,
                trashRetentionInDays: pair.trashDays,
                vaultPath: pair.vault
            })

            if (result.warning)
                output.error(result.warning)
            for (const {path, reason} of result.failed)
                output.error(`Failed "${path}": ${reason}`)

            if (result.unsealed)
                log('Restored the plaintext directory of the sealed pair.')
            if (result.seal) {
                for (const {path, reason} of result.seal.kept)
                    log(`Kept plaintext "${path}": ${reason}`)
                log(
                    `Sealed: removed ${String(result.seal.removed)} ` +
                    'plaintext entries' +
                    (result.seal.kept.length > 0 ?
                        `, kept ${String(result.seal.kept.length)}` :
                        '') +
                    '.'
                )
            }

            const changes = result.actions.filter((action) =>
                !['forget', 'record', 'skip'].includes(action.type)
            ).length

            return {
                changes,
                failed: result.failed.length > 0 ||
                    result.actions.some((action) => action.type === 'skip'),
                summary: `${dryRun ? 'Would apply' : 'Applied'} ` +
                    `${String(changes - result.failed.length)} changes` +
                    (result.failed.length > 0 ?
                        `, ${String(result.failed.length)} failed` :
                        '') +
                    '.'
            }
        }

        const getPairs = async (names: Array<string>) => {
            const settings = await loadSettings()
            // NOTE: Also checks pairs not given, they may run elsewhere.
            assertNoOverlappingPairs(settings.pairs)
            const pairNames = names.length > 0 ?
                names :
                Object.keys(settings.pairs)
            if (pairNames.length === 0)
                throw new UsageError(
                    'No pairs configured, see "pair add"' +
                    // NOTE: Only "sync" accepts paths instead of pairs.
                    (command === 'sync' ?
                        ' or give a plaintext directory and a vault.' :
                        '.')
                )
            if (values.config !== undefined)
                throw new UsageError(
                    '"--config" applies to a given vault only, configure ' +
                    '"config" of the pair instead.'
                )

            const trashDays = parseTrashDays()
            const maxDeletePercent = parseMaximalDeletionPercentage()

            return pairNames.map((name) => {
                const pair = resolvePair(settings, name)

                return {
                    ...pair,
                    ...(pair.config === undefined ?
                        {} :
                        {config: resolve(pair.config)}),
                    excludes: [...pair.excludes, ...values.exclude ?? []],
                    maxDeletePercent:
                        maxDeletePercent ?? pair.maxDeletePercent,
                    plaintext: resolve(pair.plaintext),
                    sealOnStop: values['seal-on-stop'] ?? pair.sealOnStop,
                    trashDays: trashDays ?? pair.trashDays,
                    vault: resolve(pair.vault),
                    watch: values.watch ?? pair.watch
                }
            })
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
                    Number(values.scryptn),
                values.config
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
            const configuration =
                await loadConfiguration(parameters[0], values.config)
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
            let pairs: Array<ResolvedPair>
            if (parameters.length === 2) {
                const [vault, plaintext] = parameters.map((path) =>
                    resolve(path)
                )
                pairs = [{
                    ...(values.config === undefined ?
                        {} :
                        {config: values.config}),
                    excludes: values.exclude ?? [],
                    intervalInMilliseconds: 0,
                    maxDeletePercent: parseMaximalDeletionPercentage() ??
                        DEFAULT_MAXIMAL_DELETION_PERCENTAGE,
                    name: 'command line',
                    password: 'prompt',
                    plaintext,
                    sealOnStop: false,
                    trashDays:
                        parseTrashDays() ?? DEFAULT_TRASH_RETENTION_IN_DAYS,
                    vault,
                    watch: false
                }]
            } else if (parameters.length < 2)
                pairs = await getPairs(parameters)
            else
                throw new UsageError(
                    'Command "sync" expects: [<pair>] or <vault> <plaintext>'
                )

            const dryRun = Boolean(values['dry-run'])
            let failed = false
            for (const pair of pairs) {
                if (isNested(pair.plaintext, pair.vault))
                    throw new UsageError(
                        'Plaintext directory and vault must not be located ' +
                        'inside each other.'
                    )
                if (pairs.length > 1)
                    output.log(`Pair "${pair.name}":`)

                const contentKey = await getContentKey(
                    pair.vault,
                    parameters.length === 2 ? undefined : pair,
                    pair.config
                )
                try {
                    const result = await synchronizePair(
                        pair, contentKey, output.log, dryRun
                    )
                    output.log(result.summary)
                    failed ||= result.failed
                } finally {
                    contentKey.fill(0)
                }
            }

            return failed ? EXIT_CODES.error : 0
        }
        case 'pair': {
            const [subcommand, ...pairParameters] = parameters
            const settings = await loadSettings()

            if (subcommand === 'list' && pairParameters.length === 0) {
                const names = Object.keys(settings.pairs)
                if (names.length === 0)
                    output.log('No pairs configured.')
                for (const name of names) {
                    const pair = resolvePair(settings, name)
                    output.log(
                        `${name}:\n` +
                        `    plaintext: ${pair.plaintext}\n` +
                        `    vault:     ${pair.vault}\n` +
                        (pair.config === undefined ?
                            '' :
                            `    config:    ${pair.config}\n`) +
                        '    interval:  ' +
                        `${String(pair.intervalInMilliseconds / 1000)}s\n` +
                        '    password:  ' +
                        `${JSON.stringify(pair.password)}\n` +
                        `    trash:     ${String(pair.trashDays)} days\n` +
                        '    deletions: refused above ' +
                        `${String(pair.maxDeletePercent)}%\n` +
                        `    watch:     ${pair.watch ? 'yes' : 'no'}\n` +
                        '    seal:      ' +
                        `${pair.sealOnStop ? 'on stop' : 'no'}\n` +
                        `    excludes:  ${pair.excludes.join(' ')}`
                    )
                }

                return 0
            }

            if (subcommand === 'remove' && pairParameters.length === 1) {
                const [name] = pairParameters
                const pair = resolvePair(settings, name)

                delete settings.pairs[name]
                await saveSettings(settings)

                if (pair.password === 'keychain')
                    try {
                        await getKeychain().delete(name)
                    } catch (error) {
                        output.error(
                            'Could not remove the password from the ' +
                            `keychain: ${(error as Error).message}`
                        )
                    }

                output.log(`Removed pair "${name}".`)

                return 0
            }

            if (subcommand === 'add' && pairParameters.length === 3) {
                const [name, vaultPath, plaintextPath] = pairParameters
                if (!PAIR_NAME_PATTERN.test(name))
                    throw new UsageError(
                        `Invalid pair name "${name}" (names need to start ` +
                        'with letters or digits and proceed with letters, ' +
                        'digits, ".", "_" and "-" only).'
                    )
                if (Object.prototype.hasOwnProperty.call(settings.pairs, name))
                    throw new UsageError(`Pair "${name}" already exists.`)

                const plaintext = resolve(plaintextPath)
                const vault = resolve(vaultPath)
                if (isNested(plaintext, vault))
                    throw new UsageError(
                        'Plaintext directory and vault must not be located ' +
                        'inside each other.'
                    )
                assertNoOverlappingPairs(
                    {...settings.pairs, [name]: {plaintext, vault}}
                )
                if (values.interval !== undefined)
                    parseInterval(values.interval)

                const password: PasswordSource = values.passfile ?
                    {file: resolve(values.passfile)} :
                    values.extpass ?
                        {command: values.extpass} :
                        validatePasswordSource(values.password ?? 'keychain')

                const config = values.config === undefined ?
                    undefined :
                    resolve(values.config)

                // Verify the password before anything gets saved.
                const configuration = await loadConfiguration(vault, config)
                if (password !== 'prompt' && password !== 'environment') {
                    const givenPassword = password === 'keychain' ?
                        await getPassword({}) :
                        await getPairPassword(password, name, getKeychain())
                    ;(await unlockMasterKey(
                        configuration, Buffer.from(givenPassword)
                    )).fill(0)

                    if (password === 'keychain')
                        await getKeychain().store(name, givenPassword)
                }

                settings.pairs[name] = {
                    ...(config === undefined ? {} : {config}),
                    ...(values.exclude ? {excludes: values.exclude} : {}),
                    ...(values.interval ? {interval: values.interval} : {}),
                    ...(values['max-delete-percent'] === undefined ?
                        {} :
                        {maxDeletePercent: parseMaximalDeletionPercentage()}),
                    password,
                    plaintext,
                    ...(values['seal-on-stop'] === undefined ?
                        {} :
                        {sealOnStop: values['seal-on-stop']}),
                    ...(values['trash-days'] === undefined ?
                        {} :
                        {trashDays: parseTrashDays()}),
                    vault,
                    ...(values.watch === undefined ?
                        {} :
                        {watch: values.watch})
                }
                // Validates the complete pair before saving.
                resolvePair(settings, name)
                await saveSettings(settings)

                output.log(`Added pair "${name}".`)

                return 0
            }

            throw new UsageError(
                'Command "pair" expects: add <name> <vault> <plaintext>, ' +
                'remove <name> or list'
            )
        }
        case 'daemon': {
            const pairs = await getPairs(parameters)
            for (const pair of pairs)
                if (isNested(pair.plaintext, pair.vault))
                    throw new UsageError(
                        `Pair "${pair.name}": plaintext directory and vault ` +
                        'must not be located inside each other.'
                    )

            const logPath = values['log-file'] === undefined ?
                join(getConfigurationDirectory(), LOG_FILE_NAME) :
                resolve(values['log-file'])
            if (values['run-in-background']) {
                // NOTE: Each log line would be a change to synchronize.
                for (const pair of pairs)
                    if ([pair.plaintext, pair.vault].some((path) =>
                        logPath.startsWith(join(path, '/'))
                    ))
                        throw new UsageError(
                            `Log file "${logPath}" must not be located ` +
                            `inside the directories of pair "${pair.name}".`
                        )

                // Fails before asking for passwords and synchronizing.
                await mkdir(dirname(logPath), {recursive: true})
                await (await open(logPath, 'a')).close()
            }

            // NOTE: Taken before asking for passwords, a second daemon stops.
            const releaseLocks: Array<() => Promise<void>> = []
            try {
                for (const pair of pairs)
                    releaseLocks.push(await acquireLock(
                        getPairDirectory(pair.plaintext, pair.vault),
                        DAEMON_LOCK_FILE_NAME,
                        `Pair "${pair.name}" is already watched by another ` +
                        'daemon'
                    ))

                // Unlock everything first so wrong passwords stop the start.
                const contentKeys = new Map<string, Buffer>()
                if (isBackgroundChild) {
                    const handedOverKeys = await receiveContentKeys(
                        givenDependencies.input ?? process.stdin
                    )
                    for (const pair of pairs) {
                        const key = handedOverKeys.get(pair.name)
                        if (!key)
                            throw new Error(
                                `No key handed over for pair "${pair.name}".`
                            )

                        contentKeys.set(pair.name, key)
                    }
                } else
                    for (const pair of pairs)
                        contentKeys.set(
                            pair.name, await getContentKey(pair.vault, pair)
                        )

                if (values['run-in-background']) {
                    let failed = false
                    try {
                        for (const pair of pairs)
                            try {
                                const result = await synchronizePair(
                                    pair,
                                    contentKeys.get(pair.name) as Buffer,
                                    (text) => {
                                        output.log(`"${pair.name}": ${text}`)
                                    }
                                )
                                output.log(`"${pair.name}": ${result.summary}`)
                                failed ||= result.failed
                            } catch (error) {
                                /*
                                    NOTE: Typical right after log in while
                                    the cloud client catches up, the
                                    detached daemon retries.
                                */
                                if (!(error instanceof MassDeletionError))
                                    throw error

                                output.error(`"${pair.name}": ${error.message}`)
                                failed = true
                            }

                        // NOTE: Released so the detached copy can take them.
                        for (const releaseLock of releaseLocks.splice(0))
                            await releaseLock()

                        const trashDays = values['trash-days']
                        const pid = await (
                            givenDependencies.startInBackground ??
                            startInBackground
                        )({
                            argv: [
                                'daemon',
                                ...parameters,
                                ...(values.exclude ?? []).flatMap((pattern) =>
                                    ['--exclude', pattern]
                                ),
                                ...(trashDays === undefined ?
                                    [] :
                                    ['--trash-days', trashDays]),
                                ...(values['max-delete-percent'] === undefined ?
                                    [] :
                                    [
                                        '--max-delete-percent',
                                        values['max-delete-percent']
                                    ]),
                                ...(values.watch === undefined ?
                                    [] :
                                    [values.watch ? '--watch' : '--no-watch']),
                                ...(values['seal-on-stop'] === undefined ?
                                    [] :
                                    [values['seal-on-stop'] ?
                                        '--seal-on-stop' :
                                        '--no-seal-on-stop']),
                                `--${BACKGROUND_CHILD_OPTION_NAME}`
                            ],
                            contentKeys,
                            logPath,
                            program: getProgram()
                        })
                        output.log(
                            `Daemon continues in the background (process ` +
                            `${String(pid)}), logging to "${logPath}".`
                        )
                    } finally {
                        for (const key of contentKeys.values())
                            key.fill(0)
                    }

                    return failed ? EXIT_CODES.error : 0
                }

                const abortController = new AbortController()
                const stop = () => {
                    abortController.abort()
                }
                const signal =
                    givenDependencies.signal ?? abortController.signal
                /*
                    NOTE: On windows "SIGHUP" means a closed console window
                    (some seconds left to finish), "SIGBREAK" Ctrl+Break.
                    Elsewhere "SIGHUP" is left alone (e.g. "nohup").
                */
                const signalNames: Array<NodeJS.Signals> =
                    process.platform === 'win32' ?
                        ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'] :
                        ['SIGINT', 'SIGTERM']
                const stopRequestPath = getStopRequestPath(process.pid)
                let stopRequestPoller: NodeJS.Timeout | undefined
                if (!givenDependencies.signal) {
                    for (const name of signalNames)
                        process.once(name, stop)

                    // See "stop" module (graceful stops on windows).
                    await rm(stopRequestPath, {force: true})
                    // NOTE: Left behind by a crashed process with our id.
                    await rm(getSealingPath(process.pid), {force: true})
                    stopRequestPoller = setInterval(
                        () => {
                            if (existsSync(stopRequestPath))
                                stop()
                        },
                        STOP_REQUEST_POLL_INTERVAL_IN_MILLISECONDS
                    )
                    stopRequestPoller.unref()
                }

                const log = (text: string) => {
                    output.log(`${new Date().toISOString()} ${text}`)
                }
                try {
                    // Lets the foreground process exit (see "background").
                    if (isBackgroundChild)
                        await output.write(Buffer.from(READY_SIGNAL))

                    await runDaemon({
                        /*
                            NOTE: Runs after watching ended, so our removals
                            are not mistaken for changes. A second signal
                            ends the process right away, the next start
                            restores an interrupted seal.
                        */
                        beforeStop: async () => {
                            const sealedPairs = pairs.filter(({sealOnStop}) =>
                                sealOnStop
                            )
                            if (sealedPairs.length === 0)
                                return

                            // Lets "stop" know why we take longer.
                            const sealingPath = getSealingPath(process.pid)
                            await mkdir(dirname(sealingPath), {recursive: true})
                            await writeFile(sealingPath, '')
                            try {
                                for (const pair of sealedPairs)
                                    try {
                                        const key =
                                            contentKeys.get(pair.name) as Buffer
                                        await synchronizePair(
                                            pair,
                                            key,
                                            (text) => {
                                                log(`"${pair.name}": ${text}`)
                                            },
                                            false,
                                            true
                                        )
                                    } catch (error) {
                                        log(
                                            `"${pair.name}": sealing failed, ` +
                                            'the plaintext directory stays: ' +
                                            (error instanceof Error ?
                                                error.message :
                                                String(error))
                                        )
                                    }
                            } finally {
                                await rm(sealingPath, {force: true})
                            }
                        },
                        isSynchronized: (pair, changes) => isSynchronized(
                            {plainPath: pair.plaintext, vaultPath: pair.vault},
                            changes
                        ),
                        log,
                        pairs,
                        signal,
                        watchPair: givenDependencies.watchPair ?? watchPair,
                        synchronizePair: async (pair) => {
                            const result = await synchronizePair(
                                pair,
                                contentKeys.get(pair.name) as Buffer,
                                (text) => {
                                    log(`"${pair.name}": ${text}`)
                                }
                            )

                            return result.changes > 0 || result.failed ?
                                result.summary :
                                null
                        }
                    })
                } finally {
                    clearInterval(stopRequestPoller)
                    if (stopRequestPoller)
                        await rm(stopRequestPath, {force: true})
                    for (const name of signalNames)
                        process.removeListener(name, stop)
                    for (const key of contentKeys.values())
                        key.fill(0)
                }

                return 0
            } finally {
                for (const releaseLock of releaseLocks)
                    await releaseLock()
            }
        }
        case 'stop': {
            const pairs = await getPairs(parameters)
            const control =
                givenDependencies.processControl ?? createProcessControl()

            // NOTE: One daemon may watch more pairs than given.
            const pairsByProcess = new Map<number, Array<string>>()
            const lockPaths = new Map<string, string>()
            for (const pair of await getPairs([])) {
                const pairDirectory =
                    getPairDirectory(pair.plaintext, pair.vault)
                lockPaths.set(
                    pair.name, join(pairDirectory, DAEMON_LOCK_FILE_NAME)
                )
                const pid =
                    await getLockHolder(pairDirectory, DAEMON_LOCK_FILE_NAME)
                if (pid !== null && control.isRunning(pid))
                    pairsByProcess.set(
                        pid, [...pairsByProcess.get(pid) ?? [], pair.name]
                    )
            }
            // Removes locks of stopped processes (if still held by them).
            const removeLocks = async (pid: number) => {
                for (const path of lockPaths.values())
                    try {
                        const content =
                            await readFile(path, {encoding: 'utf-8'})
                        if (Number(content) === pid)
                            await rm(path, {force: true})
                    } catch {
                        // Already released.
                    }
            }

            const pids: Array<number> = []
            for (const pair of pairs) {
                const pid = [...pairsByProcess].find(([, names]) =>
                    names.includes(pair.name)
                )?.[0]
                if (pid === undefined) {
                    output.log(
                        `Pair "${pair.name}" is not watched by a daemon.`
                    )
                    // NOTE: Locks of crashed daemons are left behind.
                    const stalePid = await getLockHolder(
                        getPairDirectory(pair.plaintext, pair.vault),
                        DAEMON_LOCK_FILE_NAME
                    )
                    if (stalePid !== null)
                        await removeLocks(stalePid)
                } else if (!pids.includes(pid))
                    pids.push(pid)
            }

            for (const pid of pids) {
                const commandLine = await control.getCommandLine(pid)
                const names = (pairsByProcess.get(pid) as Array<string>)
                    .map((name) => `"${name}"`).join(', ')
                if (commandLine === null || !isDaemonCommandLine(commandLine))
                    throw new Error(
                        `Process ${String(pid)} holding the daemon lock of ` +
                        `${names} could not be identified as daemon of this ` +
                        'application, stop it yourself if it is one.'
                    )

                if (await stopDaemon(
                    pid, control, givenDependencies.stopTimeoutInMilliseconds
                ) === 'sealing')
                    // NOTE: Keeps its locks until it is done.
                    output.log(
                        `Daemon (process ${String(pid)}) of ${names} is ` +
                        'still sealing its plaintext directories and stops ' +
                        'on its own when done (see its log).'
                    )
                else {
                    await removeLocks(pid)
                    output.log(
                        `Stopped daemon (process ${String(pid)}) of ${names}.`
                    )
                }
            }

            return 0
        }
        case 'service': {
            const [subcommand] = parameters
            if (
                parameters.length !== 1 ||
                !['install', 'status', 'uninstall'].includes(subcommand)
            )
                throw new UsageError(
                    'Command "service" expects: install, uninstall or status'
                )

            const service = givenDependencies.service ?? createService()
            if (subcommand === 'install') {
                const pairs = await getPairs([])
                const interactive = pairs.filter(({password}) =>
                    password === 'prompt'
                )
                if (interactive.length > 0)
                    throw new UsageError(
                        'A service can not ask for passwords, pairs ' +
                        interactive.map(({name}) => `"${name}"`).join(', ') +
                        ' need another password source.'
                    )
            }

            output.log(await service[
                subcommand as 'install' | 'status' | 'uninstall'
            ]())

            return 0
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
        if (error instanceof MassDeletionError)
            return EXIT_CODES.massDeletion
        if (error instanceof BackgroundStartError)
            return error.exitCode || EXIT_CODES.error

        return EXIT_CODES.error
    }
}
