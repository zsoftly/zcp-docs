---
title: Instance Types
sidebar_position: 9
description:
  ZCP compute-only instance plans, per-GB root disks, and storage tiers. Live per-size specs and
  pricing are on the pricing page.
---

ZCP compute plans come in three families across two regions and four storage tiers. For how a plan
ID encodes all of that, see [Plan Names](/public-cloud/compute/plan-names). For the **live per-size
specs (vCPU, RAM) and pricing of every plan**, see the
[pricing page](https://zcp.zsoftly.ca/pricing), which is the source of truth.

## Compute and storage are sold separately

Since October 11, 2026, every plan covers CPU and memory only. The root disk is a separate block
storage volume that you size and pay for per GB. The review step shows compute, network, public IP,
and block storage root as separate lines.

Prices on this page were checked on 2026-10-11. The [pricing page](https://zcp.zsoftly.ca/pricing)
is the source of truth, and `zcp plan vm` and `zcp plan storage` show current prices.

Plan names carry a `c` before the size. `ca2c.m` gives you 2 vCPU and 4 GB of memory in YUL, with a
root disk on `b2.g1` (shared replicated NVMe). It costs $24.80 per month. The earlier bundled plan
`ca2.m` was $36 per month with an 80 GB disk. See [Plan Names](/public-cloud/compute/plan-names).

Existing servers keep their plan and their price. Resizing an existing server's plan does not change
its root disk.

## Root disk

You choose the root disk on the **OS Disk Offering** step when you create the instance.

- The disk is billed per GB per month on the tier you pick. The step lists tiers such as `b2.g1`
  (YUL, shared replicated NVMe) and `b1.g1` (YOW, shared replicated NVMe).
- The minimum size is the size of the template. You cannot choose less.
- Grow the disk at any time. You cannot shrink it.

| Tier    | Region | Media                  | Price per GB per month |
| ------- | ------ | ---------------------- | ---------------------- |
| `b1.g1` | YOW    | Shared replicated NVMe | $0.14                  |
| `b1.g3` | YOW    | Shared HDD             | $0.03                  |
| `b2.g1` | YUL    | Shared replicated NVMe | $0.14                  |
| `b2.g2` | YUL    | Shared replicated SSD  | $0.09                  |
| `b2.l1` | YUL    | Local NVMe             | $0.10                  |
| `b2.l2` | YUL    | Local SSD              | $0.07                  |

Prices are in CAD. The console lists the orderable tiers for each region.

Worked example: a 2 vCPU, 4 GB server on YUL with an 80 GB root disk on `b2.g1` at $0.14 per GB:

- Compute, `ca2c.m`: $24.80 per month
- Root disk, 80 GB at $0.14: $11.20 per month
- Total: $36.00 per month

This matches the earlier bundled `ca2.m` price. The same root size on the default tier costs the
same total as before. A larger or smaller disk changes only the storage line.

## Recommended sizes

The catalogue tags these plans Recommended. The create page does not show the tag yet.

| Category         | YOW (`b1.g1`, `b1.g3`) | YUL (`b2.g1`, `b2.g2`) |
| ---------------- | ---------------------- | ---------------------- |
| General purpose  | `ca1c.l`, `ca1hc.l`    | `ca2c.l`, `ca2sc.l`    |
| CPU-optimized    | `cac1c.m`              | `cac2c.m`, `cac2sc.m`  |
| Memory-optimized | `cam1c.m`              | `cam2c.m`, `cam2sc.m`  |

## Custom plans

Custom plans, where you pick your own CPU and memory, are retired. Choose a fixed size. Servers
already created from a custom plan keep running on it.

## Families

| Family                 | RAM-to-vCPU                            | Best for                                    |
| ---------------------- | -------------------------------------- | ------------------------------------------- |
| General purpose        | 2:1 (4:1 from `xl`, capped at 16 vCPU) | Balanced web and app workloads              |
| Memory-optimized (`m`) | 8:1                                    | RAM-heavy workloads (caches, in-memory DBs) |
| CPU-optimized (`c`)    | 1:1                                    | High-density compute                        |

## Storage tiers

Each series has a default storage tier, shown below, and the default varies by region (see
[Regions](/public-cloud/getting-started/regions)). The tier is the one the series is intended for,
not the only option. On the **OS Disk Offering** step you can choose any tier the console lists as
orderable for your region.

| Default tier                     | Regions | Series                                    |
| -------------------------------- | ------- | ----------------------------------------- |
| `b1.g1` (shared replicated NVMe) | YOW     | `ci1c`, `ca1c`, `cim1c`, `cam1c`, `cac1c` |
| `b2.g1` (shared replicated NVMe) | YUL     | `ca2c`, `cam2c`, `cac2c`                  |
| `b2.g1` (shared replicated NVMe) | YUL     | `ci2c`, `cim2c`                           |
| `b2.g2` (shared replicated SSD)  | YUL     | `ca2sc`, `cam2sc`, `cac2sc` (budget tier) |
| `b1.g3` (shared HDD)             | YOW     | `ci1hc`, `ca1hc`, `cim1hc` (budget tier)  |

## Sizes

Sizes run `xs`, `s`, `m`, `l`, `xl`, `2xl`, `4xl`, `6xl`, smallest to largest. Not every series
offers every size. The [pricing page](https://zcp.zsoftly.ca/pricing) lists the exact vCPU and RAM
for each size, and the portal shows the current options when you create an instance.

## See also

- [Plan Names](/public-cloud/compute/plan-names)
- [Create an Instance](/public-cloud/compute/create-instance)
- [Regions](/public-cloud/getting-started/regions)
