// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module type */
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
export type FeatureFlag =
    'AESSIV' |
    'DirIV' |
    'EMENames' |
    'FIDO2' |
    'GCMIV128' |
    'HKDF' |
    'LongNameMax' |
    'LongNames' |
    'PlaintextNames' |
    'Raw64' |
    'XChaCha20Poly1305'
/**
 * Raw json content of a "gocryptfs.conf" file. Binary values are base64
 * encoded (Go's default json representation of byte slices).
 */
export interface RawVaultConfiguration {
    Creator: string
    EncryptedKey: string
    ScryptObject: {
        Salt: string
        N: number
        R: number
        P: number
        KeyLen: number
    }
    Version: number
    FeatureFlags: Array<string>
    FIDO2?: object
    LongNameMax?: number
}
export interface VaultConfiguration {
    creator: string
    encryptedKey: Buffer
    featureFlags: Array<FeatureFlag>
    scrypt: {
        salt: Buffer
        n: number
        r: number
        p: number
        keyLength: number
    }
    version: number
}

export interface TreeResult {
    directories: number
    files: number
    symbolicLinks: number
    skipped: Array<{path: string, reason: string}>
}
// region synchronization
export type EntryType = 'directory' | 'file' | 'symbolicLink'
// Both sides of a pair: the plaintext directory and the encrypted vault.
export type Side = 'cipher' | 'plain'
/**
 * What is relevant to detect changes of a file system entry. For files on
 * the cipher side the size is the encrypted size.
 */
export interface Snapshot {
    mtimeMs: number
    size: number
    target?: string
    type: EntryType
}
export type Snapshots = Map<string, Snapshot>
// Both sides of an entry as they have been after the last synchronization.
export interface StateEntry {
    cipher: Snapshot
    plain: Snapshot
}
export interface SynchronizationState {
    entries: Record<string, StateEntry>
    plainPath: string
    synchronizedAt: null | string
    vaultPath: string
    version: 1
}

export interface ConflictResolution {
    // Side whose version gets renamed to "conflictPath" (the older one).
    loser: Side
    conflictPath: string
}
export type Action =
    // Copy the entry from given side to the other one.
    {type: 'transfer', path: string, from: Side} |
    {type: 'createDirectory', path: string, side: Side} |
    // Move into the trash, deleted on the other side.
    {type: 'trash', path: string, side: Side} |
    // Remove if empty (its content has been deleted on the other side).
    {type: 'removeDirectory', path: string, side: Side} |
    // Both sides changed differently.
    {type: 'conflict', path: string} & ConflictResolution |
    // Both sides changed, needs a content comparison to decide.
    {type: 'compare', path: string} & ConflictResolution |
    // Both sides are in sync, only the state needs to be updated.
    {type: 'record', path: string} |
    // Gone on both sides, only the state needs to be updated.
    {type: 'forget', path: string} |
    {type: 'skip', path: string, reason: string}

export interface SynchronizationResult {
    actions: Array<Action>
    failed: Array<{path: string, reason: string}>
}
// endregion
