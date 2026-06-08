---
title: Provisioning a Cluster
sidebar_position: 1
---

# Provisioning a Cluster

The ZSoftly team provisions your ZSoftly Cloud Storage cluster to your requirements. This page
explains what we need from you and what you receive.

## Sizing inputs

To size your cluster, we work with you on:

- **Usable capacity**. Your target usable storage, after replication or erasure coding.
- **Data protection**. Replication (for example 3x) or erasure coding for capacity efficiency, per
  pool.
- **Performance profile**. Throughput and latency targets, plus any NVMe
  [fast tier or cache layer](../reference/performance-tiering).
- **Interfaces**. Which of object (S3), block (RBD), and file (CephFS) you need.
- **Delivery model**. [Hosted](../overview#two-delivery-models) in a ZSoftly region, or on-premises
  on your hardware.
- **Ceph version**. A recent stable release by default, or a
  [specific version](../reference/ceph-versions) you select with our team.

## What you receive

When your cluster is ready, ZSoftly provides a **credentials document** with:

- **Root and administrative access** to the cluster
- **Ceph Dashboard** URL and login
- **S3 endpoint URL** plus an initial access key and secret, for object storage
- The **Ceph version** deployed

See [Accessing Your Cluster](./accessing-your-cluster) for how to use each of these.

:::note

Your credentials document is the source of truth for endpoints, versions, and access details
specific to your cluster.

:::

## Scaling later

Clusters scale horizontally. You add capacity or performance by expanding the cluster with more
nodes or devices. Contact ZSoftly to plan an expansion.

## Get started

→ [Contact ZSoftly](https://zcp.zsoftly.ca/contact?source=docs&topic=cloud-storage) to provision or
expand a cluster.
