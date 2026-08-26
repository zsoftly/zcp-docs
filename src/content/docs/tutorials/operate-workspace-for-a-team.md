---
title: 'Make It Operational for a Team'
description:
  Turn the private network, storage, and desktops from this series into a repeatable, safe process
  for onboarding, offboarding, backups, and lifecycle management for a real team.
sidebar:
  label: 'Operate It for a Team'
---

The previous four tutorials in this series stood up one private network, one desktop, and one shared
file share. This tutorial turns that into a repeatable, safe-to-operate process for an actual team:
onboarding, offboarding, backups, snapshots, and lifecycle rules. Less "run this command," more a
checklist and the reasoning behind it.

## Before you start

- [Build a Private Network with Headscale](/tutorials/build-private-network-headscale),
  [Deploy Private Shared Storage](/tutorials/deploy-private-shared-storage),
  [Deploy Ubuntu Employee Desktops](/tutorials/deploy-ubuntu-employee-desktops), and
  [Connect Desktops to Storage](/tutorials/connect-desktops-to-storage) all complete.
- Nothing new to deploy in this tutorial. It's about operating what already exists.

## Onboarding a new employee

This reuses the desktop tutorial's flow directly, with no new mechanism, just repeated per employee:

```bash
# 1. deploy.env userdata with this employee's username and password
# 2. Deploy into the same tier
zcp instance create --name <employee>-desktop --template <ubuntukde-slug> \
  --plan ci2lxl --billing-cycle hourly --network-plan pnet-yul --is-public=false \
  --user-data-file deploy.env-userdata.yaml --wait
zcp instance add-network <employee>-desktop --network workspace-tier
# 3. Confirm RDP access
# 4. Mount company storage
```

Checklist: deploy the VM, confirm RDP access, mount storage, hand off credentials to the employee.

Track each employee's VM (name, IP, deploy date) somewhere durable. `zcp instance list` gives the
raw data, but "which VM belongs to which person" needs to be answerable without guessing, so a
simple tracked list mapping employee to VM slug is worth keeping even if it's just a spreadsheet.

## Offboarding

Because company data lives on the storage VM, not the desktop itself, offboarding is clean. Destroy
the employee's desktop VM:

```bash
zcp instance delete <employee>-desktop
```

There is no shared state between a desktop VM and the storage VM other than the NFS mount itself,
which simply stops working once the desktop is gone. This is one of the concrete advantages this
architecture has over laptop-resident data: destroying a VM can never lose company data, because the
data was never on it.

Revoke the employee's Headscale access as an explicit step, not an afterthought. A destroyed VM
doesn't automatically revoke network-level trust if they had other enrolled devices, such as a phone
or personal laptop:

```bash
docker exec headscale headscale nodes list   # find their node ID(s)
docker exec headscale headscale nodes delete --identifier <node-id>
```

Or, through the Headplane UI: Machines, find the device, remove.

## Permissions and access boundaries

Map employees or teams to storage export scoping and Headscale ACL or tag boundaries, rather than
everyone sharing one flat network. There's no single right ACL scheme here. Every organization's
team structure differs, so treat this as a checklist to adapt rather than a template to copy
exactly.

## Backups

`zcp` has two distinct backup primitives: `vm-backup`, recurring and scheduled, and `vm-snapshot`,
point-in-time. Two distinct things to back up, don't conflate them:

- **The storage VM's data**, the actual company files. This is the high-value target. Recommend a
  real recurring backup here.
- **Desktop VMs**. Lower stakes, since they're disposable and re-provisionable through the
  onboarding flow above. A snapshot here is convenience, not disaster recovery.

Point-in-time snapshot:

```bash
zcp plan vm-snapshot   # find the plan slug, e.g. vm-snapshot-yul
zcp vm-snapshot create --vm my-storage --name pre-change-snapshot \
  --plan vm-snapshot-yul --billing-cycle monthly
zcp vm-snapshot list   # confirm state: Ready
```

:::caution

`zcp vm-backup create`, the recurring and scheduled primitive that actually matters for a real
backup cadence, rejects every interval value tested, including `daily`, the CLI's own documented
example, in every casing tried. Every attempt fails with
`API error 500: The selected interval is invalid.` Until this is fixed, use `vm-snapshot` on a
manual schedule (for example, a cron job calling the CLI) as a workaround.

:::

## Snapshots and VM lifecycle

A VM snapshot left in an error state on a stopped VM can block that VM from being destroyed later.
Check snapshot state before relying on a snapshot-then-destroy pattern for teardown, since
offboarding above does exactly that.

Decide a golden-image update cadence. When the `ubuntukde` template gets a new version, decide
whether existing employee desktops get rebuilt or patched in place, and document that answer rather
than deciding it ad hoc each time.

## Monitoring

Watch RDP session health, storage VM disk usage, and network reachability through Headscale. Full
monitoring-stack integration is likely out of scope for a first pass at this. Treat it as a next
step rather than something to configure here.

## Recap

Onboard, offboard, set permissions, back up, manage snapshots and lifecycle, monitor.

## Next steps

- [Build a Private Network with Headscale](/tutorials/build-private-network-headscale)
- [Deploy Private Shared Storage](/tutorials/deploy-private-shared-storage)
- [Deploy Ubuntu Employee Desktops](/tutorials/deploy-ubuntu-employee-desktops)
- [Connect Desktops to Storage](/tutorials/connect-desktops-to-storage)
