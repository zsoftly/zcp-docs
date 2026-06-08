---
title: Overview
sidebar_position: 1
---

# ZSoftly Cloud Storage

ZSoftly Cloud Storage (ZCS) is a standalone, storage-only product. You get a dedicated,
single-tenant [Ceph](https://docs.ceph.com) storage cluster with root-level access, sized to your
workload. It is not a compute cloud. It is the storage tier you build large-scale object, block, and
file workloads on, on its own or alongside ZSoftly Public Cloud (ZCP) or Private Cloud (ZPCP).

## What it is

A fully distributed Ceph cluster, provisioned on dedicated hardware and handed to you with
administrative access. There is no single point of failure and no multi-tenant contention, so you
get predictable performance and the freedom to tune the cluster to your workload. Pool layouts,
replication versus erasure coding, device classes, and caching are all yours to configure.

A single cluster speaks three storage interfaces at once:

- **Object storage**: an S3-compatible endpoint (Ceph RGW) for the S3 tools and SDKs you already
  use. See [Object Storage](./reference/object-storage).
- **Block storage**: network block devices (Ceph RBD) for virtual machines, databases, and
  Kubernetes persistent volumes. See [Block Storage](./reference/block-storage).
- **File storage**: a POSIX shared filesystem (CephFS) you mount across many clients. See
  [File Storage](./reference/file-storage).

## Two delivery models

**Hosted (public)** ZSoftly provisions and operates your dedicated cluster on ZSoftly hardware in
one of our regions (YUL, YOW). You get root access and a private endpoint without owning or racking
hardware.

**On-premises (private)** ZSoftly designs and deploys a dedicated cluster on hardware you own or
operate, in your facility. This fits data residency, sovereignty, or existing data-center
investments.

In both models the cluster is **single-tenant and yours to administer**. Same Ceph, same root
access, same interfaces. Only the location and ownership of the hardware differ.

## Key capabilities

- **Exabyte scale, no single point of failure**. Scale horizontally by adding nodes. Data is
  replicated or erasure-coded across the cluster.
- **Root-level control**. Administer pools, users, OSDs, and the Ceph Dashboard directly.
- **Performance tiering**. Use NVMe as a fast pool or a cache layer in front of high-capacity
  drives. See [Performance & Tiering](./reference/performance-tiering).
- **Replication and disaster recovery**. Replicate to another ZSoftly region, an on-prem cluster, or
  any Ceph cluster you administer. See [Replication & DR](./reference/replication-dr).
- **Version choice**. Provisioned on a recent stable Ceph release, or a specific version you select
  with our team. See [Ceph Versions](./reference/ceph-versions).

## Use cases

- **Big data and analytics**. Large datasets with parallel access and built-in redundancy.
- **HPC, ML, and AI**. High-throughput shared storage for simulations and training datasets.
- **S3 at scale**. An open, cost-effective alternative to hyperscaler object storage.
- **Backup and disaster recovery**. A replication target for an existing Ceph cluster.

## How this differs from ZCP storage

ZCS is dedicated and root-access. ZSoftly Public Cloud also offers
[object storage](/public-cloud/storage/object-storage/create-bucket) and
[block storage](/public-cloud/storage/block-storage/create-volume), but those are managed,
multi-tenant services you consume through the ZCP portal and API. You use the storage, you do not
operate the cluster. Choose ZCP storage for managed, pay-as-you-go capacity inside the public cloud.
Choose ZCS when you need a dedicated cluster you control.

## Get started

→ [Contact ZSoftly](https://zcp.zsoftly.ca/contact?source=docs&topic=cloud-storage) to size and
provision a cluster.

Once your cluster is provisioned, continue to
[Provisioning a Cluster](./getting-started/provisioning) and
[Accessing Your Cluster](./getting-started/accessing-your-cluster).
