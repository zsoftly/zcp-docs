---
title: Tutorials
description:
  Hands-on, end-to-end tutorials for the ZSoftly Cloud Platform. Follow along from a brand-new
  account to a working deployment.
sidebar:
  label: Overview
---

Step-by-step tutorials that take you from nothing to a working result. Each one assumes a brand-new
account and walks every command, so you can copy, paste, and learn as you go.

Looking for a single feature instead of a full walkthrough? The
[CLI reference](/public-cloud/cli/reference) and the per-service guides in the sidebar cover those.

## Tutorials

### [Deploy a VPS and install Dokploy with the CLI](/tutorials/deploy-vps-dokploy-cli)

Go from a fresh account to a public virtual machine running [Dokploy](https://dokploy.com), a
self-hosted app platform. You install and authenticate the CLI, create a VPS with a public IP and
SSH access, and install Dokploy, all from the terminal. About 15 minutes.

You learn how to:

- Install and authenticate the `zcp` CLI
- Import an SSH key and pick a region, plan, and image
- Create an internet-facing VM with a public IP
- Connect over SSH and install Dokploy

### [Deploy OpenClaw from the Marketplace with the CLI](/tutorials/deploy-openclaw-marketplace-cli)

Deploy [OpenClaw](https://openclaw.ai), a self-hosted personal AI assistant, straight from the
ZSoftly Marketplace. It comes pre-installed on the image, so you deploy and connect, with no manual
install. About 10 minutes.

You learn how to:

- Find a Marketplace app template with the CLI
- Deploy it in one command with your SSH key
- Open SSH and confirm the app is ready to configure

## Secure private cloud workspace series

A five-part series that builds a private network, private storage, and private employee desktops on
ZCP, reachable only through a self-hosted mesh, never over a public IP. Each part builds on the one
before it.

### [Build a Private Network with Headscale](/tutorials/build-private-network-headscale)

Create a private VPC and tier, lock it down with a custom network ACL, and deploy a self-hosted
Headscale server from the Marketplace to give yourself mesh access into it. About 30 minutes.

You learn how to:

- Create a VPC and a private network tier with no public exposure by default
- Replace the default network ACL with one scoped to exactly what the tier needs
- Deploy a self-hosted Headscale and Headplane server from the Marketplace
- Enroll a subnet router and connect your own device to the mesh

### [Deploy Private Shared Storage](/tutorials/deploy-private-shared-storage)

Deploy an NFS file share inside the tier from the first tutorial, reachable only through the mesh.
About 20 minutes.

You learn how to:

- Deploy a storage VM with SSH access gated to your own IP and nothing else public
- Format, mount, and export a data disk over NFS, scoped to the tier and the mesh
- Verify the share from a mesh client and confirm it's unreachable from anywhere else

### [Deploy Ubuntu Employee Desktops](/tutorials/deploy-ubuntu-employee-desktops)

Deploy a full Ubuntu KDE desktop into the private tier, reached only over RDP through the mesh.
About 20 minutes.

You learn how to:

- Provision a named employee user through cloud-init
- Deploy the desktop into the private tier with no public IP
- Connect over RDP through the mesh and verify the desktop works end to end

### [Connect Desktops to Storage](/tutorials/connect-desktops-to-storage)

Mount the shared file storage on an employee desktop, so company files persist independently of any
one desktop VM. About 10 minutes per desktop.

You learn how to:

- Mount an NFS share from inside an RDP session
- Understand the UID and GID mapping behavior of a shared mount
- Confirm the share appears correctly in the KDE desktop environment

### [Make It Operational for a Team](/tutorials/operate-workspace-for-a-team)

Turn the previous four tutorials into a repeatable process for a real team: onboarding, offboarding,
backups, and lifecycle management.

You learn how to:

- Onboard and offboard employees using a repeatable checklist
- Back up the storage VM and understand the tradeoffs of VM snapshots
- Plan for golden-image updates and ongoing monitoring

## Where to go next

- [CLI quickstart](/public-cloud/cli/quickstart): the short version, for when you already have an
  account
- [Public Cloud quickstart](/public-cloud/getting-started/quickstart): the same first deployment
  from the web portal
- [Changelog](/changelog): what is new across the platform
