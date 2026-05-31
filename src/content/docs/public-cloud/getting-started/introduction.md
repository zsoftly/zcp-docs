---
title: Introduction
sidebar_position: 1
description: Welcome to ZSoftly Cloud Platform (ZCP) documentation.
---

# ZSoftly Cloud Platform (ZCP)

**ZCP** (ZSoftly Cloud Platform) is a cloud infrastructure platform that lets you provision and
manage virtual machines, private networks, block storage, object storage, and Kubernetes clusters
from a single portal.

:::note

Throughout these docs:

- **ZCP**: ZSoftly Cloud Platform (this product, the public cloud portal)
- **ZPCP**: ZSoftly Private Cloud Platform (the on-premises / dedicated private cloud product)
- **ZCP CLI**: the `zcp` command-line tool for managing ZCP resources

:::

## Capabilities

- **Compute**: Launch VMs with shared CPU, dedicated CPU, high-frequency, or GPU configurations
- **Networking**: Create public networks or fully isolated VPCs with subnets, ACLs, and VPN gateways
- **Block Storage**: Attach NVMe SSD volumes to your VMs for additional persistent storage
- **Object Storage**: S3-compatible object storage
- **Kubernetes**: Managed Kubernetes clusters with HA and autoscaling support
- **Load Balancer**: Distribute traffic across VM instances with session persistence options
- **DNS**: Manage domains and DNS records from the portal

## Access methods

| Method | Use case                                                                                                                           |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Portal | Web UI at [cloud.zcp.zsoftly.ca](https://cloud.zcp.zsoftly.ca)                                                                     |
| CLI    | [`zcp`](/public-cloud/cli/installation): scriptable, cross-platform CLI tool                                                       |
| API    | REST API: [Cloud Platform](https://api.zcp.zsoftly.ca/api/docs/nimbo) · [Object Storage](https://api.zcp.zsoftly.ca/api/docs/ceph) |

## Get started

1. [Create your account](./account-signup): sign up, verify email, set up billing
2. [Set up your profile](./profile-setup): personal info, 2FA, user roles
3. [Quickstart](./quickstart): deploy your first VM end-to-end in under 10 minutes
