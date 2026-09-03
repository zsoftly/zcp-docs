---
title: Tutorials
description:
  Hands-on, end-to-end tutorials for the ZSoftly Cloud Platform. Follow along from a brand-new
  account to a working deployment.
sidebar:
  label: Overview
---

These tutorials walk through common ZCP deployments from account setup to verification. Each guide
lists the required commands, explains the key decisions, and shows how to confirm the result.

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

### [Run Ollama Chat and Inference on ZCP](/tutorials/ollama-chat-and-inference)

Deploy the Ollama Marketplace image on an Intel VM, pull a model, and use it from the CLI and REST
API. The reference path uses an 8B model. Deployment time depends on image startup and model
download speed.

You learn how to:

- Pick a YUL Intel plan from the catalog
- Use Ollama from the CLI, `/api/chat`, and `/api/generate`
- Compare the 8B and 70B CPU workload profiles
- Record timings, resource usage, and failure signals during a bounded test

### [Run Open WebUI With Ollama on ZCP](/tutorials/open-webui-with-ollama)

Add Open WebUI to an existing Ollama VM. Run the browser client on the same machine, connect it to
the host Ollama service, and keep access private with an encrypted SSH tunnel.

You learn how to:

- Install Open WebUI with Docker and connect it to host Ollama
- Access Open WebUI through an encrypted SSH tunnel
- Select models from the browser without changing their compute path
- Remove the container, network rules, VM, and any orphaned source-NAT IP

### [Build a Private Network with Headscale](/tutorials/build-private-network-headscale)

Create a private VPC and tier, lock it down with a custom network ACL, and deploy a self-hosted
Headscale server from the Marketplace to give yourself mesh access into it. About 30 minutes.

You learn how to:

- Create a VPC and a private network tier with no public exposure by default
- Replace the default network ACL with one scoped to exactly what the tier needs
- Deploy a self-hosted Headscale and Headplane server from the Marketplace
- Enroll a subnet router and connect your own device to the mesh

### [Deploy Ubuntu Employee Desktops on ZCP](/tutorials/deploy-ubuntu-employee-desktops)

Deploy a full Ubuntu KDE desktop into the private tier from
[Build a Private Network with Headscale](/tutorials/build-private-network-headscale), reached only
through the mesh over RDP. About 30 minutes.

You learn how to:

- Provision a named employee login with cloud-init instead of a generic default user
- Bring up the tier network interface and lock down a Marketplace template's default-open SSH rule
- Connect over RDP through the mesh, with no public IP ever needed for the desktop itself
- Confirm the desktop is a genuinely usable work environment, not just a login screen

### [Connect Your Ubuntu Desktops to Private Storage](/tutorials/connect-desktops-to-storage)

Mount the file share from [Deploy Private Shared Storage](/tutorials/deploy-private-shared-storage)
on the desktop from [Deploy Ubuntu Employee Desktops](/tutorials/deploy-ubuntu-employee-desktops),
so company files persist independently of any one desktop VM. About 15 minutes per desktop.

You learn how to:

- Mount an NFS share from inside an RDP session and confirm it actually works
- Understand why NFS permissions are raw UID numbers, not usernames, and what that means for
  multiple employees sharing storage
- Give each employee a real, unique identity instead of accepting a shared one, including the real
  constraints that make it work (timing, session handling, and where retroactive fixes have to run)
- Confirm the share shows up automatically in the KDE file manager

## Where to go next

- [CLI quickstart](/public-cloud/cli/quickstart): the short version, for when you already have an
  account
- [Public Cloud quickstart](/public-cloud/getting-started/quickstart): the same first deployment
  from the web portal
- [Changelog](/changelog/): what is new across the platform

### [Manage ZCP with Terraform or OpenTofu](/tutorials/manage-infrastructure-terraform/)

Provision a network and a virtual machine declaratively with the official `zsoftly/zcp` provider,
published on the Terraform and OpenTofu registries. You write one configuration file, apply it,
change it, and destroy it, with every resource tracked. About 15 minutes.

You learn how to:

- Install the provider and authenticate with an API token
- Describe a network and a VM in HCL and apply the plan
- Resize in place and import resources you created elsewhere
- Destroy the whole stack with nothing left behind
