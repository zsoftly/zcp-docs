---
title: Rôles et permissions
description:
  Rôles intégrés, catalogue complet des permissions et création de rôles personnalisés dans ZSoftly
  Public Cloud.
---

Un **rôle** est un ensemble nommé de permissions. Plutôt que d'accorder les accès à chaque
utilisateur individuellement, vous définissez les rôles une fois, puis vous les assignez aux
[utilisateurs](/fr/public-cloud/iam/users). Toute modification des permissions d'un rôle s'applique
à tous les utilisateurs qui possèdent ce rôle.

Chaque service de la plateforme expose deux niveaux de permission :

- **Read** : consulter la ressource sans la modifier.
- **Manage** : créer, mettre à jour, supprimer et exploiter la ressource. **Manage** inclut tout ce
  que **Read** permet.

## Rôles intégrés

Trois rôles sont fournis avec chaque compte. Vous pouvez les assigner tels quels ou les utiliser
comme point de départ pour créer des rôles personnalisés.

| Rôle                      | Description                                    | Accès                                                                                                                                                    |
| ------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Owner**                 | Rôle par défaut du titulaire du compte.        | Accès complet **Read + Manage** à tous les services, y compris Users, Roles, Profile, Billing et **Quota**. C'est le seul rôle qui inclut l'accès Quota. |
| **Service Administrator** | Peut accéder à tous les services et les gérer. | **Manage** sur tous les services infonuagiques, ainsi que Users, Roles, Profile et Billing. N'inclut pas Quota.                                          |
| **Service Viewer**        | Peut consulter tous les services.              | **Read** sur tous les services. Aucune création, mise à jour ni suppression.                                                                             |

:::note

Seul le rôle **Owner** inclut les permissions **Quota**. Si un sous-utilisateur doit modifier les
quotas de ressources, cette capacité ne peut pas être déléguée avec **Service Administrator**.
Conservez les changements de quotas sous la responsabilité du propriétaire du compte.

:::

## Créer un rôle personnalisé

Lorsque les rôles intégrés sont trop larges, créez un rôle avec les permissions exactes requises par
une fonction.

- Cliquez sur votre **nom d'utilisateur** (en haut à droite) pour ouvrir le menu **Profil**, puis
  sélectionnez **Roles**.
- Cliquez sur **Add New Role** ou sur l'icône **+**.
- Entrez un **Role Name** et une **Description**. Les deux champs sont requis.
- Dans le panneau **Features**, choisissez un service, par exemple **Virtual Machine**.
- Dans le panneau **Select Permissions**, choisissez les permissions du service, par exemple
  **Virtual Machine Read** ou **Virtual Machine Manage**. Utilisez **Select All** pour accorder
  toutes les permissions de la fonctionnalité sélectionnée.
- Répétez l'opération pour chaque service que le rôle doit couvrir.
- Cliquez sur **Create Role**.

Le rôle est ensuite disponible lorsque vous
[ajoutez ou modifiez un utilisateur](/fr/public-cloud/iam/users).

:::tip

