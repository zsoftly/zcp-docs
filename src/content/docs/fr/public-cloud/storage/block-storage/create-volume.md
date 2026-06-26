---
title: Créer un volume
sidebar_position: 1
---

## Volumes de stockage bloc

Les volumes de stockage bloc fournissent du stockage SSD NVMe attachable aux machines virtuelles.
Une fois le volume attaché, formatez-le et montez-le pour étendre le stockage de votre VM.

### Créer un volume de stockage bloc

- Dans le menu de gauche, cliquez sur **Stockage blocs**.
- Cliquez sur **Créer Stockage bloc** ou sur l'icône **+**.

![Page Stockages blocs avec le bouton Créer Stockage bloc (+)](../../../../../../assets/storage/block-storage/create-volume-create-a-block-storage-volume.webp)

### Choisir un emplacement

Sélectionnez l'emplacement du centre de données.

![Créer Stockage bloc : choisir un emplacement](../../../../../../assets/storage/block-storage/create-volume-choose-a-location.webp)

### Assigner à un projet

Assignez le volume à un projet.

![Créer Stockage bloc : assigner à un projet](../../../../../../assets/storage/block-storage/create-volume-assign-to-a-project.webp)

### Choisir une instance

Sélectionnez l'instance VM à laquelle attacher ce volume.

![Créer Stockage bloc : choisir l'instance à laquelle attacher le volume](../../../../../../assets/storage/block-storage/create-volume-choose-instance.webp)

### Sélectionner la taille du volume

Sélectionnez le type et la taille de stockage. Des volumes personnalisés sont disponibles.

![Créer Stockage bloc : sélectionner le type et la taille de stockage du volume](../../../../../../assets/storage/block-storage/create-volume-select-volume-size.webp)

### Nom

Fournissez un nom de volume unique.

![Créer Stockage bloc : nommer le volume](../../../../../../assets/storage/block-storage/create-volume-name.webp)

### Créer

- **Cycles de facturation** : Hourly, Monthly, Quarterly, Semiannually, Yearly, Bi-annually,
  Tri-annually.
- **Règles de facturation** : Date to Date, Fixed Calendar Month, Unfixed Calendar Month, Fixed
  Prorata, Unfixed Prorata.
- Passez en revue, puis cliquez sur **Créer un volume**.

![Créer Stockage bloc : options de facturation et Créer un volume](../../../../../../assets/storage/block-storage/create-volume-create.webp)

Après la création, formatez et montez le volume dans la VM :

```bash
# Find the new disk (usually /dev/vdb)
lsblk

# Format
sudo mkfs.ext4 /dev/vdb

# Mount
sudo mkdir -p /data
sudo mount /dev/vdb /data

# Persist across reboots
echo '/dev/vdb /data ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

Voir aussi : [Instantanés de volume](/fr/public-cloud/storage/block-storage/snapshots),
[Instantanés de VM](/fr/public-cloud/backups-snapshots/vm-snapshots)
