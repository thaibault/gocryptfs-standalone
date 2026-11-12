// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module tree */
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
import {randomBytes} from 'crypto'
import {createWriteStream} from 'fs'
import {
    chmod, lstat, mkdir, readdir, readlink, rename, rm, symlink, utimes
} from 'fs/promises'
import {basename, dirname, join, relative, sep} from 'path'
import {Readable} from 'stream'
import {pipeline} from 'stream/promises'

import {CONFIGURATION_FILE_NAMES} from './configuration'
import {decryptFileContent, encryptFileContent} from './content'
import {excludeNothing} from './exclude'
import type {ExcludeMatcher} from './exclude'
import type {TreeResult} from './type'
// endregion
export const TEMPORARY_FILE_PREFIX = '.gocryptfs-standalone-'

type ContentTransformer = (key: Buffer, path: string) => AsyncGenerator<Buffer>
/**
 * Writes given content to a temporary file next to the target and moves it
 * into place afterwards so the target is never observed half written.
 * Modification time and permissions of given source are applied. Sources
 * changing while being read are rejected.
 * @param transform - Content producer (en- or decrypting).
 * @param key - Content key.
 * @param sourcePath - File to read.
 * @param targetPath - File to (over)write.
 * @param beforeCommit - Called right before the target gets replaced, may
 * throw to abort.
 * @returns Promise resolving when the target is in place.
 */
export const transformFile = async (
    transform: ContentTransformer,
    key: Buffer,
    sourcePath: string,
    targetPath: string,
    beforeCommit?: () => Promise<void>
): Promise<void> => {
    const sourceStats = await lstat(sourcePath)
    const temporaryPath = join(
        dirname(targetPath),
        `${TEMPORARY_FILE_PREFIX}${randomBytes(8).toString('hex')}-` +
        basename(targetPath)
    )

    try {
        await pipeline(
            Readable.from(transform(key, sourcePath)),
            createWriteStream(temporaryPath, {mode: 0o600})
        )
        const currentSourceStats = await lstat(sourcePath)
        if (
            currentSourceStats.size !== sourceStats.size ||
            currentSourceStats.mtimeMs !== sourceStats.mtimeMs
        )
            throw new Error(
                'File changed while being processed, it will be retried.'
            )

        await chmod(temporaryPath, sourceStats.mode & 0o777)
        // NOTE: Seconds as number keep sub millisecond precision.
        await utimes(
            temporaryPath,
            sourceStats.atimeMs / 1000,
            sourceStats.mtimeMs / 1000
        )
        await beforeCommit?.()
        await rename(temporaryPath, targetPath)
    } catch (error) {
        await rm(temporaryPath, {force: true})

        throw error
    }
}
/**
 * Decrypts given encrypted file into given target path.
 * @param key - Content key.
 * @param cipherPath - Encrypted file.
 * @param plainPath - Plaintext target file.
 * @returns Promise resolving when the target is in place.
 */
export const decryptFile = (
    key: Buffer, cipherPath: string, plainPath: string
): Promise<void> =>
    transformFile(decryptFileContent, key, cipherPath, plainPath)
/**
 * Encrypts given plaintext file into given target path.
 * @param key - Content key.
 * @param plainPath - Plaintext file.
 * @param cipherPath - Encrypted target file.
 * @returns Promise resolving when the target is in place.
 */
export const encryptFile = (
    key: Buffer, plainPath: string, cipherPath: string
): Promise<void> =>
    transformFile(encryptFileContent, key, plainPath, cipherPath)
/**
 * Decides whether given path relative to the vault root is internal vault
 * data or a leftover of an interrupted run.
 * @param relativePath - Path relative to the vault root.
 * @returns Indicates whether to ignore the path.
 */
export const isInternalPath = (relativePath: string): boolean =>
    CONFIGURATION_FILE_NAMES.includes(relativePath) ||
    isTemporaryPath(relativePath)
/**
 * Decides whether given path is a leftover of an interrupted run.
 * @param path - Path to check.
 * @returns Indicates whether given path is a temporary file.
 */
export const isTemporaryPath = (path: string): boolean =>
    basename(path).startsWith(TEMPORARY_FILE_PREFIX)
/**
 * Recursively mirrors given source directory into given target directory by
 * transforming each file (one way, existing files get overwritten, nothing
 * gets deleted). Modification times and permissions are carried over,
 * symbolic links are copied as they are (plaintext names vaults store link
 * targets unencrypted).
 * @param transform - Transforms one file.
 * @param sourceRoot - Directory to read.
 * @param targetRoot - Directory to write.
 * @param classify - Decides whether to process ("true"), silently ignore
 * ("false") or skip with given reason (string) a relative source path
 * (gets the path and whether it is a directory).
 * @param onProgress - Called with each processed relative path.
 * @returns Statistics and skipped entries.
 */
