---
title: Provisionner un cluster
sidebar_position: 1
---

L'équipe ZSoftly provisionne votre cluster ZSoftly Cloud Storage selon vos besoins. Cette page
explique les renseignements dont nous avons besoin et ce que vous recevez.

## Données de dimensionnement

Pour dimensionner votre cluster, nous travaillons avec vous sur les éléments suivants :

- **Capacité utilisable**. Votre cible de stockage utilisable après réplication ou codage
  d'effacement.
- **Protection des données**. Réplication (par exemple 3x) ou codage d'effacement pour optimiser la
  capacité, par pool.
- **Profil de performance**. Les objectifs de débit et de latence, ainsi que toute
  [couche rapide ou couche de cache](/fr/cloud-storage/reference/performance-tiering) NVMe.
- **Interfaces**. Les interfaces dont vous avez besoin : objet (S3), bloc (RBD) et fichier (CephFS).
- **Modèle de livraison**. [Hébergé](/fr/cloud-storage/overview#deux-modèles-de-livraison) dans une
  région ZSoftly, ou sur site sur votre matériel.
- **Version de Ceph**. Une version stable récente par défaut, ou une
  [version précise](/fr/cloud-storage/reference/ceph-versions) choisie avec notre équipe.

## Ce que vous recevez

Lorsque votre cluster est prêt, ZSoftly fournit un **document d'identifiants** qui contient :

- L'**accès root et administratif** au cluster.
- L'URL et les identifiants du **tableau de bord Ceph**.
- L'**URL du point de terminaison S3**, ainsi qu'une clé d'accès et une clé secrète initiales pour
  le stockage objet.
- La **version de Ceph** déployée.

Voir [Accéder à votre cluster](/fr/cloud-storage/getting-started/accessing-your-cluster) pour savoir
comment utiliser chacun de ces éléments.

:::note

Votre document d'identifiants est la source de vérité pour les points de terminaison, les versions
et les détails d'accès propres à votre cluster.

:::

## Mise à l'échelle ultérieure

Les clusters évoluent horizontalement. Vous ajoutez de la capacité ou de la performance en étendant
le cluster avec plus de noeuds ou de périphériques. Communiquez avec ZSoftly pour planifier une
expansion.

## Commencer

→ [Communiquer avec ZSoftly](https://zcp.zsoftly.ca/contact?source=docs&topic=cloud-storage) pour
provisionner ou étendre un cluster.
