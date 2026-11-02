---
title: Storage Types and Resilience
sidebar_position: 2
---

ZCP public-cloud block storage is available in host-local and shared replicated tiers. Choose the
tier based on performance, recovery requirements, and workload criticality.

## Availability

- **YUL-1** is the primary production region for local storage.
- **YOW-1** is intended for development and testing. Do not use it as the production target for this
  storage offering.
- Availability and ordering status depend on the selected region and plan. Confirm the current
  selection in the portal or with ZSoftly before deployment.
- The plans shown in the portal are the source of truth for current regional availability. If a plan
  is not shown as orderable, do not assume it is available for self-service deployment.

## Pricing and ordering

The [ZCP pricing page](https://zcp.zsoftly.ca/pricing/#block-storage) is the source for current
storage rates and local-tier ordering status. The docs explain storage behavior and selection, but
do not duplicate the pricing tables.

## Storage tiers

| Tier    | Storage                | Resilience                             | Good fit                                                                          |
| ------- | ---------------------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| `b2.l1` | Local NVMe SSD         | One host and one disk                  | Databases with application replication, caches, scratch data, and build workloads |
| `b2.l2` | Local SATA SSD         | One host and one disk                  | Economical local capacity and lower-I/O workloads                                 |
| `b2.g1` | Shared replicated NVMe | Distributed across the storage cluster | Production workloads that need host recovery and shared-storage resilience        |
| `b2.g2` | Shared replicated SSD  | Distributed across the storage cluster | Production workloads that need host recovery and shared-storage resilience        |

Local storage attaches the VM to storage on its host. It provides direct disk performance, but the
volume depends on that host. Local storage does not provide storage-level replication or normal
cross-host live migration.

Shared replicated storage adds network and replication overhead. It provides a stronger recovery
boundary because the data remains available across the storage cluster when the platform supports
recovery on another host.

## Sizes and root disks

Root disk size is chosen per instance, with the template size as the minimum. Data volumes have a 10
GiB minimum.

Root storage is no longer included with the VM plan. Since October 11, 2026, the root disk is a
block storage volume on the tier you choose on the **OS Disk Offering** step. It is billed per GB
per month at the rate for that tier. The minimum size is the template size. Grow the disk at any
time. You cannot shrink it. See [Instance Types](/public-cloud/compute/instance-types). Servers
created before that date keep their bundled root disk and their price.

Use a data volume to keep application data apart from the operating system, change the VM without
touching the data, or back up the data on its own plan.

Prices were checked on 2026-10-11. The [pricing page](https://zcp.zsoftly.ca/pricing) is the source
of truth.

| Tier    | Region | Media                  | Price per GB per month |
| ------- | ------ | ---------------------- | ---------------------- |
| `b1.g1` | YOW    | Shared replicated NVMe | $0.14                  |
| `b1.g3` | YOW    | Shared HDD             | $0.03                  |
| `b2.g1` | YUL    | Shared replicated NVMe | $0.14                  |
| `b2.g2` | YUL    | Shared replicated SSD  | $0.09                  |
| `b2.l1` | YUL    | Local NVMe             | $0.10                  |
| `b2.l2` | YUL    | Local SSD              | $0.07                  |

Prices are in CAD.

## Backup and recovery

Local storage is not a replacement for backups. A host failure, host maintenance event, or disk
failure can make a local volume unavailable. Use application replication, volume snapshots, and
backups according to the recovery objective for the workload.

Choose shared replicated storage when the workload needs storage-level resilience or recovery on
another host. Choose local storage when direct disk performance or lower storage cost matters more
than immediate cross-host recovery.

See also: [Create Volume](/public-cloud/storage/block-storage/create-volume),
[Volume Snapshots](/public-cloud/storage/block-storage/snapshots),
[Backups](/public-cloud/backups-snapshots/backups)
