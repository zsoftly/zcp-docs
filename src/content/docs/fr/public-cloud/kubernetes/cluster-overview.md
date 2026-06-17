---
title: Vue d'ensemble du cluster
sidebar_position: 2
---

## Vue d'ensemble du cluster Kubernetes

La page de vue d'ensemble du cluster présente un sommaire et les options de gestion de votre cluster
Kubernetes.

### Boutons d'action

- **Upgrade Kubernetes Version** : mettre à jour vers une version plus récente
- **Refresh** : recharger les données les plus récentes du cluster
- **Download Config** : télécharger le fichier `kubeconfig` pour `kubectl`
- **Power Off** : arrêter le cluster proprement
- **Delete** : supprimer définitivement le cluster et toutes ses ressources

:::note

Captures d'écran à venir.

:::

### Vue d'ensemble du cluster

- **Total CPU**, **Total RAM**
- **Noeuds de contrôle** / **noeuds de travail**
- **Réseau**, **état**

:::note

Captures d'écran à venir.

:::

### Informations sur le cluster

- Nom du projet, date de création, adresse IP, point de terminaison API, cloud, nom d'utilisateur,
  emplacement
- Version Kubernetes, mise à l'échelle automatique (nombre minimal et maximal de noeuds si activée)
- Consommation totale, réseau, clé SSH

:::note

Captures d'écran à venir.

:::

### Configuration des noeuds

- Plan actuel, CPU par noeud, mémoire par noeud, stockage par noeud

Voir aussi : [Créer un cluster](/fr/public-cloud/kubernetes/create-cluster),
[Accès kubectl](/fr/public-cloud/kubernetes/kubectl-access),
[Accès au tableau de bord](/fr/public-cloud/kubernetes/dashboard-access)
