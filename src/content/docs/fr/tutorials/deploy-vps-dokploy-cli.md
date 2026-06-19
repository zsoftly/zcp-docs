---
title: 'Déployer un VPS et installer Dokploy avec le CLI'
description:
  Passez d'un compte ZSoftly tout neuf à un VPS public exécutant Dokploy, entièrement depuis le
  terminal avec le CLI zcp.
sidebar:
  label: 'Déployer un VPS avec Dokploy (CLI)'
---

Ce tutoriel vous mène d'un compte ZSoftly Public Cloud tout neuf à un VPS fonctionnel qui exécute
[Dokploy](https://dokploy.com), une plateforme auto-hébergée pour déployer des applications et des
bases de données. Vous réalisez chaque étape depuis votre terminal avec le CLI `zcp`.

À la fin, vous disposez de :

- Un CLI authentifié sur votre machine
- Une machine virtuelle exposée sur Internet (un VPS simple) avec une IP publique et un accès SSH
- Dokploy installé et accessible dans votre navigateur

Prévoyez environ 15 minutes. L'essentiel du temps sert au démarrage de la VM et à l'installation de
Dokploy.

:::note

Les slugs de ce tutoriel (région `yow-1`, projet `default-9`, modèle `ubuntu-2404-lts`, plans, etc.)
sont des **exemples tirés d'un compte**. Les vôtres seront différents. Chaque étape montre la
commande `list` qui affiche la bonne valeur pour votre compte et votre région. Utilisez toujours
celles-ci, ne copiez pas les exemples tels quels.

:::

## Avant de commencer

- Un compte ZSoftly Public Cloud. [Créez-en un](/fr/public-cloud/getting-started/account-signup) si
  vous n'en avez pas.
- Un terminal avec un client SSH (Terminal sur macOS ou Linux, Windows Terminal ou PowerShell sur
  Windows).
- Une paire de clés SSH. Ce tutoriel en crée une pour vous si vous n'en avez pas.

:::note

Dokploy nécessite au moins **2 Go de RAM** et **30 Go de disque**. Gardez-le en tête au moment de
choisir un plan à l'étape 6.

:::

## Étape 1 : Installer le CLI

Le CLI `zcp` est un binaire unique. Installez-le avec le script en une ligne.

```bash
# macOS et Linux
curl -fsSL https://raw.githubusercontent.com/zsoftly/zcp-cli/main/scripts/install.sh | bash
```

```powershell
# Windows (PowerShell)
irm https://raw.githubusercontent.com/zsoftly/zcp-cli/main/scripts/install.ps1 | iex
```

Vérifiez l'installation :

```bash
zcp version
```

Pour les autres méthodes d'installation, voir le
[guide d'installation du CLI](/fr/public-cloud/cli/installation).

## Étape 2 : S'authentifier

Le CLI communique avec la plateforme grâce à un jeton Bearer lié à votre compte.

1. Dans le portail, ouvrez **Profil → Jetons d'API** et créez un jeton. Copiez-le.
2. Créez un profil CLI et collez le jeton à l'invite.

```bash
zcp profile add default
```

Vous êtes invité à saisir :

- **Jeton Bearer** : le jeton copié depuis le portail
- **URL de l'API** : `https://api.zcp.zsoftly.ca/api`
- **Région par défaut** (p. ex. `yow-1`) et **projet par défaut** (p. ex. `default-9`)

Vérifiez les identifiants et laissez le CLI détecter votre fournisseur infonuagique :

```bash
zcp auth validate
```

Une réponse positive signifie que vous êtes prêt. Le CLI enregistre votre profil sous
`~/.config/zcp` avec des permissions `0600`.

:::note

Toute commande visant une ressource liée à une région exige une **région** et un **projet**. La
région et le projet par défaut enregistrés à l'étape précédente les fournissent. Vous pouvez aussi
les définir une fois par variables d'environnement, ce que supposent les commandes ci-dessous :

```bash
export ZCP_REGION=yow-1        # voir : zcp region list
export ZCP_PROJECT=default-9   # voir : zcp project list (c'est « default-9 », pas « default »)
```

:::

## Étape 3 : Explorer

Avant de créer quoi que ce soit, listez ce qui est disponible pour votre compte. Il vous faut un
slug de **région**, un slug de **projet**, un **plan**, un **modèle** (image système) et une
**catégorie de stockage**.

```bash
# Régions où déployer (colonne SLUG, p. ex. yow-1)
zcp region list

# Vos projets — notez le SLUG (il ressemble à « default-9 », pas juste « default »)
zcp project list

# Plans de VM avec CPU, mémoire et prix (choisissez au moins 2 Go de RAM)
zcp plan vm --region yow-1

# Modèles système de votre région (colonne SLUG, p. ex. ubuntu-2404-lts)
zcp template list --region yow-1

# Catégories de stockage (une valeur de la colonne STORAGE CATEGORY, p. ex. nvme)
zcp plan storage --region yow-1
```

:::note

Les plans sont propres à une région, donc `zcp plan` exige une région (`--region` ou `ZCP_REGION`).
Un plan d'une autre région ne se déploiera pas. Par exemple, les plans Intel `ci*` n'existent que
dans `yow-1`, tandis que `yul-1` utilise la famille `ca*`.

:::

Notez les valeurs voulues. La suite du tutoriel utilise ce qui suit. **Les vôtres seront
différentes.** Le slug de projet, les modèles disponibles et les catégories de stockage valides
varient selon le compte et la région ; utilisez donc les valeurs qu'affichent vos propres commandes
`list`.

| Valeur                | Exemple           | Comment la trouver               |
| --------------------- | ----------------- | -------------------------------- |
| Région                | `yow-1`           | `zcp region list`                |
| Projet                | `default-9`       | `zcp project list`               |
| Plan                  | `ci1l`            | `zcp plan vm --region <r>`       |
| Modèle                | `ubuntu-2404-lts` | `zcp template list --region <r>` |
| Catégorie de stockage | `nvme`            | `zcp plan storage --region <r>`  |

:::caution

`ci1l` est un exemple. Lancez `zcp plan vm` et choisissez un plan avec au moins **2 Go de mémoire**
et **30 Go de stockage**, sinon l'installation de Dokploy échouera.

:::

:::caution

Choisissez une **version LTS d'Ubuntu bien établie** comme `ubuntu-2404-lts` (24.04). Dokploy
installe Docker depuis le dépôt apt de Docker, qui ne publie pas tout de suite de paquets pour les
toutes dernières versions. Sur une version récente comme Ubuntu 26.04, l'installateur échoue avec
`docker: not found`.

:::

:::note

Le slug de projet **n'est pas** le mot `default`. Le premier projet d'un nouveau compte a un slug
comme `default-9`. Passer `--project default` échoue avec `The selected project is invalid`.
Utilisez donc toujours le slug affiché par `zcp project list`.

La catégorie de stockage est propre à une région. `nvme` est valide dans `yow-1`, et d'autres
régions peuvent exposer `pro-nvme`, `premium-ssd` ou `hdd-storage`. Vérifiez avec `zcp plan storage`
pour votre région.

:::

## Étape 4 : Ajouter votre clé SSH

Vous vous connectez à la VM avec une clé SSH, pas un mot de passe. Si vous n'avez pas encore de clé,
créez-en une :

```bash
ssh-keygen -t ed25519 -C "vous@exemple.com"
```

Importez la clé **publique** dans votre compte et nommez-la. `--project` et `--region` sont requis.
Vous référencez ce nom au moment de créer la VM.

```bash
zcp ssh-key import \
  --name my-key \
  --key-file ~/.ssh/id_ed25519.pub \
  --project default-9 \
  --region yow-1
```

Confirmez l'enregistrement :

```bash
zcp ssh-key list
```

:::note

Le **nom** de la clé doit faire au plus 20 caractères, et la clé publique elle-même doit être
unique. Réimporter une clé que vous possédez déjà (même sous un autre nom) est rejeté. Supprimez
d'abord l'ancienne avec `zcp ssh-key delete <slug>` si vous devez la remplacer.

:::

## Étape 5 : Comprendre le réseau

Une VM a besoin d'un réseau. Le CLI propose deux types :

- **Isolated** (par défaut) : fournit un routeur virtuel, un accès Internet sortant et la prise en
  charge des IP publiques. C'est ce qu'il faut pour un VPS exposé sur Internet.
- **L2** : un simple segment de niveau 2, sans routeur ni IP publique. Réservez-le aux appliances
  qui gèrent leur propre routage, pas à un VPS public.

Vous ne créez pas le réseau séparément. Quand vous créez la VM avec un plan de réseau Isolated, la
plateforme provisionne automatiquement le réseau et une IP publique (source-NAT). Listez les plans
de réseau pour en choisir un :

```bash
# Plans de réseau (colonne SLUG, p. ex. pnet-yow)
zcp plan network --region yow-1
```

`pnet-yow` est un plan de réseau public pour la région `yow`. Choisissez celui qui correspond à
votre région.

:::tip

Vous pouvez tout de même créer et inspecter des réseaux directement avec `zcp network create`,
`zcp network list` et `zcp network get`. Pour un seul VPS, ce n'est pas nécessaire. L'étape suivante
le fait pour vous.

:::

## Étape 6 : Créer le VPS

Créez la VM en une commande. Elle provisionne le réseau, attache votre clé SSH et attribue à la VM
une IP publique (source-NAT). `--storage-category` est **requis**.

```bash
zcp instance create \
  --name dokploy \
  --project default-9 \
  --region yow-1 \
  --template ubuntu-2404-lts \
  --plan ci1l \
  --billing-cycle hourly \
  --network-type Isolated \
  --network-plan pnet-yow \
  --storage-category nvme \
  --ssh-key my-key \
  --wait
```

`--wait` bloque jusqu'à ce que la VM atteigne l'état **Running**, généralement une à trois minutes.

## Étape 7 : Trouver l'IP publique et ouvrir les ports

Affichez d'abord les détails de la VM pour le nom d'utilisateur de connexion (**Username**, les
images Ubuntu se connectent avec `ubuntu`) :

```bash
zcp instance get dokploy
```

:::note

`zcp instance get` affiche l'**IP privée** mais laisse l'**IP publique** vide. L'IP publique
source-NAT n'y figure pas. Trouvez-la avec `zcp ip list` :

:::

```bash
zcp ip list
```

Notez l'**IP ADDRESS** et le **SLUG** de la ligne dont la colonne `VM` vaut `dokploy`.

L'IP source-NAT donne à la VM un accès Internet sortant, mais **le trafic entrant est bloqué tant
que vous ne l'ouvrez pas**. Autorisez chaque port et redirigez-le vers la VM. Dokploy a besoin de
`22` (SSH), `80` et `443` (vos applications et le TLS), et `3000` (le tableau de bord) :

```bash
# Remplacez <ip-slug> par le SLUG issu de `zcp ip list`
for port in 22 80 443 3000; do
  zcp firewall create --ip <ip-slug> --protocol tcp --cidr 0.0.0.0/0 \
    --start-port "$port" --end-port "$port"
  zcp portforward create --instance dokploy --ip <ip-slug> --protocol tcp \
    --public-port "$port" --public-end-port "$port" \
    --private-port "$port" --private-end-port "$port"
done
```

:::caution

`portforward create` exige les options de port de fin (`--public-end-port` / `--private-end-port`)
même pour un seul port, sinon il échoue avec `Private end port is required`. Pour un seul port,
définissez le port de fin égal au port de début, comme ci-dessus.

:::

:::tip

Vous préférez une IP dédiée en un-pour-un exposant tous les ports plutôt qu'une redirection par port
? Allouez une IP et associez-la en static NAT (vous ajoutez quand même des règles de pare-feu pour
les ports que vous voulez joignables) :

```bash
zcp plan ip --region yow-1
zcp network list                         # trouvez le slug du réseau de votre VM
zcp ip allocate --plan ipv4-yow --billing-cycle hourly --network <slug-reseau>
zcp ip list                              # trouvez le SLUG de la nouvelle IP
zcp ip static-nat enable <ip-slug> --instance dokploy
```

:::

## Étape 8 : Se connecter en SSH

Connectez-vous avec un client SSH ordinaire à l'IP publique de l'étape 7 :

```bash
ssh -i ~/.ssh/id_ed25519 ubuntu@<ip-publique>
```

:::note

`zcp instance ssh` résout d'abord l'**IP privée** de la VM. Il ne fonctionne donc que si votre
machine est sur le même réseau (par exemple via un VPN). Depuis un poste de travail ordinaire,
connectez-vous en SSH à l'**IP publique** comme ci-dessus.

:::

Si la connexion expire, vérifiez que vous avez ouvert le port `22` (étape 7) et que vous utilisez
bien l'IP publique de `zcp ip list`.

## Étape 9 : Installer Dokploy

Vous êtes maintenant sur la VM. Installez Dokploy avec son script officiel. Il s'exécute en root,
utilisez donc `sudo`.

```bash
curl -sSL https://dokploy.com/install.sh | sudo sh
```

L'installateur télécharge Docker, démarre Dokploy et sert le tableau de bord sur le port `3000`. Il
affiche l'URL une fois terminé.

## Étape 10 : Ouvrir le tableau de bord

Dans votre navigateur, allez à :

```
http://<ip-publique>:3000
```

Créez votre compte administrateur au premier chargement. Vous pouvez ensuite déployer des
applications depuis Git, exécuter des bases de données et ajouter des domaines avec TLS automatique.

:::caution

Le port `3000` est ouvert sur Internet. Définissez tout de suite votre mot de passe administrateur,
et pointez un domaine vers la VM pour que Dokploy puisse émettre des certificats TLS pour le `443`.

:::

## Nettoyage

La facturation horaire court tant que les ressources existent. Supprimez-les une fois vos tests
terminés. Supprimer la VM de cette façon libère aussi son IP source-NAT ainsi que les règles de
pare-feu et de redirection de ports associées :

```bash
zcp instance delete dokploy
```

Si vous avez alloué une IP distincte pour le static NAT (l'astuce de l'étape 7), libérez-la aussi :

```bash
zcp ip list
zcp ip release <ip-slug>
```

## Récapitulatif

Le flux complet, du début à la fin (remplacez les slugs d'exemple par les vôtres) :

```bash
# 1. S'authentifier
zcp profile add default
zcp auth validate

# 2. Ajouter votre clé SSH (projet + région requis)
zcp ssh-key import --name my-key --key-file ~/.ssh/id_ed25519.pub \
  --project default-9 --region yow-1

# 3. Créer le VPS (provisionne son propre réseau + IP source-NAT)
zcp instance create \
  --name dokploy --project default-9 --region yow-1 \
  --template ubuntu-2404-lts --plan ci1l --billing-cycle hourly \
  --network-type Isolated --network-plan pnet-yow \
  --storage-category nvme --ssh-key my-key --wait

# 4. Trouver l'IP publique, puis ouvrir SSH + les ports applicatifs
zcp ip list
for port in 22 80 443 3000; do
  zcp firewall create --ip <ip-slug> --protocol tcp --cidr 0.0.0.0/0 \
    --start-port "$port" --end-port "$port"
  zcp portforward create --instance dokploy --ip <ip-slug> --protocol tcp \
    --public-port "$port" --public-end-port "$port" \
    --private-port "$port" --private-end-port "$port"
done

# 5. Se connecter et installer Dokploy
ssh -i ~/.ssh/id_ed25519 ubuntu@<ip-publique>
curl -sSL https://dokploy.com/install.sh | sudo sh
```

## Étapes suivantes

- [Référence du CLI](/fr/public-cloud/cli/reference) : chaque commande et option
- [Se connecter en SSH](/fr/public-cloud/compute/connect-ssh) : gestion des clés et dépannage
- [Redirection de ports](/fr/public-cloud/compute/settings/port-forwarding) : exposer des services
  précis
- [Docker sur la Marketplace](/fr/public-cloud/marketplace/docker) : une image prête à l'emploi si
  vous voulez Docker sans installation manuelle
