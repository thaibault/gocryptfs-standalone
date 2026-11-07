// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
'use strict'
/* !
    region header
    Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

    License
    -------

    This library written by Torben Sickert stands under a creative commons
    naming 3.0 unported license.
    See https://creativecommons.org/licenses/by/3.0/deed.de
    endregion
*/
// region imports
import {mkdtemp, readFile, rm, writeFile} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'

import {afterAll, beforeAll, describe, expect, test} from '@jest/globals'

import {
    createSettings,
    DEFAULT_EXCLUDES,
    loadSettings,
    parseInterval,
    resolvePair,
    saveSettings,
    validatePasswordSource
} from '../settings'
import type {Settings} from '../settings'
import {getConfigurationDirectory} from '../state'
// endregion
describe('settings', () => {
    let directory = ''
    beforeAll(async () => {
        directory = await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
    })
    afterAll(async () => {
        await rm(directory, {force: true, recursive: true})
    })

    test.each<[number | string, number]>([
        ['30s', 30000],
        ['10m', 600000],
        ['2h', 7200000],
        ['1.5m', 90000],
        [5, 300000],
        [' 15 ', 900000]
    ])('parseInterval(%p)', (value, expected) => {
        expect(parseInterval(value)).toStrictEqual(expected)
    })
    test.each(['5s', 'abc', '10d', '-1m', ''])(
        'parseInterval(%p) throws', (value) => {
            expect(() => parseInterval(value)).toThrow()
        }
    )
    test('validatePasswordSource', () => {
        for (const value of ['keychain', 'prompt', 'environment'])
            expect(validatePasswordSource(value)).toStrictEqual(value)
        expect(validatePasswordSource({file: '/a'})).toStrictEqual({file: '/a'})
        expect(validatePasswordSource({command: 'pass x'}))
            .toStrictEqual({command: 'pass x'})

        for (const value of [
            'other', {}, {file: ''}, {command: 1}, {command: 'a', file: 'b'}
        ])
            expect(() => validatePasswordSource(value))
                .toThrow('Invalid password source')
    })
    test('resolvePair applies defaults', () => {
        const settings: Settings = {
            ...createSettings(),
            pairs: {
                custom: {
                    excludes: ['*.tmp'],
                    interval: '1h',
                    password: {file: '/password'},
                    plaintext: '/plain',
                    trashDays: 3,
                    vault: '/vault'
                },
                plain: {plaintext: '/a', vault: '/b'}
            }
        }

        expect(resolvePair(settings, 'plain')).toStrictEqual({
            excludes: DEFAULT_EXCLUDES,
            intervalInMilliseconds: 600000,
            name: 'plain',
            password: 'prompt',
            plaintext: '/a',
            trashDays: 30,
            vault: '/b'
        })
        expect(resolvePair(settings, 'custom')).toStrictEqual({
            excludes: [...DEFAULT_EXCLUDES, '*.tmp'],
            intervalInMilliseconds: 3600000,
            name: 'custom',
            password: {file: '/password'},
            plaintext: '/plain',
            trashDays: 3,
            vault: '/vault'
        })
        expect(() => resolvePair(settings, 'missing'))
            .toThrow('Unknown pair "missing" (known: custom, plain).')
    })
    test('loadSettings / saveSettings', async () => {
        const configurationDirectory = join(directory, 'configuration')

        expect(await loadSettings(configurationDirectory))
            .toStrictEqual(createSettings())

        const settings = createSettings()
        settings.pairs.documents = {plaintext: '/a', vault: '/b'}
        await saveSettings(settings, configurationDirectory)
        expect(await loadSettings(configurationDirectory))
            .toStrictEqual(settings)

        // Partially given defaults are completed.
        await writeFile(
            join(configurationDirectory, 'configuration.json'),
            JSON.stringify({defaults: {trashDays: 1}})
        )
        expect((await loadSettings(configurationDirectory)).defaults)
            .toStrictEqual({...createSettings().defaults, trashDays: 1})

        await writeFile(
            join(configurationDirectory, 'configuration.json'), '{broken'
        )
        await expect(loadSettings(configurationDirectory))
            .rejects.toThrow('Invalid json')

        // Invalid pairs are reported on load already.
        await writeFile(
            join(configurationDirectory, 'configuration.json'),
            JSON.stringify({pairs: {x: {interval: '1s', plaintext: 'a', vault: 'b'}}})
        )
        await expect(loadSettings(configurationDirectory))
            .rejects.toThrow('shorter than the minimum')
        expect(await readFile(
            join(configurationDirectory, 'configuration.json'),
            {encoding: 'utf-8'}
        )).toContain('"1s"')
    })
    test('getConfigurationDirectory', () => {
        expect(getConfigurationDirectory({}, 'linux', '/home/u'))
            .toStrictEqual('/home/u/.config/gocryptfs-standalone')
        expect(getConfigurationDirectory(
            {XDG_CONFIG_HOME: '/xdg'}, 'darwin', '/Users/u'
        )).toStrictEqual('/xdg/gocryptfs-standalone')
        expect(getConfigurationDirectory(
            {APPDATA: 'C:/Users/u/AppData/Roaming'}, 'win32', 'C:/Users/u'
        )).toStrictEqual('C:/Users/u/AppData/Roaming/gocryptfs-standalone')
        expect(getConfigurationDirectory(
            {GOCRYPTFS_STANDALONE_CONFIGURATION_DIRECTORY: '/x'}, 'linux', '/'
        )).toStrictEqual('/x')
    })
})
