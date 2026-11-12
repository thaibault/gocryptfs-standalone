// #!/usr/bin/env node
// -*- coding: utf-8 -*-
/** @module standalone */
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
/*
    Builds and checks the standalone executable of the current platform via
    node's single executable applications (needs a prior "yarn build"):

    node standalone.ts build
    node standalone.ts test [<executable>]

    Runs directly via node's type stripping, so only erasable typescript
    syntax is allowed here.
*/
// region imports
import {spawn, spawnSync} from 'child_process'
import {randomBytes} from 'crypto'
import {existsSync} from 'fs'
import {
    mkdir, mkdtemp, readdir, readFile, rm, utimes, writeFile
} from 'fs/promises'
import {tmpdir} from 'os'
import {join, resolve} from 'path'
// endregion
const NAME = 'gocryptfs-standalone'
const BUNDLE_PATH = 'dist/index.js'
const TARGET_DIRECTORY = 'dist/standalone'
const PLATFORM_NAMES: Partial<Record<NodeJS.Platform, string>> = {
    darwin: 'macos', linux: 'linux', win32: 'windows'
}

interface Result {
    code: null | number
    stderr: string
    stdout: string
}
/**
 * Runs given program synchronously.
 * @param program - Executable.
 * @param parameters - Arguments.
 * @param environment - Additional environment variables.
 * @returns Exit code and outputs.
 */
const execute = (
    program: string,
    parameters: Array<string>,
    environment: Record<string, string> = {}
): Result => {
    const result = spawnSync(program, parameters, {
        encoding: 'utf-8', env: {...process.env, ...environment}
    })
    if (result.error)
        throw result.error

    return {code: result.status, stderr: result.stderr, stdout: result.stdout}
}
/**
 * Runs given program and fails on an unexpected exit code.
 * @param program - Executable.
 * @param parameters - Arguments.
 * @param environment - Additional environment variables.
 * @param expectedCode - Expected exit code.
 * @returns Exit code and outputs.
 */
const check = (
    program: string,
    parameters: Array<string>,
    environment: Record<string, string> = {},
    expectedCode = 0
): Result => {
    const result = execute(program, parameters, environment)
    if (result.code !== expectedCode)
        throw new Error(
            `"${parameters.join(' ')}" exited with ${String(result.code)} ` +
            `instead of ${String(expectedCode)}:\n${result.stdout}` +
            result.stderr
        )

    return result
}
/**
 * Determines the executable path of the current platform.
 * @returns Relative path.
 */
const getExecutablePath = (): string => {
    const platformName = PLATFORM_NAMES[process.platform]
    if (!platformName)
        throw new Error(`Unsupported platform "${process.platform}".`)

    return join(
        TARGET_DIRECTORY,
        `${NAME}-${platformName}-${process.arch}` +
        (process.platform === 'win32' ? '.exe' : '')
    )
}
/**
 * Builds the executable of the current platform.
 * @returns Path of the created executable.
 */
