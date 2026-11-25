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
    naming 4.0 international license.
    See https://creativecommons.org/licenses/by/4.0/deed.de
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
 * A file system change reported for one side. The relative posix path is
 * null or empty if it is unknown (could be anything).
 */
export interface Change {
    path: null | string
    side: Side
}
/**
 * What is relevant to detect changes of a file system entry. For files on
 * the cipher side the size is the encrypted size.
 */
export interface Snapshot {
    /*
        NOTE: Changes with every content or meta data modification and can
        not be set back (unlike the modification time).
    */
    ctimeMs: number
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
/**
 * Whether the plaintext directory has been removed after synchronizing (see
 * "seal" in the "synchronize" module). The state "sealing" means the removal
 * started but did not finish (interrupted by a crash for instance),
 * "sealed" that it finished. In both cases missing plaintext entries are
 * not deleted but not restored yet, the next synchronization restores them
 * from the vault.
 */
export type SealState = 'sealed' | 'sealing'
export interface SynchronizationState {
    entries: Record<string, StateEntry>
    plainPath: string
    // Not set while the plaintext directory is fully available.
    seal?: SealState
    synchronizedAt: null | string
    vaultPath: string
    /*
        NOTE: Version 2 introduced "seal", older versions of this application
        refuse it and merge both sides without deleting anything instead of
        mistaking a sealed plaintext directory for deletions.
    */
    version: 2
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
    // Only the change time changed on given side, transfer if content differs.
    {type: 'verify', path: string, from: Side} |
    // Both sides are in sync, only the state needs to be updated.
    {type: 'record', path: string} |
    // Gone on both sides, only the state needs to be updated.
    {type: 'forget', path: string} |
    {type: 'skip', path: string, reason: string}

export interface SealResult {
    // Plaintext entries kept since the vault does not hold them (yet).
    kept: Array<{path: string, reason: string}>
    removed: number
}
export interface SynchronizationResult {
    actions: Array<Action>
    failed: Array<{path: string, reason: string}>
    // Set if sealing was requested (and no dry run).
    seal?: SealResult
    // Plaintext directory has been restored completely after a seal.
    unsealed?: boolean
}
// endregion
