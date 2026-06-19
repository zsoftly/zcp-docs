---
title: CLI et fonctionnalités avancées
sidebar_position: 4
---

Le CLI `zcp` gère le stockage objet de bout en bout. Le cycle de vie de l'instance (création,
redimensionnement, suppression, identifiants) et la **création/liste des compartiments** passent par
le plan de contrôle ZSoftly ; tout ce qui concerne le **niveau compartiment et objet** est effectué
directement contre le point de terminaison S3 (`https://objects.<région>.zcp.zsoftly.ca`) au moyen
des clés d'accès/secrètes de votre instance, que le CLI récupère pour vous.

Résultat : le CLI expose l'ensemble des fonctionnalités S3 de la plateforme — y compris de
nombreuses capacités **non disponibles dans l'interface du portail** (règles de cycle de vie, CORS,
politiques de compartiment, chiffrement par défaut, étiquettes, URL pré-signées, copie/déplacement
côté serveur, flux de gestion des versions d'objets et nettoyage des téléversements multiparties).

Installez et configurez d'abord le CLI — voir [Installation](/fr/public-cloud/cli/installation) et
[Configuration](/fr/public-cloud/cli/configuration). Le fournisseur infonuagique pour le stockage
objet est sélectionné automatiquement ; vous choisissez seulement une **région** et un **projet**.

## Où chaque fonctionnalité est disponible

| Capacité                                                        | Portail | CLI `zcp` | API / SDK S3 |
| --------------------------------------------------------------- | :-----: | :-------: | :----------: |
| Créer / lister / redimensionner / supprimer une instance        |   ✅    |    ✅     |      —       |
| Afficher la clé d'accès et la clé secrète S3                    |   ✅    |    ✅     |      —       |
| Bascule de mise à l'échelle automatique                         |   ✅    |     —     |      —       |
| Créer / lister / supprimer un compartiment                      |   ✅    |    ✅     |      ✅      |
| Téléverser / télécharger / supprimer des objets                 |   ✅    |    ✅     |      ✅      |
| Dossiers (préfixes de clé)                                      |   ✅    |    ✅     |      ✅      |
| Rendre un compartiment public                                   |   ✅    |    ✅     |      ✅      |
| Gestion des versions : activer / suspendre / état               |   ✅    |    ✅     |      ✅      |
| **Verrou d'objet (WORM) à la création du compartiment**         |   ✅    |  prévu¹   |      ✅      |
| **Lister / télécharger / supprimer / restaurer des _versions_** |    —    |    ✅     |      ✅      |
| **URL de téléchargement pré-signée** (`object url`)             |    —    |    ✅     |      ✅      |
| **URL de téléversement pré-signée** (`object put-url`)          |    —    |    ✅     |      ✅      |
| **Copie / déplacement côté serveur**                            |    —    |    ✅     |      ✅      |
| **Stat d'objet** (HEAD : taille, type, ETag, métadonnées)       |    —    |    ✅     |      ✅      |
| **Type de contenu et métadonnées au téléversement**             |    —    |    ✅     |      ✅      |
| **Étiquettes de compartiment et d'objet**                       |    —    |    ✅     |      ✅      |
| **Chiffrement par défaut (SSE-S3)**                             |    —    |    ✅     |      ✅      |
| **Politique de compartiment brute** (get/set/delete)            |    —    |    ✅     |      ✅      |
| **Règles de cycle de vie / d'expiration**                       |    —    |    ✅     |      ✅      |
| **Règles CORS**                                                 |    —    |    ✅     |      ✅      |
| **Nettoyage des téléversements multiparties incomplets**        |    —    |    ✅     |      ✅      |
| **Vider un compartiment / purger toutes les versions**          |    —    |    ✅     |      ✅      |

¹ Le verrou d'objet ne peut être activé qu'à la création d'un compartiment. Le portail le prend en
charge dès aujourd'hui ; la prise en charge dans le CLI est prévue (voir la note en fin de page).
Vous pouvez aussi l'activer directement contre le point de terminaison S3 avec un SDK lors de la
création du compartiment.

