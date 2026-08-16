---
title: Regions
description: ZSoftly Cloud Platform regions (YOW and YUL) and what each offers.
---

ZCP runs in two Canadian regions. You pick a region when you create a resource (instance, network,
volume, cluster). Resources are region-scoped: a VM uses networks and volumes in the same region.

| Code  | Location | Processors | Storage tiers                            |
| ----- | -------- | ---------- | ---------------------------------------- |
| `YOW` | Ottawa   | Intel, AMD | NVMe, HDD (budget)                       |
| `YUL` | Montreal | Intel, AMD | Pro NVMe (`b2.g1`), Premium SSD (budget) |

The region is encoded in every plan ID (`1` = YOW, `2` = YUL). See
[Plan Names](/public-cloud/compute/plan-names) for the naming scheme and
[Instance Types](/public-cloud/compute/instance-types) for the specs and storage tiers available in
each region.

## Choosing a region

- **Latency:** pick the region closest to your users.
- **Processor:** both YOW and YUL offer Intel and AMD. YUL Intel capacity uses the `ci2` and `cim2`
  families with the `b2.g1` storage category.
- **Storage:** both regions add a budget tier for cost-sensitive workloads. Premium SSD in YUL, HDD
  in YOW.
- **Data residency:** both regions are in Canada.

## See also

- [Create an Instance](/public-cloud/compute/create-instance)
- [Instance Types](/public-cloud/compute/instance-types)
