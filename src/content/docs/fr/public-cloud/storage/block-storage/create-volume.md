---
title: Créer un volume
sidebar_position: 1
---

## Volumes de stockage bloc

Les volumes de stockage bloc ajoutent du stockage persistant aux machines virtuelles. Ils
fournissent des volumes SSD NVMe locaux, des volumes SSD SATA locaux ou des volumes de stockage
partagé répliqué, selon la région et le plan choisis. Cette page s’arrête après l’envoi de la
demande de création et d’attachement du volume.

### Créer des volumes

- Dans le menu de gauche, cliquez sur **Volumes**.
- Cliquez sur l'icône **+**.

![Page Volumes avec l'icône plus](../../../../../../assets/storage/block-storage/create-volume-create-a-block-storage-volume.webp)

### Choisir un projet

Sous **Choose Project**, attribuez le volume à un projet.

![Create Volumes : Choose Project](../../../../../../assets/storage/block-storage/create-volume-assign-to-a-project.webp)

### Sélectionner un emplacement

Sous **Select Location**, choisissez l'emplacement du centre de données.

![Create Volumes : Select Location](../../../../../../assets/storage/block-storage/create-volume-choose-a-location.webp)

### Sélectionner une instance à laquelle attacher le volume

Sous **Select Instance to attach Volumes**, choisissez l'instance virtuelle.

![Create Volumes : Select Instance to attach Volumes](../../../../../../assets/storage/block-storage/create-volume-choose-instance.webp)

### Choisir le type de stockage et la taille du volume

Dans **Choose Storage Type**, sélectionnez un type de stockage. Dans **Select Volumes Size**,
sélectionnez la taille du volume. Des volumes personnalisés sont disponibles.

La capture d'écran publiée affiche le texte « Minimum 8GB storage is required ». Cette capture
d’écran est fournie à titre indicatif. Utilisez la valeur actuelle affichée pour le plan de stockage
sélectionné dans le portail.

![Create Volumes : Choose Storage Type and Select Volumes Size](../../../../../../assets/storage/block-storage/create-volume-select-volume-size.webp)

### Choisir un nom

Dans **Choose Name**, saisissez un **Volumes Name** unique.

![Create Volumes : Choose Name and Volumes Name](../../../../../../assets/storage/block-storage/create-volume-name.webp)

### Créer

Envoyez la demande de création et d’attachement de volume pour l’instance virtuelle cible.

- **Billing Cycle** : **Hourly**, **Monthly** ou **Yearly**.
- Cliquez sur **Review & Deploy**, examinez le résumé, puis cliquez sur **Create Volumes**.

![Étapes Review & Deploy et Create Volumes](../../../../../../assets/storage/block-storage/create-volume-create.webp)

La documentation publique s’arrête après l’envoi de la demande de création et d’attachement du
volume. Ne formatez pas un disque en vous fondant uniquement sur un nom de périphérique transitoire
ou sur une sélection manuelle. Demandez au
[Support](/fr/troubleshooting#ouvrir-un-billet-de-soutien) si le volume du portail peut être associé
au périphérique de l’instance virtuelle et si une procédure validée d’initialisation et de montage
est disponible. Si une erreur s’affiche, indiquez le projet, l’emplacement et le message exact. Dans
tous les cas, fournissez les détails non sensibles de la ressource.

Voir aussi :
[Types de stockage et résilience](/fr/public-cloud/storage/block-storage/storage-types),
[Instantanés de volume](/fr/public-cloud/storage/block-storage/snapshots),
[Instantanés de VM](/fr/public-cloud/backups-snapshots/vm-snapshots)
