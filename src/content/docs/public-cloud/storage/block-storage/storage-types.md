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
- Availability and ordering status are region and plan dependent. Confirm the current selection in
  the portal or with ZSoftly before deployment.
- The local plan identifiers are defined for the YUL-1 offering, but CMP catalog publication is
  still pending. Contact ZSoftly for provisioning status if they are not shown in the portal.

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

The standard local root tiers start at **40 GiB**. Larger fixed sizes include 60, 80, 120, 160, 200,
320, and 400 GiB. Custom data-volume sizing has a 10 GiB minimum where the selected plan supports
custom volumes.

Root storage is included with the selected VM plan. A separate data volume is useful when you need
to keep application data separate from the operating system, change the VM independently from the
data, or apply a separate backup plan.

## Backup and recovery

Local storage is not a replacement for backups. A host failure, host maintenance event, or disk
failure can make a local volume unavailable. Use application replication, volume snapshots, and
backups according to the recovery objective for the workload.

Choose shared replicated storage when the workload needs storage-level resilience or recovery on
another host. Choose local storage when direct disk performance or lower storage cost matters more
than immediate cross-host recovery.

Current benchmark measurements and the tradeoffs observed in YUL-1 are documented in
[Local Storage or Replicated Distributed Storage? Our YUL-1 Root Results](https://zcp.zsoftly.ca/blog/local-vs-distributed-yul-root-storage-results/).

See also: [Create Volume](/public-cloud/storage/block-storage/create-volume),
[Volume Snapshots](/public-cloud/storage/block-storage/snapshots),
[Backups](/public-cloud/backups-snapshots/backups)
