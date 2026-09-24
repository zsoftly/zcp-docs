---
title: 'Deploy Private Shared Storage on ZCP'
description:
  Deploy an NFS file share inside your private tier from Build a Private Network with Headscale,
  using the zcp CLI. The share is reachable only from the tier and the mesh, never exposed publicly.
sidebar:
  label: 'Deploy Private Storage (CLI)'
---

This tutorial deploys an NFS file share on a VM inside the private tier from
[Build a Private Network with Headscale](/tutorials/build-private-network-headscale). The share is
reachable from the tier and the mesh network that tutorial built, and never exposed publicly.

By the end you have:

- A VM inside your existing private tier, with a separate data disk for storage
- An NFS share exported to the tier and the mesh, never on the public side
- Confirmation that the share works from a mesh client and that its public IP has nothing but SSH
  reachable on it

Plan for about 20 minutes.

## Before you start

- [Build a Private Network with Headscale](/tutorials/build-private-network-headscale) complete: a
  VPC with a private tier, a Headscale server, and a subnet router already advertising and serving
  that tier's route. This tutorial needs the exact tier name that build created, e.g.
  `my-workspace-tier` if you used `--name my-workspace`.
- `ZCP_REGION` and `ZCP_PROJECT` still exported from the previous tutorial, or re-export them.
- The same SSH key name from that tutorial's Step 4.
- `jq` installed. The deploy and teardown scripts in this tutorial require it, same as the previous
  tutorial's.

:::note

This script and the teardown script further down need a bash shell. That's native on macOS and
Linux. On Windows, run it from WSL or Git Bash, same as the previous tutorial.

:::

## Run the script

Deploying the storage VM, its data disk, and the NFS export is one script:
`zcp/deploy-private-storage.sh` from the [zsoftly/tools](https://github.com/zsoftly/tools)
repository. It runs through the same phases explained in the next section, in order.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/zsoftly/tools/main/zcp/deploy-private-storage.sh) \
  --ssh-key my-key --tier-name my-workspace-tier --name my-storage
