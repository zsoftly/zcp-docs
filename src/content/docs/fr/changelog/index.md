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

### v0.0.26 : 19 juillet 2026

**Correctifs pour la redirection de ports et les clés SSH.**

- **`portforward list` affiche de nouveau les ports.** Les colonnes des ports publics et privés
  étaient vides, car la réponse était lue à partir de noms de champs incorrects. Elles s'affichent
  maintenant correctement.
- **`portforward create` et `firewall create` n'affichent plus de tableau vide.** Les deux commandes
  créent la règle de manière asynchrone et ne renvoient aucun objet. Elles indiquent donc désormais
  que la demande a été acceptée et vous dirigent vers la commande `list` correspondante.
- **`ssh-key delete` accepte l'identifiant, le nom ou le slug de la clé.** La commande n'acceptait
  auparavant que le slug et rejetait l'identifiant affiché par `ssh-key list`. La suppression d'une
  clé inconnue est maintenant une opération sans effet.

### v0.0.25 : 18 juillet 2026

**Les enregistrements `MX` fonctionnent désormais depuis le CLI.** `zcp dns record-create`
n'envoyait jamais la priorité de l'enregistrement. Chaque création d'un `MX` échouait donc avec une
erreur d'API. La commande reçoit maintenant l'option `--priority` (de 0 à 65535, obligatoire pour
`MX`). Placez le serveur de courrier dans `--content` et le nombre de préférence dans `--priority`.
Une préférence de `0` est envoyée correctement. Le CLI refuse `--priority` pour les autres types et
affiche un message clair. Voir [Gérer le DNS avec le CLI](/fr/public-cloud/dns/cli).

```bash
zcp dns record-create --domain examplecom --name @ --type MX --content mail.example.com. --priority 10
```

### v0.0.24 : 16 juillet 2026

**La suppression d'une VM libère maintenant son IP publique.** `instance delete` passe par le même
flux d'annulation de service que la console. L'adresse attribuée automatiquement est donc libérée au
lieu de rester allouée et facturable. L'IP publique d'un répartiteur de charge constitue une
ressource distincte et réutilisable. Elle est conservée par défaut. Ajoutez `--release-ip` à
`loadbalancer delete` pour la libérer aussi.

- **`instance list` et `instance get` affichent maintenant l'IP publique**, et `get` affiche le
  cycle de facturation.
- **`ip list` et `loadbalancer list` renvoient tous les résultats** au lieu de s'arrêter à la
  première page.
- **Le CLI et son SDK sont maintenant sous licence Apache 2.0**, ce qui permet au fournisseur
  Terraform / OpenTofu d'intégrer le SDK.

### v0.0.23 : 8 juillet 2026

**`--wait` rapporte désormais l'état réel de l'instance.** L'état en cache de la plateforme accuse
parfois plusieurs minutes de retard sur la réalité, si bien que `instance create/start/stop --wait`
continuait d'attendre une VM déjà démarrée. Le CLI interroge maintenant le point de terminaison
d'état en direct, réconcilié avec l'hyperviseur, et rend la main dès que la VM est en marche.

- **Aide corrigée pour `instance delete --delete-public-ip`** : la plateforme ne libère pas encore
  l'adresse IP publique attribuée automatiquement lors de la suppression (un correctif est en cours
  côté API). L'option, l'invite et l'aide l'indiquent désormais clairement. Libérez l'adresse
  manuellement avec `zcp ip release <ip-slug>` après la suppression.

### v0.0.22 : 7 juillet 2026

**Les enregistrements DNS s'affichent et se suppriment correctement.** Le service DNS modélise les
enregistrements comme des ensembles d'enregistrements adressés par nom et type. `zcp dns show` et
`record-create` affichent maintenant le contenu des enregistrements (ensembles à valeurs multiples
inclus), et `dns record-delete` fonctionne avec `--name` et `--type`. Les noms d'enregistrements
sont relatifs : le CLI ajoute la zone pour vous.

- **`egress create` rapporte honnêtement** lorsque la plateforme accepte une règle qui n'apparaît
  jamais dans la liste des règles, au lieu d'échouer avec une erreur de recherche déroutante.
- **La validation automatisée couvre désormais la référence des commandes** : un script confronte
  les 264 exemples au CLI compilé, et nous avons réécrit six sections selon les arborescences
  réelles des commandes.
