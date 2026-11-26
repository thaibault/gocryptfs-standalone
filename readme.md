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
gocryptfs-standalone sync <vault> <plaintext> [--dry-run] [--trash-days 30]
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
- Only the change time changed (permissions, extended attributes or an edit
  keeping its modification time): both versions are compared by content and
  only transferred if they differ.<!--deDE:Nur der Änderungszeitpunkt (ctime) hat sich geändert (Berechtigungen, erweiterte Attribute oder eine Änderung, die ihren Modifikationszeitpunkt beibehält): Beide Versionen werden inhaltlich verglichen und nur bei Unterschieden übertragen.--><!--frFR:Seule la date de changement (ctime) a changé (permissions, attributs étendus ou une modification conservant sa date de modification): les deux versions sont comparées par contenu et transférées uniquement si elles diffèrent.-->
- Changed on both sides: the newer version wins, the older one is kept as
  "name (conflict &lt;host&gt; &lt;date&gt;).ext" on both sides.<!--deDE:Auf beiden Seiten geändert: Die neuere Version gewinnt, die ältere bleibt auf beiden Seiten als "name (conflict &lt;host&gt; &lt;date&gt;).ext" erhalten.--><!--frFR:Modifié des deux côtés: la version la plus récente l'emporte, l'ancienne est conservée des deux côtés sous "name (conflict &lt;host&gt; &lt;date&gt;).ext".-->

Without a state (first run) both sides get merged, files existing on both
sides are compared by content, and nothing gets deleted. The trash lives next
to the state ("pairs/&lt;id&gt;/trash", vault files stay encrypted there) and
gets purged after 30 days ("--trash-days"). Entries changing while being
synchronized are skipped and retried next time, a lock prevents parallel
runs of the same pair. "--dry-run" only shows what would happen. A run which
completes but skips or fails on single entries (e.g. sockets, entries of
different types on both sides or files failing to decrypt) returns exit code
26, a run failing as a whole exit code 1.
<!--deDE:
    Ohne Zustand (erster Lauf) werden beide Seiten zusammengeführt, auf
    beiden Seiten vorhandene Dateien nach Inhalt verglichen, und nichts wird
    gelöscht. Der Papierkorb liegt neben dem Zustand
    ("pairs/&lt;id&gt;/trash", Tresordateien bleiben dort verschlüsselt) und
    wird nach 30 Tagen geleert ("--trash-days"). Einträge, die sich während
    der Synchronisation ändern, werden übersprungen und beim nächsten Mal
    erneut versucht, eine Sperre verhindert parallele Läufe desselben
    Paares. "--dry-run" zeigt nur, was passieren würde. Ein Lauf, der
    abgeschlossen wird, aber einzelne Einträge überspringt oder bei ihnen
    scheitert (z. B. Sockets, Einträge unterschiedlichen Typs auf beiden
    Seiten oder nicht entschlüsselbare Dateien), endet mit Exit-Code 26, ein
    insgesamt fehlgeschlagener Lauf mit Exit-Code 1.
-->
<!--frFR:
    Sans état (première exécution), les deux côtés sont fusionnés, les
    fichiers présents des deux côtés sont comparés par contenu et rien n'est
    supprimé. La corbeille se trouve à côté de l'état
    ("pairs/&lt;id&gt;/trash", les fichiers du coffre y restent chiffrés) et
    est vidée après 30 jours ("--trash-days"). Les entrées modifiées pendant
    la synchronisation sont ignorées et retentées la fois suivante, un verrou
    empêche les exécutions parallèles d'une même paire. "--dry-run" montre
    seulement ce qui se passerait. Une exécution qui aboutit mais ignore
    certaines entrées ou échoue sur elles (par exemple des sockets, des
    entrées de types différents des deux côtés ou des fichiers impossibles à
    déchiffrer) se termine avec le code de sortie 26, une exécution échouant
    entièrement avec le code de sortie 1.
-->

Two guards protect against folders which are only temporarily missing:
<!--deDE:Zwei Schutzmechanismen sichern gegen nur vorübergehend fehlende Ordner ab:-->
<!--frFR:Deux protections évitent les dégâts dus à des dossiers absents seulement temporairement:-->

- A completely empty plaintext folder (e.g. an unmounted drive or a RAM disk
  after a reboot) is restored from the vault instead of deleting everything
  there.<!--deDE:Ein vollständig leerer Klartextordner (z. B. ein nicht eingehängtes Laufwerk oder eine RAM-Disk nach einem Neustart) wird aus dem Tresor wiederhergestellt, statt dort alles zu löschen.--><!--frFR:Un dossier en clair entièrement vide (par exemple un disque non monté ou un disque RAM après un redémarrage) est restauré depuis le coffre au lieu de tout y supprimer.-->
