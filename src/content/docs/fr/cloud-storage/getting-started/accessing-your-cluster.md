---
title: Accéder à votre cluster
sidebar_position: 2
---

Votre [document d'identifiants](/fr/cloud-storage/getting-started/provisioning#ce-que-vous-recevez)
contient les points de terminaison et les identifiants ci-dessous. Remplacez les valeurs fictives
par celles de votre cluster.

## Tableau de bord Ceph

Le tableau de bord Ceph est l'interface Web permettant de surveiller et de gérer votre cluster.
Utilisez l'URL et les identifiants de votre document d'identifiants. Depuis le tableau de bord, vous
pouvez :

- Consulter l'état de santé du cluster, la capacité et l'état des OSD.
- Gérer les pools et les classes de périphériques.
- Créer et gérer les utilisateurs et compartiments du stockage objet (RGW).

## Stockage objet (S3)

Votre cluster expose un point de terminaison compatible S3 via Ceph RGW. Configurez tout client S3
avec l'URL du point de terminaison indiquée dans votre document d'identifiants :

```bash
aws s3 ls --endpoint-url https://<rgw-endpoint>
```

Voir [Stockage objet](/fr/cloud-storage/reference/object-storage) pour les clients, les clés et
l'utilisation.

## Accès administratif (root)

Les clusters ZCS sont mono-locataires et offrent un accès root; vous administrez donc Ceph
directement. Par exemple, vérifiez l'état depuis un hôte administrateur :

```bash
ceph status
ceph osd df tree
```

Votre document d'identifiants précise la méthode d'accès : hôte administrateur, SSH ou tableau de
bord.

:::caution

L'accès root permet de reconfigurer directement les pools, les règles CRUSH et les OSD. Les
changements au placement des données et à la réplication ont un impact sur la durabilité et la
performance. Planifiez-les avec soin. Demandez au soutien ZSoftly de réviser un changement au
préalable si vous souhaitez un deuxième avis.

:::

## Prochaines étapes

- [Stockage objet](/fr/cloud-storage/reference/object-storage). Point de terminaison S3 et clients.
- [Stockage bloc](/fr/cloud-storage/reference/block-storage). RBD volumes.
- [Stockage de fichiers](/fr/cloud-storage/reference/file-storage). CephFS système de fichiers
  partagé.
- [Réplication et reprise après sinistre](/fr/cloud-storage/reference/replication-dr). Protéger et
  répliquer vos données.
