---
title: Create Volume
sidebar_position: 1
---

## Block Storage Volumes

Block storage volumes add persistent storage to virtual machines. They provide local NVMe SSD, local
SATA SSD, or replicated shared storage, depending on the selected region and plan. This page ends
after attachment verification. Follow
[Format and Mount a Volume](/public-cloud/storage/block-storage/format-and-mount) to format and
mount the new volume.

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

The published wizard screenshot shows the text `Minimum 8GB storage is required`. This screenshot is
for reference only. Use the current value shown for the selected storage plan in the portal.

![Create Volumes: Choose Storage Type and Select Volumes Size](../../../../../assets/storage/block-storage/create-volume-select-volume-size.webp)

### Choose Name

Under **Choose Name**, enter a unique **Volumes Name**.

![Create Volumes: Choose Name and Volumes Name](../../../../../assets/storage/block-storage/create-volume-name.webp)

### Create

Create and attach the volume to the target VM. Do not attach or detach disks while you format and
mount the volume.

- **Billing Cycle**: Hourly, Monthly, or Yearly.
- Click **Review & Deploy**, review the summary, then click **Create Volumes**.

![Create Volumes: Review & Deploy and Create Volumes](../../../../../assets/storage/block-storage/create-volume-create.webp)

The volume steps on this page end after attachment verification. Do not format a disk based only on
its device name or a manual selection. Continue at
[Confirm a Stable Volume Identifier](/public-cloud/storage/block-storage/format-and-mount#confirm-a-stable-volume-identifier).
If the selected volume cannot be confirmed through a stable guest identifier, stop and open
[Support](/troubleshooting#raise-a-support-ticket) with the project, location, exact error, and
non-sensitive resource details.

See also: [Storage Types and Resilience](/public-cloud/storage/block-storage/storage-types),
[Volume Snapshots](/public-cloud/storage/block-storage/snapshots),
[VM Snapshots](/public-cloud/backups-snapshots/vm-snapshots)
