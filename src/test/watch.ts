// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]tsickert.com) 09.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {mkdir, mkdtemp, rm, writeFile} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'

import {describe, expect, test} from '@jest/globals'

import {createExcludeMatcher} from '../exclude'
import type {ResolvedPair} from '../settings'
import {TEMPORARY_FILE_PREFIX} from '../tree'
import type {Side} from '../type'
import type {Watcher, WatchDirectory} from '../watch'
import {isRelevantChange, watchDirectory, watchPair} from '../watch'
// endregion
describe('watch', () => {
    const isExcluded = createExcludeMatcher(['*.tmp', 'cache/', '/build'])

    test.each<[null | string, Side, boolean]>([
        [null, 'plain', true],
        ['', 'plain', true],
        ['a.txt', 'plain', true],
        ['docs/a.txt', 'cipher', true],
        [`docs/${TEMPORARY_FILE_PREFIX}1234-a.txt`, 'plain', false],
        ['gocryptfs.conf', 'cipher', false],
        ['.gocryptfs.conf', 'cipher', false],
        // Only reserved in the vault.
        ['gocryptfs.conf', 'plain', true],
        ['docs/gocryptfs.conf', 'cipher', true],
        ['docs/a.tmp', 'plain', false],
        // Everything inside excluded directories.
        ['cache', 'plain', false],
        ['docs/cache/deeper/a.txt', 'cipher', false],
        ['build/a.txt', 'plain', false],
        ['docs/build/a.txt', 'plain', true]
    ])('isRelevantChange(%p, %p) -> %p', (path, side, expected) => {
        expect(isRelevantChange(path, side, isExcluded)).toStrictEqual(expected)
    })
    test('watchPair filters changes of both sides', () => {
        const pair: ResolvedPair = {
            excludes: ['*.tmp'],
            intervalInMilliseconds: 1000,
            name: 'docs',
            password: 'keychain',
            plaintext: '/plain',
            trashDays: 30,
            vault: '/vault',
            watch: true
        }
        const callbacks = new Map<string, (path: null | string) => void>()
        const closed: Array<string> = []
        const errors: Array<Error> = []
        let changes = 0
        const watchFake: WatchDirectory = (path, onChange, onError) => {
            callbacks.set(path, onChange)
            onError(new Error(path))

            return {
                close: () => {
                    closed.push(path)
                }
            }
        }

        const watcher = watchPair(
            pair,
            () => {
                changes += 1
            },
            (error) => errors.push(error),
            watchFake
        )
        expect(errors.map(({message}) => message))
            .toStrictEqual(['/plain', '/vault'])

        callbacks.get('/plain')?.('a.txt')
        callbacks.get('/plain')?.('a.tmp')
        callbacks.get('/vault')?.('gocryptfs.conf')
        callbacks.get('/vault')?.('b.txt')
        expect(changes).toStrictEqual(2)

        watcher.close()
        expect(closed).toStrictEqual(['/plain', '/vault'])

        // A failing side stops the already watched one.
        closed.length = 0
        expect(() => watchPair(pair, () => undefined, () => undefined, (
            path
        ): Watcher => {
            if (path === '/vault')
                throw new Error('No space left.')

            return {
                close: () => {
                    closed.push(path)
                }
            }
        })).toThrow('No space left.')
        expect(closed).toStrictEqual(['/plain'])
    })
    test('watchDirectory reports nested changes', async () => {
        const root = await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
        await mkdir(join(root, 'nested', 'deeper'), {recursive: true})

        const paths: Array<null | string> = []
        let watcher: undefined | Watcher
        try {
            await new Promise<void>((resolve, reject) => {
                const timer = setTimeout(() => {
                    reject(new Error(
                        `No event for the nested file, got: ${paths.join(', ')}`
                    ))
                }, 10000)

                watcher = watchDirectory(
                    root,
                    (path) => {
                        paths.push(path)
                        if (path === 'nested/deeper/a.txt') {
                            clearTimeout(timer)
                            resolve()
                        }
                    },
                    reject
                )
                // NOTE: Some platforms need a moment to set up the watches.
                setTimeout(() => {
                    void writeFile(join(root, 'nested', 'deeper', 'a.txt'), 'a')
                }, 200)
            })
        } finally {
            watcher?.close()
            await rm(root, {force: true, recursive: true})
        }
    })
})
