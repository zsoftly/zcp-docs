---
title: Auto Scaling
---

Auto-scaling automatically adjusts the number of VM instances in response to real-time demand,
ensuring availability while minimizing costs.

:::caution

Before you begin, you need an existing **[Load Balancer](/public-cloud/load-balancer)** with a
load-balancing rule that has **no instances attached**. An autoscaling group attaches to that rule
to distribute traffic, and user-bound VMs cannot coexist with an autoscale group on the same rule.

:::

### Create an Auto-Scaling Group

- From the left-hand menu, click **Auto-Scaling**.
- Click **Create New**.

![Create an Auto-Scaling Group form](../../../../assets/auto-scaling/auto-scaling-create-an-auto-scaling-group.webp)

### Steps

1. **Project**: select the project.
2. **Location**: select the data center.
3. **Network**: select or create a network.
4. **Load Balancer**: select an existing load balancer.
5. **Rule**: select a load-balancing rule with no instances attached.
6. **Image**: select the OS (Linux or Windows) and version.
7. **Storage Type**: select the storage type (for example, `b2.g1` or `b2.g2`).
8. **VM Autoscale Plan**: select an autoscale plan.
9. **Plan**: select a compute plan, or set a custom plan (CPU, memory, storage).
10. **Server Settings**: add an SSH key and a startup script (both optional).
11. **Affinity Groups**: add the instances to an affinity group (optional).
12. **Capacity Planner**: set **Minimum Instances**, **Maximum Instances**, **Expunge VM Grace
    Period** (seconds), and **Polling Interval** (seconds).
13. **Scale Up Policy**: add at least one. Set a **Name**, **Duration** (seconds), and **Quiet
    Time** (seconds).
14. **Scale Down Policy**: add at least one. Set a **Name**, **Duration** (seconds), and **Quiet
    Time** (seconds).
15. **Name**: enter a unique name.
16. **Create**: select a billing cycle and click **Create**.
