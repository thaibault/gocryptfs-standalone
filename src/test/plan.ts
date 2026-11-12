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
import {describe, expect, test} from '@jest/globals'

import {getCipherSize} from '../content'
import {createPlan, formatConflictDate, getConflictPath} from '../plan'
import type {Action, Snapshot, StateEntry} from '../type'
// endregion
const DATE = new Date(2026, 10, 7, 13, 4, 5)
const HOST = 'host'

const file = (size: number, mtimeMs: number): Snapshot =>
    ({mtimeMs, size, type: 'file'})
// Cipher counterpart of a plain file snapshot.
const encrypted = (snapshot: Snapshot): Snapshot =>
    ({...snapshot, size: getCipherSize(snapshot.size)})
const directory: Snapshot = {mtimeMs: 0, size: 0, type: 'directory'}
const link = (target: string): Snapshot =>
    ({mtimeMs: 0, size: 0, target, type: 'symbolicLink'})

const synced = (snapshot: Snapshot): StateEntry => ({
    cipher: snapshot.type === 'file' ? encrypted(snapshot) : snapshot,
    plain: snapshot
})

const plan = (
    plain: Record<string, Snapshot>,
    cipher: Record<string, Snapshot>,
    state: Record<string, StateEntry> = {}
): Array<Action> =>
    createPlan(
        new Map(Object.entries(plain)),
        new Map(Object.entries(cipher)),
        state,
        HOST,
        DATE
    )

const OLD = file(10, 1000)
const NEW = file(12, 2000)
const NEWER = file(14, 3000)
const CONFLICT_PATH = 'a (conflict host 2026-11-07 13-04-05).txt'

