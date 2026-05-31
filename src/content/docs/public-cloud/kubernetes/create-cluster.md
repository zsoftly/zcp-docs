---
title: Create Kubernetes Cluster
sidebar_position: 1
---

## Kubernetes Clusters

A Kubernetes cluster is a set of machines (nodes) that run containerized applications in an
automated, managed way. ZSoftly Public Cloud provides managed Kubernetes clusters with HA support
and autoscaling.

### Create a Cluster

- From the left-hand menu, click **Kubernetes**.
- Click **Create Cluster** or the **+** icon.

:::note Screenshot pending. Will be updated once the ZSoftly portal is confirmed stable. :::

### Steps

1. **Location**: select the data center.
2. **Project**: assign to a project.
3. **Network**: select an existing private network, or create a new one.
4. **Cluster Capacity**:
   - Select a predefined **Node Plan** (fixed CPU/memory/storage)
   - Or use a **Custom Plan** (specify CPU, memory, storage, and node count)
5. **Advanced Settings** (optional):
   - Enable **High Availability** for redundancy
   - Add **Control Nodes** for additional stability
   - Add an **SSH Key** for node access
6. **Cluster Name**: provide a unique name.
7. **Create**:
   - Billing cycles: Hourly, Monthly, Quarterly, Semiannually, Yearly, Bi-annually, Tri-annually
   - Billing rules: Date to Date, Fixed Calendar Month, Unfixed Calendar Month, Fixed Prorata,
     Unfixed Prorata
   - Click **Create Cluster**

See also: [Cluster Overview](./cluster-overview), [kubectl Access](./kubectl-access)
