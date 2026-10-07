---
title: Q3 2026 Platform Update
description:
  A Q3 2026 update on ZSoftly Cloud Platform work, including backup schedules and billing and
  Kubernetes billing, where rollout verification is incomplete.
---

This update covers work on backup schedules and billing and managed Kubernetes billing. Rollout
verification for those changes is incomplete. Confirm regional availability and billing before
relying on them. Items released earlier in the quarter are listed under
[Also Shipped in Q3 2026](#also-shipped-in-q3-2026).

## Summary

| Area                | Change                                                                                  | Billing impact                   |
| ------------------- | --------------------------------------------------------------------------------------- | -------------------------------- |
| Backups             | Schedule and storage-based billing changes are in rollout verification.                 | Confirm before use.              |
| Kubernetes          | Resource-based billing changes are in rollout verification.                             | Current charges still apply.     |
| Kubernetes          | Separate CPU and memory sizing for control-plane and worker nodes.                      | Indirect. Node sizing sets cost. |
| Store               | Search, category counts, product cards, details, billing cycle, and quantity.           | No                               |
| Marketplace         | Deployment email with application credentials and the values supplied during setup.     | No                               |
| Accounts and access | Low infrastructure-credit notifications, VM password management, tighter rate limiting. | No                               |

## Backup Schedules

### What Changed

Backup scheduling changes are in rollout verification. Confirm schedule availability and
storage-based billing for your region before relying on them.

The rollout is intended to support schedule settings such as:

- **Timezone.** The schedule runs against the timezone you set on it, not a platform default.
- **Retention policy.** Each schedule keeps backups for the period you set. Retention cleanup
  removes expired backups.

The intended activity logs cover schedule creation and updates, runs, failures, and retention
cleanup.

### Backup Billing

The storage-based backup billing model is also in rollout verification. Confirm the billing model
and regional availability with support before relying on these changes.

The intended model is:

- The platform bills each backup for the storage it holds.
- Each backup carries its own subscription. That subscription ends when the backup is deleted,
  whether you delete it or retention cleanup does.
- A paused schedule creates no new backups. Backups already taken continue to bill for the storage
  they hold until they are deleted.

:::caution

Under this model, retaining more backup data for longer increases storage charges. Confirm the
applicable billing model with support while the rollout is in verification.

:::

## Kubernetes Billing

### What Changed

Resource-based billing for managed Kubernetes remains in rollout verification. Published pricing
continues to include a managed Kubernetes control-plane charge, so do not assume that current
clusters bill only for their provisioned resources.

The planned resource-based model includes:

- Control-plane virtual machines
- Worker virtual machines
- Block storage volumes
- Networks
- Public IP addresses
- Load balancers

ZSoftly will publish the final billing behavior and any subscription changes when the rollout is
complete.

### Node Sizing

Cluster configurations support different CPU and memory sizes for control-plane nodes and worker
nodes. Size the control plane for the API server and etcd, and size workers for the workloads you
run on them. See [Create Kubernetes Cluster](/public-cloud/kubernetes/create-cluster).

## Existing Resources

Do not assume that existing backups or Kubernetes clusters have migrated. Contact support to verify
availability and billing for your resources.

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

1. Confirm backup scheduling and billing availability for your region before relying on either
   feature.
2. Confirm current Kubernetes billing for your cluster with support before changing workloads.

## Related Documentation

- [Backups](/public-cloud/backups-snapshots/backups)
- [Billing](/public-cloud/billing)
- [Create Kubernetes Cluster](/public-cloud/kubernetes/create-cluster)
- [Cluster Overview](/public-cloud/kubernetes/cluster-overview)
- [Marketplace](/public-cloud/marketplace)
- [Changelog](/changelog)
