---
title: Quickstart
sidebar_position: 4
description: Deploy your first VM on ZSoftly Public Cloud in under 10 minutes.
---

Deploy a VM, connect to it via SSH, and attach a block storage volume. End to end.

## Prerequisites

- A ZSoftly Public Cloud account ([sign up](/public-cloud/getting-started/account-signup))
- An SSH client (Terminal on macOS/Linux, PowerShell or Windows Terminal on Windows)

## Step 1: Add an SSH key

Before creating a VM, add your public SSH key to the portal to connect without a password.

1. In the portal, go to **Profile → SSH Keys**
2. Click **Add SSH Key**
3. Paste your public key (from `~/.ssh/id_ed25519.pub` or `~/.ssh/id_rsa.pub`)
4. Give it a name and click **Submit**

If you don't have an SSH key yet:

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

## Step 2: Create a network

Your VM needs a network. For a simple setup, use a Public Network.

1. In the portal, go to **Networks → Public Network**
2. Click the **+** icon
3. Choose a **Location**
4. Assign to a **Project** (or use the default)
5. Give it a name and click **Create**

## Step 3: Create a VM

1. In the portal, go to **Instances**
2. Click the **+** icon
3. Configure:
   - **Location**: same as your network
   - **Image**: choose an OS (e.g., Ubuntu 24.04)
   - **CPU Type**: Shared CPU for dev/test, Dedicated for prd
   - **Plan**: General Compute, pick the smallest that fits
   - **Project**: assign to your project
   - **Network**: select the public network you just created
   - **Public IPv4**: enable this
   - **SSH Key**: select the key you added in Step 1
   - **Server Name**: give your VM a name
4. Choose a **Billing Cycle** (Hourly for testing)
5. Click **Review & Deploy**

Your VM will be ready in 30–60 seconds.

## Step 4: Connect via SSH

Once the VM shows as **Running**:

1. Go to the VM's **Overview** page to find the **Public IP Address**
2. Connect from your terminal:

```bash
ssh root@<public-ip-address>
```

If you used Ubuntu, the default username is `ubuntu`:

```bash
ssh ubuntu@<public-ip-address>
```

## Step 5: Attach block storage (optional)

To add persistent storage separate from the root disk:

1. Go to **Block Storage** in the portal
2. Click **+** → **Create Block Storage**
3. Select the same **Location** and **Project** as your VM
4. Choose the **Instance** to attach to
5. Select a **Volume Size**
6. Click **Create Volume**

Once attached, format and mount the volume on your VM:

```bash
# Find the new disk (usually /dev/vdb)
lsblk

# Format it
sudo mkfs.ext4 /dev/vdb

# Mount it
sudo mkdir -p /data
sudo mount /dev/vdb /data

# Make it persistent across reboots
echo '/dev/vdb /data ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

## Next steps

- [VPC networking](/public-cloud/networking/vpc/create-vpc): isolate your infrastructure with
  private networks
- [Object storage](/public-cloud/storage/object-storage/create-bucket): S3-compatible storage for
  files and backups
- [Kubernetes](/public-cloud/kubernetes/create-cluster): managed container clusters
- [ZCP CLI](/public-cloud/cli/installation): manage everything from the terminal
