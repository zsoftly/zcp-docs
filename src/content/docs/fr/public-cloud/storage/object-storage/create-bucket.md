---
title: Créer un compartiment
sidebar_position: 1
---

## Stockage objet

Le stockage objet ZSoftly Public Cloud est compatible S3. Utilisez-le pour les fichiers, les
sauvegardes, les ressources statiques ou toute donnée non structurée.

### Créer une instance de stockage objet

- Dans le menu de gauche, cliquez sur **Stockage objet**.
- Cliquez sur **Créer Stockage objet** ou sur l'icône **+**.

### Étapes

1. **Assigner à un projet**.
2. **Choisir un emplacement**.
3. **Taille du stockage objet** : choisissez le type et la taille de stockage. Des plans
   personnalisés sont disponibles.
4. **Nom** : fournissez un nom unique.
5. **Créer** :
   - Cycles de facturation : horaire, mensuel ou annuel.
   - Cliquez sur **Review and Create**.

![Créer une instance de stockage objet : projet, emplacement, taille, nom et facturation](../../../../../../assets/storage/object-storage/create-bucket-steps.webp)

### Créer un compartiment

Une fois votre instance de stockage objet active :

- Cliquez sur **Créer un compartiment**.
- Entrez un **nom de compartiment**.
- Activez facultativement le **versionnement du compartiment** (requis pour Object Lock).
- Activez facultativement **Object Lock** : stocke les objets selon le modèle write-once-read-many
  (WORM).

:::note

Object Lock fonctionne seulement dans les compartiments versionnés. Les versions d'objets comptent
dans vos coûts totaux de stockage.

:::

- Cliquez sur **Créer**.

![Boîte de dialogue Créer un compartiment avec les options de nom, versionnement et verrouillage d'objets](../../../../../../assets/storage/object-storage/create-bucket-create-a-bucket.webp)

:::caution

Le compartiment obtenu ne porte pas exactement le nom que vous avez saisi. La plateforme ajoute un
suffixe numérique : un compartiment demandé sous le nom `app-backups` est créé sous un nom du type
`app-backups-001024`. C'est cette valeur suffixée qui constitue le véritable nom de compartiment S3
que vos outils doivent utiliser. Relisez-la avant toute configuration :

```bash
zcp object-storage bucket list <storage-slug> --region os-yul --project <project-slug>
```

```
SLUG                 NAME                 OBJECTS  SIZE (GB)  STATUS
app-backups-001024   app-backups-001024   0                   Inactive
```

Utilisez la colonne **NAME** dans les URL de point de terminaison, les appels SDK et les commandes
`aws s3`. Un compartiment affichant `Inactive` avec zéro objet est normal tant que rien n'y a été
écrit. Voir [Utilisation de l'API S3](/fr/public-cloud/storage/object-storage/s3-usage/).

:::

### Gérer les compartiments

- **Share** : activer le partage public afin que toute personne ayant l'URL de l'objet puisse y
  accéder.
- **Upload Files** : téléverser des fichiers directement depuis le portail.
- **Create Folder** : organiser les objets dans des dossiers à l'intérieur du compartiment.

![Vue de gestion des compartiments avec les actions Share, Upload Files et Create Folder](../../../../../../assets/storage/object-storage/create-bucket-manage-buckets.webp)

### Mise à l'échelle automatique

Activez ou désactivez la mise à l'échelle automatique depuis les actions de l'instance de stockage
pour ajuster la taille selon l'utilisation.

:::note

Captures d'écran à venir.

:::

### Identifiants

Cliquez sur l'icône **Identifiants** pour afficher votre **S3 Access Key** et votre **Secret Key**
pour l'accès programmatique.

Voir aussi : [Clés d'accès](/fr/public-cloud/storage/object-storage/access-keys),
[Utilisation de S3](/fr/public-cloud/storage/object-storage/s3-usage/)

:::tip

Il s'agit du stockage objet **géré et mutualisé** de ZSoftly Public Cloud. Vous avez besoin d'un
**cluster de stockage dédié, mono-locataire, avec accès root**, que vous administrez vous-même?
Consultez [ZSoftly Cloud Storage](/fr/cloud-storage/overview).

:::
