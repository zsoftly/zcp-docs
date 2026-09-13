---
title: Egress Rules
sidebar_position: 4
---

An egress rule controls outbound network traffic from a source to a specified destination based on
defined protocols and IP ranges.

:::caution

Whether a network starts with working outbound access depends on how it was created.

When a VM is deployed with a network plan, through the portal, `zcp instance create --network-plan`,
or the provider's `network_plan` argument, the platform provisions the network with outbound access
already working. You do not need to add anything.

A network you create as its own resource, through `zcp network create` or the `zcp_network`
Terraform resource, starts with no egress rules and blocks all outbound traffic. VMs on it cannot
reach package archives, container registries, or any other internet host until you add rules. The
symptom is every outbound command timing out while the VM is otherwise healthy and reachable over
SSH.

Check which situation you are in:

```bash
zcp egress list --network <network-slug> --region <region-slug>
```

:::

- In the **Egress Rules** tab, view all current egress rules.
- Click **Add Egress Rule** to open the rule configuration form.

![Egress Rules tab listing outbound rules with the Add Egress Rule button](../../../../../assets/networking/egress-rules-list.webp)

### Add a New Egress Rule

- Enter the **Source CIDR** and **Destination CIDR**.
- Choose protocol: TCP, UDP, ICMP, or All.
- Click **Add Egress Rule**.
