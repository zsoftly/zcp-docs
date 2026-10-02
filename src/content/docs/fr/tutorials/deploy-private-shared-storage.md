---
title: 'Déployer un stockage partagé privé sur ZCP'
description:
  Déployez un partage de fichiers NFS dans le niveau privé créé avec le tutoriel « Créer un réseau
  privé avec Headscale » à l'aide du CLI zcp. Le partage n'est accessible que depuis le niveau et le
  maillage.
sidebar:
  label: 'Déployer le stockage privé (CLI)'
---

Ce tutoriel déploie un partage de fichiers NFS sur une VM du niveau privé créé avec
[Créer un réseau privé avec Headscale](/fr/tutorials/build-private-network-headscale). Il est
accessible depuis ce niveau et le réseau maillé construit dans ce tutoriel, jamais depuis Internet.

À la fin, vous aurez :

- Une VM dans votre niveau privé existant, avec un disque de données séparé
- Un partage NFS exporté vers le niveau et le maillage, jamais vers le réseau public
- La confirmation que le partage fonctionne depuis un client du maillage et que seule SSH répond sur
  son IP publique

Prévoyez environ 20 minutes.

## Avant de commencer

- Terminez [Créer un réseau privé avec Headscale](/fr/tutorials/build-private-network-headscale) :
  vous devez disposer d'un VPC avec un niveau privé, d'un serveur Headscale et d'un routeur de
  sous-réseau qui annonce et sert déjà la route du niveau. Ce tutoriel nécessite le nom exact du
  niveau créé, par exemple `my-workspace-tier` si vous avez utilisé `--name my-workspace`.
- Gardez `ZCP_REGION` et `ZCP_PROJECT` exportés depuis le tutoriel précédent ou exportez-les de
  nouveau.
- Utilisez le même nom de clé SSH que dans son étape 4.
- Installez `jq`. Les scripts de déploiement et de suppression l'exigent.

:::note

Ce script et le script de suppression ont besoin de bash. Il est natif sous macOS et Linux. Sous
Windows, utilisez WSL ou Git Bash.

:::

## Exécuter le script

