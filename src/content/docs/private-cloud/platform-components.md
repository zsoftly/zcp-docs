---
title: Platform Components
sidebar_position: 2
---

# Platform Components

ZSoftly Private Cloud is built from open-source infrastructure components. This page describes
what's included and what ZSoftly configures versus what you control.

## Stack

| Component                          | Role                                          | Managed by                       |
| ---------------------------------- | --------------------------------------------- | -------------------------------- |
| Apache CloudStack                  | Cloud orchestration, VM lifecycle, networking | ZSoftly (initial), You (ongoing) |
| KVM (Kernel-based Virtual Machine) | Hypervisor                                    | ZSoftly                          |
| Ceph                               | Block storage (RBD) and object storage (RGW)  | ZSoftly (initial), You (ongoing) |
| OPNsense                           | Network firewall and routing                  | ZSoftly                          |
| WireGuard                          | VPN for secure remote access                  | ZSoftly                          |

## What ZSoftly configures

- Zone, pod, and cluster layout in CloudStack
- Hypervisor hosts and storage pools
- Network topology and firewall rules
- VPN access for administrators
- Initial admin credentials and access

## What you control

- VM deployment and management via CloudStack UI or API
- Network ACLs and security groups
- Storage allocation and volume management
- User and account management within CloudStack
- Kubernetes deployments (if applicable)

## Official documentation

Each component has comprehensive upstream documentation:

| Component         | Official Docs                            |
| ----------------- | ---------------------------------------- |
| Apache CloudStack | https://docs.cloudstack.apache.org       |
| Ceph              | https://docs.ceph.com                    |
| KVM               | https://www.linux-kvm.org/page/Documents |
