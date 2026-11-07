// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module exclude */
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
import {posix} from 'path'
// endregion
export type ExcludeMatcher = (
    relativePath: string, isDirectory: boolean
) => boolean
/**
 * Creates a matcher for gitignore like glob patterns ("*", "**", "?",
 * "[...]" and "{a,b}"):
 *
 * - Patterns without a slash match the name at any depth ("*.tmp").
 * - Patterns containing a slash match the path relative to the root
 *   ("docs/*.pdf"), a leading slash only anchors ("/build").
 * - A trailing slash only matches directories ("cache/").
 *
 * Matching is case insensitive on platforms with case insensitive file
 * systems by default (macOS, Windows).
 * @param patterns - Glob patterns.
 * @returns Function checking a relative posix path.
 */
export const createExcludeMatcher = (
    patterns: Array<string>
): ExcludeMatcher => {
    const rules = patterns.map((pattern) => {
        let glob = pattern.trim()
        if (glob === '' || glob === '/')
            throw new Error(`Invalid exclude pattern "${pattern}".`)

        const directoryOnly = glob.endsWith('/')
        if (directoryOnly)
            glob = glob.slice(0, -1)

        const anchored = glob.startsWith('/') || glob.includes('/')
        if (glob.startsWith('/'))
            glob = glob.slice(1)

        return {anchored, directoryOnly, glob}
    })

    return (relativePath, isDirectory) =>
        rules.some(({anchored, directoryOnly, glob}) =>
            (!directoryOnly || isDirectory) &&
            posix.matchesGlob(
                anchored ? relativePath : posix.basename(relativePath), glob
            )
        )
}
/**
 * Matcher excluding nothing.
 * @returns Always false.
 */
export const excludeNothing: ExcludeMatcher = () => false
