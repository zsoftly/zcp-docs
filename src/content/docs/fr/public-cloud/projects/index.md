---
title: Projets
description:
  Ce que sont les projets dans ZSoftly Public Cloud, et comment en créer un, ajouter des
  utilisateurs et définir des quotas de ressources.
---

Un **Projet** est un espace de travail qui regroupe des ressources infonuagiques connexes (instances
de calcul, réseaux, volumes, instantanés, équilibreurs de charge, etc.) dans un même périmètre
partagé. Au lieu de laisser les ressources dispersées sous un compte, un projet permet à une équipe
de collaborer sur un ensemble de ressources avec ses propres membres et quotas.

Les projets sont un concept fondamental : presque toutes les ressources que vous créez, comme une
instance, un réseau ou un volume de stockage bloc, sont assignées à un projet. Si un sélecteur vous
demande de choisir un **Projet** pendant la création d'une ressource, il fait référence à ce modèle.
Chaque compte commence avec un projet par défaut. Créez des projets supplémentaires pour séparer les
environnements (`dev` et `prd`, par exemple), les équipes ou les clients.

## Pourquoi utiliser des projets

- **Collaboration** : ajoutez des collègues afin que tous puissent consulter et gérer les mêmes
  ressources sans partager un identifiant.
- **Séparation** : isolez les charges de travail. Un projet `dev` et un projet `prd` contiennent des
  instances, réseaux et volumes complètement distincts.
- **Contrôle des coûts et des quotas** : définissez des limites de ressources par projet afin qu'une
  équipe ou un environnement ne dépasse pas son allocation.
- **Organisation** : consultez les listes de ressources, l'utilisation et la facturation par projet
  pour comprendre ce que chaque équipe ou environnement exécute.

## Créer un nouveau projet

- Dans le menu de gauche, cliquez sur **Projets**.
- Cliquez sur **Créer un nouveau projet**.
- Entrez les détails du projet :
  - **Nom du projet** : un nom court et reconnaissable, par exemple `team-platform-prd`.
  - **Description du projet** : l'objectif du projet.
  - **Objectif du projet** : l'utilisation prévue ou l'équipe responsable.
- Cliquez sur **Créer le projet**. Le projet est créé et devient disponible dans le sélecteur
  **Projet** lors de la création de ressources.

![Boîte de dialogue Créer un nouveau projet avec les champs nom, description et objectif](../../../../../assets/projects/projects-create-a-new-project.webp)

## Ressources du projet

Une fois le projet créé, sa vue d'ensemble affiche les ressources qui lui sont associées. À partir
de cette page, vous pouvez consulter et gérer tout ce qu'il contient :

| Ressource                 | Description                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------- |
| **Instance de calcul**    | Serveurs virtuels pour exécuter des applications ou héberger des sites Web.           |
| **Instantané de VM**      | Capture ponctuelle de l'état et des données d'une instance.                           |
| **Sauvegarde**            | Sauvegardes gérées pour protéger les données et soutenir la continuité des activités. |
| **Stockage bloc**         | Volumes de stockage supplémentaires attachés aux instances.                           |
| **Réseau**                | Réseaux publics et privés (VPC) qui connectent et isolent les ressources.             |
| **Équilibreur de charge** | Répartit le trafic entre plusieurs instances pour la haute disponibilité.             |

Lorsque vous créez l'une de ces ressources, vous sélectionnez le projet auquel elle appartient.
Consultez [Créer une instance de calcul](../compute/create-instance) pour voir un exemple du
sélecteur de projet.

## Ajouter des utilisateurs à un projet

Invitez des collègues afin qu'ils puissent collaborer sur les ressources du projet.

- Ouvrez le projet, puis cliquez sur **Ajouter des utilisateurs au projet**.
- Utilisez la barre de recherche pour trouver l'utilisateur à ajouter.
- Cliquez sur **Ajouter** pour l'inclure dans le projet.

L'utilisateur ajouté peut maintenant consulter et gérer les ressources de ce projet.

![Vue Ajouter des utilisateurs au projet avec la barre de recherche et l'action Ajouter](../../../../../assets/projects/projects-add-users-to-a-project.webp)

## Définir les limites et les quotas du compte

Les limites de compte plafonnent la quantité de chaque ressource qu'un projet peut consommer, par
emplacement. Utilisez-les pour éviter une consommation excessive et répartir la capacité
équitablement entre les équipes ou les environnements.

- Ouvrez le projet, puis allez à la section **Limite de compte du projet**. Vous y verrez la limite
  actuelle et l'utilisation de chaque ressource.
- Sélectionnez l'**Emplacement** pour lequel définir les limites.
- Cliquez sur **Edit Account Limit** pour ouvrir la page **Assigner un quota au projet**.
- Choisissez l'**Emplacement** et la **Ressource** dont vous voulez modifier le quota.
- Entrez la **Limite de quota** souhaitée.

:::tip

Définir une limite de quota à `-1` accorde un quota **illimité** pour cette ressource.

:::

- Cliquez sur **Soumettre** pour appliquer la nouvelle limite.

![Section Limite du compte du projet affichant le quota et l'utilisation par ressource et par emplacement](../../../../../assets/projects/projects-set-account-limits-and-quotas.webp)

## Prochaines étapes

- [Créer une instance de calcul](../compute/create-instance) : déployez votre première VM dans un
  projet.
- [Démarrage rapide](../getting-started/quickstart) : passez de zéro à une VM fonctionnelle et
  accessible.
- [Réseautage](../networking/public-network/create) : donnez de la connectivité aux ressources de
  votre projet.