const build = async (): Promise<string> => {
    const output = getExecutablePath()
    await mkdir(TARGET_DIRECTORY, {recursive: true})
    const mainPath = join(TARGET_DIRECTORY, 'main.mjs')
    const configurationPath = join(TARGET_DIRECTORY, 'sea.json')

    // NOTE: The entry point must not start with a shebang line.
    await writeFile(
        mainPath,
        (await readFile(BUNDLE_PATH, {encoding: 'utf-8'}))
            .replace(/^#!.*\n/, '')
    )
    await writeFile(configurationPath, JSON.stringify({
        disableExperimentalSEAWarning: true,
        main: mainPath,
        mainFormat: 'module',
        output
    }))

    check(process.execPath, ['--build-sea', configurationPath])

    /*
        NOTE: Injecting the application breaks node's signature, macOS kills
        executables with an invalid signature right away.
    */
    if (process.platform === 'darwin')
        check('codesign', ['--sign', '-', '--force', output])

    await rm(mainPath)
    await rm(configurationPath)

    return output
}
/**
 * Lists all files below given directory with their content.
 * @param root - Directory to read.
 * @returns Content by relative posix path.
 */
const readTree = async (root: string): Promise<Map<string, Buffer>> => {
    const result = new Map<string, Buffer>()
    for (const entry of await readdir(root, {
        recursive: true, withFileTypes: true
    }))
        if (entry.isFile()) {
            const path = join(entry.parentPath, entry.name)
            result.set(
                path.slice(root.length + 1).split('\\').join('/'),
                await readFile(path)
            )
        }

    return result
}
/**
 * Fails if both directories have different files or contents.
 * @param expectedRoot - Directory with expected content.
 * @param givenRoot - Directory to check.
 * @param description - Describes the comparison for error messages.
 * @returns Promise resolving when equal.
 */
const assertSameTree = async (
    expectedRoot: string, givenRoot: string, description: string
): Promise<void> => {
    const expected = await readTree(expectedRoot)
    const given = await readTree(givenRoot)

    const expectedPaths = [...expected.keys()].sort().join(', ')
    const givenPaths = [...given.keys()].sort().join(', ')
    if (expectedPaths !== givenPaths)
        throw new Error(
            `${description}: expected files ${expectedPaths}, got ${givenPaths}.`
        )

    for (const [path, content] of expected)
        if (!content.equals(given.get(path) as Buffer))
            throw new Error(`${description}: content of "${path}" differs.`)
}
/**
 * Waits until given check succeeds.
 * @param check - Condition to wait for.
 * @param description - Describes the condition for error messages.
 * @param timeoutInMilliseconds - Maximal time to wait.
 * @returns Promise resolving when the condition is met.
 */
const waitFor = async (
    check: () => boolean,
    description: string,
    timeoutInMilliseconds = 30000
): Promise<void> => {
    const end = Date.now() + timeoutInMilliseconds
    while (!check()) {
        if (Date.now() > end)
            throw new Error(`Timed out waiting for ${description}.`)

        await new Promise((resolve) => setTimeout(resolve, 100))
    }
}
/**
 * Runs an end-to-end check of given executable (without symbolic links,
 * keychain and service which need special permissions on some platforms).
 * @param executable - Executable to check.
 * @returns Promise resolving when all checks passed.
 */
const test = async (executable: string): Promise<void> => {
    const program = resolve(executable)
    const root = await mkdtemp(join(tmpdir(), `${NAME}-smoke-`))
    const path = (...segments: Array<string>) => join(root, ...segments)
    const environment = {
        GOCRYPTFS_STANDALONE_CONFIGURATION_DIRECTORY: path('configuration')
    }
    const run = (parameters: Array<string>, expectedCode = 0) =>
        check(program, parameters, environment, expectedCode)
    const step = (description: string) => {
        console.log(`- ${description}`)
    }

    try {
        const {version} = JSON.parse(
            await readFile('package.json', {encoding: 'utf-8'})
        ) as {version: string}
        step('version')
        const givenVersion = run(['--version']).stdout.trim()
        if (givenVersion !== version)
            throw new Error(`Unexpected version "${givenVersion}".`)

        await writeFile(path('password'), 'smoke test\n')
        await writeFile(path('wrong-password'), 'wrong\n')
        const password = ['--passfile', path('password')]

        step('init')
        run(['init', path('vault'), '--scryptn', '10', ...password])

        const source = path('source')
        await mkdir(path('source', 'sub', 'deeper'), {recursive: true})
        await writeFile(path('source', 'a.txt'), 'first\n')
        await writeFile(path('source', 'empty'), '')
        await writeFile(path('source', 'sub', 'Ünïcödé näme.txt'), 'ü\n')
        await writeFile(
            path('source', 'sub', 'deeper', 'big.bin'), randomBytes(1000003)
        )

        step('encrypt / decrypt')
        run(['encrypt', source, path('vault'), ...password])
        run(['decrypt', path('vault'), path('decrypted'), ...password])
        await assertSameTree(source, path('decrypted'), 'decrypt')

        step('cat')
        if (
            run(['cat', path('vault'), 'a.txt', ...password]).stdout !==
            'first\n'
        )
            throw new Error('"cat" returned unexpected content.')

        step('wrong password and external password program')
        run(
            ['cat', path('vault'), 'a.txt', '--passfile', path('wrong-password')],
            12
        )
        run(['info', path('vault'), '--extpass', 'echo smoke test'])
        run(['cat', path('vault'), 'a.txt', '--extpass', 'echo smoke test'])

        step('sync into an empty directory')
        const plain = path('plain')
        run(['sync', plain, path('vault'), ...password])
        await assertSameTree(source, plain, 'first sync')

        step('sync changes back')
        await writeFile(join(plain, 'a.txt'), 'second\n')
        const future = new Date(Date.now() + 60000)
        await utimes(join(plain, 'a.txt'), future, future)
        await rm(join(plain, 'sub', 'Ünïcödé näme.txt'))
        await writeFile(join(plain, 'new.txt'), 'new\n')
        run(['sync', plain, path('vault'), ...password])
        run(['decrypt', path('vault'), path('check'), ...password])
        await assertSameTree(plain, path('check'), 'second sync')

        step('separate configuration file')
        const configuration = path('separate.conf')
        run([
            'init', path('separate-vault'), '--scryptn', '10',
            '--config', configuration, ...password
        ])
        run(['info', path('separate-vault')], 1)
        run(['info', path('separate-vault'), '--config', configuration])

        step('configured pair')
        run(['pair', 'add', 'smoke', plain, path('vault'), ...password])
        if (!run(['sync', 'smoke']).stderr.includes('Applied 0 changes.'))
            throw new Error('Configured pair is not in sync.')

        step('daemon synchronizes on file system events')
        // NOTE: The interval is far too long to synchronize the change.
        run(['pair', 'remove', 'smoke'])
        run([
            'pair', 'add', 'smoke', plain, path('vault'), ...password,
            '--interval', '1h'
        ])
        let daemonOutput = ''
        const daemon = spawn(program, ['daemon'], {
            env: {...process.env, ...environment}
        })
        daemon.stderr.on('data', (data: Buffer) => {
            daemonOutput += data.toString()
        })
        try {
            // Watching starts after the initial run.
            await waitFor(
                () => daemonOutput.includes('and on changes'),
                `the daemon to start, got: ${daemonOutput}`
            )
            await new Promise((resolve) => setTimeout(resolve, 2000))

            await writeFile(join(plain, 'watched.txt'), 'watched\n')
            await waitFor(
                () => existsSync(path('vault', 'watched.txt')),
                `the change to be encrypted, got: ${daemonOutput}`
            )
            // NOTE: Files only appear complete (written and renamed).
            if (
                run(['cat', path('vault'), 'watched.txt', ...password])
                    .stdout !== 'watched\n'
            )
                throw new Error('Watched change has unexpected content.')
        } finally {
            daemon.kill()
        }
        run(['pair', 'remove', 'smoke'])

        console.log(`All checks of "${executable}" passed.`)
    } finally {
        await rm(root, {force: true, recursive: true})
    }
}

const [command, executable] = process.argv.slice(2)
if (command === 'build')
    console.log(`Created "${await build()}".`)
else if (command === 'test')
    await test(executable ?? getExecutablePath())
else {
    console.error('Usage: node standalone.ts build | test [<executable>]')
    process.exitCode = 2
}
