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

## Voir aussi

- [Rôles et permissions](/fr/public-cloud/iam/roles) : définissez ce qu'un utilisateur est autorisé
  à faire.
- [Vue d'ensemble IAM](/fr/public-cloud/iam/overview) : comprenez le modèle RBAC.
