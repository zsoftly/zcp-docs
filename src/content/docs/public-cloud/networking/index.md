---
title: Networking
description: Connect ZCP workloads with public networks, VPCs, IP addresses, and VPN access.
---

Networking connects your ZCP workloads to the internet, to each other, and to external networks. Use
a public network for internet-facing resources. Use a VPC when a workload needs its own private
network, subnets, access rules, and VPN connectivity.

## Choose a Network Model

- **Public Network**: assign public IP addresses and control outbound traffic for resources that
  need internet access.
- **VPC**: create an isolated network with subnets, network ACLs, public IP addresses, and VPN
  access.

Start with [Create Public Network](/public-cloud/networking/public-network/create) or
[Create VPC](/public-cloud/networking/vpc/create-vpc), depending on the workload.

## Plan Access

Before deployment, decide which resources need public access, which should remain private, and how
users or external systems will connect. Configure the relevant addresses, rules, and VPN access in
the portal.

## Next Steps

- [Public network overview](/public-cloud/networking/public-network/overview)
- [Manage public IP addresses](/public-cloud/networking/public-network/public-ips)
- [Add a VPC subnet](/public-cloud/networking/vpc/add-subnet)
- [Configure a VPN gateway](/public-cloud/networking/vpc/site-vpn)
