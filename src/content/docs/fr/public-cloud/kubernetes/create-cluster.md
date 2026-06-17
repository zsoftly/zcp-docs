---
title: Créer un cluster Kubernetes
sidebar_position: 1
---

## Clusters Kubernetes

Un cluster Kubernetes est un ensemble de machines (noeuds) qui exécutent des applications
conteneurisées de manière automatisée et gérée. ZSoftly Public Cloud fournit des clusters Kubernetes
gérés avec haute disponibilité et mise à l'échelle automatique.

### Créer un cluster

- Dans le menu de gauche, cliquez sur **Kubernetes**.
- Cliquez sur **Créer un cluster** ou sur l'icône **+**.

:::note

Captures d'écran à venir.

:::

### Étapes

1. **Emplacement** : sélectionnez le centre de données.
2. **Projet** : assignez le cluster à un projet.
3. **Réseau** : sélectionnez un réseau privé existant ou créez-en un nouveau.
4. **Capacité du cluster** :
   - Sélectionnez un **plan de noeud** prédéfini (CPU, mémoire et stockage fixes)
   - Ou utilisez un **plan personnalisé** (CPU, mémoire, stockage et nombre de noeuds)
5. **Paramètres avancés** (facultatif) :
   - Activez la **haute disponibilité** pour la redondance
   - Ajoutez des **noeuds de contrôle** pour une stabilité accrue
   - Ajoutez une **clé SSH** pour l'accès aux noeuds
6. **Nom du cluster** : fournissez un nom unique.
7. **Créer** :
   - Cycles de facturation : Hourly, Monthly, Quarterly, Semiannually, Yearly, Bi-annually,
     Tri-annually
   - Règles de facturation : Date to Date, Fixed Calendar Month, Unfixed Calendar Month, Fixed
     Prorata, Unfixed Prorata
   - Cliquez sur **Créer un cluster**

:::note

Captures d'écran à venir.

:::

Voir aussi : [Vue d'ensemble du cluster](/fr/public-cloud/kubernetes/cluster-overview),
[Accès kubectl](/fr/public-cloud/kubernetes/kubectl-access)
