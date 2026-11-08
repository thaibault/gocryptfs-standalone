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

[![npm](https://img.shields.io/npm/v/gocryptfs-standalone?color=%23d55e5d&label=npm%20package%20version&logoColor=%23d55e5d&style=for-the-badge)](https://www.npmjs.com/package/gocryptfs-standalone)
[![npm downloads](https://img.shields.io/npm/dy/gocryptfs-standalone.svg?style=for-the-badge)](https://www.npmjs.com/package/gocryptfs-standalone)

[![build](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/build.yaml?style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/build.yaml)
[![build push package](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/build-package-and-push.yaml?label=build%20push%20package&style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/build-package-and-push.yaml)

[![check types](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/check-types.yaml?label=check%20types&style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/check-types.yaml)
[![lint](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/lint.yaml?label=lint&style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/lint.yaml)
[![test](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/test-coverage-report.yaml?label=test&style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/test-coverage-report.yaml)
[![gocryptfs compatibility](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/gocryptfs-compatibility.yaml?label=gocryptfs%20compatibility&style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/gocryptfs-compatibility.yaml)
[![standalone executables](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/standalone-executables.yaml?label=standalone%20executables&style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/standalone-executables.yaml)

[![code coverage](https://img.shields.io/coverallsCoverage/github/thaibault/gocryptfs-standalone?label=code%20coverage&style=for-the-badge)](https://coveralls.io/github/thaibault/gocryptfs-standalone)

[![deploy web documentation](https://img.shields.io/github/actions/workflow/status/thaibault/gocryptfs-standalone/deploy-web-documentation.yaml?label=deploy%20web%20documentation&style=for-the-badge)](https://github.com/thaibault/gocryptfs-standalone/actions/workflows/deploy-web-documentation.yaml)
[![web documentation](https://img.shields.io/website-up-down-green-red/https/tsickert.com/gocryptfs-standalone.svg?label=web-documentation&style=for-the-badge)](https://tsickert.com/gocryptfs-standalone)

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-blue?style=for-the-badge&logo=codesandbox)](https://githubbox.com/thaibault/gocryptfs-standalone)

Use case
--------

Work with a [gocryptfs](https://github.com/rfjakob/gocryptfs) encrypted
directory (for example synchronized via a cloud service like Google Drive) on
machines where gocryptfs or a FUSE backend can not be installed (no admin
rights). The tool runs as a standalone executable on Linux, macOS and Windows.

Only vaults created with **`gocryptfs -init -plaintextnames`** are supported
(feature flags `HKDF GCMIV128 PlaintextNames`). Every other vault is refused
so it never gets damaged.

Installation
------------

Download the executable of your platform from the
[releases](https://github.com/thaibault/gocryptfs-standalone/releases)
(`linux`, `macos` or `windows`, each for `x64` and `arm64`), unpack it and
run it, no installation or admin rights needed. `SHA256SUMS` lists the
checksums of all archives.

The executables are not signed by a registered developer, so:

- **macOS** blocks downloaded ones at first: remove the quarantine flag with
  `xattr -d com.apple.quarantine gocryptfs-standalone-macos-*` (or allow it
  under "System Settings → Privacy & Security").
- **Windows** SmartScreen may warn on first start ("More info → Run
  anyway").
- **Linux** executables need a glibc based distribution (not Alpine/musl).

With node (26 or newer) the package can be used directly as well:
`npx gocryptfs-standalone …`.

To build the executable of the current platform yourself:
`yarn build:standalone` (and `yarn test:standalone` to check it end to end).

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

The vault's configuration file is looked up as `gocryptfs.conf` and then as
`.gocryptfs.conf` in the vault directory (`init` creates `gocryptfs.conf`).
Every command accepts `--config <path>` to use a configuration file located
elsewhere, like gocryptfs' `-config` option (for example to keep it out of
the cloud). Both names are reserved in the vault root and never synchronized.

`decrypt` and `encrypt` work one way: existing files on the target side get
overwritten, nothing gets deleted. Modification times, permissions and
symbolic links are carried over. Vaults created with `init` can be mounted
with gocryptfs (`-init -plaintextnames` compatible).

### Synchronization

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

### Configured pairs and background synchronization

Pairs of a plaintext directory and a vault can be configured once and then
be synchronized by name, all at once or periodically in the background:

```bash
# Asks for the password, verifies it and stores it in the keychain.
gocryptfs-standalone pair add documents ~/Documents/private ~/GoogleDrive/vault --interval 10m
gocryptfs-standalone pair list
gocryptfs-standalone sync documents        # one pair
gocryptfs-standalone sync                  # all pairs
gocryptfs-standalone daemon                # all pairs in their intervals until stopped
gocryptfs-standalone service install       # start "daemon" after each log in
gocryptfs-standalone service status
gocryptfs-standalone service uninstall
gocryptfs-standalone pair remove documents
```

Everything lives in `configuration.json` inside the configuration directory
and can be edited by hand as well:

```json
{
    "defaults": {
        "excludes": [".DS_Store", "._*", ".~lock.*#", "Thumbs.db", "desktop.ini", "~$*"],
        "interval": "10m",
        "trashDays": 30
    },
    "pairs": {
        "documents": {
            "plaintext": "/home/me/Documents/private",
            "vault": "/home/me/GoogleDrive/vault",
            "interval": "5m",
            "excludes": ["*.tmp", "build/"],
            "trashDays": 7,
            "password": "keychain",
            "config": "/home/me/vault.conf"
        }
    }
}
```

A pair's excludes are added to the default ones. `config` is optional and
only needed for a configuration file outside of the vault (`pair add
--config`). Intervals take seconds,
minutes or hours (`30s`, `10m`, `2h`, at least 10 seconds). Password sources:

| Source | Meaning |
| --- | --- |
| `"keychain"` (default of `pair add`) | operating system's credential store, see below |
| `"prompt"` | asked interactively (once when the daemon starts) |
| `"environment"` | environment variable `GOCRYPTFS_PASSWORD` |
| `{"file": "<path>"}` | first line of the file (`pair add --passfile`) |
| `{"command": "<command line>"}` | first line of the output (`pair add --extpass`) |

Credential stores used without any native module or admin rights:

- **macOS**: login keychain via `security`
- **Linux**: Secret Service (GNOME Keyring, KWallet, …) via `secret-tool`
  (package `libsecret-tools` or similar)
- **Windows**: DPAPI via PowerShell, the encrypted password is stored in
  `credentials/<pair>.dpapi` inside the configuration directory and can only
  be decrypted by the same user on the same machine

The daemon unlocks all vaults on start (so wrong passwords fail early),
synchronizes every pair right away and afterwards in its interval. Runs never
overlap and failures get retried in the next interval. `service install`
registers it per user:

- **macOS**: launchd agent `~/Library/LaunchAgents/com.tsickert.gocryptfs-standalone.plist`,
  logging to `daemon.log` in the configuration directory
- **Linux**: systemd user unit `~/.config/systemd/user/gocryptfs-standalone.service`
  (log: `journalctl --user -u gocryptfs-standalone`, keep it running while
  logged out with `loginctl enable-linger`)
- **Windows**: command file in the user's startup folder, starting the daemon
  minimized and logging to `daemon.log` in the configuration directory

### Password of single commands

The password is taken from the first available source:

1. `--passfile <path>` (first line of the file)
2. `--extpass <command>` (first line of the command's output)
3. Environment variable `GOCRYPTFS_PASSWORD`
4. Interactive prompt

Alternatively `--masterkey <hex>` unlocks the vault with its master key. A
given master key is checked against existing vault content before anything
gets encrypted with it.

Related projects
----------------

- [gocryptfs](https://github.com/rfjakob/gocryptfs) defines the on-disk
  format implemented here.
- [gocryptfs-inspect](https://github.com/slackner/gocryptfs-inspect) and
  [gocryptfs-create-folder](https://github.com/lquenti/gocryptfs-create-folder)
  are Python tools decrypting files respectively creating vaults without FUSE.