- A run is refused without changing anything (exit code 5) if the vault is
  empty although entries were synchronized before, or if more than 10 entries
  and more than 60% ("maxDeletePercent", "--max-delete-percent", 100
  disables it) of all synchronized entries would be deleted in the plaintext
  folder because they are missing in the vault. Typical reasons are a cloud
  client which did not download the vault (completely) yet or a drive which
  is not mounted, later runs continue normally once the vault is complete.
  The daemon logs a refusal once and keeps retrying. If the deletions are
  intended, run "sync --allow-mass-delete" once.<!--deDE:Ein Lauf wird ohne jede Änderung abgelehnt (Exit-Code 5), wenn der Tresor leer ist, obwohl zuvor Einträge synchronisiert wurden, oder wenn mehr als 10 Einträge und mehr als 60 % ("maxDeletePercent", "--max-delete-percent", 100 schaltet es ab) aller synchronisierten Einträge im Klartextordner gelöscht würden, weil sie im Tresor fehlen. Typische Ursachen sind ein Cloud-Client, der den Tresor (noch) nicht vollständig heruntergeladen hat, oder ein nicht eingehängtes Laufwerk; spätere Läufe arbeiten normal weiter, sobald der Tresor vollständig ist. Der Daemon protokolliert eine Ablehnung einmal und versucht es weiter. Sind die Löschungen gewollt, einmal "sync --allow-mass-delete" ausführen.--><!--frFR:Une exécution est refusée sans rien modifier (code de sortie 5) si le coffre est vide alors que des entrées ont été synchronisées auparavant, ou si plus de 10 entrées et plus de 60 % ("maxDeletePercent", "--max-delete-percent", 100 le désactive) de toutes les entrées synchronisées seraient supprimées dans le dossier en clair parce qu'elles manquent dans le coffre. Les causes typiques sont un client cloud qui n'a pas (encore) téléchargé tout le coffre ou un disque non monté; les exécutions suivantes reprennent normalement dès que le coffre est complet. Le démon journalise un refus une fois et continue de réessayer. Si les suppressions sont voulues, exécutez une fois "sync --allow-mass-delete".-->

To empty a pair, delete its content in the vault and run
"sync --allow-mass-delete".
<!--deDE:
    Um ein Paar zu leeren, löscht man den Inhalt im Tresor und führt
    "sync --allow-mass-delete" aus.
-->
<!--frFR:
    Pour vider une paire, supprimez son contenu dans le coffre et exécutez
    "sync --allow-mass-delete".
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
gocryptfs-standalone pair add documents ~/GoogleDrive/vault ~/Documents/private --interval 10m
gocryptfs-standalone pair list
gocryptfs-standalone sync documents        # one pair
gocryptfs-standalone sync                  # all pairs
gocryptfs-standalone daemon                # all pairs on changes and in their intervals
gocryptfs-standalone daemon --run-in-background  # sync once, then continue detached
gocryptfs-standalone daemon --run-in-background --log-file ~/sync.log
gocryptfs-standalone daemon --seal-on-stop # remove the plaintext when stopping
gocryptfs-standalone stop                  # stop daemons of all pairs (or given ones)
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
        "maxDeletePercent": 60,
        "sealOnStop": false,
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
            "sealOnStop": true,
            "maxDeletePercent": 100,
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
  store, see below. "pair add" asks for the password once (or takes
  "GOCRYPTFS_PASSWORD"), verifies it and stores it there, later runs read
  it from there.<!--deDE:"keychain" (Standard von "pair add"): Der Anmeldedatenspeicher des Betriebssystems, siehe unten. "pair add" fragt das Passwort einmal ab (oder nimmt "GOCRYPTFS_PASSWORD"), prüft es und legt es dort ab, spätere Läufe lesen es von dort.--><!--frFR:"keychain" (par défaut pour "pair add"): Le magasin d'identifiants du système d'exploitation, voir ci-dessous. "pair add" demande le mot de passe une fois (ou prend "GOCRYPTFS_PASSWORD"), le vérifie et l'y stocke, les exécutions suivantes l'y lisent.-->
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

