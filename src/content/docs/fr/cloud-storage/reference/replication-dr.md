---
title: Réplication et reprise après sinistre
sidebar_position: 4
---

# Réplication et reprise après sinistre

Vous contrôlez le cluster au niveau root; vous pouvez donc répliquer les données pour la reprise
après sinistre entre des clusters ZCS et tout autre cluster Ceph que vous administrez.

## Options de réplication

- **Objet (RGW multisite)**. Répliquez les compartiments et les objets entre zones ou clusters pour
  un stockage objet actif-actif ou actif-passif.
- **Bloc (RBD mirroring)**. Mettez en miroir les images RBD de façon asynchrone vers un deuxième
  cluster pour une reprise après sinistre au niveau bloc.

## Topologies courantes

- **Répliquer vers ZCS**. Pointez un cluster Ceph existant, sur site ou tiers, vers votre cluster
  ZCS afin de l'utiliser comme cible de reprise.
- **Répliquer depuis ZCS**. Répliquez votre cluster ZCS vers une autre région ZSoftly, vers un
  cluster sur site ou vers tout cluster Ceph que vous exploitez.

Les deux points de terminaison sont des points de terminaison Ceph standards; la réplication n'est
donc pas liée à ZSoftly. Vous pouvez jumeler un cluster ZCS avec des clusters exploités n'importe
où.

| Ressource     | URL                                                |
| ------------- | -------------------------------------------------- |
| RGW multisite | https://docs.ceph.com/en/latest/radosgw/multisite/ |
| RBD mirroring | https://docs.ceph.com/en/latest/rbd/rbd-mirroring/ |

:::note

Passez les conceptions de reprise après sinistre en revue avec le soutien ZSoftly : pools concernés,
direction de synchronisation et objectifs de reprise. La topologie pourra ainsi correspondre à vos
objectifs de reprise.

:::
