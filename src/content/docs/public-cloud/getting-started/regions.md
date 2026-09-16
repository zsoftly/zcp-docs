---
title: Regions
description: ZSoftly Cloud Platform regions (YOW and YUL) and what each offers.
---

ZCP runs in two Canadian regions. You pick a region when you create a resource (instance, network,
volume, cluster). Resources are region-scoped: a VM uses networks and volumes in the same region.

| Code  | Location | Role                                          | Processors | Storage tiers                            |
| ----- | -------- | --------------------------------------------- | ---------- | ---------------------------------------- |
| `YUL` | Montreal | Recommended for all production workloads      | Intel, AMD | Pro NVMe (`b2.g1`), Premium SSD (budget) |
| `YOW` | Ottawa   | Development, testing, and private cloud demos | Intel, AMD | NVMe, HDD (budget)                       |

`YUL` and `YOW` are the region codes. The CLI, the API, and Terraform take a region as a slug,
`yul-1` or `yow-1`. Run `zcp region list` to read them. The digit in a slug is not the region digit
in a plan ID. YUL has the slug `yul-1` and the plan digit `2`.

The region is encoded in every plan ID (`1` = YOW, `2` = YUL). See
[Plan Names](/public-cloud/compute/plan-names) for the naming scheme and
[Instance Types](/public-cloud/compute/instance-types) for the specs and storage tiers available in
each region.

## Choosing a region

- **Workload type:** run production and business-critical workloads in YUL. Use YOW for development,
  testing, and private cloud demos.
- **Latency:** pick the region closest to your users.
- **Processor:** both YOW and YUL offer Intel and AMD. YUL Intel capacity uses the `ci2` and `cim2`
  families with the `b2.g1` storage category.
- **Storage:** both regions add a budget tier for cost-sensitive workloads. Premium SSD in YUL, HDD
  in YOW.
- **Data residency:** both regions are in Canada.

## See also

- [Create an Instance](/public-cloud/compute/create-instance)
- [Instance Types](/public-cloud/compute/instance-types)
