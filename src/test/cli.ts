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
import {existsSync} from 'fs'
import {mkdir, mkdtemp, readFile, rm, writeFile} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'
import {Readable} from 'stream'

import {afterAll, beforeAll, describe, expect, test} from '@jest/globals'

import type {BackgroundOptions} from '../background'
import {BackgroundStartError, READY_SIGNAL} from '../background'
import type {Dependencies, Output} from '../cli'
import {EXIT_CODES, findOverlappingPairs, isNested, run} from '../cli'
import {initializeVault} from '../configuration'
import type {Keychain} from '../keychain'
import type {Service} from '../service'
import type {ProcessControl} from '../stop'
import {loadSettings, saveSettings} from '../settings'
import {DAEMON_LOCK_FILE_NAME, getPairDirectory} from '../state'
import {
    PLAIN_FIXTURE_PATH,
    VAULT_FIXTURE_MASTER_KEY,
    VAULT_FIXTURE_PASSWORD,
    VAULT_FIXTURE_PATH
} from '../fixture'
// endregion
const createOutput = (isTerminal = false) => {
    const result = {
        errors: [] as Array<string>,
        logs: [] as Array<string>,
        written: [] as Array<Buffer>
    }
    const output: Output = {
        error: (text) => result.errors.push(text),
        isTerminal,
        log: (text) => result.logs.push(text),
        write: (data) => {
            result.written.push(data)

            return Promise.resolve()
        }
    }

    return {output, result}
}

