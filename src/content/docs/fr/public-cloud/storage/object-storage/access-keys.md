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

### Afficher vos identifiants

1. Dans la liste **Stockage objet**, trouvez votre instance.
2. Cliquez sur l'icône **Identifiants** (icône de clé dans la rangée d'actions).
3. Le panneau affiche :
   - **ID de clé d'accès** : votre clé d'accès S3
   - **Clé d'accès secrète** : votre clé secrète S3 (traitez-la comme un mot de passe)

Vous pouvez aussi lire les deux clés depuis la CLI à tout moment :

```bash
zcp object-storage get <storage-slug> --region os-yul --project <project-slug>
```

La sortie contient le point de terminaison S3, la clé d'accès et la clé secrète.

:::caution

La clé secrète n'est pas affichée une seule fois. Toute personne détenant un jeton d'API pour le
projet peut l'afficher avec `zcp object-storage get`. Considérez donc un jeton d'API comme
équivalent aux identifiants S3 qu'il permet de révéler. Limitez la portée des jetons en conséquence
et effectuez une rotation des identifiants de stockage objet si un jeton est exposé.

Conservez les clés de façon sécuritaire partout où vous les utilisez. Pour les invalider, générez de
nouveaux identifiants pour l'instance.

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

Voir aussi : [Créer un compartiment](/fr/public-cloud/storage/object-storage/create-bucket),
[Utilisation de S3](/fr/public-cloud/storage/object-storage/s3-usage/)
