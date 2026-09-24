---
title: Create Volume
sidebar_position: 1
---

## Block Storage Volumes

Block storage volumes provide local NVMe SSD, local SATA SSD, or replicated shared storage that
attaches to virtual machines, depending on the selected region and plan. Once attached, format and
mount the volume to extend your VM's storage.

### Create Volumes

- From the left-hand menu, click **Volumes**.
- Click the **+** icon.

![Volumes page with the plus icon](../../../../../assets/storage/block-storage/create-volume-create-a-block-storage-volume.webp)

### Choose Project

Under **Choose Project**, assign the volume to a project.

![Create Volumes: Choose Project](../../../../../assets/storage/block-storage/create-volume-assign-to-a-project.webp)

### Select Location

Under **Select Location**, choose the data center location.

![Create Volumes: Select Location](../../../../../assets/storage/block-storage/create-volume-choose-a-location.webp)

### Select Instance to attach Volumes

Under **Select Instance to attach Volumes**, choose the VM instance.

![Create Volumes: Select Instance to attach Volumes](../../../../../assets/storage/block-storage/create-volume-choose-instance.webp)

### Choose Storage Type and Select Volumes Size

Under **Choose Storage Type**, select a storage type. Under **Select Volumes Size**, select the
volume size. Custom volumes are available.

The published wizard screenshot records an 8 GB minimum. Follow the value shown for the selected
storage plan in the portal.

![Create Volumes: Choose Storage Type and Select Volumes Size](../../../../../assets/storage/block-storage/create-volume-select-volume-size.webp)

### Choose Name

Select **Choose Name** and provide a unique **Volumes Name**.

![Create Volumes: Choose Name and Volumes Name](../../../../../assets/storage/block-storage/create-volume-name.webp)

### Create

Connect to the target VM over SSH before creating the volume. Never run these commands on your local
workstation. Run `hostname` and confirm that it matches the VM's **Server Hostname** in the portal.
Then run the first `lsblk` command below before creating the volume and record its output.

```bash
# Confirm that this is the target VM before recording its disks.
hostname

# Before creating and attaching the volume, record the current devices.
lsblk -p -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
```

- **Billing Cycle**: Hourly, Monthly, or Yearly.
- Click **Review & Deploy**, review the summary, then click **Create Volumes**.

![Create Volumes: Review & Deploy and Create Volumes](../../../../../assets/storage/block-storage/create-volume-create.webp)

After attachment, run the full `lsblk` command again and compare its output with the baseline you
recorded before creating the volume. Set `NEW_DISK` only to the path of the single whole disk that
appeared after attachment. Stop if no disk appeared, more than one disk appeared, or you cannot
identify it.

Run this self-contained block after attachment while connected to the target VM over SSH, never on
your local workstation. Run `hostname` and confirm that it matches the VM's **Server Hostname** in
the portal before continuing. It stops before formatting unless the specified device is the new,
empty disk. Formatting erases existing data.

