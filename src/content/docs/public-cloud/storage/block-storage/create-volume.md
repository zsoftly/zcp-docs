---
title: Create Volume
sidebar_position: 1
---

## Block Storage Volumes

Block storage volumes provide NVMe SSD storage that attaches to virtual machines. Once attached,
format and mount the volume to extend your VM's storage.

### Create a Block Storage Volume

- From the left-hand menu, click **Block Storages**.
- Click **Create Block Storage** or the **+** icon.

![Block Storages page with the Create Block Storage (+) button](../../../../../assets/storage/block-storage/create-volume-create-a-block-storage-volume.webp)

### Assign to a Project

Assign the volume to a project.

![Create Block Storage: assign to a project](../../../../../assets/storage/block-storage/create-volume-assign-to-a-project.webp)

### Choose a Location

Select the data center location.

![Create Block Storage: choose a location](../../../../../assets/storage/block-storage/create-volume-choose-a-location.webp)

### Choose Instance

Select the VM instance to attach this volume to.

![Create Block Storage: choose the instance to attach to](../../../../../assets/storage/block-storage/create-volume-choose-instance.webp)

### Select Volume Size

Select storage type and size. Custom volumes are available.

![Create Block Storage: select volume storage type and size](../../../../../assets/storage/block-storage/create-volume-select-volume-size.webp)

### Name

Provide a unique Volume Name.

![Create Block Storage: name the volume](../../../../../assets/storage/block-storage/create-volume-name.webp)

### Create

- **Billing Cycles**: Hourly, Monthly, Quarterly, Semiannually, Yearly, Bi-annually, Tri-annually.
- **Billing rules**: Date to Date, Fixed Calendar Month, Unfixed Calendar Month, Fixed Prorata,
  Unfixed Prorata.
- Review and click **Create Volume**.

![Create Block Storage: billing options and Create Volume](../../../../../assets/storage/block-storage/create-volume-create.webp)

After creation, format and mount the volume inside the VM:

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

See also: [Volume Snapshots](/public-cloud/storage/block-storage/snapshots),
[VM Snapshots](/public-cloud/backups-snapshots/vm-snapshots)
