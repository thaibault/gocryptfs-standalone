// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module configuration */
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
import {randomBytes, scrypt as scryptCallback} from 'crypto'
import {mkdir, readdir, readFile, rename, rm, writeFile} from 'fs/promises'
import {join} from 'path'
import {promisify} from 'util'

import {
    decryptBlock, deriveKey, encryptBlock, KEY_LENGTH, KEY_INFORMATION
} from './content'
import type {
    FeatureFlag, RawVaultConfiguration, VaultConfiguration
} from './type'
// endregion
const scrypt = promisify(scryptCallback) as (
    password: Buffer,
    salt: Buffer,
    keyLength: number,
    options: {N: number, r: number, p: number, maxmem: number}
) => Promise<Buffer>

export const CONFIGURATION_FILE_NAME = 'gocryptfs.conf'
export const SUPPORTED_VERSION = 2
/*
    NOTE: Exactly the feature flag set "gocryptfs -init -plaintextnames"
    creates. Everything else is refused so we never damage a vault we do not
    fully understand.
*/
export const REQUIRED_FEATURE_FLAGS: Array<FeatureFlag> =
    ['GCMIV128', 'HKDF', 'PlaintextNames']
export const KNOWN_FEATURE_FLAGS: Array<FeatureFlag> = [
    'AESSIV',
    'DirIV',
    'EMENames',
    'FIDO2',
    'GCMIV128',
    'HKDF',
    'LongNameMax',
    'LongNames',
    'PlaintextNames',
    'Raw64',
    'XChaCha20Poly1305'
]
export const CREATOR = 'gocryptfs-standalone'
// Same default cost gocryptfs uses (N = 2^16, needs 64 MiB of memory).
export const DEFAULT_SCRYPT_LOG_N = 16
// Minimal scrypt parameters gocryptfs accepts.
export const MINIMAL_SCRYPT_LOG_N = 10
const MINIMAL_SCRYPT_R = 8
const MINIMAL_SCRYPT_P = 1
const MINIMAL_SALT_LENGTH = 32

export class UnsupportedVaultError extends Error {
    name = 'UnsupportedVaultError'
}
export class WrongPasswordError extends Error {
    name = 'WrongPasswordError'
}
/**
 * Parses and validates given "gocryptfs.conf" content.
 * @param content - Raw json file content.
 * @returns Parsed configuration.
 */
export const parseConfiguration = (content: string): VaultConfiguration => {
    const raw = JSON.parse(content) as Partial<RawVaultConfiguration>

    if (raw.Version !== SUPPORTED_VERSION)
        throw new UnsupportedVaultError(
            `Unsupported on-disk format version "${String(raw.Version)}" ` +
            `(only version ${String(SUPPORTED_VERSION)} is supported).`
        )

    if (
        !Array.isArray(raw.FeatureFlags) ||
        typeof raw.EncryptedKey !== 'string' ||
        typeof raw.ScryptObject !== 'object'
    )
        throw new UnsupportedVaultError(
            'Configuration file is missing required fields.'
        )

    for (const flag of raw.FeatureFlags)
        if (!KNOWN_FEATURE_FLAGS.includes(flag as FeatureFlag))
            throw new UnsupportedVaultError(
                `Unknown feature flag "${flag}".`
            )

    const featureFlags = raw.FeatureFlags as Array<FeatureFlag>
    const missingFlags = REQUIRED_FEATURE_FLAGS.filter((flag) =>
        !featureFlags.includes(flag)
    )
    const unsupportedFlags = featureFlags.filter((flag) =>
        !REQUIRED_FEATURE_FLAGS.includes(flag)
    )
    if (missingFlags.length > 0 || unsupportedFlags.length > 0)
        throw new UnsupportedVaultError(
            'Only vaults created with "gocryptfs -init -plaintextnames" ' +
            'are supported (feature flags: ' +
            `${REQUIRED_FEATURE_FLAGS.join(', ')}). Given vault ` +
            (missingFlags.length > 0 ?
                `misses: ${missingFlags.join(', ')}` :
                '') +
            (missingFlags.length > 0 && unsupportedFlags.length > 0 ?
                '; ' :
                '') +
            (unsupportedFlags.length > 0 ?
                `additionally uses: ${unsupportedFlags.join(', ')}` :
                '') +
            '.'
        )

    const {KeyLen, N, P, R, Salt} = raw.ScryptObject
    const salt = Buffer.from(Salt, 'base64')
    if (
        !Number.isInteger(N) ||
        N < 2 ** MINIMAL_SCRYPT_LOG_N ||
        R < MINIMAL_SCRYPT_R ||
        P < MINIMAL_SCRYPT_P ||
        KeyLen < KEY_LENGTH ||
        salt.length < MINIMAL_SALT_LENGTH
    )
        throw new UnsupportedVaultError('Invalid scrypt parameters.')

    return {
        creator: raw.Creator ?? '',
        encryptedKey: Buffer.from(raw.EncryptedKey, 'base64'),
        featureFlags,
        scrypt: {keyLength: KeyLen, n: N, p: P, r: R, salt},
        version: raw.Version
    }
}
/**
 * Loads and validates the configuration file of given vault directory.
 * @param vaultPath - Encrypted (cipher) directory.
 * @returns Parsed configuration.
 */