```

This tutorial uses `my-storage` as the `--name` prefix and `my-workspace-tier` as the tier from the
previous tutorial's `my-workspace` example. Your own values will differ based on the `--name` you
used there and the one you choose here.

The script picks up `ZCP_REGION` and `ZCP_PROJECT` from your shell if you exported them. Pass
`--region`/`--project` instead if you didn't.

| Flag            | Purpose                                | Default / requirement      |
| --------------- | -------------------------------------- | -------------------------- |
| `--ssh-key`     | Key name, used for the storage VM      | Required                   |
| `--tier-name`   | The existing private tier to attach to | Required                   |
| `--name`        | Prefix for the VM and volume           | `storage`                  |
| `--share-name`  | NFS share directory name               | `company-share`            |
| `--volume-size` | Data volume size in GB                 | `20`                       |
| `--region`      | zcp region slug                        | Required (flag or env var) |
| `--project`     | zcp project slug                       | Required (flag or env var) |
| `-y`/`--yes`    | Skip the confirmation prompt           | Off                        |

`--tier-name` is not auto-discovered. An account can hold more than one private tier from earlier
testing, and guessing which one to attach to is a real isolation risk. The script hard-errors if the
name you pass doesn't resolve to exactly one tier.

The script auto-discovers the compute plan, network plan, and both storage categories (VM root disk
and data volume, which can differ) the same way `build-private-network.sh` does. It also
auto-detects your public IP (`--my-ip`), used to scope the VM's SSH access, via `ifconfig.me`. Pass
any flag explicitly to pin a specific value instead. Run the script with `--help` for the full list.

## What the script builds

### The storage VM

**The script deliberately allocates a public IP to the VM (`my-storage`, named from the `--name`
prefix you pass), then locks it down to nothing but SSH.**

A VM with no public network footprint sounds like the most private option. But it creates a real
problem: there's no way to reach it, not even for the one-time setup that brings the tier network
interface up. The script deploys normally instead. It allocates a public IP, then locks SSH down to
your own IP the same way `build-private-network.sh` locks down both of its VMs. It never opens
anything else on the public side. The VM ends up just as unreachable for NFS from the outside as a
no-public-IP VM would be. The public IP exists only for tightly scoped admin access.

The VM is attached to the tier you named with `add-network`, the same step
`build-private-network.sh` uses for the subnet router.

:::caution

`zcp volume create --plan <slug>` fails on this platform with a server error
(`API error 500: Undefined property: stdClass::$storage`). The script always uses `--size` instead,
never `--plan`.

:::

### Tier NIC and data disk

**The tier interface comes up the same way the subnet router's does. The data disk is detected, not
assumed.**

The platform hot-adds the tier's network interface, but the operating system doesn't bring it up
automatically. The script writes a netplan file for it and applies it, identical to how
`build-private-network.sh` handles the subnet router's tier NIC.

The data disk is the volume (`my-storage-data`) created alongside the VM. The script identifies it
as "the whole disk that isn't the root disk", rather than assuming a fixed device name. Device
naming can vary by platform, and a script that guesses wrong on this step risks formatting the wrong
disk. Formatting is idempotent: if the disk is already formatted (a rerun), the script skips `mkfs`
rather than reformatting and destroying data. The script creates the share directory **after**
mounting, not before. A directory created before the mount lands on the root disk. The moment the
data disk is mounted on top of it, that directory gets hidden.

### NFS export

**Exported to both the tier CIDR and the mesh CIDR: the server accepts either source address, even
though only one of them is actually reachable with today's default configuration.**

The script installs `nfs-kernel-server` and exports the share directory to two ranges: the tier's
own CIDR, and `100.64.0.0/10`, Headscale's mesh address range (the same constant
`build-private-network.sh` uses for its ACL rules).

:::caution

A VM physically on the tier connects with a tier-address source. Tailscale's subnet router SNATs
forwarded traffic by default, so an employee connecting over Tailscale from anywhere else also
arrives with a tier-address source today, not their real mesh-range address (`100.64.0.0/10`). The
mesh CIDR export exists for the alternative case: a subnet router started with
`--snat-subnet-routes=false`. That flag alone isn't a supported configuration. Without SNAT, this VM
also needs its own route back to `100.64.0.0/10`, and nothing here sets that up, so the combination
would still hang rather than work. Don't disable SNAT on the subnet router unless you've solved that
separately.

:::

:::note

The export uses `root_squash`, the safer default: root on a client machine does not get
root-equivalent access to the share.

:::

:::note

The share directory itself is `chmod 1777`. Every client on the tier or the mesh can read and write
anything on it. The sticky bit stops one user from deleting another's files, but there's no other
per-user permission model. Treat the share as a trusted, team-wide area, not one with individual
access control.

:::

### OS firewall

**A second, independent layer for NFS, scoped the same way as the export. SSH stays on the `zcp`
layer alone.**

The script also opens the storage VM's own OS-level firewall (`ufw`) for NFS's three ports (2049,
111, 20048), scoped to the same two CIDRs as the export itself. No `zcp` firewall or port-forward
rule for these ports exists on the VM's public IP either. Both layers matter for NFS. Neither alone
is the whole story.

SSH is different: the script explicitly allows it unscoped (`0.0.0.0/0`) at the `ufw` level. `ufw`'s
default for everything else stays deny, once `--force enable` turns it on. The restriction to your
own IP happens entirely at the `zcp` firewall layer instead, the same lockdown
`build-private-network.sh` applies to its own VMs. Scoping `ufw` itself to your IP too would work
today, but would lock you out the moment your IP changes, since `ufw` has no equivalent of the
script's own stale-rule cleanup.

## Inspect what was created

```bash
zcp instance list
zcp volume list
zcp ip list
```

## Verify from a mesh client

Use any device already connected via Tailscale to the Headscale server from the previous tutorial,
not something physically on the tier. This is the scenario that matters:

```bash
sudo apt-get install -y nfs-common
sudo mkdir -p /mnt/company-share
sudo mount -t nfs <storage-vm-tier-ip>:/srv/nfs/company-share /mnt/company-share