Tout ce qui est marqué **CLI / API S3 seulement** est aussi accessible via n'importe quel SDK
compatible S3 — voir [Utilisation de l'API S3](/fr/public-cloud/storage/object-storage/s3-usage)
pour des exemples par langage.

## Référence des commandes

`<storage>` est l'identifiant (slug) de l'instance de stockage objet, `<bucket>` celui d'un
compartiment, `<key>` la clé d'un objet. Ajoutez `-o json` (ou `-o yaml`) à n'importe quelle
commande pour une sortie lisible par machine, et `-y` pour ignorer les invites de confirmation.

:::note

Les commandes de stockage objet exigent une **région** et un **projet**. Le stockage objet utilise
ses propres régions : `os-yul` / `os-yow` (et non les régions de calcul `yul-1`/`yow-1`).
Définissez-les avec `--region`/`--project`, `ZCP_REGION`/`ZCP_PROJECT`, ou une valeur par défaut du
profil (`zcp profile add`). Par exemple : `export ZCP_REGION=os-yow ZCP_PROJECT=default-9` avant les
commandes ci-dessous.

:::

### Instance

```bash
zcp object-storage list                       # lister les instances
zcp object-storage get <storage>              # détails + point de terminaison S3 + clés
zcp object-storage credentials <storage>      # clé d'accès + clé secrète S3 uniquement
zcp object-storage resize <storage> --size 200
zcp object-storage delete <storage> -y

# Créer — choisissez une région de stockage objet (os-yul / os-yow) et un plan
zcp plan object-storage                        # lister les plans + tailles + prix
zcp object-storage create \
  --name my-store --project default \
  --region os-yow --billing-cycle hourly --plan o2100g
```

| Option (`create`)    | Description                                                                      |
| -------------------- | -------------------------------------------------------------------------------- |
| `--name`             | Nom de l'instance (requis)                                                       |
| `--region`           | Région de stockage objet : `os-yul` ou `os-yow` (requis)                         |
| `--billing-cycle`    | p. ex. `hourly`, `monthly` (requis)                                              |
| `--project`          | Identifiant de projet (ou `ZCP_PROJECT`)                                         |
| `--plan`             | Plan issu de `zcp plan object-storage` (la catégorie de stockage en est déduite) |
| `--storage-gb`       | Taille personnalisée en Go (alternative à `--plan` ; min. 60)                    |
| `--storage-category` | Remplacer la catégorie de stockage (rarement nécessaire)                         |

### Compartiment

```bash
zcp object-storage bucket list <storage>
zcp object-storage bucket get <storage> <bucket>
zcp object-storage bucket create <storage> --name my-bucket
zcp object-storage bucket empty <storage> <bucket> -y           # supprimer objets + versions
zcp object-storage bucket delete <storage> <bucket> --purge -y  # --purge purge d'abord les versions

# Public / privé (applique une politique de compartiment S3)
zcp object-storage bucket set-acl <storage> <bucket> --acl public-read
zcp object-storage bucket set-acl <storage> <bucket> --acl private

# Gestion des versions
zcp object-storage bucket versioning enable  <storage> <bucket>
zcp object-storage bucket versioning suspend <storage> <bucket>
zcp object-storage bucket versioning status  <storage> <bucket>

# Politique de compartiment S3 brute (accès fin)
zcp object-storage bucket policy get    <storage> <bucket>            # -o yaml pris en charge
zcp object-storage bucket policy set    <storage> <bucket> --file policy.json
zcp object-storage bucket policy delete <storage> <bucket>

# Étiquettes
zcp object-storage bucket tag set    <storage> <bucket> --tag env=prod --tag team=data
zcp object-storage bucket tag get    <storage> <bucket>
zcp object-storage bucket tag delete <storage> <bucket>

# Chiffrement par défaut (SSE-S3)
zcp object-storage bucket encryption enable  <storage> <bucket>
zcp object-storage bucket encryption status  <storage> <bucket>
zcp object-storage bucket encryption disable <storage> <bucket>

# Cycle de vie (expiration automatique)
zcp object-storage bucket lifecycle expire <storage> <bucket> --days 30 [--prefix logs/]
zcp object-storage bucket lifecycle expire <storage> <bucket> --noncurrent-days 7 --abort-multipart-days 3
zcp object-storage bucket lifecycle get    <storage> <bucket>          # -o yaml pris en charge
zcp object-storage bucket lifecycle delete <storage> <bucket>

# CORS (applications web)
zcp object-storage bucket cors set    <storage> <bucket> --origin '*' --method GET --method PUT --max-age 3600
zcp object-storage bucket cors get    <storage> <bucket>
zcp object-storage bucket cors delete <storage> <bucket>

# Téléversements multiparties incomplets (espace occupé par des téléversements échoués)
zcp object-storage bucket uploads list  <storage> <bucket>
zcp object-storage bucket uploads abort <storage> <bucket> <key>
```

Valeurs de `set-acl` : `private`, `public-read`, `public-read-write`. Le cycle de vie accepte
`--days` (versions courantes), `--noncurrent-days` (anciennes versions) et `--abort-multipart-days`
; combinez avec `--prefix` pour limiter à un préfixe de clé.

### Objet

```bash
zcp object-storage object list  <storage> <bucket>
zcp object-storage object stat  <storage> <bucket> <key>          # taille, type, ETag, métadonnées
zcp object-storage object put   <storage> <bucket> ./file.bin --key data/file.bin \
    --content-type application/octet-stream --metadata owner=alice
zcp object-storage object download <storage> <bucket> <key> --dest ./file.bin
zcp object-storage object delete   <storage> <bucket> <key> -y

# URL partageables (aucun identifiant requis du côté du destinataire)
zcp object-storage object url     <storage> <bucket> <key> --expires 24h   # lien de téléchargement
zcp object-storage object put-url <storage> <bucket> <key> --expires 30m   # lien de téléversement (curl -T)

# Copie / déplacement côté serveur (sans aller-retour télécharger/téléverser)
zcp object-storage object copy <storage> <src-bucket> <src-key> <dst-bucket> <dst-key>
zcp object-storage object move <storage> <src-bucket> <src-key> <dst-bucket> <dst-key>

# Étiquettes
zcp object-storage object tag set <storage> <bucket> <key> --tag kind=report

# Flux de gestion des versions (requiert : bucket versioning enable)
zcp object-storage object versions <storage> <bucket> [--prefix p/]        # lister versions + marqueurs de suppression
zcp object-storage object download <storage> <bucket> <key> --version-id <id>
zcp object-storage object delete   <storage> <bucket> <key> --version-id <id>
zcp object-storage object restore  <storage> <bucket> <key>                # restaurer (retirer le dernier marqueur de suppression)
```

| Option           | Commandes                    | Description                                                      |
| ---------------- | ---------------------------- | ---------------------------------------------------------------- |
| `--key`          | `put`                        | Clé de l'objet distant (par défaut le nom du fichier local)      |
| `--content-type` | `put`                        | Type de contenu (détecté depuis l'extension si omis)             |
| `--metadata k=v` | `put`                        | Métadonnées utilisateur (`x-amz-meta-*`), répétable              |
| `--dest`         | `download`                   | Fichier ou répertoire local                                      |
| `--version-id`   | `download`, `delete`, `stat` | Cibler une version d'objet précise                               |
| `--expires`      | `url`, `put-url`             | Durée de validité du lien (p. ex. `30m`, `24h` ; max `168h`/7 j) |
| `--prefix`       | `versions`                   | Limiter à un préfixe de clé                                      |

:::tip

Les URL pré-signées (`object url` / `object put-url`) vous permettent de transmettre un objet unique
à quelqu'un sans partager d'identifiants ni rendre tout le compartiment public — le lien fonctionne
jusqu'à son expiration (max 7 jours), même sur un compartiment privé.

:::

## Pas encore dans le CLI

- **Verrou d'objet (WORM)** — activez-le à la création d'un compartiment dans le portail, ou
  directement contre le point de terminaison S3 avec un SDK. La prise en charge dans le CLI est
  prévue.
- **Mise à l'échelle automatique** de l'instance — utilisez le portail.

Tout le reste indiqué dans le tableau ci-dessus est entièrement pris en charge par `zcp`
aujourd'hui.
