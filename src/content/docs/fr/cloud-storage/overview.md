---
title: Vue d'ensemble
sidebar_position: 1
---

# ZSoftly Cloud Storage

ZSoftly Cloud Storage (ZCS) est un produit autonome consacré uniquement au stockage. Vous obtenez un
cluster de stockage [Ceph](https://docs.ceph.com) dédié et mono-locataire, avec accès root,
dimensionné selon vos charges de travail. Ce n'est pas un nuage de calcul. C'est la couche de
stockage sur laquelle vous bâtissez des charges de travail objet, bloc et fichier à grande échelle,
seule ou aux côtés de ZSoftly Public Cloud (ZCP) ou Private Cloud (ZPCP).

## De quoi il s'agit

Un cluster Ceph entièrement distribué, provisionné sur du matériel dédié et remis avec accès
administratif. Il n'y a aucun point de défaillance unique ni concurrence multi-locataire; vous
obtenez donc une performance prévisible et la liberté d'ajuster le cluster à vos charges de travail.
La disposition des pools, le choix entre réplication et codage d'effacement, les classes de
périphériques et la mise en cache sont tous sous votre contrôle.

Un même cluster expose trois interfaces de stockage :

- **Stockage objet** : un point de terminaison compatible S3 (Ceph RGW) pour les outils et SDK S3
  que vous utilisez déjà. Voir [Stockage objet](/fr/cloud-storage/reference/object-storage).
- **Stockage bloc** : des périphériques blocs réseau (Ceph RBD) pour les machines virtuelles, les
  bases de données et les volumes persistants Kubernetes. Voir
  [Stockage bloc](/fr/cloud-storage/reference/block-storage).
- **Stockage de fichiers** : un système de fichiers partagé POSIX (CephFS) monté par plusieurs
  clients. Voir [Stockage de fichiers](/fr/cloud-storage/reference/file-storage).

## Deux modèles de livraison

**Hébergé (public)** ZSoftly provisionne et exploite votre cluster dédié sur du matériel ZSoftly
dans l'une de nos régions (YUL, YOW). Vous obtenez un accès root et un point de terminaison privé
sans posséder ni installer de matériel.

**Sur site (privé)** ZSoftly conçoit et déploie un cluster dédié sur du matériel que vous possédez
ou exploitez, dans vos installations. Ce modèle répond aux besoins de résidence des données, de
souveraineté ou d'investissements existants en centre de données.

Dans les deux modèles, le cluster est **mono-locataire et sous votre administration**. Même Ceph,
même accès root, mêmes interfaces. Seuls l'emplacement et la propriété du matériel changent.

## Capacités clés

- **Échelle exaoctet, sans point de défaillance unique**. Faites évoluer le cluster horizontalement
  en ajoutant des noeuds. Les données sont répliquées ou codées par effacement dans le cluster.
- **Contrôle root**. Administrez directement les pools, les utilisateurs, les OSD et le tableau de
  bord Ceph.
- **Hiérarchisation de la performance**. Utilisez le NVMe comme pool rapide ou comme couche de cache
  devant des disques de grande capacité. Voir
  [Performance et hiérarchisation](/fr/cloud-storage/reference/performance-tiering).
- **Réplication et reprise après sinistre**. Répliquez vers une autre région ZSoftly, un cluster sur
  site ou tout cluster Ceph que vous administrez. Voir
  [Réplication et reprise après sinistre](/fr/cloud-storage/reference/replication-dr).
- **Choix de version**. Le cluster est provisionné avec une version stable récente de Ceph, ou avec
  une version précise sélectionnée avec notre équipe. Voir
  [Versions de Ceph](/fr/cloud-storage/reference/ceph-versions).

## Cas d'utilisation

- **Données massives et analytique**. Grands ensembles de données avec accès parallèle et redondance
  intégrée.
- **HPC, ML et IA**. Stockage partagé à haut débit pour les simulations et les jeux de données
  d'entraînement.
- **S3 à grande échelle**. Une solution ouverte et économique par rapport au stockage objet des
  grands fournisseurs infonuagiques.
- **Sauvegarde et reprise après sinistre**. Une cible de réplication pour un cluster Ceph existant.

## Différences avec le stockage ZCP

ZCS est dédié et donne un accès root. ZSoftly Public Cloud offre aussi du
[stockage objet](/fr/public-cloud/storage/object-storage/create-bucket) et du
[stockage bloc](/fr/public-cloud/storage/block-storage/create-volume), mais il s'agit de services
gérés et multi-locataires consommés par le portail et l'API ZCP. Vous utilisez le stockage; vous
n'exploitez pas le cluster. Choisissez le stockage ZCP pour une capacité gérée et facturée à l'usage
dans le nuage public. Choisissez ZCS lorsque vous avez besoin d'un cluster dédié que vous contrôlez.

## Commencer

→ [Communiquer avec ZSoftly](https://zcp.zsoftly.ca/contact?source=docs&topic=cloud-storage) pour
dimensionner et provisionner un cluster.

Une fois votre cluster provisionné, poursuivez avec
[Provisionner un cluster](/fr/cloud-storage/getting-started/provisioning) et
[Accéder à votre cluster](/fr/cloud-storage/getting-started/accessing-your-cluster).
