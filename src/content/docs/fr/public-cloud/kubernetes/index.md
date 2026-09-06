---
title: Kubernetes
description: Créez et exploitez des clusters Kubernetes dans ZCP.
---

ZCP Kubernetes fournit des clusters gérés pour les applications conteneurisées. Créez un cluster,
choisissez sa configuration de nœuds et son réseau, puis utilisez `kubectl` ou le tableau de bord
pour déployer et exploiter vos charges de travail.

## Planifier Votre Cluster

Avant de créer un cluster, choisissez le projet, la région, le plan de nœud, le réseau et la clé
d’accès qui conviennent à la charge de travail. Tenez compte de la capacité requise par les pods
d’application et de la façon dont la charge de travail doit évoluer.

Consultez [Créer un cluster](/fr/public-cloud/kubernetes/create-cluster) pour le flux du portail.

## Exploiter Votre Cluster

La vue d’ensemble du cluster affiche son état, la configuration des nœuds, les ressources totales et
les actions de gestion. Téléchargez le fichier `kubeconfig` pour vous connecter avec `kubectl`.
Utilisez le tableau de bord lorsque vous avez besoin d’une vue des ressources du cluster dans le
navigateur.

## Étapes Suivantes

- [Créer un cluster](/fr/public-cloud/kubernetes/create-cluster)
- [Consulter les détails du cluster](/fr/public-cloud/kubernetes/cluster-overview)
- [Accès kubectl](/fr/public-cloud/kubernetes/kubectl-access)
- [Ouvrir le tableau de bord](/fr/public-cloud/kubernetes/dashboard-access)
