<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

License
-------

This library written by Torben Sickert stands under a creative commons naming
3.0 unported license. See https://creativecommons.org/licenses/by/3.0/deed.de
endregion -->

Project Status
--------------

[![build](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/build.yaml?style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/build.yaml)
[![check types](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/check-types.yaml?label=check%20types&style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/check-types.yaml)
[![lint](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/lint.yaml?label=lint&style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/lint.yaml)
[![test](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/test-coverage-report.yaml?label=test&style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/test-coverage-report.yaml)
[![gocryptfs compatibility](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/gocryptfs-compatibility.yaml?label=gocryptfs%20compatibility&style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/gocryptfs-compatibility.yaml)

Use case
--------

Work with a [gocryptfs](https://github.com/rfjakob/gocryptfs) encrypted
directory (for example synchronized via a cloud service like Google Drive) on
machines where gocryptfs or a FUSE backend can not be installed (no admin
rights). The tool runs as a standalone executable on Linux, macOS and Windows.

Only vaults created with **`gocryptfs -init -plaintextnames`** are supported
(feature flags `HKDF GCMIV128 PlaintextNames`). Every other vault is refused
so it never gets damaged.

Usage
-----

```bash
gocryptfs-standalone init <vault> [--scryptn 16]
gocryptfs-standalone info <vault>
gocryptfs-standalone cat <vault> <path> > file
gocryptfs-standalone decrypt <vault> <target>
gocryptfs-standalone encrypt <source> <vault>
gocryptfs-standalone sync <plaintext> <vault> [--dry-run] [--trash-days 30]
```

`decrypt`, `encrypt` and `sync` accept `--exclude <pattern>` (repeatable).

`decrypt` and `encrypt` work one way: existing files on the target side get
overwritten, nothing gets deleted. Modification times, permissions and
symbolic links are carried over. Vaults created with `init` can be mounted
with gocryptfs (`-init -plaintextnames` compatible).

### Synchronisation

`sync` keeps a plaintext directory and a vault in sync in both directions.
After each run the state of both sides is remembered (a json file in the
user's configuration directory: `%APPDATA%\gocryptfs-standalone` on Windows,
`$XDG_CONFIG_HOME/gocryptfs-standalone` or `~/.config/gocryptfs-standalone`
elsewhere). Compared to that state:

| Plaintext directory | Vault | Result |
| --- | --- | --- |
| changed / new | unchanged / missing | encrypted into the vault |
| unchanged / missing | changed / new | decrypted into the plaintext directory |
| deleted | unchanged | vault version moved into the trash |
| unchanged | deleted | plaintext version moved into the trash |
| changed | deleted | encrypted again (a change beats a deletion) |
| changed | changed | newer version wins, the older one is kept as `name (conflict <host> <date>).ext` on both sides |

Without a state (first run) both sides get merged, files existing on both
sides are compared by content, and nothing gets deleted. The trash lives
next to the state (`pairs/<id>/trash`, vault files stay encrypted there) and
gets purged after 30 days (`--trash-days`). Entries changing while being synchronized are
skipped and retried next time, a lock prevents parallel runs of the same
pair. `--dry-run` only shows what would happen.

### Excludes

Excluded entries are left alone on both sides, as if they did not exist.
Excluding something already synchronized never deletes it. Patterns follow
gitignore conventions:

| Pattern | Matches |
| --- | --- |
| `.DS_Store`, `*.tmp`, `~$*` | names at any depth |
| `docs/*.pdf`, `docs/**/*.pdf` | paths relative to the root |
| `/build` | only in the root |
| `cache/`, `node_modules/` | only directories (with all their content) |

Supported globs: `*`, `**`, `?`, `[...]` and `{a,b}`. Matching is case
insensitive on macOS and Windows.

### Password

The password is taken from the first available source:

1. `--passfile <path>` (first line of the file)
2. `--extpass <command>` (first line of the command's output)
3. Environment variable `GOCRYPTFS_PASSWORD`
4. Interactive prompt

Alternatively `--masterkey <hex>` unlocks the vault with its master key. A
given master key is checked against existing vault content before anything
gets encrypted with it.

Roadmap
-------

1. **Read only** (done): `info`, `cat`, `decrypt`.
2. **Write** (done): `encrypt` and `init`, verified by mounting the result
   with real gocryptfs and running `gocryptfs -fsck`.
3. **Sync** (done): two-way synchronisation between a vault and a plaintext
   directory.
4. **Automation**: configuration file with multiple vault/directory pairs,
   password from the operating system's credential store, `daemon` mode with
   a configurable interval and per user autostart (no admin rights needed).
5. **Distribution**: standalone executables via Node's single executable
   applications for Linux, macOS and Windows (x64 and arm64).

Related projects
----------------

- [gocryptfs](https://github.com/rfjakob/gocryptfs) defines the on-disk
  format implemented here.
- [gocryptfs-inspect](https://github.com/slackner/gocryptfs-inspect) and
  [gocryptfs-create-folder](https://github.com/lquenti/gocryptfs-create-folder)
  are Python tools decrypting files respectively creating vaults without FUSE.
