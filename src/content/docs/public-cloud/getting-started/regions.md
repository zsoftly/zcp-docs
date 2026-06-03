---
title: Regions
description: ZSoftly Cloud Platform regions (YOW and YUL) and what each offers.
---

ZCP runs in two Canadian regions. You pick a region when you create a resource (instance, network,
volume, cluster). Resources are region-scoped: a VM uses networks and volumes in the same region.

| Code  | Location | Processors | Storage tiers                  |
| ----- | -------- | ---------- | ------------------------------ |
| `YOW` | Ottawa   | Intel, AMD | NVMe, HDD (budget)             |
| `YUL` | Montreal | AMD        | Pro NVMe, Premium SSD (budget) |

The region is encoded in every plan ID (`1` = YOW, `2` = YUL). See
[Plan Names](../compute/plan-names) for the naming scheme and
[Instance Types](../compute/instance-types) for the specs and storage tiers available in each
region.

## Choosing a region

- **Latency:** pick the region closest to your users.
- **Processor:** YOW offers both Intel and AMD; YUL is AMD.
- **Storage:** both regions add a budget tier for cost-sensitive workloads — Premium SSD in YUL, HDD
  in YOW.
- **Data residency:** both regions are in Canada.

## See also

- [Create an Instance](../compute/create-instance)
- [Instance Types](../compute/instance-types)