Un seul script déploie la VM de stockage, son disque de données et l'export NFS :
`zcp/deploy-private-storage.sh` du dépôt [zsoftly/tools](https://github.com/zsoftly/tools). Il
exécute les phases expliquées dans la section suivante, dans l'ordre.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/zsoftly/tools/main/zcp/deploy-private-storage.sh) \
  --ssh-key my-key --tier-name my-workspace-tier --name my-storage
```

Ce tutoriel utilise `my-storage` comme préfixe `--name` et `my-workspace-tier` comme niveau de
l'exemple précédent `my-workspace`. Vos valeurs dépendent du `--name` choisi dans ce tutoriel et du
précédent.

Le script lit `ZCP_REGION` et `ZCP_PROJECT` dans votre shell si vous les avez exportés. Sinon,
passez `--region` et `--project`.

| Indicateur      | Rôle                                     | Valeur par défaut ou exigence                        |
| --------------- | ---------------------------------------- | ---------------------------------------------------- |
| `--ssh-key`     | Nom de clé utilisé par la VM de stockage | Obligatoire                                          |
| `--tier-name`   | Niveau privé existant à attacher         | Obligatoire                                          |
| `--name`        | Préfixe de la VM et du volume            | `storage`                                            |
| `--share-name`  | Nom du répertoire du partage NFS         | `company-share`                                      |
| `--volume-size` | Taille du volume de données en GB        | `20`                                                 |
| `--region`      | Slug de région zcp                       | Obligatoire (indicateur ou variable d'environnement) |
| `--project`     | Slug de projet zcp                       | Obligatoire (indicateur ou variable d'environnement) |
| `-y`/`--yes`    | Ignorer l'invite de confirmation         | Désactivé                                            |

`--tier-name` n'est pas détecté automatiquement. Un compte peut contenir plusieurs niveaux privés et
deviner le bon niveau représente un risque réel d'isolation. Le script échoue si ce nom ne
correspond pas à exactement un niveau.

Comme `build-private-network.sh`, le script détecte les plans de calcul et réseau ainsi que les deux
catégories de stockage, qui peuvent différer entre le disque racine et le volume de données. Il
détecte aussi votre IP publique avec `ifconfig.me` pour limiter SSH (`--my-ip`). Passez un
indicateur précis pour fixer une valeur et utilisez `--help` pour la liste complète.

## Ce que construit le script

### La VM de stockage

**Le script attribue délibérément une IP publique à la VM (`my-storage`, selon le préfixe `--name`),
puis la limite à SSH.**

Une VM sans présence réseau publique paraît plus privée, mais il serait impossible de l'atteindre,
même pour la configuration ponctuelle de l'interface du niveau. Le script déploie normalement,
attribue une IP publique puis limite SSH à votre seule IP, comme `build-private-network.sh` le fait
pour ses deux VM. Rien d'autre n'est ouvert publiquement. NFS est donc aussi inaccessible depuis
l'extérieur qu'il le serait sans IP publique. L'IP ne sert qu'à l'administration limitée.

La VM est attachée au niveau nommé avec `add-network`, comme le routeur de sous-réseau du script
précédent.

:::caution

`zcp volume create --plan <slug>` échoue sur cette plateforme avec une erreur serveur
(`API error 500: Undefined property: stdClass::$storage`). Le script utilise toujours `--size`,
jamais `--plan`.

:::

### Interface du niveau et disque de données

**L'interface du niveau est activée comme celle du routeur. Le disque de données est détecté, sans
hypothèse.**

La plateforme ajoute l'interface réseau à chaud, mais le système d'exploitation ne l'active pas
automatiquement. Le script écrit et applique un fichier netplan, comme pour l'interface de niveau du
routeur.

Le disque de données est le volume `my-storage-data` créé avec la VM. Le script l'identifie comme le
disque entier qui n'est pas le disque racine, plutôt que de supposer un nom de périphérique fixe.
Les noms de périphériques varient selon la plateforme. Une mauvaise supposition pourrait formater le
mauvais disque. Le formatage est idempotent : lors d'une nouvelle exécution, le script ignore `mkfs`
si le disque est déjà formaté et ne détruit pas les données. Le répertoire du partage est créé
**après** le montage : s'il est créé avant, il réside sur le disque racine et devient masqué lorsque
le volume est monté dessus.

### Export NFS

**Le partage est exporté vers le CIDR du niveau et celui du maillage : le serveur accepte les deux
adresses source, même si une seule est accessible par la configuration actuelle.**

Le script installe `nfs-kernel-server` et exporte le répertoire vers le CIDR du niveau et
`100.64.0.0/10`, la plage d'adresses du maillage Headscale employée également par
`build-private-network.sh` dans ses règles ACL.

:::caution

Une VM physiquement dans le niveau se connecte avec une adresse source du niveau. Par défaut, le
routeur de sous-réseau Tailscale applique SNAT au trafic transmis. Un employé connecté avec
Tailscale arrive donc aujourd'hui avec une adresse du niveau, pas son adresse de maillage
`100.64.0.0/10`. L'export du CIDR de maillage prévoit le cas d'un routeur lancé avec
`--snat-subnet-routes=false`. Cet indicateur seul n'est pas une configuration prise en charge. Sans
SNAT, cette VM doit aussi avoir une route de retour vers `100.64.0.0/10`, que ce tutoriel ne crée
pas. La combinaison se bloquerait. Ne désactivez pas SNAT sans avoir résolu ce point séparément.

:::

:::note

L'export utilise `root_squash`, le choix le plus sûr : root sur un client ne reçoit pas l'accès
équivalent à root sur le partage.

:::

:::note

Le répertoire du partage est `chmod 1777`. Tous les clients du niveau ou du maillage peuvent lire et
écrire son contenu. Le sticky bit empêche un utilisateur de supprimer les fichiers d'un autre, mais
il n'existe aucun autre modèle d'autorisation par utilisateur. Considérez ce partage comme une zone
d'équipe de confiance.

:::

### Pare-feu du système d'exploitation

**Une seconde couche indépendante limite NFS aux mêmes plages que l'export. SSH reste limité par la
couche `zcp`.**

Le script ouvre aussi le pare-feu `ufw` de la VM pour les trois ports NFS (2049, 111, 20048),
limités aux deux CIDR de l'export. Aucune règle de pare-feu ni redirection `zcp` n'existe pour ces
ports sur l'IP publique. Les deux couches sont nécessaires pour NFS.

SSH est différent : `ufw` l'autorise sans limite (`0.0.0.0/0`), tandis que son refus par défaut
reste en place pour le reste après `--force enable`. La limitation à votre IP est entièrement
assurée par la couche de pare-feu `zcp`. Limiter aussi `ufw` à votre IP fonctionnerait aujourd'hui
mais vous exclurait si votre IP changeait, car `ufw` ne nettoie pas les règles obsolètes comme le
script.

## Inspecter les ressources créées

```bash
zcp instance list
zcp volume list
zcp ip list
```

## Vérifier depuis un client du maillage

Utilisez un appareil déjà connecté par Tailscale au serveur Headscale du tutoriel précédent, pas un
appareil situé physiquement dans le niveau. C'est le scénario important :

```bash
sudo apt-get install -y nfs-common
sudo mkdir -p /mnt/company-share
sudo mount -t nfs <storage-vm-tier-ip>:/srv/nfs/company-share /mnt/company-share

echo "test" | sudo tee /mnt/company-share/test.txt
cat /mnt/company-share/test.txt
```

`<storage-vm-tier-ip>` est affiché dans le résumé final du script. `company-share` est la valeur par
défaut de `--share-name`. Utilisez votre valeur si vous en avez passé une autre.

:::note

La commande `apt-get` suppose un client Debian ou Ubuntu. Utilisez le paquet client NFS et les
outils de montage de votre système d'exploitation si vous en utilisez un autre.

:::

:::caution

Si cette commande se bloque au lieu d'échouer clairement, vérifiez `tailscale status` sur le client
et le routeur de sous-réseau avant de supposer un problème NFS ou pare-feu. Un nœud peut devenir
silencieusement hors ligne. `sudo systemctl restart tailscaled` sur le nœud concerné résout le
problème, comme dans le tutoriel précédent.

:::

## Vérifier l'isolation

```bash
# from the public internet:
nc -zv -w 3 <storage-vm-public-ip> 2049
```

Cette commande échoue (connexion refusée ou délai dépassé). L'IP publique de la VM de stockage ne
laisse SSH accessible que depuis votre IP. NFS est joignable uniquement dans le niveau ou par le
maillage.

:::note

`nc` (`sudo apt-get install -y netcat-openbsd` sur Debian ou Ubuntu si nécessaire. macOS fournit
déjà `nc`) se comporte de la même manière dans tous les shells. `/dev/tcp/<host>/<port>` est une
fonction propre à bash et échoue directement dans des shells comme zsh.

:::

## Nettoyer

La facturation horaire s'applique tant que ces ressources existent. Le script de suppression retire
la VM de stockage et son volume de données pour un préfixe `--name`. Il ne touche pas le niveau
privé ni le VPC du tutoriel précédent.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/zsoftly/tools/main/zcp/destroy-private-storage.sh) \
  --name my-storage --allow-unverified-volume-delete
```

Il récupère `ZCP_REGION` et `ZCP_PROJECT` dans votre shell comme le script de déploiement. Sinon,
passez `--region` et `--project`. Le script échoue sans l'un ou l'autre.

:::note

Le CLI `zcp` ne permet pas de vérifier qu'un volume appartient à une VM ou qu'il est attaché. Le
script de déploiement enregistre donc les ressources exactes qu'il crée dans
`~/.zcp-private-storage-state/` sur la machine où vous l'exécutez, indexées ensemble par `--name`,
`--region` et `--project`. Exécutez la suppression depuis cette même machine avec les mêmes valeurs.
L'enregistrement est créé lorsque les contrôles de configuration du disque de l'étape 2 ont réussi,
pas dès la création de la VM et du volume.

Le script résout le volume à partir de cet enregistrement ou, sur une autre machine, d'une
correspondance de nom. Il indique le volume à supprimer mais ne peut pas confirmer son attachement
actuel : une personne pourrait l'avoir rattaché ailleurs. La suppression exige toujours
`--allow-unverified-volume-delete`, même avec l'enregistrement. Sans lui, la VM est supprimée mais
le volume, toujours facturable, est laissé seul avec une sortie non nulle et une raison imprimée.

:::

:::caution

Ce script ne demande pas sa propre confirmation. Chaque suppression, y compris le volume de données
et tout le contenu du partage, est immédiate.

Il détache explicitement le volume avant la suppression de la VM, puis le supprime séparément. Si
l'une de ces étapes échoue, le volume peut rester présent et facturable. Vérifiez ensuite
`zcp volume list`.

Comme chaque VM de cette série avec une IP publique, la VM de stockage crée aussi un réseau autonome
et une IP source-NAT épinglée. `instance delete` ne les supprime pas. Le script détecte et signale
un reste comme `destroy-private-network.sh` le fait. Retirez-le du portail web CMP en recherchant
l'ID réseau imprimé. Un reste confirmé donne un code de sortie non nul, vérifiez `$?`. Une
suppression demandée mais non confirmée, affichée comme `[WARN]`, donne aussi une sortie non nulle.
Examinez les lignes `[WARN]` avant de conclure qu'il s'agit d'un réseau résiduel.

:::

## Récapitulatif

1. Déployez une VM dans le niveau du tutoriel précédent avec un disque séparé :
   `deploy-private-storage.sh --ssh-key <name> --tier-name <tier-name> --name my-storage`.
2. Le script limite SSH à votre IP, active l'interface du niveau, formate et monte le disque de
   données, puis l'exporte par NFS vers les CIDR du niveau et du maillage avec un pare-feu
   correspondant.
3. Montez le partage depuis un appareil connecté au maillage, vérifiez lecture et écriture, puis
   confirmez que seule SSH répond sur l'IP publique.
4. Exécutez `destroy-private-storage.sh --name <prefix> --allow-unverified-volume-delete` à la fin
   et cherchez un réseau résiduel.

## Étapes suivantes

- [Déployer des postes Ubuntu pour les employés](/fr/tutorials/deploy-ubuntu-employee-desktops) : un
  bureau complet pour un employé dans le même niveau. La connexion de ce bureau à ce partage est
  toujours en cours.
- [Créer un réseau privé avec Headscale](/fr/tutorials/build-private-network-headscale) : le niveau
  et le maillage
- [Référence CLI](/fr/public-cloud/cli/reference) : chaque commande et indicateur
- [Vue d'ensemble des tutoriels](/fr/tutorials) : la liste complète
