---
title: Clés d'accès
sidebar_position: 2
---

## Clés d'accès au stockage objet

Votre instance de stockage objet possède des identifiants compatibles S3 qui permettent l'accès
programmatique avec tout outil ou SDK compatible S3.

### Points de terminaison S3

| Région         | Point de terminaison                 |
| -------------- | ------------------------------------ |
| YUL (Montréal) | `https://objects.yul.zcp.zsoftly.ca` |
| YOW (Ottawa)   | `https://objects.yow.zcp.zsoftly.ca` |

Le point de terminaison de votre instance correspond à la région choisie lors de sa création.

### Créer et faire la rotation des clés d'accès

1. Dans la liste **Stockage objet**, trouvez votre instance.
2. Cliquez sur l'icône **Identifiants** (icône de clé dans la rangée d'actions).
3. Créez une clé d'accès et copiez son secret dans les cinq minutes.

Utilisez le CLI pour lister les métadonnées des clés, créer une clé et révoquer une clé :

```bash
zcp object-storage keys list <storage-slug>
zcp object-storage keys create <storage-slug>
zcp object-storage keys delete <storage-slug> <key-id> -y
```

Chaque espace de stockage prend en charge une ou deux clés actives. Pour faire la rotation d'une
clé, créez une seconde clé, mettez à jour chaque application qui utilise l'ancienne clé, puis
révoquez l'ancienne clé. Vous ne pouvez pas révoquer la dernière clé active.

:::caution

Le secret est disponible seulement cinq minutes après la création de la clé. Le CLI ne déchiffre ni
ne récupère un ancien secret. Enregistrez-le de façon sécuritaire lorsque vous créez la clé.

Masquer un secret ne le révoque pas. La révocation désactive la clé dans le stockage objet et la
marque comme révoquée dans le plan de contrôle.

:::

### Utiliser les identifiants avec AWS CLI

Configurez un profil nommé pour votre stockage objet ZSoftly :

```bash
aws configure --profile zsoftly
# AWS Access Key ID: <your access key>
# AWS Secret Access Key: <your secret key>
# Default region name: (leave blank)
# Default output format: json
```

Passez ensuite le point de terminaison lors de l'exécution des commandes :

```bash
# YUL (Montreal)
aws s3 ls --profile zsoftly --endpoint-url https://objects.yul.zcp.zsoftly.ca

# YOW (Ottawa)
aws s3 ls --profile zsoftly --endpoint-url https://objects.yow.zcp.zsoftly.ca
```

### Utiliser les identifiants avec des variables d'environnement

```bash
export AWS_ACCESS_KEY_ID="<your access key>"
export AWS_SECRET_ACCESS_KEY="<your secret key>"

# Set the endpoint for your region
export AWS_ENDPOINT_URL="https://objects.yul.zcp.zsoftly.ca"
```

Pour les commandes S3 directes avec `zcp`, enregistrez les nouveaux identifiants dans ces variables
:

```bash
export ZCP_S3_ACCESS_KEY="<your access key>"
export ZCP_S3_SECRET_KEY="<your secret key>"
```

Le CLI vérifie que `ZCP_S3_ACCESS_KEY` est active pour l'espace de stockage sélectionné avant de se
connecter.

Voir aussi : [Créer un compartiment](/fr/public-cloud/storage/object-storage/create-bucket),
[Utilisation de S3](/fr/public-cloud/storage/object-storage/s3-usage/)
