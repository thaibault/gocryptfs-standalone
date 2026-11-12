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
import {randomBytes} from 'crypto'
import {mkdtemp, readFile, rm, stat, writeFile} from 'fs/promises'
import {tmpdir} from 'os'
import {join} from 'path'

import {afterAll, beforeAll, describe, expect, test} from '@jest/globals'

import {
    CIPHER_BLOCK_SIZE,
    CorruptFileError,
    createHeader,
    decryptBlock,
    decryptFileContent,
    deriveContentKey,
    encryptBlock,
    encryptFileContent,
    getCipherSize,
    getPlainSize,
    HEADER_LENGTH,
    parseHeader,
    PLAIN_BLOCK_SIZE
} from '../content'
import {
    PLAIN_FIXTURE_PATH, VAULT_FIXTURE_MASTER_KEY, VAULT_FIXTURE_PATH
} from '../fixture'
// endregion
const KEY = deriveContentKey(Buffer.from(VAULT_FIXTURE_MASTER_KEY, 'hex'))

const collect = async (blocks: AsyncGenerator<Buffer>): Promise<Buffer> => {
    const result: Array<Buffer> = []
    for await (const block of blocks)
        result.push(block)

    return Buffer.concat(result)
}

describe('content', () => {
    let temporaryDirectory = ''
    beforeAll(async () => {
        temporaryDirectory =
            await mkdtemp(join(tmpdir(), 'gocryptfs-standalone-'))
    })
    afterAll(async () => {
        await rm(temporaryDirectory, {force: true, recursive: true})
    })

    test('encryptBlock / decryptBlock', () => {
        const fileID = randomBytes(16)
        const plaintext = randomBytes(100)
        const ciphertext = encryptBlock(KEY, plaintext, 3, fileID)

        expect(ciphertext).toHaveLength(100 + 32)
        expect(decryptBlock(KEY, ciphertext, 3, fileID))
            .toStrictEqual(plaintext)
        // Blocks are bound to their position and file.
        expect(() => decryptBlock(KEY, ciphertext, 4, fileID))
            .toThrow(CorruptFileError)
        expect(() => decryptBlock(KEY, ciphertext, 3, randomBytes(16)))
            .toThrow(CorruptFileError)

        const tampered = Buffer.from(ciphertext)
        tampered[20] ^= 1
        expect(() => decryptBlock(KEY, tampered, 3, fileID))
            .toThrow('failed authentication')
    })
    test('decryptBlock handles holes and empty blocks', () => {
        expect(decryptBlock(
            KEY, Buffer.alloc(CIPHER_BLOCK_SIZE), 0, randomBytes(16)
        )).toStrictEqual(Buffer.alloc(PLAIN_BLOCK_SIZE))
        expect(decryptBlock(KEY, Buffer.alloc(0), 0, null)).toHaveLength(0)
        expect(() => decryptBlock(KEY, Buffer.alloc(40), 0, null))
            .toThrow('all-zero nonce')
    })
    test('createHeader / parseHeader', () => {
        const header = createHeader()

        expect(header).toHaveLength(HEADER_LENGTH)
        expect(parseHeader(header)).toStrictEqual(header.subarray(2))
        expect(() => parseHeader(Buffer.alloc(HEADER_LENGTH)))
            .toThrow('Unsupported file version 0')
        expect(() => parseHeader(Buffer.from([0, 2, ...Buffer.alloc(16)])))
            .toThrow('all-zero')
        expect(() => parseHeader(Buffer.alloc(3))).toThrow('truncated')
    })
    test.each([
        [0, 0],
        [1, 18 + 1 + 32],
        [4096, 18 + 4128],
        [4097, 18 + 4128 + 1 + 32],
        [3 * 4096 + 123, 18 + 3 * 4128 + 123 + 32]
    ])('sizes: %i plain <-> %i cipher bytes', (plainSize, cipherSize) => {
        expect(getCipherSize(plainSize)).toStrictEqual(cipherSize)
        expect(getPlainSize(cipherSize)).toStrictEqual(plainSize)
    })
    test.each([
        'block-exact.bin',
        'block-plus-one.bin',
        'empty.txt',
        'hello.txt',
        'nested/deeper/multi-block.bin',
        'nested/Ünïcödé name.txt',
        'sparse.bin'
    ])('decryptFileContent of gocryptfs file "%s"', async (path) => {
        const cipherPath = join(VAULT_FIXTURE_PATH, path)
        const expected = await readFile(join(PLAIN_FIXTURE_PATH, path))

        expect(await collect(decryptFileContent(KEY, cipherPath)))
            .toStrictEqual(expected)
        expect(getPlainSize((await stat(cipherPath)).size))
            .toStrictEqual(expected.length)
    })
    test.each([0, 1, 4095, 4096, 4097, 3 * 4096])(
        'encryptFileContent round trip with %i bytes',
        async (size) => {
            const plaintext = randomBytes(size)
            const plainPath = join(temporaryDirectory, `plain-${size}`)
            const cipherPath = join(temporaryDirectory, `cipher-${size}`)
            await writeFile(plainPath, plaintext)

            const ciphertext = await collect(encryptFileContent(KEY, plainPath))
            expect(ciphertext).toHaveLength(getCipherSize(size))

            await writeFile(cipherPath, ciphertext)
            expect(await collect(decryptFileContent(KEY, cipherPath)))
                .toStrictEqual(plaintext)
        }
    )
    test('decryptFileContent detects truncation', async () => {
        const cipherPath = join(temporaryDirectory, 'truncated')
        const ciphertext = await readFile(
            join(VAULT_FIXTURE_PATH, 'block-plus-one.bin')
        )
        await writeFile(cipherPath, ciphertext.subarray(0, -10))

        await expect(collect(decryptFileContent(KEY, cipherPath)))
            .rejects.toThrow(CorruptFileError)
    })
})
