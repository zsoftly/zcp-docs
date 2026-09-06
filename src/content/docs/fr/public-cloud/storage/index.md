---
title: Stockage
description: Choisissez le stockage bloc ou objet compatible S3 pour les charges de travail ZCP.
---

ZCP fournit du stockage bloc pour les machines virtuelles et du stockage objet compatible S3 pour
les données accessibles avec des compartiments et une API. Choisissez le type de stockage selon la
façon dont votre application lit et écrit les données.

## Choisir Un Type De Stockage

- **Stockage bloc** : attachez un volume à une machine virtuelle lorsqu’une application a besoin
  d’un disque monté. Utilisez-le pour les systèmes de fichiers, bases de données et données
  d’application qui s’exécutent sur une instance.
- **Stockage objet** : stockez les données dans des compartiments lorsqu’une application accède aux
  objets avec une API compatible S3. Utilisez-le pour les téléversements, sauvegardes, médias et
  données d’application partagées.

Lisez [Types de stockage et résilience](/fr/public-cloud/storage/block-storage/storage-types) avant
de choisir un niveau de stockage bloc.

## Protéger Vos Données

Planifiez des instantanés et des sauvegardes pour les données qui ont besoin d’être récupérées. Un
niveau de stockage ne remplace pas un plan de sauvegarde. Examinez les besoins de récupération de
chaque charge de travail avant le déploiement.

## Étapes Suivantes

- [Créer un volume bloc](/fr/public-cloud/storage/block-storage/create-volume)
- [Créer un compartiment de stockage objet](/fr/public-cloud/storage/object-storage/create-bucket)
- [Créer un instantané de volume](/fr/public-cloud/storage/block-storage/snapshots)
- [Gérer les clés d’accès au stockage objet](/fr/public-cloud/storage/object-storage/access-keys)