- **Les instances L2 fonctionnent et les exemples de `instance create` s'exécutent tels quels**,
  contribution de [@cokerrd](https://github.com/cokerrd), qui signe ici sa première contribution
  communautaire : la nouvelle option `--is-public` débloque `--network-type L2`, et les options
  requises `--network-plan` et `--storage-category` figurent désormais dans chaque exemple.

### v0.0.21 : 2 juillet 2026

**Les valeurs par défaut du profil s'appliquent maintenant aux commandes de création.** Avec des
valeurs par défaut configurées via `zcp profile add`, les commandes de création et de modification
n'exigent plus `--region`/`--project`. Configurez-les une fois, comme le permettaient déjà les
commandes de liste et de lecture.

- **Accompagnement au premier lancement** : les installateurs affichent la configuration à
  copier-coller pour les valeurs par défaut de production (`--region yul-1 --project default-9`),
  reprises dans toute la documentation.
- **Nous confrontons chaque slug d'exemple au catalogue en production** (modèles, plans, plans de
  sauvegarde et d'équilibreur de charge), donc les exemples s'exécutent tels quels.

### v0.0.20 : 30 juin 2026

**`zcp instance delete` demande par défaut la libération de l'adresse IP publique attribuée
automatiquement**, pour ne plus laisser d'adresses allouées et facturées après la suppression de la
VM. Passez `--delete-public-ip=false` pour conserver l'adresse. Les adresses acquises manuellement
et les adresses source-NAT ne sont pas touchées. Voir la note de la v0.0.23 : la libération côté
plateforme n'est pas encore active.

### v0.0.19 : 21 juin 2026

**Gérer l'IAM depuis la CLI : sous-utilisateurs, rôles et permissions.** Tout ce qui se trouve dans
la section Profil du portail est maintenant scriptable. Ces commandes sont de niveau compte (aucun
`--region`/`--project`). Voir [Rôles et permissions](/fr/public-cloud/iam/roles) et
[Utilisateurs](/fr/public-cloud/iam/users).

- **`zcp permission list`** : parcourir le catalogue des permissions (filtrer avec `--category`)
  pour trouver les slugs à attribuer aux rôles.
- **`zcp role`** : `list`, `get <slug>` (affiche les permissions et les utilisateurs assignés),
  `create`, `update` et `delete`. `--permission` est répétable et **remplace** tout l'ensemble du
  rôle ; les rôles intégrés `owner`/`service-administrator`/`service-viewer` sont protégés contre
  les modifications.
- **`zcp sub-user`** : `list` (avec les filtres `--role`/`--blocked`), `create`, `update`, `block`,
  `unblock` et `delete`. Les sous-utilisateurs sont désignés par **ID ou courriel** ; les nouveaux
  sous-utilisateurs sont bloqués jusqu'à ce que vous les débloquiez.

**Équilibreurs de charge et références d'instances.**

- **`zcp loadbalancer create` fonctionne** : la commande envoie désormais la première règle requise
  (`--public-port`/`--private-port`/`--algorithm`) et peut attacher des serveurs dorsaux avec
  `--vm`.
- **Désigner une instance par ID, nom ou slug** dans chaque sous-commande `instance`, avec une
  erreur claire quand un nom est ambigu ; `instance list` affiche maintenant la colonne `ID` et
  renvoie **toutes** les VM (la liste est paginée).
- **`reboot` refuse une VM qui n'est pas `Running`** au lieu de l'ignorer silencieusement, et
  `-o json`/`-o yaml` renvoient des objets complets.

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

Gérez l'infrastructure ZCP comme du code avec le fournisseur officiel, publié sous `zsoftly/zcp` sur
le [registre OpenTofu](https://search.opentofu.org/provider/zsoftly/zcp) et le
[registre Terraform](https://registry.terraform.io/providers/zsoftly/zcp). Le code source se trouve
sur [github.com/zsoftly/terraform-provider-zcp](https://github.com/zsoftly/terraform-provider-zcp).

### v0.1.3 : 20 juillet 2026

**La redirection de port et les règles de pare-feu enregistrent maintenant leur véritable ID.**
`zcp_port_forward` et `zcp_firewall_rule` stockaient un ID vide parce que le point de terminaison de
création ne renvoie aucun objet de règle. Terraform les recréait donc à chaque application. Les deux
ressources recherchent maintenant la règle après sa création, la font correspondre selon le
protocole et les ports, puis enregistrent le véritable ID. Les plans restent ainsi stables.

- Passage du SDK du CLI `zcp` à la v0.0.26, qui corrige le décodage des ports des règles de
  redirection de port.
- **Sécurité** : mise à niveau de `golang.org/x/text` pour corriger GO-2026-5970, une boucle infinie
  accessible par la ressource de répartiteur de charge.

### v0.1.2 : 18 juillet 2026

**Les enregistrements `MX` dans `zcp_dns_record`.** Un nouvel argument `priority`, de 0 à 65535,
définit le nombre de préférence. Placez le serveur de courrier dans `content`. La priorité est
obligatoire pour `MX` et refusée pour tous les autres types. Ces deux règles sont vérifiées pendant
la planification afin qu'une erreur survienne avant l'application. Cette version repose sur le SDK
du CLI `zcp` v0.0.25 et a été vérifiée avec l'API DNS en production.

- **La valeur `SRV` a été retirée des valeurs de `type` documentées.** L'API DNS refuse les
  enregistrements `SRV` et `LOC`. La présentation de `SRV` induisait donc en erreur. `type` demeure
  une chaîne libre.

### v0.1.1 : 18 juillet 2026

**Les destructions libèrent les IP publiques attribuées automatiquement.** `zcp_instance` et
`zcp_load_balancer` libèrent ces adresses au moyen du flux d'annulation de service. Une destruction
ne laisse donc plus d'adresse facturable. Définissez `assign_public_ip = false` pour créer une
instance sans IP publique. Cette version passe aussi au SDK du CLI `zcp` v0.0.24, qui parcourt
toutes les pages des listes d'IP publiques et de répartiteurs de charge.

### v0.1.0 : 8 juillet 2026

**Première version publique, disponible sur les deux registres.** 38 ressources et 12 sources de
données couvrent tout ce que le CLI `zcp` prend en charge : instances, volumes, instantanés et
sauvegardes, VPC et réseaux, règles de pare-feu et de sortie, équilibreurs de charge, mise à
l'échelle automatique, grappes Kubernetes, DNS, stockage objet, VPN et gouvernance de compte. Chaque
ressource prend en charge `terraform import`, et nous signons chaque version publiée.

```hcl
terraform {
  required_providers {
    zcp = {
      source  = "zsoftly/zcp"
      version = "~> 0.1"
    }
  }
}
```

Définissez `ZCP_BEARER_TOKEN` dans votre environnement, puis exécutez `terraform init` ou
`tofu init`. Générez le jeton dans la console sous **Compte → Clés API**.
