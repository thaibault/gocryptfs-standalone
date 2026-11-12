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

import {createExcludeMatcher} from '../exclude'
// endregion
describe('exclude', () => {
    test.each<[string, string, boolean, boolean]>([
        // Names at any depth.
        ['.DS_Store', '.DS_Store', false, true],
        ['.DS_Store', 'a/b/.DS_Store', false, true],
        ['*.tmp', 'a/file.tmp', false, true],
        ['*.tmp', 'a/file.tmp.txt', false, false],
        ['{Thumbs.db,desktop.ini}', 'x/desktop.ini', false, true],
        ['~$*', 'docs/~$report.docx', false, true],
        ['file?.txt', 'file1.txt', false, true],
        ['file[0-9].txt', 'filex.txt', false, false],
        // Paths relative to the root.
        ['docs/*.pdf', 'docs/a.pdf', false, true],
        ['docs/*.pdf', 'other/docs/a.pdf', false, false],
        ['docs/**/*.pdf', 'docs/x/y/a.pdf', false, true],
        ['/build', 'build', true, true],
        ['/build', 'sub/build', true, false],
        // Directories only.
        ['cache/', 'a/cache', true, true],
        ['cache/', 'a/cache', false, false]
    ])('%p matches %p (directory: %p): %p', (
        pattern, path, isDirectory, expected
    ) => {
        expect(createExcludeMatcher([pattern])(path, isDirectory))
            .toStrictEqual(expected)
    })
    test('multiple patterns and invalid ones', () => {
        const isExcluded = createExcludeMatcher(['*.tmp', 'node_modules/'])

        expect(isExcluded('a.tmp', false)).toStrictEqual(true)
        expect(isExcluded('x/node_modules', true)).toStrictEqual(true)
        expect(isExcluded('a.txt', false)).toStrictEqual(false)
        expect(createExcludeMatcher([])('a', false)).toStrictEqual(false)
        expect(() => createExcludeMatcher([' '])).toThrow('Invalid')
        expect(() => createExcludeMatcher(['/'])).toThrow('Invalid')
    })
})
