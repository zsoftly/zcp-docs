---
title: Firewall
sidebar_position: 7
---

## Firewall Configuration

The Firewall setting lets you define security rules for incoming and outgoing network traffic to
your VM. Allow or deny access to specific IP addresses, ports, or protocols.

- Go to **VM Settings** → **Firewall**.
- Click **Manage** to change firewall configurations for the network.

Example use case: block all traffic except SSH (port 22) and web traffic (ports 80/443).

## Inbound Port Policy

Assigning a public IP does not open every port on a VM. Follow a least-privilege approach for
inbound traffic:

- Standard operating system images typically allow SSH over TCP **22** at the guest firewall. Keep
  application ports closed until you need them.
- Marketplace images can include image-specific firewall rules. Check the image documentation before
  changing the default rules.
- Do not create an allow-all inbound rule. Open only the required protocol and destination port, and
  restrict the source IP or CIDR range when possible.

### Example: Open TCP 3000

If an application listens on TCP port **3000** and needs to be reachable from the internet, add an
inbound allow rule with these values:

| Field             | Value                                            |
| ----------------- | ------------------------------------------------ |
| Source IP or CIDR | A trusted IP or range, such as `203.0.113.10/32` |
| Protocol          | TCP                                              |
| Source port       | Any                                              |
| Destination port  | `3000`                                           |
| Action            | Allow                                            |

Use `0.0.0.0/0` as the source only when the application must be public. Client source ports are
usually dynamic, so the application port belongs in the destination port field.

Also complete the network-specific steps:

- If the network uses port forwarding, forward public port **3000** to port **3000** on the VM. See
  [Port Forwarding](/public-cloud/compute/settings/port-forwarding).
- For a VPC, allow TCP **3000** in the applicable
  [Network ACL](/public-cloud/networking/vpc/network-acls).
- Confirm the guest firewall allows TCP **3000** and the application listens on the VM network
  interface, not only on `127.0.0.1`.

For production web applications, expose ports **80** and **443** through a reverse proxy when
possible. Keep the application port private.

![Firewall configuration settings](../../../../../assets/compute/settings/firewall-firewall-configuration.webp)

See also: [Networks](/public-cloud/compute/settings/networks),
[Port Forwarding](/public-cloud/compute/settings/port-forwarding)
