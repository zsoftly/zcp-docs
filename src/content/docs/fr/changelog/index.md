---
title: Journal des modifications
description:
  Tout ce qui est nouveau sur la plateforme infonuagique ZSoftly. Fonctionnalités de la plateforme
  et des services, applications de la place de marché, le CLI zcp et le fournisseur Terraform /
  OpenTofu.
---

L'endroit unique pour suivre les nouveautés de la plateforme infonuagique ZSoftly. Chaque section
ci-dessous est son propre journal : **plateforme et services**, la **place de marché**, le **CLI
`zcp`** et le **fournisseur Terraform / OpenTofu**, les plus récentes en premier.

:::tip

Chaque composant tient son propre `CHANGELOG.md` sur GitHub. La section **CLI** ci-dessous reflète
[`zcp-cli/CHANGELOG.md`](https://github.com/zsoftly/zcp-cli/blob/main/CHANGELOG.md) ; utilisez-le
pour l'historique complet au niveau des commits.

:::

## Plateforme et services

Mises à jour de la plateforme Public Cloud et des services gérés.

- **Kubernetes 1.36** est désormais pris en charge pour les grappes gérées.
- Les images **Windows Server 2025** sont disponibles pour les instances de calcul.
- **ZSoftly Cloud Storage** : les grappes de stockage dédiées à un seul locataire sont disponibles
  de façon générale.

## Place de marché

Images d'applications en un clic pour les instances de calcul.

- **Plus de 20 applications en un clic** disponibles, dont cPanel, GitLab, Grafana, WordPress,
  PostgreSQL, MySQL, MariaDB, MongoDB, Elasticsearch, InfluxDB, Docker, n8n, et plus. Parcourez-les
  dans la [place de marché](/fr/public-cloud/marketplace).

## CLI (`zcp`)

L'outil en ligne de commande officiel de la plateforme. Les entrées ci-dessous reflètent le
[`CHANGELOG.md`](https://github.com/zsoftly/zcp-cli/blob/main/CHANGELOG.md) du CLI sur GitHub.

### v0.0.18 : 19 juin 2026

**La région et le projet sont désormais requis pour les commandes liées à une région ou à un
projet.** Les résultats deviennent prévisibles et correspondent à la façon dont la plateforme
délimite les ressources. Voir [Configuration](/fr/public-cloud/cli/configuration) pour savoir
comment les fournir.

- **Définissez-les une fois** : `zcp profile add` demande maintenant une région par défaut (requise)
  et un projet, comme `aws configure`. Ensuite, la plupart des commandes n'ont plus besoin de
  `--region`/`--project`, et vous pouvez toujours les remplacer par commande ou avec les variables
  d'environnement `ZCP_REGION`/`ZCP_PROJECT`.
- **Les listes sont limitées à votre région et à votre projet** : chaque liste de ressources et de
  catalogue filtre désormais sa sortie, donc `plan`, `template list`, `iso list`, `marketplace list`
  et `storage-category list` ne mélangent plus les entrées d'autres régions. Les commandes de niveau
  compte (`dns`, `auth`, `profile`, `region`, `project` et les autres commandes de découverte) sont
  exemptées.

**Clés SSH.**

- **`ssh-key import` corrigé** : la commande envoie maintenant le projet et la région requis,
  résolvant une erreur 500 à l'import, et valide le nom de la clé côté client (20 caractères
  maximum).
- **`instance create --ssh-key <name>`** active désormais correctement l'authentification par clé
  SSH. Importez d'abord la clé avec `ssh-key import`. Les noms de clé et le contenu de la clé
  publique doivent être uniques.

**Erreurs plus claires.**

- **Les erreurs de validation de l'API** affichent maintenant le détail au niveau du champ (par
  exemple, `public_key: The public key has already been taken.`) au lieu d'un message générique.

### v0.0.17 : 17 juin 2026

**Stockage objet : l'ensemble des fonctionnalités S3 dans le CLI.** Plusieurs sont disponibles
uniquement via le CLI (ou un SDK S3) aujourd'hui, pas encore dans l'interface web. Voir le
[guide CLI du stockage objet](/fr/public-cloud/storage/object-storage/cli) pour la référence
complète et un tableau comparatif interface vs CLI.

- **Flux de gestion des versions** : lister les versions et les marqueurs de suppression,
  télécharger ou supprimer une version précise, et `restore` (restaurer).
