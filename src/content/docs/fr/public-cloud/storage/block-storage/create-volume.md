---
title: Créer un volume
sidebar_position: 1
---

## Volumes de stockage bloc

Les volumes de stockage bloc fournissent des volumes SSD NVMe locaux, des volumes SSD SATA locaux ou
des volumes de stockage partagé répliqué pour les machines virtuelles, selon la région et le plan
choisis. Une fois le volume attaché, formatez-le et montez-le pour étendre le stockage de votre VM.

### Create Volumes

- Dans le menu de gauche, cliquez sur **Volumes**.
- Cliquez sur l'icône **+**.

![Page Volumes avec l'icône plus](../../../../../../assets/storage/block-storage/create-volume-create-a-block-storage-volume.webp)

### Choose Project

Sous **Choose Project**, attribuez le volume à un projet.

![Create Volumes : Choose Project](../../../../../../assets/storage/block-storage/create-volume-assign-to-a-project.webp)

### Select Location

Sous **Select Location**, choisissez l'emplacement du centre de données.

![Create Volumes : Select Location](../../../../../../assets/storage/block-storage/create-volume-choose-a-location.webp)

### Select Instance to attach Volumes

Sous **Select Instance to attach Volumes**, choisissez l'instance virtuelle.

![Create Volumes : Select Instance to attach Volumes](../../../../../../assets/storage/block-storage/create-volume-choose-instance.webp)

### Choose Storage Type and Select Volumes Size

Dans **Choose Storage Type**, sélectionnez un type de stockage. Dans **Select Volumes Size**,
sélectionnez la taille du volume. Des volumes personnalisés sont disponibles.

La capture d'écran publiée affiche le texte « Minimum 8GB storage is required ». Cette capture
d’écran est fournie à titre indicatif. Nous n’avons pas encore vérifié, après connexion, les champs
obligatoires dans l’interface CMP. Utilisez la valeur actuelle affichée pour le plan de stockage
sélectionné dans le portail.

![Create Volumes : Choose Storage Type and Select Volumes Size](../../../../../../assets/storage/block-storage/create-volume-select-volume-size.webp)

### Choose Name

Sélectionnez **Choose Name** et fournissez un **Volumes Name** unique.

![Create Volumes : Choose Name and Volumes Name](../../../../../../assets/storage/block-storage/create-volume-name.webp)

### Créer

Connectez-vous à l'instance virtuelle cible avec SSH avant de créer le volume. N'exécutez jamais ces
commandes sur votre poste de travail local. Exécutez `hostname` et vérifiez qu'il correspond au
**Server Hostname** de l'instance dans le portail. Ensuite, exécutez la première commande `lsblk`
ci-dessous avant de créer le volume et enregistrez sa sortie.

```bash
# Confirm that this is the target VM before recording its disks.
hostname

# Before creating and attaching the volume, record the current devices.
lsblk -p -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
```

- **Billing Cycle** : **Hourly**, **Monthly** ou **Yearly**.
- Cliquez sur **Review & Deploy**, examinez le résumé, puis cliquez sur **Create Volumes**.

![Étapes Review & Deploy et Create Volumes](../../../../../../assets/storage/block-storage/create-volume-create.webp)

Après avoir attaché le volume, exécutez cette commande via SSH sur l’instance virtuelle cible, puis
comparez sa sortie à celle enregistrée avant la création du volume.

```bash
lsblk -p -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
```

Les étapes de gestion du volume s’arrêtent après la vérification de l’attachement. Ne formatez pas
un disque en vous fondant uniquement sur son nom de périphérique ou sur une sélection manuelle. La
création d’un système de fichiers, le montage du volume et l’ajout d’une configuration de montage
persistante exigent une procédure testée séparément qui identifie le volume à l’aide d’un
identifiant stable. Si vous ne pouvez pas identifier clairement le disque attaché, arrêtez-vous et
ouvrez [Support](/fr/troubleshooting#ouvrir-un-billet-de-soutien) avec le projet, l’emplacement,
l’erreur exacte et les détails non sensibles de la ressource.

Voir aussi :
[Types de stockage et résilience](/fr/public-cloud/storage/block-storage/storage-types),
[Instantanés de volume](/fr/public-cloud/storage/block-storage/snapshots),
[Instantanés de VM](/fr/public-cloud/backups-snapshots/vm-snapshots)