export const loadConfiguration = async (
    vaultPath: string
): Promise<VaultConfiguration> =>
    parseConfiguration(await readFile(
        join(vaultPath, CONFIGURATION_FILE_NAME), {encoding: 'utf-8'}
    ))
/**
 * Derives the key encryption key from given password and scrypt parameters.
 * @param scryptParameters - Parameters as stored in the configuration.
 * @param password - Vault password.
 * @returns Key to wrap the master key with.
 */
export const deriveKeyEncryptionKey = async (
    scryptParameters: VaultConfiguration['scrypt'], password: Buffer
): Promise<Buffer> => {
    const {keyLength, n, p, r, salt} = scryptParameters
    const scryptHash = await scrypt(
        password,
        salt,
        keyLength,
        // NOTE: Node's default limit (32 MiB) is too low for N = 2^16.
        {N: n, maxmem: 256 * n * r + 1024 * 1024, p, r}
    )
    const keyEncryptionKey = deriveKey(scryptHash, KEY_INFORMATION.content)
    scryptHash.fill(0)

    return keyEncryptionKey
}
/**
 * Derives the key encryption key from given password and unwraps the master
 * key with it.
 * @param configuration - Parsed vault configuration.
 * @param password - Vault password.
 * @returns The 32 byte master key.
 */
export const unlockMasterKey = async (
    configuration: VaultConfiguration, password: Buffer
): Promise<Buffer> => {
    const keyEncryptionKey =
        await deriveKeyEncryptionKey(configuration.scrypt, password)

    try {
        // NOTE: The master key is wrapped like block 0 without file id.
        return decryptBlock(
            keyEncryptionKey, configuration.encryptedKey, 0, null
        )
    } catch {
        throw new WrongPasswordError('Password incorrect.')
    } finally {
        keyEncryptionKey.fill(0)
    }
}
/**
 * Parses a master key as printed by "gocryptfs -init" or
 * "gocryptfs-xray -dumpmasterkey" (hex, optionally grouped by dashes).
 * @param value - Master key representation.
 * @returns The 32 byte master key.
 */
export const parseMasterKey = (value: string): Buffer => {
    const hex = value.replace(/[\s-]/g, '')
    if (!/^[0-9a-fA-F]{64}$/.test(hex))
        throw new Error('A master key has to consist of 64 hex digits.')

    return Buffer.from(hex, 'hex')
}
/**
 * Serializes given configuration exactly like gocryptfs does (tab indented
 * json with its field order and a trailing newline).
 * @param configuration - Configuration to serialize.
 * @returns File content.
 */
