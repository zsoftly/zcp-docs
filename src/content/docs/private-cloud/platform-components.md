---
title: Platform Components
sidebar_position: 2
---

# Platform Components

ZSoftly Private Cloud is built from open-source infrastructure components. The stack below is our
**recommended core**: the combination we recommend and have the most engineering experience with.
These are recommendations and options for your environment, not a fixed ZSoftly stack. None of it is
locked in. The strength of ZPCP is flexibility and customization. Our team works with the tools you
already use for networking, firewall, security, and storage, swaps components to fit your
environment, and assembles an integrated platform that fully replaces VMware vSphere and other
licensed tools.

This page describes the recommended stack, the alternatives each layer can be swapped for, and what
ZSoftly configures versus what you control.

## Recommended core stack

| Component                          | Role                                              | Managed by                       |
| ---------------------------------- | ------------------------------------------------- | -------------------------------- |
| Apache CloudStack                  | Cloud orchestration, VM lifecycle, networking     | ZSoftly (initial), You (ongoing) |
| KVM (Kernel-based Virtual Machine) | Hypervisor (replaces VMware ESXi)                 | ZSoftly                          |
| Ceph                               | Block storage (RBD) and object storage (RGW)      | ZSoftly (initial), You (ongoing) |
| OPNsense                           | Open-source software-defined firewall and routing | ZSoftly                          |
| WireGuard                          | VPN for secure remote access                      | ZSoftly                          |
| Keycloak or Authentik              | Identity, SSO, and social login                   | ZSoftly (initial), You (ongoing) |

An optional **branded self-service portal** can sit on top of the orchestration layer for your end
users.

## Flexibility and alternatives

Nothing in the stack is set in stone. Each layer can be swapped for an alternative or integrated
with a tool you already run. ZSoftly's engineers design the combination that best replaces your
existing VMware vSphere or other licensed platform.

| Layer                              | Recommended           | Alternatives                                                          |
| ---------------------------------- | --------------------- | --------------------------------------------------------------------- |
| Orchestration                      | Apache CloudStack     | OpenStack (fully supported)                                           |
| Hypervisor                         | KVM                   | Open-source standard; replaces VMware ESXi                            |
| Block / object storage             | Ceph                  | ZFS, NFS, or integration with your existing SAN/NAS                   |
| Software-defined router / firewall | OPNsense              | pfSense, VyOS, or your existing firewall (Fortinet, Palo Alto)        |
| VPN                                | WireGuard             | OpenVPN, IPsec                                                        |
| Identity / SSO                     | Keycloak or Authentik | Google, GitHub, other social or OIDC/SAML login, or your existing IdP |

The network edge is open-source and software-defined. OPNsense is our recommendation, but it is one
option among open-source software-defined routers and firewalls, not a fixed requirement.

**Identity and single sign-on:** ZPCP includes full SSO and social login. ZSoftly deploys Keycloak
or Authentik and connects Google, GitHub, and any other OIDC or SAML provider, or integrates the
identity system you already run.

## What ZSoftly configures

- Zone, pod, and cluster layout in CloudStack
- Hypervisor hosts and storage pools
- Network topology and firewall rules
- VPN access for administrators
- Identity provider, SSO, and social login integration
- Initial admin credentials and access

## What you control

- VM deployment and management via the CloudStack or OpenStack UI or API (or your branded portal)
- Network ACLs and security groups
- Storage allocation and volume management
- User and account management within CloudStack
- Kubernetes deployments (if applicable)

## Official documentation

Each component has comprehensive upstream documentation:

| Component         | Official Docs                            |
| ----------------- | ---------------------------------------- |
| Apache CloudStack | https://docs.cloudstack.apache.org       |
| OpenStack         | https://docs.openstack.org               |
| Ceph              | https://docs.ceph.com                    |
| KVM               | https://www.linux-kvm.org/page/Documents |
| Keycloak          | https://www.keycloak.org/documentation   |
| Authentik         | https://docs.goauthentik.io              |