- **Télécharger des objets** dans un fichier local (`object download`).
- **Politiques de compartiment** : lire, définir (depuis un fichier JSON) ou supprimer la politique
  S3 brute d'un compartiment.
- **Étiquetage** des compartiments et objets ; **chiffrement par défaut** (SSE-S3) ; **règles de
  cycle de vie** (expirer versions courantes/anciennes et téléversements incomplets) ; **règles
  CORS**.
- **URL pré-signées** : liens de téléchargement _et_ de téléversement à durée limitée, sans
  identifiants, même sur un compartiment privé.
- **Copie / déplacement côté serveur**, **stat d'objet** (métadonnées complètes) et
  `put --metadata`.
- **Rendre les compartiments publics/privés**, **vider un compartiment** et **nettoyer les
  téléversements incomplets**.
- **Création simplifiée** : `zcp plan object-storage` liste les plans, et `create --plan` déduit la
  catégorie de stockage.

**Ergonomie du CLI.**

- **Erreurs d'arguments claires** : chaque commande indique ce qui manque, la syntaxe et un exemple.
- **Les sous-commandes inconnues génèrent une erreur** (code de sortie non nul) au lieu d'afficher
  silencieusement l'aide.
- **Fournisseur infonuagique détecté automatiquement** : enregistré dans votre profil lors de
  `zcp auth validate` ; vous n'avez plus à passer `--cloud-provider`.
- **`-o yaml`** est maintenant pris en charge pour la sortie des politiques, du cycle de vie et de
  CORS.

### v0.0.16 : 11 juin 2026

- **Sous-réseaux VPC (tiers)** : créer un réseau comme sous-réseau VPC avec `network create --vpc`,
  et attacher une liste de contrôle d'accès (ACL) à la création avec `--acl`.
- **Règles d'ACL réseau** : gestion complète : `acl rules`, `acl create-rule`, `acl update-rule`
  (sur place), `acl delete-rule`, ainsi que `acl delete` pour les listes d'ACL. `--cidr` accepte des
  listes séparées par des virgules.
- **`network get`** : afficher le CIDR, l'état, l'appartenance au VPC et l'ACL d'un réseau.
- **`plan network`** : lister les plans réseau (les valeurs de `--network-plan`).
- **Corrections** : `vpc get`/`create` affichent maintenant le CIDR/l'état, les tableaux de plans
  incluent une colonne SLUG ; `vpc delete` attend la fin de l'opération ; meilleure gestion du cas «
  déjà supprimé ».

### v0.0.15 : 10 juin 2026

- **VPN** : nouvelles options Diffie-Hellman et Perfect Forward Secrecy IKE/ESP (`--ike-dh`,
  `--esp-dh`, `--esp-pfs`) sur la création/mise à jour de passerelle client ; la configuration VPN
  complète est maintenant renvoyée de façon fiable.
- **`ip allocate --project`** : attribuer une IP à un projet précis dès l'allocation.
- **Corrections** : les commandes de passerelle VPN/client et de mise à jour VPC/réseau ne renvoient
  plus de champs vides ; effacer une `--description` fonctionne désormais.

### v0.0.14 : 10 juin 2026