Appliquez le **moindre privilège** : commencez sans permission, puis ajoutez seulement ce qui est
nécessaire. Accordez **Read** lorsqu'une personne a seulement besoin de visibilité, et réservez
**Manage** aux ressources qu'elle doit réellement exploiter. Combinez le rôle avec la
[portée par projet](/fr/public-cloud/iam/users#restreindre-un-utilisateur-à-des-projets-précis) pour
limiter aussi _les ressources_ visées.

:::

### Exemple

Un propriétaire de compte crée un rôle **Accountant** qui accorde seulement **Billing Read**,
**Billing Manage** et **Store Read**. Un sous-utilisateur avec ce rôle peut travailler avec les
factures, les paiements et la boutique, mais n'a aucun accès pour créer ou supprimer des instances,
des réseaux ou d'autres ressources d'infrastructure. Un rôle **Developer** distinct pourrait
accorder **Virtual Machine Manage**, **Stockage bloc Manage** et **Réseau Manage**, tout en excluant
la facturation.

## Gérer les rôles avec la CLI

Tout ce qui précède est aussi disponible dans la [CLI ZCP](/fr/public-cloud/cli/installation). Les
commandes de rôle sont de niveau compte ; elles n'ont donc pas besoin de `--region`/`--project`.
Utilisez les slugs de la [référence des permissions](#référence-des-permissions) ci-dessous. La
commande `zcp permission list` les affiche.

```bash
# Découvrir les slugs de permissions (filtrer par catégorie au besoin)
zcp permission list
zcp permission list --category "Virtual Machine"

# Inspecter les rôles intégrés et ce qu'ils accordent
zcp role list
zcp role get service-administrator

# Créer un rôle personnalisé à partir de slugs (au moins un est requis)
zcp role create --name "Developer" --description "Calcul et réseau" \
  --permission virtual-machine-read --permission virtual-machine-manage \
  --permission block-storage-manage --permission network-manage

# Modifier un rôle. --permission REMPLACE tout l'ensemble (ce n'est pas additif) ;
# listez donc toutes les permissions souhaitées. Les options omises restent inchangées.
zcp role update developer \
  --permission virtual-machine-read --permission virtual-machine-manage \
  --permission block-storage-manage --permission network-manage --permission dns-read

# Supprimer un rôle personnalisé
zcp role delete developer
```

:::note

Les rôles intégrés **Owner**, **Service Administrator** et **Service Viewer** ne peuvent être ni
modifiés ni supprimés. La CLI rejette ces opérations avec un message clair.

:::

## Référence des permissions

Le catalogue complet des permissions est regroupé par domaine. La plupart des services offrent
**Read** et **Manage**; quelques-uns sont en lecture seule.

### Calcul

| Service                     | Permissions   | Donne accès à                                                                                  |
| --------------------------- | ------------- | ---------------------------------------------------------------------------------------------- |
| Virtual Machine             | Read / Manage | Consulter les instances / créer, mettre à jour, supprimer et exploiter les instances           |
| Virtual Machine Instantané  | Read / Manage | Consulter les instantanés de VM / créer, mettre à jour, supprimer et restaurer des instantanés |
| Virtual Machine Sauvegardes | Read / Manage | Consulter les sauvegardes de VM / créer, mettre à jour, supprimer et restaurer des sauvegardes |
| VM Autoscale                | Read / Manage | Consulter l'autoscaling / configurer et gérer l'autoscaling des VM                             |
| Affinity Groups             | Read / Manage | Consulter, créer, mettre à jour et supprimer des groupes d'affinité                            |
| Templates                   | Read / Manage | Consulter, créer, mettre à jour et supprimer des modèles                                       |
| ISO                         | Read / Manage | Consulter, importer et gérer des ISO                                                           |
| Marketplace App             | Read only     | Consulter les applications du marché                                                           |
| Monitoring                  | Read only     | Consulter les données de surveillance                                                          |

### Conteneurs

| Service    | Permissions   | Donne accès à                                                                |
| ---------- | ------------- | ---------------------------------------------------------------------------- |
| Kubernetes | Read / Manage | Consulter les grappes / créer, mettre à jour, supprimer et gérer les grappes |

### Stockage

| Service                  | Permissions   | Donne accès à                                                                           |
| ------------------------ | ------------- | --------------------------------------------------------------------------------------- |
| Stockage bloc            | Read / Manage | Consulter les volumes / créer, mettre à jour, supprimer et attacher des volumes         |
| Stockage bloc Instantané | Read / Manage | Consulter les instantanés de volume / créer, mettre à jour et supprimer des instantanés |
| Stockage bloc Backup     | Read / Manage | Consulter les sauvegardes de volume / créer, mettre à jour et supprimer des sauvegardes |
| Stockage objet           | Read / Manage | Consulter le stockage objet / créer et gérer les compartiments et les clés d'accès      |

### Réseautage

| Service               | Permissions   | Donne accès à                                                                             |
| --------------------- | ------------- | ----------------------------------------------------------------------------------------- |
| VPC                   | Read / Manage | Consulter, créer, mettre à jour, supprimer et exploiter des VPC                           |
| Réseau                | Read / Manage | Consulter, créer, mettre à jour et supprimer des réseaux                                  |
| Virtual Router        | Read / Manage | Consulter, créer, mettre à jour, supprimer et exploiter des routeurs virtuels             |
| Équilibreur de charge | Read / Manage | Consulter, créer, mettre à jour et supprimer des équilibreurs de charge                   |
| VPN                   | Read / Manage | Consulter, créer, mettre à jour, supprimer et exploiter des connexions VPN                |
| IP Address            | Read / Manage | Consulter, acquérir, assigner et libérer des adresses IP                                  |
| Sécurité Group        | Read / Manage | Consulter, créer, mettre à jour, supprimer et appliquer des règles de groupes de sécurité |
| DNS                   | Read / Manage | Consulter le DNS / gérer les domaines et les enregistrements DNS                          |

### Organisation et accès

| Service  | Permissions   | Donne accès à                                                 |
| -------- | ------------- | ------------------------------------------------------------- |
| Projet   | Read / Manage | Consulter, créer, mettre à jour et supprimer des projets      |
| Sub User | Read / Manage | Consulter, créer, mettre à jour et supprimer des utilisateurs |
| Role     | Read / Manage | Consulter, créer, mettre à jour et supprimer des rôles        |
| Profile  | Read / Manage | Consulter le profil / mettre à jour les paramètres du profil  |

### Facturation

| Service | Permissions   | Donne accès à                                                  |
| ------- | ------------- | -------------------------------------------------------------- |
| Billing | Read / Manage | Consulter la facturation / gérer les paramètres de facturation |
| Quota   | Read / Manage | Consulter les quotas / gérer les quotas de ressources          |
| Store   | Read / Manage | Consulter la boutique / gérer les achats dans la boutique      |

### Soutien

| Service              | Permissions   | Donne accès à                                                     |
| -------------------- | ------------- | ----------------------------------------------------------------- |
| Support Ticket       | Read / Manage | Consulter les billets / créer, mettre à jour et gérer des billets |
| Support Ticket Reply | Read / Manage | Consulter les réponses aux billets / envoyer des réponses         |

## Voir aussi

- [Utilisateurs](/fr/public-cloud/iam/users) : assignez un rôle lorsque vous invitez une personne.
- [Vue d'ensemble IAM](/fr/public-cloud/iam/overview) : comprenez comment les rôles, utilisateurs et
  portées de projet s'articulent.