describe('plan', () => {
    test('formatConflictDate', () => {
        expect(formatConflictDate(DATE)).toStrictEqual('2026-11-07 13-04-05')
    })
    test.each([
        ['a.txt', 'a (conflict host 2026-11-07 13-04-05).txt'],
        ['dir/a.tar.gz', 'dir/a.tar (conflict host 2026-11-07 13-04-05).gz'],
        ['.bashrc', '.bashrc (conflict host 2026-11-07 13-04-05)'],
        ['noextension', 'noextension (conflict host 2026-11-07 13-04-05)']
    ])('getConflictPath(%p)', (path, expected) => {
        expect(getConflictPath(path, HOST, DATE, () => false))
            .toStrictEqual(expected)
    })
    test('getConflictPath avoids taken names', () => {
        expect(getConflictPath(
            'a.txt', HOST, DATE, (path) => !path.endsWith(' 3).txt')
        )).toStrictEqual('a (conflict host 2026-11-07 13-04-05 3).txt')
    })

    describe('without previous state', () => {
        test.each<[
            string,
            Record<string, Snapshot>,
            Record<string, Snapshot>,
            Array<Action>
        ]>([
            [
                'new plain file',
                {'a.txt': OLD},
                {},
                [{type: 'transfer', path: 'a.txt', from: 'plain'}]
            ],
            [
                'new vault file',
                {},
                {'a.txt': encrypted(OLD)},
                [{type: 'transfer', path: 'a.txt', from: 'cipher'}]
            ],
            [
                'new directories',
                {p: directory},
                {c: directory},
                [
                    {type: 'createDirectory', path: 'c', side: 'plain'},
                    {type: 'createDirectory', path: 'p', side: 'cipher'}
                ]
            ],
            [
                'same directory on both sides',
                {d: directory},
                {d: directory},
                [{type: 'record', path: 'd'}]
            ],
            [
                'same sized files need a comparison',
                {'a.txt': OLD},
                {'a.txt': encrypted(file(10, 5000))},
                [{
                    type: 'compare',
                    path: 'a.txt',
                    conflictPath: CONFLICT_PATH,
                    loser: 'plain'
                }]
            ],
            [
                'different sized files conflict directly',
                {'a.txt': NEW},
                {'a.txt': encrypted(OLD)},
                [{
                    type: 'conflict',
                    path: 'a.txt',
                    conflictPath: CONFLICT_PATH,
                    loser: 'cipher'
                }]
            ],
            [
                'equal symbolic links',
                {l: link('a')},
                {l: link('a')},
                [{type: 'record', path: 'l'}]
            ],
            [
                'different types',
                {x: directory},
                {x: encrypted(OLD)},
                [{
                    type: 'skip',
                    path: 'x',
                    reason: 'Type differs: directory in plaintext ' +
                        'directory, file in vault.'
                }]
            ]
        ])('%s', (_, plain, cipher, expected) => {
            expect(plan(plain, cipher)).toStrictEqual(expected)
        })
    })

    describe('with previous state', () => {
        const state = {'a.txt': synced(OLD)}

        test.each<[
            string,
            Record<string, Snapshot>,
            Record<string, Snapshot>,
            Array<Action>
        ]>([
            ['unchanged', {'a.txt': OLD}, {'a.txt': encrypted(OLD)}, []],
            [
                'changed in plaintext directory',
                {'a.txt': NEW},
                {'a.txt': encrypted(OLD)},
                [{type: 'transfer', path: 'a.txt', from: 'plain'}]
            ],
            [
                'changed in vault',
                {'a.txt': OLD},
                {'a.txt': encrypted(NEW)},
                [{type: 'transfer', path: 'a.txt', from: 'cipher'}]
            ],
            [
                // An older modification time is still a change.
                'restored from backup in plaintext directory',
                {'a.txt': file(10, 500)},
                {'a.txt': encrypted(OLD)},
                [{type: 'transfer', path: 'a.txt', from: 'plain'}]
            ],
            [
                'deleted in plaintext directory',
                {},
                {'a.txt': encrypted(OLD)},
                [{type: 'trash', path: 'a.txt', side: 'cipher'}]
            ],
            [
                'deleted in vault',
                {'a.txt': OLD},
                {},
                [{type: 'trash', path: 'a.txt', side: 'plain'}]
            ],
            [
                'deleted in vault but changed in plaintext directory',
                {'a.txt': NEW},
                {},
                [{type: 'transfer', path: 'a.txt', from: 'plain'}]
            ],
            [
                'deleted in plaintext directory but changed in vault',
                {},
                {'a.txt': encrypted(NEW)},
                [{type: 'transfer', path: 'a.txt', from: 'cipher'}]
            ],
            ['deleted on both sides', {}, {}, [{type: 'forget', path: 'a.txt'}]],
            [
                'changed on both sides, vault newer',
                {'a.txt': NEW},
                {'a.txt': encrypted(NEWER)},
                [{
                    type: 'conflict',
                    path: 'a.txt',
                    conflictPath: CONFLICT_PATH,
                    loser: 'plain'
                }]
            ],
            [
                'changed on both sides to the same size',
                {'a.txt': NEW},
                {'a.txt': encrypted(file(12, 2500))},
                [{
                    type: 'compare',
                    path: 'a.txt',
                    conflictPath: CONFLICT_PATH,
                    loser: 'plain'
                }]
            ]
        ])('%s', (_, plain, cipher, expected) => {
            expect(plan(plain, cipher, state)).toStrictEqual(expected)
        })

        test('deleted directory with content', () => {
            expect(plan(
                {},
                {d: directory, 'd/e': directory, 'd/e/a': encrypted(OLD)},
                {d: synced(directory), 'd/e': synced(directory), 'd/e/a': synced(OLD)}
            )).toStrictEqual([
                {type: 'trash', path: 'd/e/a', side: 'cipher'},
                // Nested directories first.
                {type: 'removeDirectory', path: 'd/e', side: 'cipher'},
                {type: 'removeDirectory', path: 'd', side: 'cipher'}
            ])
        })
        test('symbolic link changed in vault', () => {
            expect(plan({l: link('a')}, {l: link('b')}, {l: synced(link('a'))}))
                .toStrictEqual([{type: 'transfer', path: 'l', from: 'cipher'}])
        })
        test('deletions are applied before transfers', () => {
            expect(plan(
                {'b.txt': OLD},
                {'a.txt': encrypted(OLD)},
                {'a.txt': synced(OLD)}
            ).map(({type}) => type)).toStrictEqual(['trash', 'transfer'])
        })
    })
})