echo "test" | sudo tee /mnt/company-share/test.txt
cat /mnt/company-share/test.txt
```

`<storage-vm-tier-ip>` is printed in the script's final summary. `company-share` is the default
`--share-name`. Use your own value if you passed something different.

:::note

The `apt-get` command above assumes a Debian/Ubuntu client. Use your own OS's NFS client package and
mount tooling if you're on something else.

:::

:::caution

If this hangs instead of failing cleanly, check `tailscale status` on both the client and the subnet
router before assuming anything about the NFS or firewall configuration is wrong. A node can
silently go offline (unable to reach the coordination server) with no obvious trigger.
`sudo systemctl restart tailscaled` on the affected node resolves it, the same fix noted in the
previous tutorial.

:::

## Verify isolation

```bash
# from the public internet:
nc -zv -w 3 <storage-vm-public-ip> 2049
```

This fails (connection refused or timeout). The storage VM's public IP has SSH open and nothing
else. NFS is reachable only from inside the tier or over the mesh, never from the public internet.

:::note

`nc` (`sudo apt-get install -y netcat-openbsd` on Debian/Ubuntu if you don't have it; macOS ships
its own `nc` already) works the same way in any shell. `/dev/tcp/<host>/<port>` is a bash-only
feature and errors outright in shells like zsh.

:::

## Clean up

Hourly billing runs while these resources exist. The teardown script removes the storage VM and its
data volume for a given `--name` prefix. It does not touch the private tier or VPC from the previous
tutorial.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/zsoftly/tools/main/zcp/destroy-private-storage.sh) \
  --name my-storage --allow-unverified-volume-delete
```

It picks up `ZCP_REGION`/`ZCP_PROJECT` from your shell the same way the deploy script does. Pass
`--region`/`--project` explicitly if you didn't export them. The script hard-errors without one or
the other.

:::note

The `zcp` CLI has no way to check whether a volume belongs to a given VM, or whether it's currently
attached to anything at all, so the deploy script records the exact resources it created to
`~/.zcp-private-storage-state/` on the machine you ran it from, keyed by `--name`, `--region`, and
`--project` together. Run the teardown from that same machine, with the same `--region`/`--project`,
and it resolves the volume from that record instead of a name guess. The record itself is written
once the disk-setup checks in Step 2 pass, not as soon as the VM and volume exist, so a deploy that
fails before then leaves nothing to record.

The script resolves the volume from that record, or falls back to a bare name match on a different
machine. Either way, it can tell you which volume it would delete. It cannot confirm the volume is
still attached to this VM right now. Someone could have manually reattached it elsewhere since
deploy ran, and this CLI would not show that. Deleting the volume always requires
`--allow-unverified-volume-delete` in every case, including when the script resolves the volume from
its own state record. Leave it off and the VM still gets deleted, but the data volume is left alone
(and still billable) with a non-zero exit and a printed reason.

:::

:::caution

This runs with no confirmation prompt of its own: every delete it issues, including the data volume
and everything on the share, happens immediately.

The script explicitly detaches the data volume before deleting the VM, then deletes the volume as
its own separate step, rather than counting on the VM delete to handle an attached disk on its own.
If either step fails, the volume can be left behind, still billable. Check `zcp volume list`
afterward.

Like every VM in this series deployed with its own public IP, the storage VM also created its own
standalone network and pinned source-NAT IP. `instance delete` won't remove either one. The script
detects and reports a leftover the same way `destroy-private-network.sh` does. Check its output. If
one appears, remove it from the CMP web portal (search by the network ID it prints). A confirmed
leftover makes the script exit non-zero, so check `$?` after running it. A delete the script issued
but never confirmed (a `[WARN]` line, not necessarily a leftover network) also exits non-zero for
the same reason. Don't assume a non-zero exit always means a leftover network. Check the `[WARN]`
lines above it too.

:::

## Recap

1. Deploy a VM inside the tier from the previous tutorial, with a separate data disk:
   `deploy-private-storage.sh --ssh-key <name> --tier-name <tier-name> --name my-storage`.
2. The script locks the VM's SSH down to your own IP, brings up the tier interface, formats and
   mounts the data disk, and exports it over NFS to both the tier and mesh CIDRs, with a matching OS
   firewall.
3. Mount the share from a device already connected to the mesh, verify read/write, then confirm the
   storage VM's public IP has nothing but SSH reachable on it.
4. Run `destroy-private-storage.sh --name <prefix> --allow-unverified-volume-delete` when you're
   done, then check for a leftover network the same way the previous tutorial's teardown does.

## Next steps

- [Deploy Ubuntu Employee Desktops](/tutorials/deploy-ubuntu-employee-desktops): a full desktop for
  one employee inside the same tier, connecting them to this share is still in progress
- [Build a Private Network with Headscale](/tutorials/build-private-network-headscale): the tier and
  mesh this tutorial builds on
- [CLI reference](/public-cloud/cli/reference): every command and flag
- [Tutorials overview](/tutorials): the full list of available tutorials
