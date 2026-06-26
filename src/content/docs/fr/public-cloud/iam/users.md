---
title: Utilisateurs
description:
  Inviter, gérer, réinviter et désactiver des utilisateurs dans votre organisation ZSoftly Public
  Cloud.
---

La section **Users** permet d'ajouter des personnes à votre organisation et de contrôler leurs
accès. Chaque utilisateur se connecte avec ses propres identifiants et reçoit un
[rôle](/fr/public-cloud/iam/roles) qui détermine ce qu'il peut faire.

## Consulter les utilisateurs

- Dans le menu de gauche, accédez à la section **Profile**.
- Sélectionnez **Users** pour afficher la liste complète des utilisateurs actifs et inactifs de
  votre organisation.

Depuis la liste, utilisez les boutons d'action pour modifier les renseignements ou le rôle d'un
utilisateur, ou pour réinviter un utilisateur dont l'invitation est encore en attente.

:::caution

Le portail n'a pas encore de bouton **Supprimer l'utilisateur**. La suppression depuis le portail
est prévue pour une version future.

Pour retirer l'accès d'une personne depuis le portail, **bloquez** (désactivez) l'utilisateur à
l'aide des boutons d'action de la liste Users. Le compte reste dans votre organisation mais perd
l'accès à la plateforme.

Pour supprimer un compte, utilisez la [CLI ZCP](/fr/public-cloud/cli/installation)
(`zcp sub-user delete`) ou l'API.

:::

:::note

Captures d'écran à venir.

:::

## Ajouter un nouvel utilisateur

- Dans le menu de gauche, accédez à la section **Profile**.
- Sélectionnez **Users**, puis cliquez sur **Add User**.
- Entrez les renseignements de l'utilisateur et sélectionnez son **Role**. Consultez
  [Rôles et permissions](/fr/public-cloud/iam/roles) pour créer un rôle d'abord si celui dont vous
  avez besoin n'existe pas encore.
- Cliquez sur **Soumettre** pour créer l'utilisateur.

L'utilisateur reçoit une invitation et, une fois celle-ci acceptée, peut se connecter avec les
permissions accordées par son rôle.

:::note

Captures d'écran à venir.

:::

## Restreindre un utilisateur à des projets précis

Vous pouvez limiter un utilisateur à certains [Projets](/fr/public-cloud/projects), afin qu'il voie
et gère seulement les ressources des projets auxquels il est autorisé. Cette restriction complète le
rôle : le rôle contrôle _les actions_ permises, tandis que la portée du projet contrôle _les
ressources_ auxquelles ces actions s'appliquent.

:::tip

Associez un rôle à moindre privilège à une portée de projet stricte pour les sous-utilisateurs. Par
exemple, un rôle _Développeur_ limité au seul projet `dev`.

:::

## Gérer les sous-utilisateurs avec la CLI

Les mêmes actions sont disponibles dans la [CLI ZCP](/fr/public-cloud/cli/installation). Les
commandes de sous-utilisateur sont de niveau compte (aucun `--region`/`--project`), et un
sous-utilisateur peut être désigné par son **ID** ou son **courriel**.

```bash
# Lister les sous-utilisateurs (filtrer par rôle ou état bloqué au besoin)
zcp sub-user list
zcp sub-user list --role service-administrator
zcp sub-user list --blocked

# Créer un sous-utilisateur. --email doit être une adresse d'entreprise. --password
# exige 8+ caractères avec majuscules/minuscules, un chiffre et un symbole. --role est
# un slug de rôle (voir `zcp role list`). --project est répétable. Les nouveaux
# sous-utilisateurs sont bloqués jusqu'à ce que vous les débloquiez.
zcp sub-user create --name "Jane Doe" --email jane@yourco.com \
  --password 'S3cret!pass' --role service-viewer --project default-9

# Changer le rôle ou les projets d'un sous-utilisateur (désigné par courriel ou ID)
zcp sub-user update jane@yourco.com --role service-administrator

# Révoquer ou rétablir l'accès sans supprimer le compte
zcp sub-user block jane@yourco.com
zcp sub-user unblock jane@yourco.com

# Supprimer complètement un sous-utilisateur
zcp sub-user delete jane@yourco.com
```

## Voir aussi

- [Rôles et permissions](/fr/public-cloud/iam/roles) : définissez ce qu'un utilisateur est autorisé
  à faire.
- [Vue d'ensemble IAM](/fr/public-cloud/iam/overview) : comprenez le modèle RBAC.