export const serializeConfiguration = (
    configuration: VaultConfiguration
): string => {
    const raw: RawVaultConfiguration = {
        Creator: configuration.creator,
        EncryptedKey: configuration.encryptedKey.toString('base64'),
        ScryptObject: {
            Salt: configuration.scrypt.salt.toString('base64'),
            N: configuration.scrypt.n,
            R: configuration.scrypt.r,
            P: configuration.scrypt.p,
            KeyLen: configuration.scrypt.keyLength
        },
        Version: configuration.version,
        FeatureFlags: configuration.featureFlags
    }

    return `${JSON.stringify(raw, null, '\t')}\n`
}
/**
 * Creates a new plaintext names vault configuration protecting given (or a
 * new random) master key with given password.
 * @param password - Vault password.
 * @param scryptLogN - Binary logarithm of the scrypt cost parameter N.
 * @param masterKey - Master key to protect, a random one by default.
 * @returns Configuration and its (unprotected) master key.
 */
export const createConfiguration = async (
    password: Buffer,
    scryptLogN: number = DEFAULT_SCRYPT_LOG_N,
    masterKey: Buffer = randomBytes(KEY_LENGTH)
): Promise<{configuration: VaultConfiguration, masterKey: Buffer}> => {
    if (
        !Number.isInteger(scryptLogN) ||
        scryptLogN < MINIMAL_SCRYPT_LOG_N ||
        scryptLogN > 28
    )
        throw new Error(
            'The scrypt cost has to be an integer between ' +
            `${String(MINIMAL_SCRYPT_LOG_N)} and 28.`
        )
    if (password.length === 0)
        throw new Error('Password is empty.')

    const scryptParameters: VaultConfiguration['scrypt'] = {
        keyLength: KEY_LENGTH,
        n: 2 ** scryptLogN,
        p: MINIMAL_SCRYPT_P,
        r: MINIMAL_SCRYPT_R,
        salt: randomBytes(MINIMAL_SALT_LENGTH)
    }
    const keyEncryptionKey =
        await deriveKeyEncryptionKey(scryptParameters, password)
    // NOTE: Same order gocryptfs sets these flags in.
    const featureFlags: Array<FeatureFlag> =
        ['HKDF', 'GCMIV128', 'PlaintextNames']

    const configuration: VaultConfiguration = {
        creator: CREATOR,
        encryptedKey: encryptBlock(keyEncryptionKey, masterKey, 0, null),
        featureFlags,
        scrypt: scryptParameters,
        version: SUPPORTED_VERSION
    }
    keyEncryptionKey.fill(0)

    return {configuration, masterKey}
}
/**
 * Initializes a new plaintext names vault in given (empty or not yet
 * existing) directory.
 * @param vaultPath - Directory to create the vault in.
 * @param password - Vault password.
 * @param scryptLogN - Binary logarithm of the scrypt cost parameter N.
 * @returns The new vault's master key.
 */
export const initializeVault = async (
    vaultPath: string, password: Buffer, scryptLogN?: number
): Promise<Buffer> => {
    await mkdir(vaultPath, {recursive: true})
    if ((await readdir(vaultPath)).length > 0)
        throw new Error(`Directory "${vaultPath}" is not empty.`)

    const {configuration, masterKey} =
        await createConfiguration(password, scryptLogN)

    const filePath = join(vaultPath, CONFIGURATION_FILE_NAME)
    const temporaryFilePath = `${filePath}.tmp`
    try {
        // NOTE: Read only like gocryptfs does, it should never be modified.
        await writeFile(
            temporaryFilePath,
            serializeConfiguration(configuration),
            {flag: 'wx', mode: 0o400}
        )
        await rename(temporaryFilePath, filePath)
    } catch (error) {
        await rm(temporaryFilePath, {force: true})

        throw error
    }

    return masterKey
}
/**
 * Formats given master key like gocryptfs does to make it easier to note
 * down.
 * @param masterKey - Key to format.
 * @returns Dash separated groups of eight hex digits on two lines.
 */
export const formatMasterKey = (masterKey: Buffer): string => {
    const groups = masterKey.toString('hex').match(/.{8}/g) ?? []

    return `${groups.slice(0, 4).join('-')}-\n${groups.slice(4).join('-')}`
}
