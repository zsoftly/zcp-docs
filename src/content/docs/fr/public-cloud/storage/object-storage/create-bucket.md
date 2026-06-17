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
5. **Créer** : cycles de facturation : Hourly, Monthly, Quarterly, Semiannually, Yearly,
   Bi-annually, Tri-annually. Règles de facturation : Date to Date, Fixed Calendar Month, Unfixed
   Calendar Month, Fixed Prorata, Unfixed Prorata. Cliquez sur **Review and Create**.

:::note

Captures d'écran à venir.

:::

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

:::note

Captures d'écran à venir.

:::

### Gérer les compartiments

- **Share** : activer le partage public afin que toute personne ayant l'URL de l'objet puisse y
  accéder.
- **Upload Files** : téléverser des fichiers directement depuis le portail.
- **Create Folder** : organiser les objets dans des dossiers à l'intérieur du compartiment.

:::note

Captures d'écran à venir.

:::

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
[Utilisation de S3](/fr/public-cloud/storage/object-storage/s3-usage)

:::tip

Il s'agit du stockage objet **géré et mutualisé** de ZSoftly Public Cloud. Vous avez besoin d'un
**cluster de stockage dédié, mono-locataire, avec accès root**, que vous administrez vous-même?
Consultez [ZSoftly Cloud Storage](/fr/cloud-storage/overview).

:::
