---
title: Compute Instance
sidebar_position: 1
---

A **Compute Instance** is a virtual server in the cloud that functions similarly to a physical
computer. It has its own CPU, memory, and storage, allowing you to install software, run
applications, or host websites. Compute Instances are a fundamental component of ZSoftly Public
Cloud, enabling you to launch and scale servers as needed.

## Creating a Compute Instance

- From the left-hand menu, click on the **Instances** tab.
- To create an instance, click the **plus (+)** icon located on the right side of the page.

:::note

Screenshots coming.

:::

## Choose a Location

Select the data center location where your server will be physically hosted.

:::note

Screenshots coming.

:::

## Choose an Image

Select an OS or application template. Import a custom ISO if needed. For Microsoft Windows, only
official evaluation versions are available.

Browse the full catalogs: [OS Images](https://zcp.zsoftly.ca/marketplace/os-images) and
[One-Click Apps](https://zcp.zsoftly.ca/marketplace/apps).

:::note

Screenshots coming.

:::

## Choose the Type of CPU Allocation

- **Shared CPU**: Affordable, with resources shared among users. Ideal for development, testing, and
  low-performance workloads like small websites.
- **Dedicated CPU**: Provides exclusive resources for consistent performance. Perfect for production
  environments, high-traffic applications, and databases.
- **High-Frequency Compute**: Offers high clock speeds for compute-intensive tasks like simulations,
  financial modeling, and low-latency applications.
- **Cloud GPU**: Delivers GPU acceleration for demanding tasks like machine learning, AI, video
  rendering, and scientific simulations.

:::note

Screenshots coming.

:::

## Choose a Plan

- **General Compute (GC)**: Balanced workloads with a mix of CPU, memory, storage, and bandwidth.
  Ideal for general-purpose applications, web servers, and testing environments.
- **Compute Optimized (CO)**: Prioritizes CPU performance for compute-intensive tasks like batch
  processing, analytics, and high-speed processing workloads.
- **Memory Optimized (RO)**: Tailored for applications requiring high memory capacity, such as
  in-memory databases, big data processing, and real-time caching systems.
- **Database Optimized (DO)**: Specifically tuned for database workloads, offering enhanced I/O
  performance and memory-to-disk ratio for transactional or analytical database systems.

See [Instance Types](./instance-types) for families and storage tiers, and the
[pricing page](https://zcp.zsoftly.ca/pricing) for per-size specs and pricing.

:::note

Screenshots coming.

:::

## Assign to a Project

Assign the server to one of your projects to organize resources.

:::note

Screenshots coming.

:::

## Choose a Network

- **Public Network**: A simple, pre-configured network for external connectivity. Includes cloud
  firewall protection, port forwarding, and remote access VPN.
- **VPC Network**: A Virtual Private Cloud (VPC) offering complete control over traffic routing and
  enhanced security. Supports VPN gateway, site-to-site VPN connections, and traffic segregation.

> **Note:** By default, a VPC is created with a random CIDR block and one network tier.

Choose whether to enable public IPv4.

:::note

Screenshots coming.

:::

## Configure Server Settings

- Add SSH Key for secure access. Click **Add Now**. For some OS images (e.g., Arch Linux) an SSH key
  is required.
- Add a startup script to automate actions during initialization.

:::note

Screenshots coming.

:::

## Advanced Settings (Optional)

- **Boot Mode**: Select Legacy or Secure boot.
- **Boot Type**: Choose between UEFI or BIOS.
- **Enable Dynamic Scaling**: Allows automatic resource scaling.

:::note

Screenshots coming.

:::

## Server Hostname

Provide a unique Server Name and valid Server Hostname.

:::note

Screenshots coming.

:::

## Review and Deploy

- Choose the desired **Billing Cycle**: Hourly, Monthly, Quarterly, Semiannually, Yearly,
  Bi-annually, Tri-annually.
- Supported billing rules: Date to Date, Fixed Calendar Month, Unfixed Calendar Month, Fixed
  Prorata, Unfixed Prorata.
- Verify all configuration details and click **Review & Deploy**.

## See also

- [Instance Overview](./instance-overview)
- [Activity Logs](./activity-logs)
