---
title: Stockage bloc (RBD)
sidebar_position: 2
---

Ceph RBD (RADOS Block Device) fournit des périphériques blocs répliqués et à provisionnement léger,
adossés à votre cluster. Les volumes RBD conviennent aux disques de machines virtuelles, aux bases
de données et aux volumes persistants Kubernetes.

## Flux de travail type

Créez un pool et une image, puis mappez l'image sur un client. Exécutez ces commandes depuis un hôte
administrateur ayant accès au cluster :

```bash
ceph osd pool create rbd-pool
rbd create rbd-pool/vol01 --size 100G
rbd map rbd-pool/vol01
mkfs.ext4 /dev/rbd0
mount /dev/rbd0 /mnt/vol01
```

## Utilisation avec des plateformes

- **Machines virtuelles**. Attachez des images RBD comme disques de VM.
- **Kubernetes**. Utilisez le pilote [Ceph CSI](https://github.com/ceph/ceph-csi) pour provisionner
  dynamiquement des volumes persistants RBD.
- **Bases de données**. Appuyez les bases de données à E/S élevées sur un pool NVMe. Voir
  [Performance et hiérarchisation](/fr/cloud-storage/reference/performance-tiering).

| Ressource                | URL                                  |
| ------------------------ | ------------------------------------ |
| Ceph RBD (Stockage bloc) | https://docs.ceph.com/en/latest/rbd/ |
| Ceph CSI                 | https://github.com/ceph/ceph-csi     |

:::tip

Vous pouvez mettre en miroir les images RBD vers un autre cluster pour la reprise après sinistre.
Voir [Réplication et reprise après sinistre](/fr/cloud-storage/reference/replication-dr).

:::
