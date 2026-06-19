---
title: 'Deploy a VPS and install Dokploy with the CLI'
description:
  Go from a brand-new ZSoftly account to a public VPS running Dokploy, entirely from the terminal
  with the zcp CLI.
sidebar:
  label: 'Deploy a VPS with Dokploy (CLI)'
---

This tutorial takes you from a brand-new ZSoftly Public Cloud account to a working VPS that runs
[Dokploy](https://dokploy.com), a self-hosted platform for deploying apps and databases. You do
every step from your terminal with the `zcp` CLI.

By the end you have:

- An authenticated CLI on your machine
- A public-facing virtual machine (a simple VPS) with a public IP and SSH access
- Dokploy installed and reachable in your browser

Plan for about 15 minutes. Most of it is the VM booting and Dokploy installing.

:::note

The slugs in this tutorial (region `yow-1`, project `default-9`, template `ubuntu-2404-lts`, plans,
and so on) are **examples from one account**. Yours will differ. Every step shows the `list` command
that prints the right value for your account and region. Always use those, don't copy the examples
verbatim.

:::

## Before you start

- A ZSoftly Public Cloud account. [Sign up](/public-cloud/getting-started/account-signup) first if
  you do not have one.
- A terminal with an SSH client (Terminal on macOS or Linux, Windows Terminal or PowerShell on
  Windows).
- An SSH key pair. This tutorial creates one for you if you do not have it.

:::note

Dokploy needs at least **2 GB of RAM** and **30 GB of disk**. Keep that in mind when you pick a plan
in Step 6.

:::

## Step 1: Install the CLI

The `zcp` CLI is a single binary. Install it with the one-line script.

```bash
# macOS and Linux
curl -fsSL https://raw.githubusercontent.com/zsoftly/zcp-cli/main/scripts/install.sh | bash
```

```powershell
# Windows (PowerShell)
irm https://raw.githubusercontent.com/zsoftly/zcp-cli/main/scripts/install.ps1 | iex
```

Confirm it works:

```bash
zcp version
```

For other install methods, see the [CLI installation guide](/public-cloud/cli/installation).

## Step 2: Authenticate

The CLI talks to the platform with a bearer token tied to your account.

1. In the portal, open **Profile → API Tokens** and create a token. Copy it.
2. Create a CLI profile and paste the token when prompted.

```bash
zcp profile add default
```

You are prompted for:

- **Bearer token**: the token you copied from the portal
- **API URL**: `https://api.zcp.zsoftly.ca/api`

Verify the credentials and let the CLI detect your cloud provider:

```bash
zcp auth validate
```

A successful response means you are ready. The CLI saves your profile under `~/.config/zcp` with
`0600` permissions.

:::note

Every command that touches a region-specific resource requires a **region** and a **project**
(`--region`/`--project`, or the `ZCP_REGION`/`ZCP_PROJECT` environment variables). Set them once so
you don't repeat the flags. The commands below assume this:

```bash
export ZCP_REGION=yow-1        # see: zcp region list
export ZCP_PROJECT=default-9   # see: zcp project list (it's "default-9", not "default")
```

:::

## Step 3: Look around

Before you create anything, list what is available to your account. You need a **region** slug, a
**project** slug, a **plan**, a **template** (OS image), and a **storage category**.

```bash
# Regions you can deploy in (use the SLUG column, e.g. yow-1)
zcp region list

# Your projects — note the SLUG (it looks like "default-9", not just "default")
zcp project list

# VM plans with CPU, memory, and price (pick one with at least 2 GB RAM)
zcp plan vm --region yow-1

# OS templates for your region (use the SLUG column, e.g. ubuntu-2404-lts)
zcp template list --region yow-1

# Storage categories (use a value from the STORAGE CATEGORY column, e.g. nvme)
zcp plan storage --region yow-1
```

:::note

Plans are region-specific, so `zcp plan` requires a region (`--region` or `ZCP_REGION`). A plan from
another region will not deploy. For example, the Intel `ci*` plans exist only in `yow-1`, while
`yul-1` uses the `ca*` family.

:::

Note the values you want. The rest of this tutorial uses the following. **Yours will differ.** The
project slug, the available templates, and the valid storage categories all vary by account and
region, so use the values your own `list` commands print.

| Value            | Example           | How to find it                   |
| ---------------- | ----------------- | -------------------------------- |
| Region           | `yow-1`           | `zcp region list`                |
| Project          | `default-9`       | `zcp project list`               |
| Plan             | `ci1l`            | `zcp plan vm --region <r>`       |
| Template         | `ubuntu-2404-lts` | `zcp template list --region <r>` |
| Storage category | `nvme`            | `zcp plan storage --region <r>`  |

:::caution

`ci1l` is an example. Run `zcp plan vm` and choose a plan with at least **2 GB of memory** and **30
GB of storage**, or Dokploy will fail to install.

:::

:::caution

Pick a **well-established Ubuntu LTS** such as `ubuntu-2404-lts` (24.04). Dokploy installs Docker
from Docker's apt repository, which does not publish packages for the very newest releases right
away. On a brand-new release like Ubuntu 26.04 the installer fails with `docker: not found`.

:::

:::note

The project slug is **not** the word `default`. A new account's first project has a slug like
`default-9`. Passing `--project default` fails with `The selected project is invalid`, so always use
the slug from `zcp project list`.

The storage category is region-specific. `nvme` is valid in `yow-1`, while other regions may expose
`pro-nvme`, `premium-ssd`, or `hdd-storage` instead. Check `zcp plan storage` for your region.

:::

## Step 4: Add your SSH key

You connect to the VM with an SSH key, not a password. If you do not have a key yet, create one:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

Import the **public** key into your account and give it a name. `--project` and `--region` are
required. You reference the name when you create the VM.

```bash
zcp ssh-key import \
  --name my-key \
  --key-file ~/.ssh/id_ed25519.pub \
  --project default-9 \
  --region yow-1
```

Confirm it registered:

```bash
zcp ssh-key list
```

:::note

The key **name** must be 20 characters or fewer, and the public key itself must be unique.
Re-importing a key you already have (even under a new name) is rejected. Delete the old one first
with `zcp ssh-key delete <slug>` if you need to replace it.

:::

## Step 5: Understand the network

A VM needs a network. The CLI offers two types:

- **Isolated** (the default): comes with a virtual router, outbound internet, and support for public
  IPs. This is what an internet-facing VPS needs.
- **L2**: a plain layer-2 segment with no router and no public IP support. Use it for appliances
  that manage their own routing, not for a public VPS.

You do not create the network as a separate step. When you create the VM with an Isolated network
plan, the platform provisions the network and a public (source-NAT) IP for it automatically. List
the network plans to pick one:

```bash
# Network plans (use the SLUG column, e.g. pnet-yow)
zcp plan network --region yow-1
```

`pnet-yow` is a public network plan for the `yow` region. Pick the one that matches your region.

:::tip

You can still create and inspect networks directly with `zcp network create`, `zcp network list`,
and `zcp network get`. For a single VPS you do not need to. The next step does it for you.

:::

## Step 6: Create the VPS

Create the VM in one command. This provisions the network, attaches your SSH key, and gives the VM a
public (source-NAT) IP. `--storage-category` is **required**.

```bash
zcp instance create \
  --name dokploy \
  --project default-9 \
  --region yow-1 \
  --template ubuntu-2404-lts \
  --plan ci1l \
  --billing-cycle hourly \
  --network-type Isolated \
  --network-plan pnet-yow \
  --storage-category nvme \
  --ssh-key my-key \
  --wait
```

`--wait` blocks until the VM reaches the **Running** state, usually one to three minutes.

## Step 7: Find the public IP and open the ports

First read the VM details for the login **Username** (Ubuntu images log in as `ubuntu`):

```bash
zcp instance get dokploy
```

:::note

`zcp instance get` shows the **Private IP** but leaves **Public IP** blank. The source-NAT public IP
is not listed there. Find it with `zcp ip list`:

:::

```bash
zcp ip list
```

Note the **IP ADDRESS** and the **SLUG** of the row whose `VM` is `dokploy`.

The source-NAT IP gives the VM outbound internet, but **inbound traffic is blocked until you open
it**. Allow each port and forward it to the VM. Dokploy needs `22` (SSH), `80` and `443` (your apps
and TLS), and `3000` (the dashboard):

```bash
# Replace <ip-slug> with the SLUG from `zcp ip list`
for port in 22 80 443 3000; do
  zcp firewall create --ip <ip-slug> --protocol tcp --cidr 0.0.0.0/0 \
    --start-port "$port" --end-port "$port"
  zcp portforward create --instance dokploy --ip <ip-slug> --protocol tcp \
    --public-port "$port" --public-end-port "$port" \
    --private-port "$port" --private-end-port "$port"
done
```

:::caution

`portforward create` requires the end-port flags (`--public-end-port` / `--private-end-port`) even
for a single port, or it fails with `Private end port is required`. For one port, set the end port
equal to the start port as shown above.

:::

:::tip

Prefer a dedicated one-to-one IP that exposes every port instead of per-port forwards? Allocate an
IP and map it with static NAT (you still add firewall rules for the ports you want reachable):

```bash
zcp plan ip --region yow-1
zcp network list                         # find your VM's network slug
zcp ip allocate --plan ipv4-yow --billing-cycle hourly --network <network-slug>
zcp ip list                              # find the new IP SLUG
zcp ip static-nat enable <ip-slug> --instance dokploy
```

:::

## Step 8: Connect over SSH

Connect with a plain SSH client to the public IP from Step 7:

```bash
ssh -i ~/.ssh/id_ed25519 ubuntu@<public-ip>
```

:::note

`zcp instance ssh` resolves the VM's **private** IP first, so it only works when your machine is on
the same network (for example over a VPN). From a regular workstation, SSH to the **public** IP as
shown above.

:::

If the connection times out, confirm you opened port `22` (Step 7) and that you are using the public
IP from `zcp ip list`.

## Step 9: Install Dokploy

You are now on the VM. Install Dokploy with its official script. It runs as root, so use `sudo`.

```bash
curl -sSL https://dokploy.com/install.sh | sudo sh
```

The installer pulls Docker, starts Dokploy, and serves the dashboard on port `3000`. It prints the
URL when it finishes.

## Step 10: Open the dashboard

In your browser, go to:

```
http://<public-ip>:3000
```

Create your admin account on first load. From there you deploy apps from Git, run databases, and add
domains with automatic TLS.

:::caution

Port `3000` is open to the internet. Set your admin password right away, and point a domain at the
VM so Dokploy can issue TLS certificates for `443`.

:::

## Clean up

Hourly billing runs while resources exist. Remove them when you are done testing. Deleting the VM
this way also releases its source-NAT IP and the firewall and port-forward rules attached to it:

```bash
zcp instance delete dokploy
```

If you allocated a separate IP for static NAT (the Step 7 tip), release it too:

```bash
zcp ip list
zcp ip release <ip-slug>
```

## Recap

The whole flow, start to finish (replace the example slugs with your own):

```bash
# 1. Authenticate
zcp profile add default
zcp auth validate

# 2. Add your SSH key (project + region are required)
zcp ssh-key import --name my-key --key-file ~/.ssh/id_ed25519.pub \
  --project default-9 --region yow-1

# 3. Create the VPS (provisions its own network + source-NAT IP)
zcp instance create \
  --name dokploy --project default-9 --region yow-1 \
  --template ubuntu-2404-lts --plan ci1l --billing-cycle hourly \
  --network-type Isolated --network-plan pnet-yow \
  --storage-category nvme --ssh-key my-key --wait

# 4. Find the public IP, then open SSH + app ports
zcp ip list
for port in 22 80 443 3000; do
  zcp firewall create --ip <ip-slug> --protocol tcp --cidr 0.0.0.0/0 \
    --start-port "$port" --end-port "$port"
  zcp portforward create --instance dokploy --ip <ip-slug> --protocol tcp \
    --public-port "$port" --public-end-port "$port" \
    --private-port "$port" --private-end-port "$port"
done

# 5. Connect and install Dokploy
ssh -i ~/.ssh/id_ed25519 ubuntu@<public-ip>
curl -sSL https://dokploy.com/install.sh | sudo sh
```

## Next steps

- [CLI reference](/public-cloud/cli/reference): every command and flag
- [Connect via SSH](/public-cloud/compute/connect-ssh): key management and troubleshooting
- [Port forwarding](/public-cloud/compute/settings/port-forwarding): expose specific services
- [Docker on the Marketplace](/public-cloud/marketplace/docker): a prebuilt image if you want Docker
  without the manual install
