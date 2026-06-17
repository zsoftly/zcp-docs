---
title: Instance de calcul
sidebar_position: 1
---

Une **instance de calcul** est un serveur virtuel dans le nuage, semblable à un ordinateur physique.
Elle possède son propre CPU, sa mémoire et son stockage, ce qui vous permet d'installer des
logiciels, d'exécuter des applications ou d'héberger des sites Web. Les instances de calcul sont un
composant fondamental de ZSoftly Public Cloud et vous permettent de lancer et de faire évoluer des
serveurs selon vos besoins.

## Créer une instance de calcul

- Dans le menu de gauche, cliquez sur l'onglet **Instances**.
- Pour créer une instance, cliquez sur l'icône **plus (+)** située à droite de la page.

:::note

Captures d'écran à venir.

:::

## Choisir un emplacement

Sélectionnez l'emplacement du centre de données où votre serveur sera hébergé physiquement.

:::note

Captures d'écran à venir.

:::

## Choisir une image

Sélectionnez un système d'exploitation ou un modèle d'application. Importez un ISO personnalisé au
besoin.

**Images Windows prises en charge :**

| Image                 | État               |
| --------------------- | ------------------ |
| Windows Server 2025   | Disponible         |
| Windows 11 Enterprise | Bientôt disponible |

Consultez les catalogues complets : [images de SE](https://zcp.zsoftly.ca/marketplace/os-images) et
[applications en un clic](https://zcp.zsoftly.ca/marketplace/apps).

:::note

Captures d'écran à venir.

:::

## Choisir le type d'allocation CPU

- **CPU partagé** : option abordable avec ressources partagées entre utilisateurs. Idéal pour le
  développement, les tests et les charges de travail légères comme les petits sites Web.
- **CPU dédié** : ressources exclusives pour des performances constantes. Convient aux
  environnements de production, aux applications à fort trafic et aux bases de données.
- **High-Frequency Compute** : fréquences d'horloge élevées pour les tâches intensives, comme les
  simulations, la modélisation financière et les applications à faible latence.
- **Cloud GPU** : accélération GPU pour les tâches exigeantes comme l'apprentissage automatique,
  l'IA, le rendu vidéo et les simulations scientifiques.

:::note

Captures d'écran à venir.

:::

## Choisir un plan

- **General Compute (GC)** : charges de travail équilibrées avec un mélange de CPU, mémoire,
  stockage et bande passante. Idéal pour les applications générales, les serveurs Web et les
  environnements de test.
- **Compute Optimized (CO)** : priorité à la performance CPU pour les tâches intensives, comme le
  traitement par lots, l'analytique et les charges de travail à traitement rapide.
- **Memory Optimized (RO)** : conçu pour les applications exigeant une grande capacité mémoire,
  comme les bases de données en mémoire, le traitement de mégadonnées et les systèmes de cache en
  temps réel.
- **Database Optimized (DO)** : optimisé pour les charges de travail de bases de données, avec des
  performances E/S améliorées et un ratio mémoire/disque adapté aux systèmes transactionnels ou
  analytiques.

Consultez [Types d'instances](/fr/public-cloud/compute/instance-types) pour les familles et niveaux
de stockage, ainsi que la [page de tarification](https://zcp.zsoftly.ca/pricing) pour les
caractéristiques et prix par taille.

:::note

Captures d'écran à venir.

:::

## Assigner à un projet

Assignez le serveur à l'un de vos projets afin d'organiser les ressources.

:::note

Captures d'écran à venir.

:::

## Choisir un réseau

- **Réseau public** : réseau simple et préconfiguré pour la connectivité externe. Inclut la
  protection par pare-feu infonuagique, la redirection de ports et le VPN d'accès distant.
- **Réseau VPC** : Cloud privé virtuel (VPC) offrant un contrôle complet du routage du trafic et une
  sécurité renforcée. Prend en charge les passerelles VPN, les connexions VPN site à site et la
  ségrégation du trafic.

> **Note :** Par défaut, un VPC est créé avec un bloc CIDR aléatoire et un niveau de réseau.

Choisissez ensuite d'activer ou non l'IPv4 publique.

:::note

Captures d'écran à venir.

:::

## Configurer les paramètres du serveur

- Ajoutez une clé SSH pour un accès sécurisé. Cliquez sur **Add Now**. Pour certaines images de SE,
  comme Arch Linux, une clé SSH est requise.
- Ajoutez un script de démarrage pour automatiser des actions pendant l'initialisation.

:::note

Captures d'écran à venir.

:::

## Paramètres avancés (facultatif)

- **Boot Mode** : sélectionnez Legacy ou Secure boot.
- **Boot Type** : choisissez UEFI ou BIOS.
- **Enable Dynamic Scaling** : permet la mise à l'échelle automatique des ressources.

:::note

Captures d'écran à venir.

:::

## Nom d'hôte du serveur

Fournissez un **Server Name** unique et un **Server Hostname** valide.

:::note

Captures d'écran à venir.

:::

## Vérifier et déployer

- Choisissez le **Cycle de facturation** souhaité : horaire, mensuel, trimestriel, semestriel,
  annuel, biannuel ou triannuel.
- Règles de facturation prises en charge : Date to Date, Fixed Calendar Month, Unfixed Calendar
  Month, Fixed Prorata, Unfixed Prorata.
- Vérifiez tous les détails de configuration, puis cliquez sur **Review & Deploy**.

## Voir aussi

- [Vue d'ensemble des instances](/fr/public-cloud/compute/instance-overview)
- [Journaux d'activité](/fr/public-cloud/compute/activity-logs)