describe('cli', () => {
    let temporaryDirectory = ''
    let passwordFile = ''
    beforeAll(async () => {
        temporaryDirectory =
            await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
        passwordFile = join(temporaryDirectory, 'password')
        await writeFile(passwordFile, `${VAULT_FIXTURE_PASSWORD}\nignored\n`)
    })
    afterAll(async () => {
        await rm(temporaryDirectory, {force: true, recursive: true})
    })

    test('info', async () => {
        const {output, result} = createOutput()

        expect(await run(['info', VAULT_FIXTURE_PATH], output))
            .toStrictEqual(0)
        expect(result.logs[0]).toContain('HKDF GCMIV128 PlaintextNames')
    })
    test.each([
        ['--passfile', () => passwordFile],
        ['--masterkey', () => VAULT_FIXTURE_MASTER_KEY],
        ['--extpass', () => `echo ${VAULT_FIXTURE_PASSWORD}`]
    ])('cat with %s', async (option, getValue) => {
        const {output, result} = createOutput()

        expect(await run(
            ['cat', VAULT_FIXTURE_PATH, 'hello.txt', option, getValue()],
            output
        )).toStrictEqual(0)
        expect(Buffer.concat(result.written)).toStrictEqual(
            await readFile(join(PLAIN_FIXTURE_PATH, 'hello.txt'))
        )
    })
    test('decrypt', async () => {
        const {output, result} = createOutput()
        const target = join(temporaryDirectory, 'decrypted')

        expect(await run(
            ['decrypt', VAULT_FIXTURE_PATH, target, '--passfile', passwordFile],
            output
        )).toStrictEqual(0)
        expect(result.logs[0]).toStrictEqual(
            'Decrypted 7 files, 2 directories and 1 symbolic links.'
        )
        expect(await readFile(join(target, 'nested/Ünïcödé name.txt')))
            .toStrictEqual(await readFile(
                join(PLAIN_FIXTURE_PATH, 'nested/Ünïcödé name.txt')
            ))
    })
    test.each([
        [[], EXIT_CODES.usage],
        [['unknown'], EXIT_CODES.usage],
        [['info'], EXIT_CODES.usage],
        [['--unknown-option'], EXIT_CODES.usage],
        [['cat', 'vault', 'gocryptfs.conf'], EXIT_CODES.usage],
        [['decrypt', 'vault', 'vault/inside'], EXIT_CODES.usage],
        [['encrypt', 'source/vault', 'source'], EXIT_CODES.usage],
        [['sync', 'a', 'b', '--trash-days', '-1'], EXIT_CODES.usage],
        [['sync', 'a', 'b', '--trash-days', 'x'], EXIT_CODES.usage],
        [['info', '/not/existing'], EXIT_CODES.error],
        [['--help'], 0],
        [['--version'], 0]
    ])('run(%p) exits with %i', async (argv, code) => {
        expect(await run(argv, createOutput().output)).toStrictEqual(code)
    })
    test('wrong password', async () => {
        const {output, result} = createOutput()
        const wrongPasswordFile = join(temporaryDirectory, 'wrong')
        await writeFile(wrongPasswordFile, 'wrong\n')

        expect(await run(
            [
                'cat',
                VAULT_FIXTURE_PATH,
                'hello.txt',
                '--passfile',
                wrongPasswordFile
            ],
            output
        )).toStrictEqual(EXIT_CODES.wrongPassword)
        expect(result.errors).toStrictEqual(['Password incorrect.'])
    })
    test('isNested', () => {
        expect(isNested('/a', '/a')).toStrictEqual(true)
        expect(isNested('/a', '/a/b')).toStrictEqual(true)
        expect(isNested('/a/b', '/a')).toStrictEqual(true)
        expect(isNested('/a', '/ab')).toStrictEqual(false)
    })
    test('findOverlappingPairs', () => {
        expect(findOverlappingPairs({
            a: {plaintext: '/plain/a', vault: '/vault/a'},
            b: {plaintext: '/plain/b', vault: '/vault/b'}
        })).toStrictEqual(null)
        // Any directory of one pair inside any of the other one.
        expect(findOverlappingPairs({
            a: {plaintext: '/plain/a', vault: '/vault/a'},
            b: {plaintext: '/plain/b', vault: '/vault/b'},
            c: {plaintext: '/vault/b/c', vault: '/vault/c'}
        })).toStrictEqual(['b', 'c'])
        expect(findOverlappingPairs({
            a: {plaintext: '/plain/a', vault: '/vault/a'},
            b: {plaintext: '/plain/a', vault: '/vault/a'}
        })).toStrictEqual(['a', 'b'])
    })
    test('init, encrypt and decrypt round trip', async () => {
        const vault = join(temporaryDirectory, 'new-vault')
        const target = join(temporaryDirectory, 'round-trip')
        const options = ['--passfile', passwordFile]

        const initialization = createOutput(true)
        expect(await run(
            ['init', vault, '--scryptn', '10', ...options],
            initialization.output
        )).toStrictEqual(0)
        expect(initialization.result.logs[1]).toMatch(
            /Your master key is:\n\n {4}([0-9a-f]{8}-){4}\n {4}([0-9a-f]{8}-){3}[0-9a-f]{8}\n/
        )

        const encryption = createOutput()
        expect(await run(
            ['encrypt', PLAIN_FIXTURE_PATH, vault, ...options],
            encryption.output
        )).toStrictEqual(0)
        expect(encryption.result.logs).toStrictEqual(
            ['Encrypted 7 files, 2 directories and 1 symbolic links.']
        )

        expect(await run(
            ['decrypt', vault, target, ...options], createOutput().output
        )).toStrictEqual(0)
        expect(await readFile(join(target, 'nested/deeper/multi-block.bin')))
            .toStrictEqual(await readFile(
                join(PLAIN_FIXTURE_PATH, 'nested/deeper/multi-block.bin')
            ))
    })
    test('init', async () => {
        const nonEmpty = join(temporaryDirectory, 'non-empty')
        await mkdir(nonEmpty)
        await writeFile(join(nonEmpty, 'file'), '')

        const {output, result} = createOutput()
        expect(await run(
            ['init', nonEmpty, '--scryptn', '10', '--passfile', passwordFile],
            output
        )).toStrictEqual(EXIT_CODES.error)
        expect(result.errors[0]).toContain('is not empty')

        // The master key is never shown when not running in a terminal.
        const quiet = createOutput()
        expect(await run(
            [
                'init',
                join(temporaryDirectory, 'quiet-vault'),
                '--scryptn',
                '10',
                '--passfile',
                passwordFile
            ],
            quiet.output
        )).toStrictEqual(0)
        expect(quiet.result.logs.join('')).not.toContain('master key')

        expect(await run(
            [
                'init',
                join(temporaryDirectory, 'any'),
                '--masterkey',
                VAULT_FIXTURE_MASTER_KEY
            ],
            createOutput().output
        )).toStrictEqual(EXIT_CODES.usage)
        const invalid = join(temporaryDirectory, 'invalid-scrypt-cost')
        expect(await run(
            ['init', invalid, '--scryptn', '5', '--passfile', passwordFile],
            createOutput().output
        )).toStrictEqual(EXIT_CODES.error)
        // Invalid parameters never leave a directory behind.
        expect(existsSync(invalid)).toStrictEqual(false)
    })
    test('separate configuration file', async () => {
        const vault = join(temporaryDirectory, 'separate-vault')
        const configuration = join(temporaryDirectory, 'separate.conf')
        const plain = join(temporaryDirectory, 'separate-plain')
        const options = ['--config', configuration, '--passfile', passwordFile]

        expect(await run(
            ['init', vault, '--scryptn', '10', ...options],
            createOutput().output
        )).toStrictEqual(0)
        expect(existsSync(join(vault, 'gocryptfs.conf'))).toStrictEqual(false)

        const missing = createOutput()
        expect(await run(['info', vault], missing.output))
            .toStrictEqual(EXIT_CODES.error)
        expect(missing.result.errors[0]).toContain('No configuration file')
        expect(await run(
            ['info', vault, '--config', configuration], createOutput().output
        )).toStrictEqual(0)

        expect(await run(
            ['encrypt', PLAIN_FIXTURE_PATH, vault, ...options],
            createOutput().output
        )).toStrictEqual(0)
        const synchronization = createOutput()
        expect(await run(
            ['sync', vault, plain, ...options], synchronization.output
        )).toStrictEqual(0)
        expect(synchronization.result.logs.at(-1))
            .toStrictEqual('Applied 10 changes.')
        expect(await readFile(join(plain, 'hello.txt'))).toStrictEqual(
            await readFile(join(PLAIN_FIXTURE_PATH, 'hello.txt'))
        )
    })
    test('encrypt refuses a wrong master key', async () => {
        const {output, result} = createOutput()

        expect(await run(
            [
                'encrypt',
                PLAIN_FIXTURE_PATH,
                VAULT_FIXTURE_PATH,
                '--masterkey',
                '00'.repeat(32)
            ],
            output
        )).toStrictEqual(EXIT_CODES.wrongPassword)
        expect(result.errors)
            .toStrictEqual(['Master key does not match the vault content.'])
    })
    describe('configured pairs', () => {
        const passwords = new Map<string, string>()
        const keychain: Keychain = {
            delete: (name) => {
                passwords.delete(name)

                return Promise.resolve()
            },
            load: (name) => Promise.resolve(passwords.get(name) ?? ''),
            store: (name, password) => {
                passwords.set(name, password)

                return Promise.resolve()
            }
        }
        const serviceCalls: Array<string> = []
        const service: Service = {
            install: () => Promise.resolve(String(serviceCalls.push('install'))),
            status: () => Promise.resolve(String(serviceCalls.push('status'))),
            uninstall: () =>
                Promise.resolve(String(serviceCalls.push('uninstall')))
        }
        const backgroundStarts: Array<BackgroundOptions> = []
        const runWithPairs = (
            argv: Array<string>,
            signal?: AbortSignal,
            dependencies: Partial<Dependencies> = {}
        ) => {
            const {output, result} = createOutput()

            return run(argv, output, {
                keychain,
                service,
                signal,
                startInBackground: (options) => {
                    // NOTE: Keys get wiped after the hand over.
                    backgroundStarts.push({
                        ...options,
                        contentKeys: new Map([...options.contentKeys].map(
                            ([name, key]) => [name, Buffer.from(key)]
                        ))
                    })

                    return Promise.resolve(4242)
                },
                ...dependencies
            }).then((code) => ({code, ...result}))
        }

        let vault = ''
        let plain = ''
        beforeAll(async () => {
            process.env.GOCRYPTFS_STANDALONE_CONFIGURATION_DIRECTORY =
                join(temporaryDirectory, 'configuration')
            vault = join(temporaryDirectory, 'pair-vault')
            plain = join(temporaryDirectory, 'pair-plain')
            await initializeVault(vault, Buffer.from('secret'), 10)
        })
        afterAll(() => {
            delete process.env.GOCRYPTFS_STANDALONE_CONFIGURATION_DIRECTORY
            delete process.env.GOCRYPTFS_PASSWORD
        })

        test('pair add, list, sync, daemon and remove', async () => {
            expect((await runWithPairs(['sync'])).errors[0])
                .toContain(
                    'No pairs configured, see "pair add" or give a ' +
                    'plaintext directory and a vault.'
                )
            expect((await runWithPairs(['daemon'])).errors[0])
                .toContain('No pairs configured, see "pair add".')

            // Wrong passwords are never stored.
            process.env.GOCRYPTFS_PASSWORD = 'wrong'
            expect((await runWithPairs(['pair', 'add', 'docs', vault, plain])).code)
                .toStrictEqual(EXIT_CODES.wrongPassword)
            expect(passwords.size).toStrictEqual(0)

            process.env.GOCRYPTFS_PASSWORD = 'secret'
            expect((await runWithPairs([
                'pair', 'add', 'docs', vault, plain, '--interval', '1h',
                '--exclude', '*.tmp'
            ])).code).toStrictEqual(0)
            delete process.env.GOCRYPTFS_PASSWORD
            expect(passwords.get('docs')).toStrictEqual('secret')

            expect((await runWithPairs(['pair', 'add', 'docs', vault, plain]))
                .errors).toStrictEqual(['Pair "docs" already exists.'])
            expect((await runWithPairs(['pair', 'add', 'a b', vault, plain]))
                .code).toStrictEqual(EXIT_CODES.usage)

            const listing = await runWithPairs(['pair', 'list'])
            expect(listing.logs[0]).toContain('interval:  3600s')
            expect(listing.logs[0]).toContain('password:  "keychain"')
            expect(listing.logs[0]).toContain('.DS_Store')
            expect(listing.logs[0]).toContain('*.tmp')
            expect(listing.logs[0]).toContain('watch:     yes')

            // Password comes from the keychain now.
            await writeFile(join(temporaryDirectory, 'note.txt'), 'note')
            await mkdir(plain, {recursive: true})
            await writeFile(join(plain, 'a.txt'), 'a')
            await writeFile(join(plain, 'ignored.tmp'), 'tmp')
            const synchronization = await runWithPairs(['sync', 'docs'])
            expect(synchronization.code).toStrictEqual(0)
            expect(synchronization.logs)
                .toStrictEqual(['encrypt a.txt', 'Applied 1 changes.'])

            expect((await runWithPairs(['sync', 'unknown'])).errors[0])
                .toContain('Unknown pair "unknown"')

            // The daemon runs until stopped.
            const controller = new AbortController()
            await writeFile(join(plain, 'b.txt'), 'b')
            setTimeout(() => {
                controller.abort()
            }, 200)
            const daemon = await runWithPairs(['daemon'], controller.signal)
            expect(daemon.code).toStrictEqual(0)
            expect(daemon.logs.map((line) => line.replace(/^\S+ /, '')))
                .toStrictEqual([
                    'Started synchronizing "docs" every 3600s and on changes.',
                    '"docs": encrypt b.txt',
                    '"docs": Applied 1 changes.',
                    'Stopped.'
                ])
            expect(existsSync(join(
                getPairDirectory(plain, vault), DAEMON_LOCK_FILE_NAME
            ))).toStrictEqual(false)

            // Synchronizes in the foreground, then continues detached.
            await writeFile(join(plain, 'c.txt'), 'c')
            const foreground = await runWithPairs([
                'daemon', 'docs', '--run-in-background', '--no-watch',
                '--exclude', '*.log'
            ])
            expect(foreground.code).toStrictEqual(0)
            expect(foreground.logs).toStrictEqual([
                '"docs": encrypt c.txt',
                '"docs": Applied 1 changes.',
                'Daemon continues in the background (process 4242), ' +
                `logging to "${join(
                    temporaryDirectory, 'configuration', 'daemon.log'
                )}".`
            ])
            expect(backgroundStarts).toHaveLength(1)
            const [backgroundStart] = backgroundStarts
            expect(backgroundStart.argv).toStrictEqual([
                'daemon', 'docs', '--exclude', '*.log', '--no-watch',
                '--background-child'
            ])
            expect([...backgroundStart.contentKeys.keys()])
                .toStrictEqual(['docs'])
            // The detached copy takes over the lock.
            expect(existsSync(join(
                getPairDirectory(plain, vault), DAEMON_LOCK_FILE_NAME
            ))).toStrictEqual(false)

            // The detached copy uses the handed over key.
            const childController = new AbortController()
            await writeFile(join(plain, 'd.txt'), 'd')
            setTimeout(() => {
                childController.abort()
            }, 200)
            const {output: childOutput, result: child} = createOutput()
            expect(await run(
                backgroundStart.argv,
                childOutput,
                {
                    input: Readable.from([JSON.stringify({
                        docs: (backgroundStart.contentKeys.get('docs') as
                            Buffer).toString('hex')
                    })]),
                    keychain: {...keychain, load: () => {
                        throw new Error('Not to be asked.')
                    }},
                    service,
                    signal: childController.signal
                }
            )).toStrictEqual(0)
            expect(Buffer.concat(child.written).toString())
                .toStrictEqual(READY_SIGNAL)
            expect(child.logs.map((line) => line.replace(/^\S+ /, '')))
                .toStrictEqual([
                    'Started synchronizing "docs" every 3600s.',
                    '"docs": encrypt d.txt',
                    '"docs": Applied 1 changes.',
                    'Stopped.'
                ])

            // Failing detached copies report their error.
            const failedStart = await runWithPairs(
                ['daemon', '--run-in-background'],
                undefined,
                {
                    startInBackground: () => Promise.reject(
                        new BackgroundStartError('Broken.', EXIT_CODES.locked)
                    )
                }
            )
            expect(failedStart.code).toStrictEqual(EXIT_CODES.locked)
            expect(failedStart.errors).toStrictEqual(['Broken.'])

            expect((await runWithPairs(['sync', '--run-in-background'])).code)
                .toStrictEqual(EXIT_CODES.usage)

            // Logs go to a given file instead.
            const logFile = join(temporaryDirectory, 'logs', 'background.log')
            const customLog = await runWithPairs([
                'daemon', '--run-in-background', '--log-file', logFile
            ])
            expect(customLog.code).toStrictEqual(0)
            expect(backgroundStarts.at(-1)?.logPath).toStrictEqual(logFile)
            expect(customLog.logs.at(-1)).toContain(`logging to "${logFile}"`)
            expect(existsSync(logFile)).toStrictEqual(true)

            expect((await runWithPairs(['daemon', '--log-file', logFile]))
                .errors).toStrictEqual([
                '"--log-file" applies to "daemon --run-in-background" only.'
            ])
            // Writing into a watched directory would never settle down.
            const watchedLog = await runWithPairs([
                'daemon', '--run-in-background',
                '--log-file', join(plain, 'daemon.log')
            ])
            expect(watchedLog.code).toStrictEqual(EXIT_CODES.usage)
            expect(watchedLog.errors).toStrictEqual([
                `Log file "${join(plain, 'daemon.log')}" must not be located ` +
                'inside the directories of pair "docs".'
            ])
            expect(existsSync(join(plain, 'daemon.log'))).toStrictEqual(false)
            // Unwritable log files fail before synchronizing.
            const unwritableLog = await runWithPairs([
                'daemon', '--run-in-background', '--log-file', temporaryDirectory
            ])
            expect(unwritableLog.code).toStrictEqual(EXIT_CODES.error)
            expect(unwritableLog.logs).toStrictEqual([])

            expect((await runWithPairs(['service', 'install'])).code)
                .toStrictEqual(0)
            expect((await runWithPairs(['service', 'unknown'])).code)
                .toStrictEqual(EXIT_CODES.usage)

            expect((await runWithPairs(['pair', 'remove', 'docs'])).code)
                .toStrictEqual(0)
            expect(passwords.size).toStrictEqual(0)
            expect((await runWithPairs(['pair', 'list'])).logs)
                .toStrictEqual(['No pairs configured.'])
        })
        test('pair with a separate configuration file', async () => {
            const separateVault = join(temporaryDirectory, 'pair-separate-vault')
            const configuration = join(temporaryDirectory, 'pair-separate.conf')
            await initializeVault(
                separateVault, Buffer.from('secret'), 10, configuration
            )

            process.env.GOCRYPTFS_PASSWORD = 'secret'
            expect((await runWithPairs([
                'pair', 'add', 'separate', separateVault, plain,
                '--config', configuration, '--password', 'environment',
                '--no-watch'
            ])).code).toStrictEqual(0)
            const listing = (await runWithPairs(['pair', 'list'])).logs[0]
            expect(listing).toContain(`config:    ${configuration}`)
            expect(listing).toContain('watch:     no')
            expect((await runWithPairs(['sync', 'separate'])).code)
                .toStrictEqual(0)

            // Configured pairs bring their own configuration file.
            expect((await runWithPairs(
                ['sync', 'separate', '--config', configuration]
            )).code).toStrictEqual(EXIT_CODES.usage)

            await runWithPairs(['pair', 'remove', 'separate'])
            delete process.env.GOCRYPTFS_PASSWORD
        })
        test('overlapping pairs and a second daemon are refused', async () => {
            process.env.GOCRYPTFS_PASSWORD = 'secret'
            expect((await runWithPairs([
                'pair', 'add', 'first', vault, plain,
                '--password', 'environment'
            ])).code).toStrictEqual(0)

            const message =
                'Pairs "first" and "second" overlap, their directories must ' +
                'not be located inside each other.'
            for (const [plaintext, otherVault] of [
                [join(plain, 'nested'), join(temporaryDirectory, 'other')],
                [join(temporaryDirectory, 'other'), join(vault, 'nested')],
                [plain, vault]
            ]) {
                const addition = await runWithPairs([
                    'pair', 'add', 'second', otherVault, plaintext,
                    '--password', 'environment'
                ])
                expect(addition.code).toStrictEqual(EXIT_CODES.usage)
                expect(addition.errors).toStrictEqual([message])
            }

            // Hand edited configurations get checked as well.
            const settings = await loadSettings()
            settings.pairs.second = {
                plaintext: join(temporaryDirectory, 'other'),
                vault: join(plain, 'nested')
            }
            await saveSettings(settings)
            const synchronization = await runWithPairs(['sync', 'first'])
            expect(synchronization.code).toStrictEqual(EXIT_CODES.usage)
            expect(synchronization.errors).toStrictEqual([message])
            delete settings.pairs.second
            await saveSettings(settings)

            // A running daemon (here this process) owns the pair.
            const lockPath = join(
                getPairDirectory(plain, vault), DAEMON_LOCK_FILE_NAME
            )
            await writeFile(lockPath, String(process.pid))
            const daemon = await runWithPairs(['daemon'])
            expect(daemon.code).toStrictEqual(EXIT_CODES.locked)
            expect(daemon.errors).toStrictEqual([
                'Pair "first" is already watched by another daemon ' +
                `(process ${String(process.pid)}).`
            ])
            // Only its own lock gets released.
            expect(existsSync(lockPath)).toStrictEqual(true)
            await rm(lockPath)

            await runWithPairs(['pair', 'remove', 'first'])
            delete process.env.GOCRYPTFS_PASSWORD
        })
        test('stop', async () => {
            const otherVault = join(temporaryDirectory, 'stop-vault')
            const otherPlain = join(temporaryDirectory, 'stop-plain')
            for (const [name, pairVault, pairPlain] of [
                ['first', vault, plain],
                ['second', otherVault, otherPlain],
                ['third', join(temporaryDirectory, 'stop-third-vault'),
                    join(temporaryDirectory, 'stop-third-plain')]
            ]) {
                if (name !== 'first')
                    await initializeVault(pairVault, Buffer.from('secret'), 10)
                process.env.GOCRYPTFS_PASSWORD = 'secret'
                expect((await runWithPairs([
                    'pair', 'add', name, pairVault, pairPlain,
                    '--password', 'environment'
                ])).code).toStrictEqual(0)
            }
            delete process.env.GOCRYPTFS_PASSWORD
            const getLockPath = (pairVault: string, pairPlain: string) =>
                join(getPairDirectory(pairPlain, pairVault), DAEMON_LOCK_FILE_NAME)
            const thirdLock = getLockPath(
                join(temporaryDirectory, 'stop-third-vault'),
                join(temporaryDirectory, 'stop-third-plain')
            )

            // Process 100 watches "first" and "second", 200 crashed.
            const running = new Set([100, 300])
            const terminated: Array<number> = []
            const processControl: ProcessControl = {
                getCommandLine: (pid) => Promise.resolve(pid === 100 ?
                    'node /usr/bin/gocryptfs-standalone daemon' :
                    '/usr/bin/vim'
                ),
                isRunning: (pid) => running.has(pid),
                terminate: (pid) => {
                    terminated.push(pid)
                    running.delete(pid)
                }
            }
            for (const [path, pid] of [
                [getLockPath(vault, plain), '100'],
                [getLockPath(otherVault, otherPlain), '100'],
                [thirdLock, '200']
            ]) {
                await mkdir(join(path, '..'), {recursive: true})
                await writeFile(path, pid)
            }

            const stop = await runWithPairs(
                ['stop', 'second', 'third'], undefined, {processControl}
            )
            expect(stop.code).toStrictEqual(0)
            expect(stop.logs).toStrictEqual([
                'Pair "third" is not watched by a daemon.',
                'Stopped daemon (process 100) of "first", "second".'
            ])
            expect(terminated).toStrictEqual([100])
            for (const path of [
                getLockPath(vault, plain),
                getLockPath(otherVault, otherPlain),
                thirdLock
            ])
                expect(existsSync(path)).toStrictEqual(false)

            // Reused process ids of foreign processes are never stopped.
            await writeFile(thirdLock, '300')
            const refused =
                await runWithPairs(['stop'], undefined, {processControl})
            expect(refused.code).toStrictEqual(EXIT_CODES.error)
            expect(refused.logs).toStrictEqual([
                'Pair "first" is not watched by a daemon.',
                'Pair "second" is not watched by a daemon.'
            ])
            expect(refused.errors).toStrictEqual([
                'Process 300 holding the daemon lock of "third" could not ' +
                'be identified as daemon of this application, stop it ' +
                'yourself if it is one.'
            ])
            expect(terminated).toStrictEqual([100])
            expect(existsSync(thirdLock)).toStrictEqual(true)
            await rm(thirdLock)

            for (const name of ['first', 'second', 'third'])
                await runWithPairs(['pair', 'remove', name])
        })
        test('service refuses pairs needing interactive passwords', async () => {
            expect((await runWithPairs([
                'pair', 'add', 'interactive', vault, plain, '--password', 'prompt'
            ])).code).toStrictEqual(0)

            const installation = await runWithPairs(['service', 'install'])
            expect(installation.code).toStrictEqual(EXIT_CODES.usage)
            expect(installation.errors[0]).toContain('"interactive"')

            await runWithPairs(['pair', 'remove', 'interactive'])
        })
    })
})