```bash
(
  set -eu

  if [ -z "${SSH_CONNECTION:-}" ]; then
    echo "Connect to the target VM over SSH before formatting a disk." >&2
    exit 1
  fi

  # Confirm that this is the target VM before formatting a disk.
  hostname

  # Compare this inventory with the baseline. Stop unless one new whole disk appeared after attachment.
  lsblk -p -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS

  # Replace this sentinel with the absolute path of the one verified new disk.
  NEW_DISK=/dev/REPLACE_WITH_NEW_DISK

  if [ "$NEW_DISK" = /dev/REPLACE_WITH_NEW_DISK ] || [ ! -b "$NEW_DISK" ]; then
    echo "Set NEW_DISK to the verified block device path." >&2
    exit 1
  fi

  # Recheck the device immediately before formatting.
  lsblk -p -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS "$NEW_DISK"
  DISK_TYPE=$(lsblk -dn -o TYPE "$NEW_DISK") || { echo "Could not inspect the disk type. Stop and verify it." >&2; exit 1; }
  DEVICE_ROWS=$(lsblk -nr -o NAME "$NEW_DISK") || { echo "Could not inspect disk devices. Stop and verify them." >&2; exit 1; }
  DEVICE_COUNT=$(awk 'NF { count++ } END { print count + 0 }' <<<"$DEVICE_ROWS") || { echo "Could not count disk devices. Stop and verify them." >&2; exit 1; }
  FSTYPE=$(lsblk -dn -o FSTYPE "$NEW_DISK") || { echo "Could not inspect the disk filesystem. Stop and verify it." >&2; exit 1; }
  MOUNTPOINTS=$(lsblk -dn -o MOUNTPOINTS "$NEW_DISK") || { echo "Could not inspect disk mount points. Stop and verify them." >&2; exit 1; }
  SIGNATURES=$(sudo wipefs -n -i -O TYPE "$NEW_DISK") || { echo "Could not inspect disk signatures. Stop and verify them." >&2; exit 1; }
  if [ "$DISK_TYPE" != disk ] ||
    [ "$DEVICE_COUNT" -ne 1 ] ||
    [ -n "$FSTYPE" ] ||
    [ -n "$MOUNTPOINTS" ] ||
    [ -n "$SIGNATURES" ]; then
    echo "NEW_DISK is not an empty whole disk. Stop and verify it." >&2
    exit 1
  fi
  MOUNT_TARGETS=$(findmnt -rn -o TARGET) || { echo "Could not inspect mount targets. Stop and review them." >&2; exit 1; }
  if grep -Fx /data <<<"$MOUNT_TARGETS" >/dev/null; then
    echo "/data is already mounted. Stop and review it." >&2
    exit 1
  else
    MOUNT_TARGET_STATUS=$?
    if [ "$MOUNT_TARGET_STATUS" -ne 1 ]; then
      echo "Could not search mount targets. Stop and review them." >&2
      exit 1
    fi
  fi
  FSTAB_SNAPSHOT=$(mktemp) || {
    echo "Could not create a temporary fstab snapshot. Stop and review it." >&2
    exit 1
  }
  trap 'rm -f -- "$FSTAB_SNAPSHOT"' EXIT
  if ! sudo cat /etc/fstab >"$FSTAB_SNAPSHOT"; then
    echo "Could not read /etc/fstab. Stop and review it." >&2
    exit 1
  fi
  if ! findmnt --verify --tab-file "$FSTAB_SNAPSHOT" >/dev/null; then
    echo "Could not validate /etc/fstab. Stop and review it." >&2
    exit 1
  fi
  if awk '/^[[:space:]]*($|#)/ { next } { target = $2; sub(/\/+$/, "", target); if (target == "/data") found = 1 } END { exit(found ? 0 : 1) }' "$FSTAB_SNAPSHOT"; then
    echo "/data already has an fstab entry. Stop and review it." >&2
    exit 1
  else
    FSTAB_TARGET_STATUS=$?
    if [ "$FSTAB_TARGET_STATUS" -ne 1 ]; then
      echo "Could not inspect fstab targets. Stop and review them." >&2
      exit 1
    fi
  fi
  if ! rm -f -- "$FSTAB_SNAPSHOT"; then
    echo "Could not remove the temporary fstab snapshot. Stop and review it." >&2
    exit 1
  fi
  trap - EXIT
  if [ -L /data ]; then
    echo "/data is a symbolic link. Stop and review it." >&2
    exit 1
  fi
  if [ -e /data ] && [ ! -d /data ]; then
    echo "/data is not a directory. Stop and review it." >&2
    exit 1
  fi
  if [ -d /data ]; then
    DATA_ENTRY=$(sudo find /data -mindepth 1 -maxdepth 1 -print -quit) || {
      echo "Could not inspect /data. Stop and review it." >&2
      exit 1
    }
    if [ -n "$DATA_ENTRY" ]; then
      echo "/data is not empty. Stop and review it." >&2
      exit 1
    fi
  fi

  sudo mkfs.ext4 "$NEW_DISK"
  sudo mkdir -p /data
  sudo mount "$NEW_DISK" /data
  UUID=$(sudo blkid -s UUID -o value "$NEW_DISK")
  if [ -z "$UUID" ]; then
    echo "No filesystem UUID was created. Stop and verify the disk." >&2
    exit 1
  fi
  printf '%s\n' "UUID=$UUID /data ext4 defaults,nofail 0 2" | sudo tee -a /etc/fstab >/dev/null
  sudo findmnt --verify
  sudo mount -a
  findmnt /data
)
```

See also: [Storage Types and Resilience](/public-cloud/storage/block-storage/storage-types),
[Volume Snapshots](/public-cloud/storage/block-storage/snapshots),
[VM Snapshots](/public-cloud/backups-snapshots/vm-snapshots)
