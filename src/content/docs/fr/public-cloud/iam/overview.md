---
title: Vue d'ensemble IAM
description: >-
  Fonctionnement de la gestion des identités et des accès dans ZSoftly Public Cloud : utilisateurs,
  rôles et accès limités aux projets.
---

La **gestion des identités et des accès (IAM)** contrôle qui peut se connecter à votre organisation
et ce que chaque personne est autorisée à faire. ZSoftly Public Cloud utilise le **contrôle d'accès
fondé sur les rôles (RBAC)** : au lieu d'accorder les permissions une par une, vous définissez des
**rôles** qui regroupent un ensemble de permissions, puis vous assignez un rôle à chaque
**utilisateur**.

## Le modèle

| Concept                    | Définition                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Propriétaire du compte** | Titulaire principal du compte. Dispose d'un accès complet et gère les utilisateurs, les rôles et les paramètres de l'organisation. |
| **Utilisateur**            | Personne invitée dans votre organisation. Chaque utilisateur reçoit un rôle.                                                       |
| **Rôle**                   | Ensemble nommé de permissions, par exemple un rôle _Comptable_ avec accès seulement à la facturation.                              |
| **Permission**             | Capacité d'effectuer une action précise ou d'accéder à une fonctionnalité précise.                                                 |
| **Portée du projet**       | Restriction facultative qui limite un utilisateur à certains [Projets](/fr/public-cloud/projects).                                 |

## Fonctionnement

- Le **propriétaire du compte** crée des **rôles** avec les permissions exactes requises pour une
  fonction. Par exemple, un rôle _Comptable_ peut inclure seulement les permissions de facturation,
  tandis qu'un rôle _Développeur_ peut inclure des permissions de calcul et de réseautage.
- Le propriétaire **invite les utilisateurs** et assigne un rôle à chacun, afin qu'ils obtiennent
  uniquement les accès accordés par ce rôle.
- L'accès peut être **limité à des [Projets](/fr/public-cloud/projects) précis**, afin qu'un
  utilisateur voie et gère seulement les ressources des projets auxquels il est autorisé. Cette
  approche combine le RBAC, qui définit les actions permises, avec les projets, qui définissent les
  ressources visées.

Chaque compte inclut trois rôles intégrés : **Owner**, **Service Administrator** et **Service
Viewer**. Vous pouvez définir vos propres rôles dans
[Rôles et permissions](/fr/public-cloud/iam/roles), où se trouve aussi le catalogue complet des
permissions.

:::tip

Appliquez le principe du **moindre privilège** : accordez à chaque rôle le plus petit ensemble de
permissions permettant aux utilisateurs de faire leur travail, et limitez les utilisateurs aux seuls
projets nécessaires.

:::

## Où gérer l'IAM

Tous les paramètres IAM se trouvent dans le menu **Profil**, accessible en cliquant sur votre **nom
d'utilisateur** dans le coin supérieur droit du portail :

- [Utilisateurs](/fr/public-cloud/iam/users) : inviter, modifier, réinviter et désactiver les
  personnes de votre organisation.
- [Rôles et permissions](/fr/public-cloud/iam/roles) : créer des rôles personnalisés et assigner des
  permissions.
- [Sécurité du compte](/fr/public-cloud/iam/security) : authentification à deux facteurs et gestion
  des mots de passe.

Pour les paramètres personnels, comme vos renseignements, le thème, le fuseau horaire, les journaux
d'activité et l'historique de connexion, consultez
[Configuration du profil](/fr/public-cloud/getting-started/profile-setup).
