---
title: Stockage Ceph
sidebar_position: 2
---

# Référence du stockage Ceph

Ceph fournit le stockage bloc (RBD) et le stockage objet (RGW) pour votre nuage privé.

:::note

Vous cherchez un cluster Ceph dédié et autonome avec accès root, en dehors d'un nuage privé complet?
Consultez [ZSoftly Cloud Storage](/fr/cloud-storage/overview).

:::

## Version

Votre document d'identifiants précise la version de Ceph déployée dans votre environnement.

## Documentation officielle

| Ressource                 | URL                                            |
| ------------------------- | ---------------------------------------------- |
| Documentation Ceph        | https://docs.ceph.com                          |
| Ceph RBD (stockage bloc)  | https://docs.ceph.com/en/latest/rbd/           |
| Ceph RGW (stockage objet) | https://docs.ceph.com/en/latest/radosgw/       |
| Tableau de bord Ceph      | https://docs.ceph.com/en/latest/mgr/dashboard/ |

## Accès au stockage objet

Ceph RGW fournit un point de terminaison de stockage objet compatible S3 pour votre nuage privé.
Votre document d'identifiants contient :

- **URL du point de terminaison S3**
- **ID de clé d'accès**
- **Clé d'accès secrète**

Utilisez n'importe quel client compatible S3 (AWS CLI, boto3, rclone) avec ces identifiants.
Configurez l'URL du point de terminaison avec l'adresse RGW de votre nuage privé.

```bash
aws s3 ls --endpoint-url http://<rgw-endpoint> --profile your-profile
```

## Tableau de bord Ceph

Le tableau de bord Ceph est accessible à l'URL indiquée dans votre document d'identifiants. Il
fournit :

- L'état de santé et le statut du cluster.
- La gestion des pools et des OSD.
- La gestion des utilisateurs RGW et des compartiments.