"--run-in-background" asks for missing passwords and synchronizes all pairs
once in the foreground. Afterwards the daemon continues as a detached process
logging to "daemon.log" in the configuration folder, the command returns
(exit code 26 if the initial synchronization skipped or failed on single
entries, 5 if it refused a mass deletion, the daemon runs anyway in both
cases; exit code 1 if it failed as a whole, the daemon is not started then).
Unlocked keys are handed over via a pipe, never via arguments or
environment variables. "--log-file &lt;path&gt;" logs into another file
(appended, missing folders are created); it must not be located inside a
watched plaintext folder or vault. The process id is shown on start and stored
in "daemon.lock" of each pair. Useful for log in scripts or terminals without
a service.

"stop" ends the daemons watching given or all configured pairs and waits until
they finished a running synchronization (at most a minute). A daemon still
sealing its pairs after that minute (see below) is reported as such and stops
on its own when done, it keeps its locks until then. A daemon watching
further pairs stops for those as well, including one started by the service
(until the next log in). Only processes identified as daemon of this
application get stopped, so a process id reused after a crash is never hit.
On Windows, where signals end processes immediately, "stop" asks the daemon
via a file "daemon-&lt;process id&gt;.stop" in the configuration folder, which
it checks every second.
<!--deDE:
    "--run-in-background" fragt fehlende Passwörter ab und synchronisiert
    alle Paare einmal im Vordergrund. Danach läuft der Daemon als
    abgekoppelter Prozess weiter und protokolliert nach "daemon.log" im
    Konfigurationsordner, der Befehl kehrt zurück (Exit-Code 26, wenn die
    erste Synchronisation einzelne Einträge übersprungen hat oder bei ihnen
    gescheitert ist, 5, wenn sie eine Massenlöschung abgelehnt hat, der
    Daemon läuft in beiden Fällen trotzdem; Exit-Code 1, wenn sie insgesamt
    gescheitert ist, der Daemon wird dann nicht gestartet). Die
    entsperrten Schlüssel werden über eine Pipe übergeben, nie über
    Argumente oder Umgebungsvariablen. "--log-file &lt;path&gt;" protokolliert
    in eine andere Datei (angehängt, fehlende Ordner werden angelegt); sie
    darf nicht in einem überwachten Klartextordner oder Tresor liegen. Die
    Prozess-ID wird beim Start angezeigt und in "daemon.lock" jedes Paares
    abgelegt. Nützlich für Anmeldeskripte oder Terminals ohne Dienst.

    "stop" beendet die Daemons der angegebenen oder aller eingerichteten
    Paare und wartet, bis sie einen laufenden Abgleich abgeschlossen haben
    (höchstens eine Minute). Ein Daemon, der danach noch seine Paare
    versiegelt (siehe unten), wird als solcher gemeldet und endet von selbst,
    wenn er fertig ist, seine Sperren behält er bis dahin. Ein Daemon, der
    weitere Paare überwacht, endet auch für diese, ebenso ein vom Dienst gestarteter (bis zur nächsten
    Anmeldung). Beendet werden nur Prozesse, die als Daemon dieser Anwendung
    erkannt werden, eine nach einem Absturz neu vergebene Prozess-ID trifft
    also nie einen fremden Prozess. Unter Windows, wo Signale Prozesse sofort
    beenden, bittet "stop" den Daemon über eine Datei
    "daemon-&lt;process id&gt;.stop" im Konfigurationsordner, die er jede
    Sekunde prüft.
