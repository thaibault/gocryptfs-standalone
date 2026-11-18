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
import {mkdtemp, readFile, rm} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'
import {Readable} from 'stream'

import {afterAll, beforeAll, describe, expect, test} from '@jest/globals'

import {
    BackgroundStartError,
    READY_SIGNAL,
    receiveContentKeys,
    startInBackground
} from '../background'
// endregion
describe('background', () => {
    let temporaryDirectory = ''
    beforeAll(async () => {
        temporaryDirectory =
            await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
    })
    afterAll(async () => {
        await rm(temporaryDirectory, {force: true, recursive: true})
    })

    const contentKeys = () => new Map([
        ['docs', Buffer.from('0102ff', 'hex')]
    ])

    test('receiveContentKeys', async () => {
        expect(await receiveContentKeys(Readable.from(['{"docs":', '"0102ff"}'])))
            .toStrictEqual(contentKeys())
    })
    test('startInBackground hands keys over and detaches', async () => {
        const logPath = join(temporaryDirectory, 'nested', 'running.log')
        const resultPath = join(temporaryDirectory, 'received.json')
        // Echoes the received keys and environment, then reports readiness.
        const script = `
            let data = ''
            process.stdin.on('data', (chunk) => { data += chunk })
            process.stdin.on('end', () => {
                require('fs').writeFileSync(${JSON.stringify(resultPath)}, JSON.stringify({
                    argv: process.argv.slice(1),
                    keys: JSON.parse(data),
                    password: process.env.GOCRYPTFS_PASSWORD ?? null
                }))
                console.error('logged')
                process.stdout.write(${JSON.stringify(READY_SIGNAL)})
            })
        `

        const pid = await startInBackground({
            argv: ['daemon', '--background-child'],
            contentKeys: contentKeys(),
            environment: {...process.env, GOCRYPTFS_PASSWORD: 'secret'},
            logPath,
            program: [process.execPath, '-e', script]
        })

        expect(pid).toBeGreaterThan(0)
        expect(JSON.parse(await readFile(resultPath, 'utf-8')))
            .toStrictEqual({
                argv: ['daemon', '--background-child'],
                keys: {docs: '0102ff'},
                password: null
            })
        // NOTE: Standard error of the copy lands in the log file.
        for (let attempt = 0; attempt < 50; attempt += 1) {
            if ((await readFile(logPath, 'utf-8')).includes('logged'))
                break
            await new Promise((resolve) => setTimeout(resolve, 20))
        }
        expect(await readFile(logPath, 'utf-8')).toStrictEqual('logged\n')
    })
    test('startInBackground reports early failures', async () => {
        const logPath = join(temporaryDirectory, 'failing.log')

        const start = startInBackground({
            argv: [],
            contentKeys: contentKeys(),
            logPath,
            program: [
                process.execPath,
                '-e',
                'console.error("Pair is locked."); process.exit(4)'
            ]
        })

        await expect(start).rejects.toThrow(BackgroundStartError)
        await expect(start).rejects.toMatchObject({
            exitCode: 4, message: 'Pair is locked.'
        })
    })
})
