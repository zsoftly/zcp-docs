---
title: Quickstart
sidebar_position: 4
description: Deploy your first VM on ZSoftly Public Cloud and attach a block storage volume.
---

Deploy a VM, connect to it via SSH, and attach a block storage volume. End to end.

## Prerequisites

- A ZSoftly Public Cloud account ([sign up](/public-cloud/getting-started/account-signup))
- An SSH client (Terminal on macOS/Linux, PowerShell or Windows Terminal on Windows)
- An SSH key pair

If you already have an SSH key, display the contents of its `.pub` file. Otherwise, generate an
Ed25519 key:

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

Copy the public key contents for Step 2. For the Ed25519 key generated above, run:

```bash
cat ~/.ssh/id_ed25519.pub
```

## Step 1: Create a network

Your VM needs a network. For a simple setup, use a Public Network.

1. In the portal, go to **Networks → Public Network**
2. Click the **+** icon. The page title is **Create Isolated Network**.
3. Complete **Choose Project**, then **Select Location**.
4. In **Network Details**, enter a **Network Name**.
5. Under **Choose Network Plan**, select a network plan.
6. In **Network Configuration**, review the visible **Gateway** and **Netmask** values.
7. Choose a **Billing Cycle** and review the **Price Summary**.
8. Click **Create Network**.

If the wizard rejects an input, record the exact field and error message. Do not guess replacement
gateway or netmask values. If the message is unclear or the portal still rejects the value, open
[Support](/troubleshooting#raise-a-support-ticket) and include the project, location, exact message,
and non-sensitive resource details.

## Step 2: Create a VM

1. In the portal, go to **Instances**
2. Click the **+** icon
3. Configure:
   - **Location**: same as your network
   - **Image**: choose an OS (e.g., Ubuntu 24.04)
   - **CPU Type**: Shared CPU for dev/test, Dedicated CPU for prd workloads
   - **Plan**: General Compute, pick the smallest that fits
   - **Project**: assign to your project
   - **Network**: select the public network you just created
   - **Public IPv4**: enable this
   - **SSH Key**: in **Server Settings**, click **Add now** beside **Add SSH Key To Your Instance**.
     In the dialog, either enter a key name and paste your public key, or select an existing key.
   - **Server Name**: give your VM a name
   - **Server Hostname**: review the prefilled value and change it if your naming standard requires
     it
4. Choose a **Billing Cycle** (Hourly for testing)
5. Click **Review & Deploy**

After deployment, refresh the instance list or Overview page until the VM shows as **Running**.
Startup time varies. If the status does not change, open the instance details and record the exact
error message. Open [Support](/troubleshooting#raise-a-support-ticket) if the portal cannot start
the VM or the error remains. Include the project, location, instance name, and exact message.

## Step 3: Connect via SSH

Once the VM shows as **Running**:

1. Go to the VM's **Overview** page to find the **Public IP Address**
2. In **VM Settings**, add a [firewall](/public-cloud/compute/settings/firewall) rule for TCP
   **22**. Then add a [port-forwarding](/public-cloud/compute/settings/port-forwarding) rule that
   maps port 22 on the public IP to port 22 on the VM.
3. Connect from your terminal. For an Ubuntu image, use:

```bash
ssh ubuntu@203.0.113.10
```

Replace `203.0.113.10` with the public IP address from the portal. Ubuntu images use `ubuntu` by
default. For other images, use the default username listed in
[Connect With SSH](/public-cloud/compute/connect-ssh). Use `root` only when the image identifies it
as the default user.

If SSH does not connect, record the terminal error, confirm that the VM is **Running**, and confirm
the public IP, firewall rule, and port-forwarding rule allow TCP port 22. Then review
[SSH key settings](/public-cloud/compute/settings/ssh-keys) and
[Connect With SSH](/public-cloud/compute/connect-ssh) for the image username and authentication
method. If it still fails, open [Support](/troubleshooting#raise-a-support-ticket) with the project,
location, instance name, and non-sensitive error details.

## Step 4: Attach block storage (optional)

To add persistent storage separate from the root disk, connect to the target VM over SSH first.
Never run these commands on your local workstation. Run `hostname` and confirm that it matches the
VM's **Server Hostname** in the portal. Then run the first `lsblk` command below before creating the
volume and record its output.

```bash
# Confirm that this is the target VM before recording its disks.
hostname

# Before creating and attaching the volume, record the current devices.
lsblk -p -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
```

1. Go to **Volumes** in the portal
2. Click the **+** icon
3. Under **Choose Project**, select the project assigned to your VM
4. Under **Select Location**, select the VM's location
5. Under **Select Instance to attach Volumes**, select your VM
6. Under **Choose Storage Type**, select a storage type, then select the size under **Select Volumes
   Size**
7. Under **Choose Name**, enter a **Volumes Name**, choose a **Billing Cycle**, and review the
   **Price Summary**
8. Click **Review & Deploy**
9. Review the summary, then click **Create Volumes**

If the wizard rejects an input, record the exact field and error message.
[Create Volume](/public-cloud/storage/block-storage/create-volume) confirms the current wizard
steps, visible labels, and screenshots. If the message is unclear or the portal still rejects the
value, open [Support](/troubleshooting#raise-a-support-ticket) with the project, location,
non-sensitive resource details, and exact message.

The published wizard screenshot shows the text `Minimum 8GB storage is required`. This screenshot is
for reference only. We have not yet verified the required fields in CMP while signed in. Use the
current value shown for the selected storage plan in the portal.

After attachment, run this command on the target VM over SSH and compare its output with the
baseline you recorded before creating the volume.

```bash
lsblk -p -o NAME,SIZE,TYPE,FSTYPE,MOUNTPOINTS
```

The volume steps end after attachment verification. Do not format a disk based only on its device
name or a manual selection. Creating a filesystem, mounting the volume, and adding persistent mount
configuration require a separately tested procedure that identifies the volume by a stable
identifier. If the attached disk is not unambiguous, stop and open
[Support](/troubleshooting#raise-a-support-ticket) with the project, location, exact error, and
non-sensitive resource details.

## Next steps

- [VPC networking](/public-cloud/networking/vpc/create-vpc): isolate your infrastructure with
  private networks
- [Object storage](/public-cloud/storage/object-storage/create-bucket): S3-compatible storage for
  files and backups
- [Kubernetes](/public-cloud/kubernetes/create-cluster): managed container clusters
- [ZCP CLI](/public-cloud/cli/installation): manage everything from the terminal
