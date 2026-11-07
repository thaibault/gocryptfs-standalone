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
import {join} from 'path'
// endregion
/*
    Fixture vault created with real gocryptfs v2.6.1:

    gocryptfs -init -plaintextnames -scryptn 10 -passfile <(echo test) vault

    and filled through a FUSE mount. "PLAIN_FIXTURE_PATH" holds a copy of
    the mounted (decrypted) view.
*/
export const VAULT_FIXTURE_PATH =
    join(process.cwd(), 'test-fixtures/plaintextnames-vault')
export const PLAIN_FIXTURE_PATH =
    join(process.cwd(), 'test-fixtures/plaintextnames-plain')
export const VAULT_FIXTURE_PASSWORD = 'test'
export const VAULT_FIXTURE_MASTER_KEY =
    'b3ebda842b4858e9290697551743b6611ef8f0abb924fd67c90565a92c673654'
