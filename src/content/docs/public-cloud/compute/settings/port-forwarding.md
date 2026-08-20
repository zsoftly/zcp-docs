---
title: Port Forwarding
sidebar_position: 8
---

Port Forwarding redirects traffic from a specific port on your public IP to a port on your VM. For
example, forward external traffic on port 8080 to port 80 on your VM for web server access.

- Go to **VM Settings** → **Port Forwarding**.
- Click **Manage** to change port configurations for the network.

Port forwarding maps the public destination port to a port on the VM. It does not replace the
inbound firewall rule or the VPC Network ACL. Configure each applicable layer, and restrict the
source IP or CIDR range in the firewall when the service does not need to be public.

![Port forwarding settings](../../../../../assets/compute/settings/port-forwarding-port-forwarding.webp)
