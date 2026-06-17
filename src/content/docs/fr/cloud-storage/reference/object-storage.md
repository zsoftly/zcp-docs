---
title: Stockage objet (S3)
sidebar_position: 1
---

Votre cluster fournit du stockage objet compatible S3 par l'entremise de Ceph RADOS Gateway (RGW).
Il reproduit l'API Amazon S3; vos outils et SDK S3 existants fonctionnent donc avec votre cluster
après la modification de l'URL du point de terminaison.

## Point de terminaison et identifiants

Depuis votre
[document d'identifiants](/fr/cloud-storage/getting-started/provisioning#ce-que-vous-recevez) :

- **URL du point de terminaison S3**, par exemple `https://<rgw-endpoint>`.
- **ID de clé d'accès** et **clé d'accès secrète**.

Créez d'autres utilisateurs et clés RGW depuis le tableau de bord Ceph ou avec l'outil
`radosgw-admin` sur votre cluster.

## Clients

**AWS CLI**

```bash
aws configure                 # enter your access key + secret
aws s3 mb s3://my-bucket --endpoint-url https://<rgw-endpoint>
aws s3 cp ./file.dat s3://my-bucket/ --endpoint-url https://<rgw-endpoint>
aws s3 ls s3://my-bucket --endpoint-url https://<rgw-endpoint>
```

**rclone**

```bash
rclone config   # provider: S3 (Other / Ceph), set endpoint + keys
rclone copy ./data zcs:my-bucket
```

**Python (boto3)**

```python
import boto3

s3 = boto3.client(
    "s3",
    endpoint_url="https://<rgw-endpoint>",
    aws_access_key_id="<access-key>",
    aws_secret_access_key="<secret-key>",
)
s3.create_bucket(Bucket="my-bucket")
```

## Fonctionnalités prises en charge

Ceph RGW prend en charge les opérations S3 courantes : téléversements multiparties, versionnement
des objets, politiques de compartiment et URL présignées. Pour l'ensemble complet des
fonctionnalités propres à votre version, consultez la documentation officielle.

| Ressource                       | URL                                         |
| ------------------------------- | ------------------------------------------- |
| Ceph RGW (objet/S3)             | https://docs.ceph.com/en/latest/radosgw/    |
| Prise en charge de l'API S3 RGW | https://docs.ceph.com/en/latest/radosgw/s3/ |

:::tip

Pour répliquer des données objet entre plusieurs sites, utilisez RGW multisite. Voir
[Réplication et reprise après sinistre](/fr/cloud-storage/reference/replication-dr).

:::
