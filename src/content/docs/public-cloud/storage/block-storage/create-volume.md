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

The published wizard screenshot shows the text `Minimum 8GB storage is required`. This screenshot is
for reference only. We have not yet verified the required fields in CMP while signed in. Use the
current value shown for the selected storage plan in the portal.

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

After attachment, run this command on the target VM over SSH and compare its output with the
baseline you recorded before creating the volume.

```bash
lsblk -p -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
```

The volume steps on this page end after attachment verification. Do not format a disk based only on
its device name or a manual selection. Creating a filesystem, mounting the volume, and adding
persistent mount configuration require a separately tested procedure that identifies the volume by a
stable identifier. If the attached disk is not unambiguous, stop and open
[Support](/troubleshooting#raise-a-support-ticket) with the project, location, exact error, and
non-sensitive resource details.

See also: [Storage Types and Resilience](/public-cloud/storage/block-storage/storage-types),
[Volume Snapshots](/public-cloud/storage/block-storage/snapshots),
[VM Snapshots](/public-cloud/backups-snapshots/vm-snapshots)
