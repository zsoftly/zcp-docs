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

Under **Choose Network Plan**, select a network plan.

### Network Configuration

ZSoftly has not verified whether **Gateway** and **Netmask** are required. If the portal populates a
field with a value for the selected network, leave that value unchanged. If either field is blank or
appears to show placeholder text, do not enter or infer a value. Record the field and any message
shown, then open [Support](/troubleshooting#raise-a-support-ticket) with the project, location, any
message shown, and non-sensitive resource details.

![Create Isolated Network: gateway and network mask configuration](../../../../../assets/networking/pub-net-config.webp)

### Create

- Choose the **Billing Cycle**: Hourly, Monthly, or Yearly.
- Review the **Price Summary** and click **Create Network**.

![Create Isolated Network: billing cycle and price summary](../../../../../assets/networking/pub-net-billing.webp)

See also: [Network Overview](/public-cloud/networking/public-network/overview),
[Public IPs](/public-cloud/networking/public-network/public-ips)