-->
<!--frFR:
    "--run-in-background" demande les mots de passe manquants et synchronise
    toutes les paires une fois au premier plan. Ensuite le démon continue en
    tant que processus détaché, journalisant dans "daemon.log" du dossier de
    configuration, et la commande se termine (code de sortie 26 si la
    synchronisation initiale a ignoré certaines entrées ou échoué sur elles,
    5 si elle a refusé une suppression massive, le démon tourne quand même
    dans les deux cas; code de sortie 1 si elle a échoué entièrement, le
    démon n'est alors pas démarré).
    Les clés déverrouillées sont transmises par un tube, jamais par des
    arguments ou des variables d'environnement. L'identifiant du processus
    est affiché au démarrage et stocké dans "daemon.lock" de chaque paire.
    "--log-file &lt;path&gt;" journalise dans un autre fichier (en ajout, les
    dossiers manquants sont créés); il ne doit pas se trouver dans un dossier
    en clair ou un coffre surveillé. Utile pour des scripts de connexion ou
    des terminaux sans service.

    "stop" arrête les démons surveillant les paires indiquées ou toutes les
    paires configurées et attend qu'ils aient terminé une synchronisation en
    cours (une minute au plus). Un démon qui scelle encore ses paires après
    cette minute (voir plus bas) est signalé comme tel et s'arrête de lui-même
    une fois terminé, il garde ses verrous jusque-là. Un démon surveillant
    d'autres paires s'arrête aussi pour celles-ci, y compris celui lancé par le service (jusqu'à la
    prochaine connexion). Seuls les processus identifiés comme démon de cette
    application sont arrêtés, un identifiant de processus réattribué après un
    plantage ne touche donc jamais un processus étranger. Sous Windows, où
    les signaux terminent les processus immédiatement, "stop" demande l'arrêt
    au démon via un fichier "daemon-&lt;process id&gt;.stop" dans le dossier de
    configuration, qu'il vérifie chaque seconde.
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

<!--|deDE:Klartextordner versiegeln-->
<!--|frFR:Sceller le dossier en clair-->
### Sealing the plaintext folder

Unlike a gocryptfs mount the plaintext folder is a real copy on disk, readable
while no daemon runs. With "sealOnStop": true (or "--seal-on-stop" for
"pair add" or a single "daemon" run) the daemon synchronizes such a pair a
last time when it stops ("stop", the service manager, Ctrl+C, SIGTERM) and
removes every plaintext entry the vault holds in exactly that version. The
next start ("daemon" or "sync") restores the folder from the vault.
<!--deDE:
    Anders als bei einer gocryptfs-Einhängung ist der Klartextordner eine
    echte Kopie auf dem Datenträger, lesbar, solange kein Daemon läuft. Mit
    "sealOnStop": true (oder "--seal-on-stop" für "pair add" oder einen
    einzelnen "daemon"-Lauf) synchronisiert der Daemon ein solches Paar beim
    Beenden ("stop", der Dienstverwalter, Strg+C, SIGTERM) ein letztes Mal
    und entfernt jeden Klartexteintrag, den der Tresor in genau dieser
    Version enthält. Der nächste Start ("daemon" oder "sync") stellt den
    Ordner aus dem Tresor wieder her.
-->
<!--frFR:
    Contrairement à un montage gocryptfs, le dossier en clair est une vraie
    copie sur le disque, lisible tant qu'aucun démon ne tourne. Avec
    "sealOnStop": true (ou "--seal-on-stop" pour "pair add" ou une seule
    exécution de "daemon"), le démon synchronise une telle paire une dernière
    fois à son arrêt ("stop", le gestionnaire de services, Ctrl+C, SIGTERM)
    et supprime chaque entrée en clair que le coffre contient exactement dans
    cette version. Le démarrage suivant ("daemon" ou "sync") restaure le
    dossier depuis le coffre.
-->

- Nothing gets lost: entries changed after the last synchronization, not yet
  in the vault, excluded or not synchronizable stay and are logged as "Kept
  plaintext …". The plaintext folder itself stays as well.<!--deDE:Nichts geht verloren: Nach dem letzten Abgleich geänderte, noch nicht im Tresor vorhandene, ausgeschlossene oder nicht synchronisierbare Einträge bleiben und werden als "Kept plaintext …" protokolliert. Der Klartextordner selbst bleibt ebenfalls.--><!--frFR:Rien n'est perdu: les entrées modifiées après la dernière synchronisation, pas encore dans le coffre, exclues ou non synchronisables restent et sont journalisées comme "Kept plaintext …". Le dossier en clair lui-même reste également.-->
- The state of the pair is marked as sealed before the first removal. While
  marked, missing plaintext entries are restored, never deleted in the vault,
  even if the removal got interrupted. Entries still present (or created in
  the meantime) follow the usual rules. The mark is cleared once everything
  is restored without failures.<!--deDE:Der Zustand des Paares wird vor dem ersten Entfernen als versiegelt markiert. Solange die Markierung besteht, werden fehlende Klartexteinträge wiederhergestellt und nie im Tresor gelöscht, auch wenn das Entfernen unterbrochen wurde. Noch vorhandene (oder zwischenzeitlich angelegte) Einträge folgen den üblichen Regeln. Die Markierung verschwindet, sobald alles fehlerfrei wiederhergestellt ist.--><!--frFR:L'état de la paire est marqué comme scellé avant la première suppression. Tant que la marque existe, les entrées en clair manquantes sont restaurées et jamais supprimées dans le coffre, même si la suppression a été interrompue. Les entrées encore présentes (ou créées entre-temps) suivent les règles habituelles. La marque disparaît dès que tout est restauré sans échec.-->
- Every start decrypts the whole vault again, which takes a while for large
  pairs. "sync" restores a sealed pair as well but never seals it.<!--deDE:Jeder Start entschlüsselt den ganzen Tresor erneut, was bei großen Paaren dauert. "sync" stellt ein versiegeltes Paar ebenfalls wieder her, versiegelt es aber nie.--><!--frFR:Chaque démarrage déchiffre à nouveau tout le coffre, ce qui prend du temps pour les grandes paires. "sync" restaure aussi une paire scellée mais ne la scelle jamais.-->

Limits, sealing is no replacement for a real encrypted mount:
<!--deDE:Grenzen, das Versiegeln ersetzt keine echte verschlüsselte Einhängung:-->
<!--frFR:Limites, le scellement ne remplace pas un vrai montage chiffré:-->

- Sealing only happens on a clean stop. After a crash, a power loss, a
  "kill -9" or when the operating system ends the daemon before it finished
  (systemd after 90 seconds, launchd after about 20 seconds) the plaintext
  stays until the next start and stop. "stop" itself never interrupts a
  seal: after a minute it reports that sealing is still running and the
  daemon continues on its own.
  Windows does not tell console programs about log off or shut down, stop the
  daemon before ("gocryptfs-standalone stop"); closing its console window
  leaves a few seconds only.<!--deDE:Versiegelt wird nur bei einem sauberen Beenden. Nach einem Absturz, einem Stromausfall, einem "kill -9" oder wenn das Betriebssystem den Daemon beendet, bevor er fertig ist (systemd nach 90 Sekunden, launchd nach etwa 20 Sekunden), bleibt der Klartext bis zum nächsten Start und Beenden liegen. "stop" selbst unterbricht nie ein Versiegeln: Nach einer Minute meldet es, dass noch versiegelt wird, und der Daemon macht allein weiter. Windows informiert Konsolenprogramme nicht über Abmelden oder Herunterfahren, daher den Daemon vorher beenden ("gocryptfs-standalone stop"); das Schließen seines Konsolenfensters lässt nur wenige Sekunden.--><!--frFR:Le scellement n'a lieu qu'à un arrêt propre. Après un plantage, une coupure de courant, un "kill -9" ou lorsque le système d'exploitation termine le démon avant qu'il ait fini (systemd après 90 secondes, launchd après environ 20 secondes), le texte en clair reste jusqu'au prochain démarrage et arrêt. "stop" lui-même n'interrompt jamais un scellement: après une minute, il signale que le scellement est encore en cours et le démon continue seul. Windows n'informe pas les programmes console de la déconnexion ou de l'arrêt, arrêtez donc le démon avant ("gocryptfs-standalone stop"); fermer sa fenêtre console ne laisse que quelques secondes.-->
- Removing only unlinks files, their content is not wiped from the storage.
  SSDs, copy on write file systems (APFS, btrfs, ZFS), snapshots (e.g. local
  Time Machine snapshots), backups, search indexes, thumbnails and editor
  swap or recovery files can keep copies; overwriting before removing does not
  help reliably there. Full disk encryption (FileVault, BitLocker, LUKS)
  remains the protection against offline access.<!--deDE:Entfernen löst nur die Verknüpfung der Dateien, ihr Inhalt wird nicht vom Datenträger gelöscht. SSDs, Copy-on-Write-Dateisysteme (APFS, btrfs, ZFS), Schnappschüsse (z. B. lokale Time-Machine-Schnappschüsse), Sicherungen, Suchindizes, Vorschaubilder und Auslagerungs- oder Wiederherstellungsdateien von Editoren können Kopien behalten; vorheriges Überschreiben hilft dort nicht zuverlässig. Vollverschlüsselung des Datenträgers (FileVault, BitLocker, LUKS) bleibt der Schutz gegen Zugriff im ausgeschalteten Zustand.--><!--frFR:La suppression ne fait que délier les fichiers, leur contenu n'est pas effacé du support. Les SSD, les systèmes de fichiers copy-on-write (APFS, btrfs, ZFS), les instantanés (par exemple les instantanés locaux de Time Machine), les sauvegardes, les index de recherche, les vignettes et les fichiers d'échange ou de récupération des éditeurs peuvent conserver des copies; écraser avant de supprimer n'y aide pas de façon fiable. Le chiffrement complet du disque (FileVault, BitLocker, LUKS) reste la protection contre l'accès hors ligne.-->
- Plaintext versions moved into the trash (deleted in the vault elsewhere)
  stay readable in "pairs/&lt;id&gt;/trash/&lt;date&gt;/plaintext" for
  "trashDays"; "trashDays": 0 purges them with the next run.<!--deDE:In den Papierkorb verschobene Klartextversionen (anderswo im Tresor gelöscht) bleiben für "trashDays" in "pairs/&lt;id&gt;/trash/&lt;date&gt;/plaintext" lesbar; "trashDays": 0 leert sie beim nächsten Lauf.--><!--frFR:Les versions en clair déplacées dans la corbeille (supprimées ailleurs dans le coffre) restent lisibles dans "pairs/&lt;id&gt;/trash/&lt;date&gt;/plaintext" pendant "trashDays"; "trashDays": 0 les purge à l'exécution suivante.-->
- Programs keeping files open may write them back after their removal (or
  fail to remove them on Windows). Such files stay and get merged on the next
  start.<!--deDE:Programme, die Dateien offen halten, können sie nach dem Entfernen zurückschreiben (oder unter Windows das Entfernen verhindern). Solche Dateien bleiben und werden beim nächsten Start zusammengeführt.--><!--frFR:Les programmes gardant des fichiers ouverts peuvent les réécrire après leur suppression (ou empêcher leur suppression sous Windows). Ces fichiers restent et sont fusionnés au démarrage suivant.-->

The plaintext folder can additionally live on a RAM based file system. Then
it never reaches persistent storage and even a crash or power loss leaves
nothing behind; an empty plaintext folder after a reboot is restored from the
vault, never mistaken for deletions. Changes not synchronized yet get lost
with the RAM content (with "watch" at most 30 seconds of changes, otherwise up
to an interval), the folder's size is limited by memory and swap may still
write memory pages to disk unless it is encrypted:
<!--deDE:
    Der Klartextordner kann zusätzlich auf einem RAM-basierten Dateisystem
    liegen. Dann erreicht er nie dauerhaften Speicher und selbst ein Absturz
    oder Stromausfall hinterlässt nichts; ein nach einem Neustart leerer
    Klartextordner wird aus dem Tresor wiederhergestellt und nie für
    Löschungen gehalten. Noch nicht synchronisierte Änderungen gehen mit dem
    RAM-Inhalt verloren (mit "watch" höchstens 30 Sekunden an Änderungen,
    sonst bis zu einem Intervall), die Größe des Ordners ist durch den
    Arbeitsspeicher begrenzt und eine unverschlüsselte Auslagerung kann
    Speicherseiten dennoch auf den Datenträger schreiben:
-->
<!--frFR:
    Le dossier en clair peut en plus se trouver sur un système de fichiers en
    RAM. Il n'atteint alors jamais le stockage persistant et même un
    plantage ou une coupure de courant ne laisse rien; un dossier en clair
    vide après un redémarrage est restauré depuis le coffre, jamais pris pour
    des suppressions. Les modifications pas encore synchronisées sont perdues
    avec le contenu de la RAM (avec "watch" au plus 30 secondes de
    modifications, sinon jusqu'à un intervalle), la taille du dossier est
    limitée par la mémoire et un espace d'échange non chiffré peut tout de
    même écrire des pages mémoire sur le disque:
-->

```bash
# Linux: per user tmpfs, only accessible by the user, cleared on log out.
gocryptfs-standalone pair add documents ~/GoogleDrive/vault "$XDG_RUNTIME_DIR/documents" --seal-on-stop
# macOS: RAM disk of 1 GiB (2097152 sectors of 512 bytes) until the next reboot.
diskutil erasevolume HFS+ Private "$(hdiutil attach -nomount ram://2097152)"
gocryptfs-standalone pair add documents ~/GoogleDrive/vault /Volumes/Private/documents --seal-on-stop
```

Windows has no built in RAM disk, third party drivers need admin rights. A
RAM disk has to exist before the daemon starts (e.g. created by a log in
script on macOS).
<!--deDE:
    Windows bringt keine RAM-Disk mit, Treiber von Drittanbietern benötigen
    Administratorrechte. Eine RAM-Disk muss vor dem Start des Daemons
    existieren (unter macOS z. B. von einem Anmeldeskript angelegt).
-->
<!--frFR:
    Windows n'a pas de disque RAM intégré, les pilotes tiers nécessitent des
    droits d'administrateur. Un disque RAM doit exister avant le démarrage du
    démon (par exemple créé par un script de connexion sous macOS).
-->

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
