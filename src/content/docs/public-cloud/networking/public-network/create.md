---
title: Create Public Network
sidebar_position: 1
---

A **Public Network** provides internet-facing access to cloud resources. It allows VMs and services
to communicate with external systems over the internet.

### Create a Public Network

- From the left-hand menu, click **Networks** → **Public Network** tab.
- Click the **+** icon. The page title is **Create Isolated Network**.

![Networks page on the Public Network tab with the add (+) button](../../../../../assets/networking/pub-net-add.webp)

### Choose Project

Under **Choose Project**, select the project for the network.

![Create Isolated Network: Choose Project](../../../../../assets/networking/pub-net-project.webp)

### Select Location

Under **Select Location**, choose the data center location for the network.

![Create Isolated Network: Select Location](../../../../../assets/networking/pub-net-location.webp)

### Network Details

Enter a **Network Name**.

![Create Isolated Network: Network Details and Network Name](../../../../../assets/networking/pub-net-name.webp)

### Choose Network Plan

Select **Choose Network Plan**.

### Network Configuration

Review the visible **Gateway** and **Netmask** values. If the wizard rejects a value, record the
exact field and error message. Do not guess replacement gateway or netmask values. If the message is
unclear or the portal still rejects the value, open
[Support](/troubleshooting#raise-a-support-ticket) with the project, location, exact message, and
non-sensitive resource details.

![Create Isolated Network: gateway and network mask configuration](../../../../../assets/networking/pub-net-config.webp)

### Create

- Choose the **Billing Cycle**: Hourly, Monthly, or Yearly.
- Review the **Price Summary** and click **Create Network**.

![Create Isolated Network: billing cycle and price summary](../../../../../assets/networking/pub-net-billing.webp)

See also: [Network Overview](/public-cloud/networking/public-network/overview),
[Public IPs](/public-cloud/networking/public-network/public-ips)
