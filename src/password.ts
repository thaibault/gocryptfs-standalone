// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module password */
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
import {readFile} from 'fs/promises'

import type {Keychain} from './keychain'
import type {PasswordSource} from './settings'
// endregion
export const PASSWORD_ENVIRONMENT_VARIABLE_NAME = 'GOCRYPTFS_PASSWORD'

export interface PasswordSources {
    // Asks twice when prompting interactively (for new passwords).
    confirm?: boolean
    environment?: NodeJS.ProcessEnv
    externalProgram?: string
    file?: string
    prompt?: (question: string) => Promise<string>
}
/**
 * Takes the first line of given text like gocryptfs does for "-passfile" and
 * "-extpass".
 * @param text - Text to extract the password from.
 * @param source - Source description for error messages.
 * @returns Password.
 */
export const getFirstLine = (text: string, source: string): string => {
    const password = text.split(/\r?\n/, 1)[0]
    if (password === '')
        throw new Error(`Password from ${source} is empty.`)

    return password
}
/**
 * Runs given shell command and returns the first line of its output.
 * @param command - Command line to run.
 * @returns Password.
 */
export const runExternalProgram = (command: string): Promise<string> =>
    new Promise((resolve, reject) => {
        const child = spawn(
            command, {shell: true, stdio: ['inherit', 'pipe', 'inherit']}
        )
        const chunks: Array<Buffer> = []

        child.stdout.on('data', (chunk: Buffer) => {
            chunks.push(chunk)
        })
        child.on('error', reject)
        child.on('close', (code) => {
            if (code === 0)
                try {
                    resolve(getFirstLine(
                        Buffer.concat(chunks).toString('utf-8'),
                        'external program'
                    ))
                } catch (error) {
                    reject(
                        error instanceof Error ?
                            error :
                            new Error(String(error))
                    )
                }
            else
                reject(new Error(
                    `External password program exited with code ` +
                    `${String(code)}.`
                ))
        })
    })
/**
 * Reads a line from the terminal without echoing it.
 * @param question - Prompt to show.
 * @returns Entered text.
 */
export const promptHidden = (question: string): Promise<string> =>
    new Promise((resolve, reject) => {
        const input = process.stdin
        if (!input.isTTY) {
            reject(new Error(
                'No terminal available to ask for a password. Use ' +
                `"--passfile", "--extpass" or "${
                    PASSWORD_ENVIRONMENT_VARIABLE_NAME}".`
            ))

            return
        }

        process.stderr.write(question)
        input.setRawMode(true)
        input.resume()
        input.setEncoding('utf-8')

        let value = ''
        const finish = (error?: Error) => {
            input.setRawMode(false)
            input.pause()
            input.removeListener('data', onData)
            process.stderr.write('\n')

            if (error)
                reject(error)
            else
                resolve(value)
        }
        const onData = (data: string) => {
            for (const character of data)
                if (character === '\r' || character === '\n') {
                    finish()

                    return
                } else if (character === '\u0003')
                    finish(new Error('Aborted.'))
                else if (character === '\u007f' || character === '\b')
                    value = value.slice(0, -1)
                else
                    value += character
        }

        input.on('data', onData)
    })
/**
 * Determines the vault password from the first available source in order:
 * password file, external program, environment variable, interactive prompt.
 * @param sources - Configured sources.
 * @returns Password.
 */
export const getPassword = async (
    sources: PasswordSources
): Promise<string> => {
    if (sources.file)
        return getFirstLine(
            await readFile(sources.file, {encoding: 'utf-8'}),
            `file "${sources.file}"`
        )

    if (sources.externalProgram)
        return runExternalProgram(sources.externalProgram)

    const environmentValue =
        (sources.environment ?? process.env)[
            PASSWORD_ENVIRONMENT_VARIABLE_NAME
        ]
    if (environmentValue)
        return environmentValue

    const prompt = sources.prompt ?? promptHidden
    const password = await prompt('Password: ')
    if (password === '')
        throw new Error('Password is empty.')
    if (sources.confirm && await prompt('Repeat: ') !== password)
        throw new Error('Passwords do not match.')

    return password
}
/**
 * Determines the password of a configured pair from its source.
 * @param source - Configured password source.
 * @param name - Name of the pair.
 * @param keychain - Credential store to use for "keychain".
 * @param environment - Environment variables.
 * @param prompt - Interactive prompt to use for "prompt".
 * @returns Password.
 */
export const getPairPassword = async (
    source: PasswordSource,
    name: string,
    keychain: Keychain,
    environment: NodeJS.ProcessEnv = process.env,
    prompt: (question: string) => Promise<string> = promptHidden
): Promise<string> => {
    if (source === 'keychain')
        return keychain.load(name)
    if (source === 'environment') {
        const password = environment[PASSWORD_ENVIRONMENT_VARIABLE_NAME]
        if (!password)
            throw new Error(
                `Pair "${name}" expects its password in ` +
                `"${PASSWORD_ENVIRONMENT_VARIABLE_NAME}".`
            )

        return password
    }
    if (source === 'prompt') {
        const password = await prompt(`Password of "${name}": `)
        if (password === '')
            throw new Error('Password is empty.')

        return password
    }
    if ('file' in source)
        return getFirstLine(
            await readFile(source.file, {encoding: 'utf-8'}),
            `file "${source.file}"`
        )

    return runExternalProgram(source.command)
}