- **Infrastructure as code** : les paquets d'API du CLI sont désormais importables par des modules
  Go externes, ce qui permet le
  [fournisseur Terraform / OpenTofu](https://github.com/zsoftly/terraform-provider-zcp). Le
  comportement du CLI est inchangé.

### v0.0.12 : 9 juin 2026

- **`kubernetes upgrade-version`** : mettre à niveau la version Kubernetes d'une grappe en cours
  d'exécution (`--version v1.x.y`) ; la version adaptée à la région de la grappe est résolue
  automatiquement.

### v0.0.11 : 8 juin 2026

- **`instance create --user-data` / `--user-data-file`** : fournir un script cloud-init / de
  démarrage en ligne ou depuis un fichier à la création d'une VM.
- **Corrections** : l'IP privée d'une instance s'affiche correctement, et `instance get` réessaie
  pendant le bref intervalle suivant la création ; `instance create --blockstorage-plan` est
  maintenant optionnel (attribué automatiquement).

### v0.0.10 : 7 juin 2026

- **Stockage objet** introduit : gérer des instances de stockage compatibles S3 (lister, obtenir,
  créer, supprimer, redimensionner), des compartiments (lister, obtenir, créer, supprimer) et des
  objets (lister, obtenir, téléverser, supprimer), plus `credentials` pour afficher les clés d'accès
  S3.
- **Commandes de suppression** ajoutées pour les instances, réseaux, volumes, instantanés,
  sauvegardes, VPC et sauvegardes de VM (`instance delete --force` pour purge immédiate).
- **Kubernetes** : `scale` des nœuds de travail (avec `--wait`) et `get-config` (télécharger le
  kubeconfig).
- **Équilibreur de charge** : `delete-rule` et `detach-vm`.

### v0.0.9 : 14 avril 2026

- **Variables d'environnement** : `ZCP_PROJECT`, `ZCP_REGION`, `ZCP_CLOUD_PROVIDER`, `ZCP_OUTPUT`,
  `ZCP_DEBUG` réduisent les options répétitives dans les scripts et l'intégration continue.
- **Mode zéro configuration** : fonctionner avec seulement `ZCP_BEARER_TOKEN` et `ZCP_API_URL`, sans
  fichier de configuration ; `ZCP_PROFILE` sélectionne le profil actif.

### v0.0.8 : 9 avril 2026

- **Création de tiers/sous-réseaux VPC** confirmée de bout en bout, avec l'ajout des options
  `--cloud-provider`, `--region` et `--project` aux commandes de création de réseau, VPC, routeur
  virtuel, DNS, VPN et autoscale.
- Une **feuille de route** publiée documentant ce qui fonctionne, ce qui s'en vient et ce qui est en
  attente.

### v0.0.7 : 8 avril 2026

- **Nouvelles commandes** : `region list`, `profile-info` (gestion du profil utilisateur),
  `vm-backup`, et des commandes de découverte : `cloud-provider list`, `server list`,
  `currency list`, `billing-cycle list`, `storage-category list`.
- **Nettoyage** : suppression des commandes héritées qui visaient des points de terminaison retirés.

### v0.0.6 : 8 avril 2026

Reconstruit sur l'API actuelle de la plateforme infonuagique ZSoftly avec **authentification par
jeton Bearer** et un format de réponse cohérent. Un grand ensemble de groupes de commandes est
arrivé :

- **DNS**, **projets**, **surveillance**, **facturation**, **support**, **autoscale**, **tableau de
  bord**, **plans**, **boutique**, **place de marché**, **produits**, **ISO**, **groupes
  d'affinité** et **sauvegardes**.
- **Opérations VM** : redémarrer, réinitialiser, étiquettes, changer nom d'hôte/mot de
  passe/plan/OS, ajouter un réseau, modules complémentaires.
- **`--auto-approve` / `-y` global** pour ignorer les invites de confirmation en automatisation.

### v0.0.5 : 31 mars 2026

- **Corrections de fiabilité** : les commandes de suppression vérifient que la ressource a bien
  disparu ; la liste des volumes déduplique les entrées ; messages plus clairs pour les instantanés
  sur volumes détachés et les comptes vides.

### v0.0.4 : 27 mars 2026

- **Réseaux de tier VPC** : `vpc create-network` et `vpc update-network`.

### v0.0.3 : 27 mars 2026

- Ajout de **`host list`**, **`resource quota`**, des options de tier VPC sur `network create`, et
  d'une suite de tests d'intégration complète.

### v0.0.2 : 23 mars 2026

- **Zone par défaut par profil** : définissez-la une fois et cessez de taper `--zone` à chaque
  commande ; une option explicite a toujours priorité.

### v0.0.1 : 15 mars 2026

- **Version initiale** du CLI `zcp` : 28 commandes de premier niveau couvrant le calcul, le
  stockage, le réseau, la sécurité, Kubernetes et la facturation.
- **Profils nommés** avec stockage sécurisé des identifiants (`0600`), une option **`--wait`** pour
  les opérations asynchrones, **`instance ssh`**, la **complétion** (bash/zsh/fish/PowerShell), une
  option **`--pager`**, et des **binaires multiplateformes** (Linux/macOS/Windows, amd64/arm64) avec
  des installateurs en une ligne.

## Fournisseur Terraform / OpenTofu

Gérez l'infrastructure ZCP comme du code. Le fournisseur est en développement actif sur
[github.com/zsoftly/terraform-provider-zcp](https://github.com/zsoftly/terraform-provider-zcp) ; les
versions publiées seront listées ici.
