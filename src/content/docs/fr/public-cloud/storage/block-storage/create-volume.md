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

:::note

Captures d'écran à venir.

:::

### Choisir un emplacement

Sélectionnez l'emplacement du centre de données.

:::note

Captures d'écran à venir.

:::

### Assigner à un projet

Assignez le volume à un projet.

:::note

Captures d'écran à venir.

:::

### Choisir une instance

Sélectionnez l'instance VM à laquelle attacher ce volume.

:::note

Captures d'écran à venir.

:::

### Sélectionner la taille du volume

Sélectionnez le type et la taille de stockage. Des volumes personnalisés sont disponibles.

:::note

Captures d'écran à venir.

:::

### Nom

Fournissez un nom de volume unique.

:::note

Captures d'écran à venir.

:::

### Créer

- **Cycles de facturation** : Hourly, Monthly, Quarterly, Semiannually, Yearly, Bi-annually,
  Tri-annually.
- **Règles de facturation** : Date to Date, Fixed Calendar Month, Unfixed Calendar Month, Fixed
  Prorata, Unfixed Prorata.
- Passez en revue, puis cliquez sur **Créer un volume**.

:::note

Captures d'écran à venir.

:::

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
