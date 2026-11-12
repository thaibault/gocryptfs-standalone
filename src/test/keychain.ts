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
import {mkdtemp, readFile, rm, writeFile} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'

import {afterAll, beforeAll, describe, expect, test} from '@jest/globals'

import {
    createKeychain,
    createLinuxKeychain,
    createMacOSKeychain,
    createWindowsKeychain,
    KeychainError,
    runCommand
} from '../keychain'
import type {CommandResult, CommandRunner} from '../keychain'
import {getPairPassword} from '../password'
// endregion
const PASSWORD = 'pässwört "with" spaces'
const HEX = Buffer.from(PASSWORD).toString('hex')

interface Call {
    command: string
    input?: string
    parameters: Array<string>
}
const createRunner = (
    result: Partial<CommandResult> = {}
): {calls: Array<Call>, run: CommandRunner} => {
    const calls: Array<Call> = []

    return {
        calls,
        run: (command, parameters, input) => {
            calls.push({command, input, parameters})

            return Promise.resolve({code: 0, stderr: '', stdout: '', ...result})
        }
    }
}
// The secret must never show up as command line argument.
const expectNoSecretInArguments = (calls: Array<Call>) => {
    for (const {parameters} of calls)
        for (const parameter of parameters) {
            expect(parameter).not.toContain(PASSWORD)
            expect(parameter).not.toContain(HEX)
        }
}

describe('keychain', () => {
    let directory = ''
    beforeAll(async () => {
        directory = await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
    })
    afterAll(async () => {
        await rm(directory, {force: true, recursive: true})
    })

    test('macOS', async () => {
        const storing = createRunner()
        await createMacOSKeychain(storing.run).store('docs', PASSWORD)
        expect(storing.calls).toStrictEqual([{
            command: 'security',
            input: 'add-generic-password -U -a docs -s gocryptfs-standalone ' +
                `-l gocryptfs-standalone-docs -w ${HEX}\n`,
            parameters: ['-i']
        }])
        expectNoSecretInArguments(storing.calls)

        const loading = createRunner({stdout: `${HEX}\n`})
        expect(await createMacOSKeychain(loading.run).load('docs'))
            .toStrictEqual(PASSWORD)
        expect(loading.calls[0].parameters).toStrictEqual([
            'find-generic-password',
            '-a',
            'docs',
            '-s',
            'gocryptfs-standalone',
            '-w'
        ])

        await expect(createMacOSKeychain(createRunner({
            code: 44, stderr: 'The specified item could not be found.'
        }).run).load('docs')).rejects.toThrow(
            'Could not load the password of "docs" (The specified item ' +
            'could not be found.).'
        )
    })
    test('Linux', async () => {
        const storing = createRunner()
        await createLinuxKeychain(storing.run).store('docs', PASSWORD)
        expect(storing.calls).toStrictEqual([{
            command: 'secret-tool',
            input: HEX,
            parameters: [
                'store',
                '--label=gocryptfs-standalone docs',
                'service',
                'gocryptfs-standalone',
                'account',
                'docs'
            ]
        }])

        expect(await createLinuxKeychain(
            createRunner({stdout: HEX}).run
        ).load('docs')).toStrictEqual(PASSWORD)

        const deleting = createRunner()
        await createLinuxKeychain(deleting.run).delete('docs')
        expect(deleting.calls[0].parameters[0]).toStrictEqual('clear')
    })
    test('Windows', async () => {
        const storing = createRunner({stdout: '01000000d08c9ddf\r\n'})
        const keychain = createWindowsKeychain(directory, storing.run)
        await keychain.store('docs', PASSWORD)

        expect(storing.calls[0].command).toStrictEqual('powershell.exe')
        expect(storing.calls[0].input).toStrictEqual(`${HEX}\n`)
        expectNoSecretInArguments(storing.calls)
        expect(await readFile(
            join(directory, 'credentials/docs.dpapi'), {encoding: 'utf-8'}
        )).toStrictEqual('01000000d08c9ddf\n')

        const loading = createRunner({stdout: `${HEX}\r\n`})
        expect(await createWindowsKeychain(directory, loading.run).load('docs'))
            .toStrictEqual(PASSWORD)
        expect(loading.calls[0].input).toStrictEqual('01000000d08c9ddf\n')

        await keychain.delete('docs')
        await expect(keychain.load('docs')).rejects.toThrow(KeychainError)
    })
    test('unexpected content and platforms', async () => {
        await expect(createLinuxKeychain(
            createRunner({stdout: 'not hex'}).run
        ).load('docs')).rejects.toThrow('unexpected format')

        expect(createKeychain('linux')).toBeDefined()
        await expect(runCommand('not-existing-command-123', []))
            .rejects.toThrow(KeychainError)
        expect(await runCommand('cat', [], 'echo')).toStrictEqual(
            {code: 0, stderr: '', stdout: 'echo'}
        )
    })
    test('getPairPassword', async () => {
        const keychain = createLinuxKeychain(createRunner({stdout: HEX}).run)
        const file = join(directory, 'password')
        await writeFile(file, 'from file\nignored')

        expect(await getPairPassword('keychain', 'docs', keychain))
            .toStrictEqual(PASSWORD)
        expect(await getPairPassword({file}, 'docs', keychain))
            .toStrictEqual('from file')
        expect(await getPairPassword(
            {command: 'echo from command'}, 'docs', keychain
        )).toStrictEqual('from command')
        expect(await getPairPassword(
            'environment', 'docs', keychain, {GOCRYPTFS_PASSWORD: 'env'}
        )).toStrictEqual('env')
        await expect(getPairPassword('environment', 'docs', keychain, {}))
            .rejects.toThrow('GOCRYPTFS_PASSWORD')
        expect(await getPairPassword(
            'prompt',
            'docs',
            keychain,
            {},
            (question) => Promise.resolve(question)
        )).toStrictEqual('Password of "docs": ')
    })
})
