// #!/usr/bin/env babel-node
// -*- coding: utf-8 -*-
/** @module gocryptfs-standalone */
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
import {run} from './cli'
// endregion
process.exitCode = await run(process.argv.slice(2))
