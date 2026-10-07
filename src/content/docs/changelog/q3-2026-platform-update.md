---
title: Q3 2026 Platform Update
description:
  The Q3 2026 release for the ZSoftly Cloud Platform, covering backup schedules and backup billing,
  Kubernetes billing, the Store, and Marketplace deployment emails.
---

This release covers backup schedules and billing, managed Kubernetes billing, Store purchasing, and
Marketplace deployment emails. Items released earlier in the quarter are listed under
[Also Shipped in Q3 2026](#also-shipped-in-q3-2026).

## Summary

| Area                | Change                                                                                  | Billing impact                   |
| ------------------- | --------------------------------------------------------------------------------------- | -------------------------------- |
| Backups             | Create, edit, pause, resume, and run schedules. Per-schedule timezone and retention.    | Yes. Storage-based billing.      |
| Backups             | Activity logs for schedule changes, runs, failures, and retention cleanup.              | No                               |
| Kubernetes          | Billing moves from a cluster charge to the resources provisioned for the cluster.       | Yes. Resource-based billing.     |
| Kubernetes          | Separate CPU and memory sizing for control-plane and worker nodes.                      | Indirect. Node sizing sets cost. |
| Store               | Search, category counts, product cards, details, billing cycle, and quantity.           | No                               |
| Marketplace         | Deployment email with application credentials and the values supplied during setup.     | No                               |
| Accounts and access | Low infrastructure-credit notifications, VM password management, tighter rate limiting. | No                               |

## Backup Schedules

### What Changed

You can create, edit, pause, resume, and run a backup schedule from the portal. Each schedule
carries its own settings:

- **Timezone.** The schedule runs against the timezone you set on it, not a platform default.
- **Retention policy.** Each schedule keeps backups for the period you set. Retention cleanup
  removes expired backups.

Activity logs record schedule creation and updates, runs, failures, and retention cleanup.

### Backup Billing

Backup billing moves from a charge tied to the schedule to a charge tied to the storage your backups
consume.

- The platform bills each backup for the storage it holds.
- Each backup carries its own subscription. That subscription ends when the backup is deleted,
  whether you delete it or retention cleanup does.
- A paused schedule creates no new backups. Backups already taken continue to bill for the storage
  they hold until they are deleted.

Backup cost depends on the actual stored backup size and the retention period.

:::caution

Retention and cost are linked. A long retention period on a large instance holds more backup storage
and costs more.

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

The Kubernetes cluster itself no longer carries a separate charge. The platform lists the resources
under **Billing → Subscriptions**.

### Node Sizing

Cluster configurations support different CPU and memory sizes for control-plane nodes and worker
nodes. Size the control plane for the API server and etcd, and size workers for the workloads you
run on them. See [Create Kubernetes Cluster](/public-cloud/kubernetes/create-cluster).

## Existing Resources

Existing backup billing is being migrated. Existing Kubernetes clusters need a billing configuration
update. Review **Billing → Subscriptions** and contact support to confirm the migration for your
resources.

## DNS Record Sets

Creating a supported DNS record adds its value to the matching name and type. Existing values stay.
Exact duplicates do not create duplicate answers. The console removes one selected value without
removing the others. A `CNAME` still cannot share a name with another record type.

You can enter a `TXT` value with or without double quotes. The platform stores and returns it
quoted. Production QA confirmed the same DNS answers and updated SOA serials from both authoritative
name servers.

:::caution

The ZCP DNS console does not currently offer `CAA` as a record type. Contact support if you need to
publish a CAA record.

:::

## Other Changes

- **Low infrastructure-credit notifications.** The platform notifies you when account credit for
  infrastructure runs low, before it affects your services.
- **VM password management.** The portal changes how you manage instance passwords.
- **Rate limiting.** Tighter limits on ticket, feedback, login, and password-reset requests.
- **API tokens.** API token expiration settings have been added.
- **Storage-driver integration.** Kubernetes CSI storage-driver integration is not included in this
  release.
- **Marketplace deployment email.** Every successful Marketplace application deployment sends you an
  email with the application credentials. When the application takes configuration values, the email
  also lists the values you supplied. See [Marketplace](/public-cloud/marketplace).

:::caution

Deleting the email does not revoke its credentials. Keep the email private and change credentials or
secrets where the application supports it. Do not forward it.

:::

## Store

The Store adds search and browsing:

- Search products by name.
- Browse categories with product counts.
- Open a product to see vendor information, billing cycles, quantity, dynamic pricing, and contract
  terms before purchase.

## CLI Automation

The CLI supports custom VM configuration, load-balancer rule listing, and S3-compatible
object-storage access keys. See [CLI v0.0.30](#october-follow-up).

## Object Storage Access Keys

Each object store supports one or two active access keys. Copy the new secret within five minutes of
creating the key. Hiding a secret does not revoke it. After updating consumers, revoke the old key.
Revocation disables it in object storage and marks it revoked in the control plane. You cannot
revoke the last active key.

## October Follow-Up

[CLI v0.0.30](/changelog/#cli-v0.0.30), released October 3, adds three confirmed CLI changes:

- Create a custom VM by omitting `--plan` and supplying `--cpu`, `--memory`, and `--disk`.
- List load balancer rule IDs with `zcp loadbalancer list-rule <load-balancer-slug>`.
- Manage S3-compatible object-storage access keys with `zcp object-storage keys`. See
  [Object Storage Access Keys](#object-storage-access-keys).

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

1. Review the retention period on each backup schedule.
2. Delete backups you no longer need. Deleting a backup ends its subscription.
3. Review **Billing → Subscriptions** for Kubernetes resources and contact support to confirm the
   billing migration.

## Related Documentation

- [Backups](/public-cloud/backups-snapshots/backups)
- [Billing](/public-cloud/billing)
- [Create Kubernetes Cluster](/public-cloud/kubernetes/create-cluster)
- [Cluster Overview](/public-cloud/kubernetes/cluster-overview)
- [Marketplace](/public-cloud/marketplace)
- [Changelog](/changelog)
