---
title: Instance Types
sidebar_position: 9
description:
  ZCP compute instance families and storage tiers. Live per-size specs and pricing are on the
  pricing page.
---

ZCP compute plans come in three families across two regions and four storage tiers. For how a plan
ID encodes all of that, see [Plan Names](./plan-names). For the **live per-size specs (vCPU, RAM,
root disk) and pricing of every plan**, see the [pricing page](https://zcp.zsoftly.ca/pricing),
which is the source of truth.

## Families

| Family                 | RAM-to-vCPU                            | Best for                                    |
| ---------------------- | -------------------------------------- | ------------------------------------------- |
| General purpose        | 2:1 (4:1 from `xl`, capped at 16 vCPU) | Balanced web and app workloads              |
| Memory-optimized (`m`) | 8:1                                    | RAM-heavy workloads (caches, in-memory DBs) |
| CPU-optimized (`c`)    | 1:1                                    | High-density compute                        |

## Storage tiers

The storage tier is fixed per series and varies by region (see
[Regions](../getting-started/regions)):

| Tier        | Regions | Series                                 |
| ----------- | ------- | -------------------------------------- |
| NVMe        | YOW     | `ci1`, `ca1`, `cim1`, `cam1`, `cac1`   |
| Pro NVMe    | YUL     | `ca2`, `cam2`, `cac2`                  |
| Premium SSD | YUL     | `ca2s`, `cam2s`, `cac2s` (budget tier) |
| HDD         | YOW     | `ci1h`, `ca1h`, `cim1h` (budget tier)  |

## Sizes

Sizes run `xs`, `s`, `m`, `l`, `xl`, `2xl`, `4xl`, `6xl`, smallest to largest. Not every series
offers every size. The [pricing page](https://zcp.zsoftly.ca/pricing) lists the exact vCPU, RAM, and
root disk for each size, and the portal shows the current options when you create an instance.

## See also

- [Plan Names](./plan-names)
- [Create an Instance](./create-instance)
- [Regions](../getting-started/regions)
