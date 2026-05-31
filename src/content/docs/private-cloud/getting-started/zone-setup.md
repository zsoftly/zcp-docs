---
title: Zone Setup
sidebar_position: 4
---

# Zone Setup

Understanding how ZSoftly has structured your CloudStack deployment.

## CloudStack zones, pods, and clusters

Apache CloudStack organizes infrastructure into a hierarchy:

```
Zone
└── Pod
    └── Cluster
        ├── Host (KVM hypervisor)
        └── Primary Storage (Ceph RBD)
```

**Zone**: a logical datacenter. In most ZSoftly deployments, one zone = one physical location.

**Pod**: a group of layer-2 connected hosts within a zone. Typically one pod per zone in standard
deployments.

**Cluster**: a group of hypervisor hosts sharing the same configuration and primary storage.

**Host**: a physical or virtual KVM hypervisor that runs your VMs.

## Your deployment layout

Your credentials document includes the zone name and cluster count. To view the full layout:

1. Log in to the CloudStack UI as admin
2. Go to **Infrastructure → Zones**
3. Click your zone to expand pods, clusters, and hosts

## What ZSoftly manages

- Adding new hypervisor hosts to existing clusters
- Ceph storage pool expansion
- Zone-level networking configuration

Contact ZSoftly support for changes to the underlying infrastructure layout.

## Official reference

See the
[Apache CloudStack Administrator Guide](https://docs.cloudstack.apache.org/en/latest/adminguide/)
for full zone management documentation.
