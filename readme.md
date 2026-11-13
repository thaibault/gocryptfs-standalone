<!-- !/usr/bin/env markdown
-*- coding: utf-8 -*-
region header
Copyright Torben Sickert (info["~at~"]tsickert.com) 07.11.2026

License
-------

This library written by Torben Sickert stands under a creative commons naming
4.0 international license.
See https://creativecommons.org/licenses/by/4.0/deed.de
endregion -->

<!--|deDE:Projektstatus-->
<!--|frFR:Statut du projet-->
Project status
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

<!--|deDE:Einsatzmöglichkeiten-->
<!--|frFR:Cas d'utilisation-->
Use case
--------

Work with a [gocryptfs](https://github.com/rfjakob/gocryptfs) encrypted
folder (for example synchronized via a cloud service like Google Drive) on
machines where gocryptfs or FUSE can not be installed, e.g. without admin
rights. The tool runs as a single executable on Linux, macOS and Windows and
keeps a decrypted copy in sync with the vault, also in the background.
<!--deDE:
    Arbeiten Sie mit einem durch
    [gocryptfs](https://github.com/rfjakob/gocryptfs)
    verschlüsselten Ordner (zum Beispiel über einen Cloud-Dienst wie Google
    Drive synchronisiert) auf Rechnern, auf denen sich gocryptfs oder FUSE
    nicht installieren lässt, z. B. ohne Administratorrechte. Das Werkzeug
    läuft als einzelne ausführbare Datei unter Linux, macOS und Windows und
    hält eine entschlüsselte Kopie mit dem Tresor synchron, auch im
    Hintergrund.
-->
<!--frFR:
    Travaillez avec un dossier chiffré par
    [gocryptfs](https://github.com/rfjakob/gocryptfs) (par exemple
    synchronisé via un service cloud comme Google Drive) sur des machines où
    gocryptfs ou FUSE ne peuvent pas être installés, par exemple sans droits
    d'administrateur. L'outil fonctionne comme un seul exécutable sous Linux,
    macOS et Windows et maintient une copie déchiffrée synchronisée avec le
    coffre, y compris en arrière-plan.
-->

Only vaults created with `gocryptfs -init -plaintextnames` are supported
(feature flags "HKDF", "GCMIV128" and "PlaintextNames"). Every other vault is
refused so it never gets damaged.
<!--deDE:
    Unterstützt werden nur Tresore, die mit `gocryptfs -init -plaintextnames`
    angelegt wurden (Feature-Flags "HKDF", "GCMIV128" und "PlaintextNames").
    Jeder andere Tresor wird abgelehnt, damit er nie beschädigt wird.
-->
<!--frFR:
    Seuls les coffres créés avec `gocryptfs -init -plaintextnames` sont pris
    en charge (options "HKDF", "GCMIV128" et "PlaintextNames"). Tout autre
    coffre est refusé afin de ne jamais l'endommager.
-->

<div class="wd-table-of-contents">
    <h2 id="content">Content<!--deDE:Inhalt--><!--frFR:Contenu--></h2>
    <!--wd-table-of-contents-->
</div>

Installation
------------

Download the executable of your platform from the
[releases](https://github.com/thaibault/gocryptfs-standalone/releases)
("linux", "macos" or "windows", each for "x64" and "arm64"), unpack it and
run it, no installation or admin rights needed. "SHA256SUMS" lists the
checksums of all archives. The executables are not signed by a registered
developer:
<!--deDE:
    Laden Sie die ausführbare Datei Ihrer Plattform aus den
    [Releases](https://github.com/thaibault/gocryptfs-standalone/releases)
    herunter ("linux", "macos" oder "windows", jeweils für "x64" und
    "arm64"), entpacken Sie sie und starten Sie sie, ohne Installation oder
    Administratorrechte. "SHA256SUMS" enthält die Prüfsummen aller Archive.
    Die ausführbaren Dateien sind nicht von einem registrierten Entwickler
    signiert:
-->
<!--frFR:
    Téléchargez l'exécutable de votre plateforme depuis les
    [releases](https://github.com/thaibault/gocryptfs-standalone/releases)
    ("linux", "macos" ou "windows", chacun pour "x64" et "arm64"),
    décompressez-le et lancez-le, sans installation ni droits
    d'administrateur. "SHA256SUMS" contient les sommes de contrôle de toutes
    les archives. Les exécutables ne sont pas signés par un développeur
    enregistré:
-->

- macOS blocks them at first: remove the quarantine flag with
  `xattr -d com.apple.quarantine gocryptfs-standalone-macos-*` or allow it
  under "System Settings → Privacy & Security".<!--deDE:macOS blockiert sie zunächst: Entfernen Sie das Quarantäne-Attribut mit `xattr -d com.apple.quarantine gocryptfs-standalone-macos-*` oder erlauben Sie sie unter "Systemeinstellungen → Datenschutz & Sicherheit".--><!--frFR:macOS les bloque d'abord: supprimez l'attribut de quarantaine avec `xattr -d com.apple.quarantine gocryptfs-standalone-macos-*` ou autorisez-les dans "Réglages système → Confidentialité et sécurité".-->
- Windows SmartScreen may warn on first start ("More info → Run anyway").<!--deDE:Windows SmartScreen warnt eventuell beim ersten Start ("Weitere Informationen → Trotzdem ausführen").--><!--frFR:Windows SmartScreen peut avertir au premier lancement ("Informations complémentaires → Exécuter quand même").-->
- Linux executables need a glibc based distribution (not Alpine or musl).<!--deDE:Linux-Dateien benötigen eine glibc-basierte Distribution (nicht Alpine oder musl).--><!--frFR:Les exécutables Linux nécessitent une distribution basée sur glibc (pas Alpine ni musl).-->

With Node.js 26 or newer the package also runs directly via
`npx gocryptfs-standalone …`.
<!--deDE:
    Mit Node.js 26 oder neuer läuft das Paket auch direkt über
    `npx gocryptfs-standalone …`.
-->
<!--frFR:
    Avec Node.js 26 ou plus récent, le paquet s'exécute aussi directement
    via `npx gocryptfs-standalone …`.
-->

On Arch Linux the included "PKGBUILD" builds a package via
"makepkg --install", installing "gocryptfs-standalone" into "/usr/bin".
<!--deDE:
    Unter Arch Linux baut das enthaltene "PKGBUILD" über
    "makepkg --install" ein Paket, das "gocryptfs-standalone" nach
    "/usr/bin" installiert.
-->
<!--frFR:
    Sous Arch Linux, le "PKGBUILD" inclus construit un paquet via
    "makepkg --install", qui installe "gocryptfs-standalone" dans
    "/usr/bin".
-->

<!--|deDE:Verwendung-->
<!--|frFR:Utilisation-->
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

"decrypt" and "encrypt" work one way: existing files on the target side get
overwritten, nothing gets deleted. Modification times, permissions and
symbolic links are carried over. Vaults created with "init" can be mounted
with gocryptfs. "--help" lists all options.
<!--deDE:
    "decrypt" und "encrypt" arbeiten in eine Richtung: Vorhandene Dateien auf
    der Zielseite werden überschrieben, nichts wird gelöscht.
    Änderungszeiten, Berechtigungen und symbolische Links werden übernommen.
    Mit "init" angelegte Tresore lassen sich mit gocryptfs einhängen.
    "--help" listet alle Optionen.
-->
<!--frFR:
    "decrypt" et "encrypt" fonctionnent dans un seul sens: les fichiers
    existants côté cible sont écrasés, rien n'est supprimé. Les dates de
    modification, permissions et liens symboliques sont conservés. Les
    coffres créés avec "init" peuvent être montés avec gocryptfs. "--help"
    liste toutes les options.
-->

The vault's configuration file is looked up as "gocryptfs.conf" and then as
".gocryptfs.conf" in the vault folder. "--config &lt;path&gt;" uses one
located elsewhere, like gocryptfs' "-config" option, e.g. to keep it out of
the cloud. Both names are reserved in the vault root and never synchronized.
<!--deDE:
    Die Konfigurationsdatei des Tresors wird als "gocryptfs.conf" und danach
    als ".gocryptfs.conf" im Tresorordner gesucht. "--config &lt;path&gt;"
    verwendet eine an anderer Stelle liegende, wie die Option "-config" von
    gocryptfs, z. B. um sie aus der Cloud herauszuhalten. Beide Namen sind im
    Tresor-Wurzelverzeichnis reserviert und werden nie synchronisiert.
-->
<!--frFR:
    Le fichier de configuration du coffre est recherché sous "gocryptfs.conf"
    puis sous ".gocryptfs.conf" dans le dossier du coffre.
    "--config &lt;path&gt;" en utilise un situé ailleurs, comme l'option
    "-config" de gocryptfs, par exemple pour le garder hors du cloud. Les
    deux noms sont réservés à la racine du coffre et jamais synchronisés.
-->

<!--|deDE:Passwort einzelner Befehle-->
<!--|frFR:Mot de passe des commandes individuelles-->
### Password of single commands

The password is taken from the first available source:
<!--deDE:Das Passwort wird aus der ersten verfügbaren Quelle genommen:-->
<!--frFR:Le mot de passe est pris dans la première source disponible:-->

1. "--passfile &lt;path&gt;": First line of the file.<!--deDE:"--passfile &lt;path&gt;": Erste Zeile der Datei.--><!--frFR:"--passfile &lt;path&gt;": Première ligne du fichier.-->
2. "--extpass &lt;command&gt;": First line of the command's output.<!--deDE:"--extpass &lt;command&gt;": Erste Zeile der Ausgabe des Befehls.--><!--frFR:"--extpass &lt;command&gt;": Première ligne de la sortie de la commande.-->
3. Environment variable "GOCRYPTFS_PASSWORD".<!--deDE:Umgebungsvariable "GOCRYPTFS_PASSWORD".--><!--frFR:Variable d'environnement "GOCRYPTFS_PASSWORD".-->
4. Interactive prompt.<!--deDE:Interaktive Abfrage.--><!--frFR:Saisie interactive.-->

"--masterkey &lt;hex&gt;" unlocks the vault with its master key instead. A
given master key is checked against existing vault content before anything
gets encrypted with it.
<!--deDE:
    "--masterkey &lt;hex&gt;" entsperrt den Tresor stattdessen mit seinem
    Hauptschlüssel. Ein angegebener Hauptschlüssel wird an vorhandenem
    Tresorinhalt geprüft, bevor damit etwas verschlüsselt wird.
-->
<!--frFR:
    "--masterkey &lt;hex&gt;" déverrouille plutôt le coffre avec sa clé
    maîtresse. Une clé maîtresse indiquée est vérifiée sur le contenu
    existant du coffre avant que quoi que ce soit ne soit chiffré avec elle.
-->

<!--|deDE:Synchronisation-->
<!--|frFR:Synchronisation-->
Synchronization
---------------

"sync" keeps a plaintext folder and a vault in sync in both directions. After
each run the state of both sides is remembered in the user's configuration
folder ("%APPDATA%\gocryptfs-standalone" on Windows,
"$XDG_CONFIG_HOME/gocryptfs-standalone" or "~/.config/gocryptfs-standalone"
elsewhere). Compared to that state:
<!--deDE:
    "sync" hält einen Klartextordner und einen Tresor in beide Richtungen
    synchron. Nach jedem Lauf wird der Zustand beider Seiten im
    Konfigurationsordner des Benutzers gespeichert
    ("%APPDATA%\gocryptfs-standalone" unter Windows, sonst
    "$XDG_CONFIG_HOME/gocryptfs-standalone" oder
    "~/.config/gocryptfs-standalone"). Verglichen mit diesem Zustand:
-->
<!--frFR:
    "sync" synchronise un dossier en clair et un coffre dans les deux sens.
    Après chaque exécution, l'état des deux côtés est mémorisé dans le
    dossier de configuration de l'utilisateur
    ("%APPDATA%\gocryptfs-standalone" sous Windows, ailleurs
    "$XDG_CONFIG_HOME/gocryptfs-standalone" ou
    "~/.config/gocryptfs-standalone"). Par rapport à cet état:
-->

- Changed or new in the plaintext folder: encrypted into the vault.<!--deDE:Im Klartextordner geändert oder neu: wird in den Tresor verschlüsselt.--><!--frFR:Modifié ou nouveau dans le dossier en clair: chiffré dans le coffre.-->
- Changed or new in the vault: decrypted into the plaintext folder.<!--deDE:Im Tresor geändert oder neu: wird in den Klartextordner entschlüsselt.--><!--frFR:Modifié ou nouveau dans le coffre: déchiffré dans le dossier en clair.-->
- Deleted on one side and unchanged on the other: the other version is
  moved into the trash.<!--deDE:Auf einer Seite gelöscht und auf der anderen unverändert: Die andere Version wird in den Papierkorb verschoben.--><!--frFR:Supprimé d'un côté et inchangé de l'autre: l'autre version est déplacée dans la corbeille.-->
- Deleted on one side and changed on the other: the change wins and is
  copied again.<!--deDE:Auf einer Seite gelöscht und auf der anderen geändert: Die Änderung gewinnt und wird erneut kopiert.--><!--frFR:Supprimé d'un côté et modifié de l'autre: la modification l'emporte et est recopiée.-->
- Changed on both sides: the newer version wins, the older one is kept as
  "name (conflict &lt;host&gt; &lt;date&gt;).ext" on both sides.<!--deDE:Auf beiden Seiten geändert: Die neuere Version gewinnt, die ältere bleibt auf beiden Seiten als "name (conflict &lt;host&gt; &lt;date&gt;).ext" erhalten.--><!--frFR:Modifié des deux côtés: la version la plus récente l'emporte, l'ancienne est conservée des deux côtés sous "name (conflict &lt;host&gt; &lt;date&gt;).ext".-->

Without a state (first run) both sides get merged, files existing on both
sides are compared by content, and nothing gets deleted. The trash lives next
to the state ("pairs/&lt;id&gt;/trash", vault files stay encrypted there) and
gets purged after 30 days ("--trash-days"). Entries changing while being
synchronized are skipped and retried next time, a lock prevents parallel
runs of the same pair. "--dry-run" only shows what would happen.
<!--deDE:
    Ohne Zustand (erster Lauf) werden beide Seiten zusammengeführt, auf
    beiden Seiten vorhandene Dateien nach Inhalt verglichen, und nichts wird
    gelöscht. Der Papierkorb liegt neben dem Zustand
    ("pairs/&lt;id&gt;/trash", Tresordateien bleiben dort verschlüsselt) und
    wird nach 30 Tagen geleert ("--trash-days"). Einträge, die sich während
    der Synchronisation ändern, werden übersprungen und beim nächsten Mal
    erneut versucht, eine Sperre verhindert parallele Läufe desselben
    Paares. "--dry-run" zeigt nur, was passieren würde.
-->
<!--frFR:
    Sans état (première exécution), les deux côtés sont fusionnés, les
    fichiers présents des deux côtés sont comparés par contenu et rien n'est
    supprimé. La corbeille se trouve à côté de l'état
    ("pairs/&lt;id&gt;/trash", les fichiers du coffre y restent chiffrés) et
    est vidée après 30 jours ("--trash-days"). Les entrées modifiées pendant
    la synchronisation sont ignorées et retentées la fois suivante, un verrou
    empêche les exécutions parallèles d'une même paire. "--dry-run" montre
    seulement ce qui se passerait.
-->

<!--|deDE:Ausschlüsse-->
<!--|frFR:Exclusions-->
### Excludes

"decrypt", "encrypt" and "sync" accept "--exclude &lt;pattern&gt;"
(repeatable). Excluded entries are left alone on both sides as if they did
not exist, excluding something already synchronized never deletes it.
Patterns follow gitignore conventions:
<!--deDE:
    "decrypt", "encrypt" und "sync" akzeptieren "--exclude &lt;pattern&gt;"
    (wiederholbar). Ausgeschlossene Einträge bleiben auf beiden Seiten
    unberührt, als gäbe es sie nicht, das Ausschließen von bereits
    Synchronisiertem löscht nie etwas. Muster folgen den Konventionen von
    gitignore:
-->
<!--frFR:
    "decrypt", "encrypt" et "sync" acceptent "--exclude &lt;pattern&gt;"
    (répétable). Les entrées exclues sont laissées intactes des deux côtés
    comme si elles n'existaient pas, exclure quelque chose de déjà
    synchronisé ne supprime jamais rien. Les motifs suivent les conventions
    de gitignore:
-->

- ".DS_Store", "*.tmp", "~$*": Names at any depth.<!--deDE:".DS_Store", "*.tmp", "~$*": Namen in jeder Tiefe.--><!--frFR:".DS_Store", "*.tmp", "~$*": Noms à n'importe quelle profondeur.-->
- "docs/*.pdf", "docs/**/*.pdf": Paths relative to the root.<!--deDE:"docs/*.pdf", "docs/**/*.pdf": Pfade relativ zur Wurzel.--><!--frFR:"docs/*.pdf", "docs/**/*.pdf": Chemins relatifs à la racine.-->
- "/build": Only in the root.<!--deDE:"/build": Nur in der Wurzel.--><!--frFR:"/build": Seulement à la racine.-->
- "cache/", "node_modules/": Only folders, with all their content.<!--deDE:"cache/", "node_modules/": Nur Ordner, mit ihrem gesamten Inhalt.--><!--frFR:"cache/", "node_modules/": Seulement des dossiers, avec tout leur contenu.-->

Supported globs are "*", "**", "?", "[...]" and "{a,b}". Matching is case
insensitive on macOS and Windows.
<!--deDE:
    Unterstützte Platzhalter sind "*", "**", "?", "[...]" und "{a,b}".
    Unter macOS und Windows wird Groß- und Kleinschreibung ignoriert.
-->
<!--frFR:
    Les jokers pris en charge sont "*", "**", "?", "[...]" et "{a,b}". La
    casse est ignorée sous macOS et Windows.
-->

<!--|deDE:Gespeicherte Paare und Hintergrund-Synchronisation-->
<!--|frFR:Paires enregistrées et synchronisation en arrière-plan-->
Configured pairs and background synchronization
-----------------------------------------------

Pairs of a plaintext folder and a vault can be configured once and then be
synchronized by name, all at once or in the background:
<!--deDE:
    Paare aus Klartextordner und Tresor lassen sich einmal einrichten und
    dann über ihren Namen, alle zusammen oder im Hintergrund
    synchronisieren:
-->
<!--frFR:
    Les paires d'un dossier en clair et d'un coffre peuvent être configurées
    une fois puis synchronisées par leur nom, toutes ensemble ou en
    arrière-plan:
-->

```bash
# Asks for the password, verifies it and stores it in the keychain.
gocryptfs-standalone pair add documents ~/Documents/private ~/GoogleDrive/vault --interval 10m
gocryptfs-standalone pair list
gocryptfs-standalone sync documents        # one pair
gocryptfs-standalone sync                  # all pairs
gocryptfs-standalone daemon                # all pairs on changes and in their intervals
gocryptfs-standalone service install       # start "daemon" after each log in
gocryptfs-standalone service status
gocryptfs-standalone service uninstall
gocryptfs-standalone pair remove documents
```

Everything lives in "configuration.json" inside the configuration folder and
can be edited by hand as well:
<!--deDE:
    Alles steht in "configuration.json" im Konfigurationsordner und lässt
    sich auch von Hand bearbeiten:
-->
<!--frFR:
    Tout se trouve dans "configuration.json" dans le dossier de configuration
    et peut aussi être modifié à la main:
-->

```JSON
{
    "defaults": {
        "excludes": [".DS_Store", "._*", ".~lock.*#", "Thumbs.db", "desktop.ini", "~$*"],
        "interval": "10m",
        "trashDays": 30,
        "watch": true
    },
    "pairs": {
        "documents": {
            "plaintext": "/home/me/Documents/private",
            "vault": "/home/me/GoogleDrive/vault",
            "interval": "5m",
            "excludes": ["*.tmp", "build/"],
            "trashDays": 7,
            "watch": false,
            "password": "keychain",
            "config": "/home/me/vault.conf"
        }
    }
}
```

A pair's excludes are added to the default ones. "config" is only needed for
a configuration file outside of the vault ("pair add --config"). Intervals
take seconds, minutes or hours ("30s", "10m", "2h", at least 10 seconds).
Pairs must not overlap: a folder of one pair must not be located inside one
of another pair. Password sources:
<!--deDE:
    Die Ausschlüsse eines Paares ergänzen die Standardausschlüsse. "config"
    wird nur für eine Konfigurationsdatei außerhalb des Tresors benötigt
    ("pair add --config"). Intervalle nehmen Sekunden, Minuten oder Stunden
    ("30s", "10m", "2h", mindestens 10 Sekunden). Paare dürfen sich nicht
    überschneiden: Ein Ordner eines Paares darf nicht innerhalb eines Ordners
    eines anderen Paares liegen. Passwortquellen:
-->
<!--frFR:
    Les exclusions d'une paire s'ajoutent à celles par défaut. "config"
    n'est nécessaire que pour un fichier de configuration hors du coffre
    ("pair add --config"). Les intervalles acceptent secondes, minutes ou
    heures ("30s", "10m", "2h", au moins 10 secondes). Les paires ne doivent
    pas se chevaucher: un dossier d'une paire ne doit pas se trouver dans un
    dossier d'une autre paire. Sources de mot de passe:
-->

- "keychain" (default of "pair add"): The operating system's credential
  store, see below.<!--deDE:"keychain" (Standard von "pair add"): Der Anmeldedatenspeicher des Betriebssystems, siehe unten.--><!--frFR:"keychain" (par défaut pour "pair add"): Le magasin d'identifiants du système d'exploitation, voir ci-dessous.-->
- "prompt": Asked interactively, once when the daemon starts.<!--deDE:"prompt": Wird interaktiv abgefragt, einmal beim Start des Daemons.--><!--frFR:"prompt": Demandé de façon interactive, une fois au démarrage du démon.-->
- "environment": Environment variable "GOCRYPTFS_PASSWORD".<!--deDE:"environment": Umgebungsvariable "GOCRYPTFS_PASSWORD".--><!--frFR:"environment": Variable d'environnement "GOCRYPTFS_PASSWORD".-->
- {"file": "&lt;path&gt;"}: First line of the file ("pair add --passfile").<!--deDE:{"file": "&lt;path&gt;"}: Erste Zeile der Datei ("pair add --passfile").--><!--frFR:{"file": "&lt;path&gt;"}: Première ligne du fichier ("pair add --passfile").-->
- {"command": "&lt;command line&gt;"}: First line of the output
  ("pair add --extpass").<!--deDE:{"command": "&lt;command line&gt;"}: Erste Zeile der Ausgabe ("pair add --extpass").--><!--frFR:{"command": "&lt;command line&gt;"}: Première ligne de la sortie ("pair add --extpass").-->

Credential stores are used without native modules or admin rights:
<!--deDE:
    Anmeldedatenspeicher werden ohne native Module oder Administratorrechte
    genutzt:
-->
<!--frFR:
    Les magasins d'identifiants sont utilisés sans modules natifs ni droits
    d'administrateur:
-->

- macOS: Login keychain via "security".<!--deDE:macOS: Anmelde-Schlüsselbund über "security".--><!--frFR:macOS: Trousseau de session via "security".-->
- Linux: Secret Service (GNOME Keyring, KWallet, …) via "secret-tool"
  (package "libsecret-tools" or similar).<!--deDE:Linux: Secret Service (GNOME Keyring, KWallet, …) über "secret-tool" (Paket "libsecret-tools" o. ä.).--><!--frFR:Linux: Secret Service (GNOME Keyring, KWallet, …) via "secret-tool" (paquet "libsecret-tools" ou similaire).-->
- Windows: DPAPI via PowerShell. The encrypted password is stored in
  "credentials/&lt;pair&gt;.dpapi" inside the configuration folder and can
  only be decrypted by the same user on the same machine.<!--deDE:Windows: DPAPI über PowerShell. Das verschlüsselte Passwort liegt in "credentials/&lt;pair&gt;.dpapi" im Konfigurationsordner und kann nur vom selben Benutzer auf demselben Rechner entschlüsselt werden.--><!--frFR:Windows: DPAPI via PowerShell. Le mot de passe chiffré est stocké dans "credentials/&lt;pair&gt;.dpapi" dans le dossier de configuration et ne peut être déchiffré que par le même utilisateur sur la même machine.-->

<!--|deDE:Daemon-->
<!--|frFR:Démon-->
### Daemon

The daemon unlocks all vaults on start, so wrong passwords fail early, then
synchronizes every pair right away and afterwards in its interval. Runs never
overlap, failures get retried in the next interval, a run blocked by a
parallel "sync" of the same pair after 10 seconds. Only one daemon watches a
pair at a time, another one stops right away (exit code 4).
<!--deDE:
    Der Daemon entsperrt beim Start alle Tresore, sodass falsche Passwörter
    früh auffallen, synchronisiert dann jedes Paar sofort und danach in
    seinem Intervall. Läufe überschneiden sich nie, Fehlschläge werden im
    nächsten Intervall erneut versucht, ein durch ein paralleles "sync"
    desselben Paares blockierter Lauf nach 10 Sekunden. Nur ein Daemon
    überwacht ein Paar, ein weiterer beendet sich sofort (Exit-Code 4).
-->
<!--frFR:
    Le démon déverrouille tous les coffres au démarrage, de sorte que les
    mauvais mots de passe échouent tôt, puis synchronise chaque paire
    immédiatement et ensuite à son intervalle. Les exécutions ne se
    chevauchent jamais, les échecs sont retentés à l'intervalle suivant, une
    exécution bloquée par un "sync" parallèle de la même paire après 10
    secondes. Un seul démon surveille une paire, un autre s'arrête
    immédiatement (code de sortie 4).
-->

With "watch": true (default) the daemon additionally listens to file system
events of both sides and synchronizes a pair 2 seconds after the last change,
at the latest 30 seconds after the first one while changes keep coming. The
interval stays as fallback, since cloud clients and network or FUSE mounts
often do not report everything. If watching fails (e.g. Linux' inotify limit
"fs.inotify.max_user_watches" is reached) the pair is synchronized in its
interval only and watching is retried every 5 minutes. "--no-watch" disables
watching for "pair add" or a single "daemon" run.
<!--deDE:
    Mit "watch": true (Standard) lauscht der Daemon zusätzlich auf
    Dateisystemereignisse beider Seiten und synchronisiert ein Paar 2
    Sekunden nach der letzten Änderung, spätestens 30 Sekunden nach der
    ersten, solange weitere Änderungen eintreffen. Das Intervall bleibt als
    Rückfallebene, da Cloud-Clients sowie Netzwerk- oder FUSE-Einhängungen
    oft nicht alles melden. Schlägt das Überwachen fehl (z. B. weil unter
    Linux das inotify-Limit "fs.inotify.max_user_watches" erreicht ist),
    wird das Paar nur in seinem Intervall synchronisiert und das Überwachen
    alle 5 Minuten erneut versucht. "--no-watch" deaktiviert das Überwachen
    für "pair add" oder einen einzelnen "daemon"-Lauf.
-->
<!--frFR:
    Avec "watch": true (par défaut), le démon écoute en plus les événements
    du système de fichiers des deux côtés et synchronise une paire 2
    secondes après la dernière modification, au plus tard 30 secondes après
    la première tant que des modifications arrivent. L'intervalle reste une
    solution de repli, car les clients cloud et les montages réseau ou FUSE
    ne signalent souvent pas tout. Si la surveillance échoue (par exemple
    lorsque la limite inotify "fs.inotify.max_user_watches" de Linux est
    atteinte), la paire n'est synchronisée qu'à son intervalle et la
    surveillance est retentée toutes les 5 minutes. "--no-watch" désactive
    la surveillance pour "pair add" ou une seule exécution de "daemon".
-->

"service install" registers the daemon per user, without admin rights:
<!--deDE:
    "service install" richtet den Daemon pro Benutzer ein, ohne
    Administratorrechte:
-->
<!--frFR:
    "service install" enregistre le démon par utilisateur, sans droits
    d'administrateur:
-->

- macOS: launchd agent
  "~/Library/LaunchAgents/com.tsickert.gocryptfs-standalone.plist", logging
  to "daemon.log" in the configuration folder.<!--deDE:macOS: launchd-Agent "~/Library/LaunchAgents/com.tsickert.gocryptfs-standalone.plist", protokolliert nach "daemon.log" im Konfigurationsordner.--><!--frFR:macOS: agent launchd "~/Library/LaunchAgents/com.tsickert.gocryptfs-standalone.plist", journalisant dans "daemon.log" du dossier de configuration.-->
- Linux: systemd user unit
  "~/.config/systemd/user/gocryptfs-standalone.service" (log via
  `journalctl --user -u gocryptfs-standalone`, keep it running while logged
  out with `loginctl enable-linger`).<!--deDE:Linux: systemd-Benutzer-Unit "~/.config/systemd/user/gocryptfs-standalone.service" (Protokoll über `journalctl --user -u gocryptfs-standalone`, läuft nach dem Abmelden weiter mit `loginctl enable-linger`).--><!--frFR:Linux: unité utilisateur systemd "~/.config/systemd/user/gocryptfs-standalone.service" (journal via `journalctl --user -u gocryptfs-standalone`, continue après la déconnexion avec `loginctl enable-linger`).-->
- Windows: Command file in the user's startup folder, starting the daemon
  minimized and logging to "daemon.log" in the configuration folder.<!--deDE:Windows: Befehlsdatei im Autostart-Ordner des Benutzers, die den Daemon minimiert startet und nach "daemon.log" im Konfigurationsordner protokolliert.--><!--frFR:Windows: Fichier de commandes dans le dossier de démarrage de l'utilisateur, lançant le démon réduit et journalisant dans "daemon.log" du dossier de configuration.-->

<!--|deDE:Verwandte Projekte-->
<!--|frFR:Projets connexes-->
Related projects
----------------

- [gocryptfs](https://github.com/rfjakob/gocryptfs) defines the on-disk
  format implemented here.<!--deDE:[gocryptfs](https://github.com/rfjakob/gocryptfs) definiert das hier implementierte Speicherformat.--><!--frFR:[gocryptfs](https://github.com/rfjakob/gocryptfs) définit le format sur disque implémenté ici.-->
- [gocryptfs-inspect](https://github.com/slackner/gocryptfs-inspect) and
  [gocryptfs-create-folder](https://github.com/lquenti/gocryptfs-create-folder)
  are Python tools decrypting files and creating vaults without FUSE.<!--deDE:[gocryptfs-inspect](https://github.com/slackner/gocryptfs-inspect) und [gocryptfs-create-folder](https://github.com/lquenti/gocryptfs-create-folder) sind Python-Werkzeuge, die Dateien entschlüsseln bzw. Tresore ohne FUSE anlegen.--><!--frFR:[gocryptfs-inspect](https://github.com/slackner/gocryptfs-inspect) et [gocryptfs-create-folder](https://github.com/lquenti/gocryptfs-create-folder) sont des outils Python qui déchiffrent des fichiers et créent des coffres sans FUSE.-->

<!--|deDE:Entwicklung-->
<!--|frFR:Développement-->
Development
-----------

```bash
yarn install
yarn test
yarn build:standalone
yarn test:standalone
```

"yarn build:standalone" builds the executable of the current platform via
Node.js' single executable applications, "yarn test:standalone" checks it
end to end.
<!--deDE:
    "yarn build:standalone" baut die ausführbare Datei der aktuellen
    Plattform über die Single Executable Applications von Node.js,
    "yarn test:standalone" prüft sie durchgängig.
-->
<!--frFR:
    "yarn build:standalone" construit l'exécutable de la plateforme courante
    via les single executable applications de Node.js,
    "yarn test:standalone" le vérifie de bout en bout.
-->