export const transformTree = async (
    transform: (sourcePath: string, targetPath: string) => Promise<void>,
    sourceRoot: string,
    targetRoot: string,
    classify: (relativePath: string, isDirectory: boolean) => boolean | string,
    onProgress: (relativePath: string) => void = () => {
        // Nothing to report by default.
    }
): Promise<TreeResult> => {
    const result: TreeResult = {
        directories: 0, files: 0, skipped: [], symbolicLinks: 0
    }

    const walk = async (sourceDirectory: string): Promise<void> => {
        const targetDirectory = join(
            targetRoot, relative(sourceRoot, sourceDirectory)
        )
        await mkdir(targetDirectory, {recursive: true})

        for (const entry of await readdir(
            sourceDirectory, {withFileTypes: true}
        )) {
            const sourcePath = join(sourceDirectory, entry.name)
            const relativePath =
                relative(sourceRoot, sourcePath).split(sep).join('/')

            const classification =
                classify(relativePath, entry.isDirectory())
            if (classification === false)
                continue
            if (typeof classification === 'string') {
                result.skipped.push({
                    path: relativePath, reason: classification
                })

                continue
            }

            const targetPath = join(targetDirectory, entry.name)
            onProgress(relativePath)

            try {
                if (entry.isDirectory()) {
                    await walk(sourcePath)
                    result.directories += 1
                } else if (entry.isFile()) {
                    await transform(sourcePath, targetPath)
                    result.files += 1
                } else if (entry.isSymbolicLink()) {
                    await rm(targetPath, {force: true})
                    await symlink(await readlink(sourcePath), targetPath)
                    result.symbolicLinks += 1
                } else
                    result.skipped.push({
                        path: relativePath, reason: 'Unsupported file type.'
                    })
            } catch (error) {
                result.skipped.push({
                    path: relativePath,
                    reason: error instanceof Error ?
                        error.message :
                        String(error)
                })
            }
        }

        const stats = await lstat(sourceDirectory)
        if (sourceDirectory !== sourceRoot)
            await chmod(targetDirectory, stats.mode & 0o777)
        await utimes(
            targetDirectory, stats.atimeMs / 1000, stats.mtimeMs / 1000
        )
    }

    await walk(sourceRoot)

    return result
}
/**
 * Recursively decrypts given vault directory into given plaintext directory.
 * @param key - Content key.
 * @param cipherRoot - Encrypted vault directory.
 * @param plainRoot - Target directory.
 * @param isExcluded - Decides which relative paths to leave out.
 * @param onProgress - Called with each processed relative path.
 * @returns Statistics and skipped entries.
 */
export const decryptTree = (
    key: Buffer,
    cipherRoot: string,
    plainRoot: string,
    isExcluded: ExcludeMatcher = excludeNothing,
    onProgress?: (relativePath: string) => void
): Promise<TreeResult> =>
    transformTree(
        (sourcePath, targetPath) => decryptFile(key, sourcePath, targetPath),
        cipherRoot,
        plainRoot,
        (relativePath, isDirectory) =>
            !isInternalPath(relativePath) &&
            !isExcluded(relativePath, isDirectory),
        onProgress
    )
/**
 * Recursively encrypts given plaintext directory into given vault directory.
 * @param key - Content key.
 * @param plainRoot - Plaintext directory.
 * @param cipherRoot - Encrypted vault directory.
 * @param isExcluded - Decides which relative paths to leave out.
 * @param onProgress - Called with each processed relative path.
 * @returns Statistics and skipped entries.
 */
export const encryptTree = (
    key: Buffer,
    plainRoot: string,
    cipherRoot: string,
    isExcluded: ExcludeMatcher = excludeNothing,
    onProgress?: (relativePath: string) => void
): Promise<TreeResult> =>
    transformTree(
        (sourcePath, targetPath) => encryptFile(key, sourcePath, targetPath),
        plainRoot,
        cipherRoot,
        (relativePath, isDirectory) => {
            if (isExcluded(relativePath, isDirectory))
                return false
            if (CONFIGURATION_FILE_NAMES.includes(relativePath))
                return (
                    `The name "${relativePath}" is reserved in the vault ` +
                    'root.'
                )

            return !isTemporaryPath(relativePath)
        },
        onProgress
    )
/**
 * Finds any non-empty encrypted file in given vault (breadth first).
 * @param cipherRoot - Encrypted vault directory.
 * @returns Path of the first found file or null if there is none.
 */
export const findSampleFile = async (
    cipherRoot: string
): Promise<null | string> => {
    const directories = [cipherRoot]
    for (const directory of directories)
        for (const entry of await readdir(directory, {withFileTypes: true})) {
            const path = join(directory, entry.name)
            if (isInternalPath(relative(cipherRoot, path)))
                continue

            if (entry.isDirectory())
                directories.push(path)
            else if (entry.isFile() && (await lstat(path)).size > 0)
                return path
        }

    return null
}
