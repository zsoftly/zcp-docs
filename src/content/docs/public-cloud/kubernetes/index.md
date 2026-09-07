---
title: Kubernetes
description: Create and operate Kubernetes clusters in ZCP.
---

ZCP Kubernetes provides managed clusters for containerized applications. Create a cluster, choose
its node configuration and network, then use `kubectl` or the dashboard to deploy and operate your
workloads.

## Plan Your Cluster

Before creating a cluster, choose the project, region, node plan, network, and access key that fit
the workload. Consider the capacity that application pods need and how the workload should scale.

Use [Create Cluster](/public-cloud/kubernetes/create-cluster) for the portal workflow.

Review the [version lifecycle](/public-cloud/kubernetes/create-cluster#version-lifecycle) before
selecting a Kubernetes minor version.

## Operate Your Cluster

The cluster overview shows the cluster status, node configuration, resource totals, and management
actions. Download the `kubeconfig` file to connect with `kubectl`. Use the dashboard when you need a
browser-based view of cluster resources.

## Next Steps

- [Create a cluster](/public-cloud/kubernetes/create-cluster)
- [Review version lifecycle](/public-cloud/kubernetes/create-cluster#version-lifecycle)
- [Review cluster details](/public-cloud/kubernetes/cluster-overview)
- [Connect with kubectl](/public-cloud/kubernetes/kubectl-access)
- [Open the dashboard](/public-cloud/kubernetes/dashboard-access)
