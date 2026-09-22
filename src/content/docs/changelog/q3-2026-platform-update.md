---
title: Q3 2026 Platform Update
description:
  The Q3 2026 release for the ZSoftly Cloud Platform, covering backup schedules and backup billing,
  Kubernetes billing, the Store, and Marketplace deployment emails.
draft: true
---

The release that closes Q3 2026 changes how you schedule and pay for backups, how you pay for
managed Kubernetes clusters, and how you find and buy products in the Store. It also adds a
deployment email for Marketplace applications and several smaller platform changes. Items released
earlier in the quarter are listed under [Also Shipped in Q3 2026](#also-shipped-in-q3-2026).

Two of these are billing changes that apply to resources you already run. Read
[Backup Billing](#backup-billing), [Kubernetes Billing](#kubernetes-billing), and
[Migration Behavior](#migration-behavior) before the effective date.

## Effective Date

| Item           | Value                                                            |
| -------------- | ---------------------------------------------------------------- |
| Effective      | By September 30, 2026                                            |
| Regions        | YUL-1 and YOW-1                                                  |
| Downtime       | None expected                                                    |
| Action needed  | None to migrate. Review retention and cluster sizing beforehand. |
| Billing impact | Yes. Backup billing and Kubernetes billing both change.          |

## Summary

| Area                | Change                                                                                   | Billing impact                   |
| ------------------- | ---------------------------------------------------------------------------------------- | -------------------------------- |
| Backups             | Create, edit, pause, resume, and run schedules now. Per-schedule timezone and retention. | Yes. Storage-based billing.      |
| Backups             | Activity logs for runs, failures, and retention cleanup.                                 | No                               |
| Kubernetes          | Billing moves from a cluster charge to the resources provisioned for the cluster.        | Yes. Resource-based billing.     |
| Kubernetes          | Separate CPU and memory sizing for control-plane and worker nodes.                       | Indirect. Node sizing sets cost. |
| Store               | Product search, categories, card layout, per-product billing cycle and quantity.         | No                               |
| Marketplace         | Deployment email with application credentials and the values supplied during setup.      | No                               |
| Accounts and access | Low infrastructure-credit notifications, VM password management, tighter rate limiting.  | No                               |

## Backup Schedules

### What Changed

You can create, edit, pause, resume, and run a backup schedule from the portal. Each schedule
carries its own settings:

- **Timezone.** The schedule runs against the timezone you set on it, not a platform default.
- **Retention policy.** Each schedule keeps backups for the period you set. Retention cleanup
  removes expired backups.

Activity logs record each run against the schedule. Use them to confirm a successful backup,
investigate a failure, and follow the retention cleanup that removes expired backups.

### Backup Billing

Backup billing moves from a charge tied to the schedule to a charge tied to the storage your backups
consume.

- The platform bills each backup for the storage it holds.
- Each backup carries its own subscription. That subscription ends when the backup is deleted,
  whether you delete it or retention cleanup does.
- A paused schedule creates no new backups. Backups already taken continue to bill for the storage
  they hold until they are deleted.

Your total moves with the number of backups you keep and the size of the instances behind them.
Retention is now the setting that controls backup cost.

:::caution

Retention and cost are linked. A long retention period on a large instance holds more backup storage
and costs more. Review the retention on each schedule before the effective date.

:::

## Kubernetes Billing

### What Changed

The platform bills each cloud resource provisioned for a managed Kubernetes cluster, instead of
charging a single cluster fee:

- Control-plane virtual machines
- Worker virtual machines
- Block storage volumes
- Networks
- Public IP addresses
- Load balancers

The Kubernetes cluster itself no longer carries a separate charge. The platform bills each resource
at the same rate as the equivalent resource elsewhere and lists it as its own entry under **Billing
→ Subscriptions**.

### Node Sizing

Cluster configurations support different CPU and memory sizes for control-plane nodes and worker
nodes. Size the control plane for the API server and etcd, and size workers for the workloads you
run on them. See [Create Kubernetes Cluster](/public-cloud/kubernetes/create-cluster).

## Migration Behavior

Existing backup schedules and existing Kubernetes clusters move to the new billing models. You do
not need to recreate anything.

| Resource                     | What happens                                                                                                                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing backup schedules    | The schedule keeps running. Billing moves to the storage the backups consume. Each backup gets its own subscription.                                                                |
| Existing backups             | The platform retains them. Each one bills for its storage until you or retention cleanup deletes it.                                                                                |
| Existing Kubernetes clusters | The cluster keeps running. The cluster charge stops. The platform bills the control-plane VMs, worker VMs, volumes, networks, IPs, and load balancers it already uses individually. |
| Running workloads            | No restart, no reschedule, no downtime expected.                                                                                                                                    |

:::caution

This changes how the platform calculates charges, not how it presents them. Your invoice can go up
or down after the effective date depending on your backup storage, your retention settings, and the
resources in your clusters. Compare **Billing → Summary** before and after the change.

:::

## Other Changes

- **Low infrastructure-credit notifications.** The platform notifies you when account credit for
  infrastructure runs low, before it affects your services.
- **VM password management.** The portal changes how you manage instance passwords.
- **Rate limiting.** Tighter limits on login and password-reset requests. The platform throttles
  repeated attempts in a short window.
- **Marketplace deployment email.** Every successful Marketplace application deployment sends you an
  email with the application credentials. When the application takes configuration values, the email
  also lists the values you supplied. See [Marketplace](/public-cloud/marketplace).

:::caution

The Marketplace deployment email contains working credentials, and they stay valid for as long as
the message sits in a mailbox. Change them at your first sign-in, then delete the message. Do not
forward it.

:::

## Store

The Store adds search and browsing:

- Search products by name.
- Browse by category.
- Open a product to see its details, select an available billing cycle and a quantity, and see the
  total price before you confirm the purchase.

## API Changes

<!-- TODO: Replace this section with the confirmed API changes before publishing.
     Cover: new or changed backup schedule endpoints and fields (timezone, retention, pause,
     resume, run-now), Kubernetes cluster payload changes for per-role node sizing, subscription
     and billing response changes for backups and clusters, and any deprecated or breaking
     behavior with its removal date. Then set draft: false. -->

We are confirming the API changes for this release. We will update this section before the effective
date.

## Also Shipped in Q3 2026

These changes are already live. Each links to its changelog entry.

| Date              | Change                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| July 19, 2026     | [CLI v0.0.26](/changelog/#cli-v0.0.26): port-forwarding and SSH key fixes.                         |
| August 16, 2026   | [Intel compute in Montreal (YUL)](/changelog/#intel-compute-yul).                                  |
| September 1, 2026 | [Postpaid billing](/changelog/#postpaid-billing) at signup.                                        |
| September 6, 2026 | [Kubernetes 1.37](/changelog/#kubernetes-1.37) for new managed clusters.                           |
| September 6, 2026 | [Object storage endpoint DNS resolution from VPCs](/changelog/#object-storage-vpc-dns-resolution). |
| September 7, 2026 | [Up to 8 subnets per VPC](/changelog/#vpc-subnet-limit).                                           |
| September 7, 2026 | [CLI v0.0.28](/changelog/#cli-v0.0.28) and [v0.0.29](/changelog/#cli-v0.0.29).                     |
| September 7, 2026 | [Terraform / OpenTofu provider v0.2.0](/changelog/#terraform-v0.2.0).                              |

## What To Do

1. Review the retention period on each backup schedule. Retention now drives backup cost.
2. Delete backups you no longer need. Deleting a backup ends its subscription.
3. Review the size and count of your Kubernetes control-plane nodes, worker nodes, volumes, public
   IPs, and load balancers.
4. Record your current monthly spend from **Billing → Summary** so you can compare after the
   effective date.

## Related Documentation

- [Backups](/public-cloud/backups-snapshots/backups)
- [Billing](/public-cloud/billing)
- [Create Kubernetes Cluster](/public-cloud/kubernetes/create-cluster)
- [Cluster Overview](/public-cloud/kubernetes/cluster-overview)
- [Marketplace](/public-cloud/marketplace)
- [Changelog](/changelog)
