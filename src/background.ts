// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module background */
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
import {mkdir, open} from 'fs/promises'
import {dirname} from 'path'
import type {Readable, Writable} from 'stream'

import {PASSWORD_ENVIRONMENT_VARIABLE_NAME} from './password'
// endregion
/*
    Hands a daemon over to a detached copy of this application:

    1. The foreground process unlocks the vaults and runs the initial
       synchronization.
    2. It starts the copy with "--background-child" and writes the content
       keys into its standard input (never into arguments or the
       environment, where other processes could read them).
    3. The copy takes over the daemon locks and writes "READY_SIGNAL" to its
       standard output, everything else goes into the log file.
    4. The foreground process exits, the copy keeps running.
*/
export const BACKGROUND_CHILD_OPTION_NAME = 'background-child'
export const READY_SIGNAL = 'ready\n'

export interface BackgroundOptions {
    // Arguments of the copy (without program).
    argv: Array<string>
    contentKeys: Map<string, Buffer>
    // Environment of the copy (defaults to the current one).
    environment?: NodeJS.ProcessEnv
    // Receives standard output and error of the copy.
    logPath: string
    // Program and arguments starting this application (see "getProgram").
    program: Array<string>
}

export class BackgroundStartError extends Error {
    name = 'BackgroundStartError'

    constructor(message: string, public exitCode: number) {
        super(message)
    }
}
/**
 * Starts a detached copy of this application and hands given content keys
 * over to it.
 * @param options - Arguments, keys, log file and program.
 * @returns Promise resolving with the process id of the copy as soon as it
 * runs, rejecting with its logged error if it stops before.
 */
export const startInBackground = async (
    options: BackgroundOptions
): Promise<number> => {
    const {argv, contentKeys, logPath, program} = options
    // NOTE: Passwords are not needed anymore, the keys get handed over.
    const environment = {...options.environment ?? process.env}
    delete environment[PASSWORD_ENVIRONMENT_VARIABLE_NAME]

    await mkdir(dirname(logPath), {recursive: true})
    const log = await open(logPath, 'a+')
    try {
        // Errors of the copy get appended after this position.
        const offset = (await log.stat()).size

        const [executable, ...programArguments] = program
        const child = spawn(executable, [...programArguments, ...argv], {
            detached: true,
            env: environment,
            stdio: ['pipe', 'pipe', log.fd],
            windowsHide: true
        })
        // NOTE: Both are pipes, see "stdio" above.
        const input = child.stdin as Writable
        const output = child.stdout as Readable

        const exitCode = await new Promise<null | number>((resolve, reject) => {
            let received = ''
            child.once('error', reject)
            child.once('exit', (code) => {
                resolve(code ?? 1)
            })
            output.setEncoding('utf-8')
            output.on('data', (chunk: string) => {
                received += chunk
                if (received.includes(READY_SIGNAL))
                    resolve(null)
            })

            // NOTE: The copy may stop before reading anything.
            input.on('error', () => {
                // Reported via its exit.
            })
            input.end(JSON.stringify(Object.fromEntries(
                [...contentKeys].map(([name, key]) =>
                    [name, key.toString('hex')]
                )
            )))
        })

        if (exitCode !== null) {
            const {buffer, bytesRead} = await log.read({
                buffer: Buffer.alloc(64 * 1024), position: offset
            })
            const message = buffer.subarray(0, bytesRead).toString('utf-8')
                .trim()

            throw new BackgroundStartError(
                message || 'Daemon stopped right after starting in the ' +
                `background (exit code ${String(exitCode)}).`,
                exitCode
            )
        }

        output.destroy()
        child.unref()

        return child.pid as number
    } finally {
        await log.close()
    }
}
/**
 * Reads the content keys handed over by "startInBackground".
 * @param input - Standard input of the copy.
 * @returns Content keys by pair name.
 */
export const receiveContentKeys = async (
    input: Readable
): Promise<Map<string, Buffer>> => {
    const chunks: Array<Buffer> = []
    for await (const chunk of input)
        chunks.push(Buffer.from(chunk as Buffer | string))

    const keys = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as
        Record<string, string>

    return new Map(Object.entries(keys).map(([name, key]) =>
        [name, Buffer.from(key, 'hex')]
    ))
}
