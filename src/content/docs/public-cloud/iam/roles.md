---
title: Roles & Permissions
description:
  Built-in roles, the full permissions catalog, and how to create custom roles in ZSoftly Public
  Cloud.
---

A **role** is a named bundle of permissions. Rather than granting access to each user individually,
you define roles once and assign them to [users](/public-cloud/iam/users). Change a role's
permissions and the change reaches every user with that role.

Every service in the platform exposes two permission levels:

- **Read**: view the resource, but not change it.
- **Manage**: create, update, delete, and operate the resource (Manage includes everything Read
  allows).

## Built-in roles

Three roles ship with every account. You can assign them as-is or use them as a starting point for
custom roles.

| Role                      | Description                              | Access                                                                                                                             |
| ------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Owner**                 | The default role for the account holder. | Full **Read + Manage** on every service, including Users, Roles, Profile, Billing, and **Quota**. The only role with Quota access. |
| **Service Administrator** | Can access and manage all services.      | **Manage** on all cloud services plus Users, Roles, Profile, and Billing. Does **not** include Quota.                              |
| **Service Viewer**        | Can view all services.                   | **Read** on all services. No create, update, or delete.                                                                            |

:::note

Only the **Owner** role carries **Quota** permissions. If a sub-user needs to adjust resource
quotas, that capability cannot be delegated through Service Administrator. Keep quota changes with
the account owner.

:::

## Create a custom role

When the built-in roles are broader than you need, create a role with exactly the permissions a job
requires.

- Navigate to the **Profile** section from the left-hand menu and select **Roles**.
- Click **Add New Role** (the **+** icon).
- Enter a **Role Name** and **Description** (both required).
- In the **Features** panel, pick a service (e.g. **Virtual Machine**).
- In the **Select Permissions** panel, choose the permissions for that service (for example,
  **Virtual Machine Read** or **Virtual Machine Manage**). Use **Select All** to grant every
  permission for the selected feature.
- Repeat for each service the role should cover.
- Click **Create Role**.

The role is now available to assign when you [add or edit a user](/public-cloud/iam/users).

:::tip

Apply **least privilege**: start with no permissions and add only what the job needs. Grant **Read**
where someone only needs visibility, and reserve **Manage** for the resources they operate. Combine
the role with [Project scoping](/public-cloud/iam/users#restrict-a-user-to-specific-projects) to
also limit _which_ resources it applies to.

:::

### Example

An account owner creates an **Accountant** role granting **Billing Read**, **Billing Manage**, and
**Store Read** only. A sub-user with that role works with invoices, payments, and the store. They
have no access to create or delete instances, networks, or other infrastructure. A separate
**Developer** role might grant **Virtual Machine Manage**, **Block Storage Manage**, and **Network
Manage** while excluding billing.

## Manage roles from the CLI

Everything above is also available in the [ZCP CLI](/public-cloud/cli/installation). Role commands
are account-level, so they need no `--region`/`--project`. Use the slugs from the
[permissions reference](#permissions-reference) below. `zcp permission list` prints them.

```bash
# Discover permission slugs (filter by category if you like)
zcp permission list
zcp permission list --category "Virtual Machine"

# Inspect the built-in roles and what they grant
zcp role list
zcp role get service-administrator

# Create a custom role from permission slugs (at least one is required)
zcp role create --name "Developer" --description "Compute and networking" \
  --permission virtual-machine-read --permission virtual-machine-manage \
  --permission block-storage-manage --permission network-manage

# Update a role. --permission REPLACES the whole set (it is not additive), so list
# every permission the role should end up with. Flags you omit are left unchanged.
zcp role update developer \
  --permission virtual-machine-read --permission virtual-machine-manage \
  --permission block-storage-manage --permission network-manage --permission dns-read

# Delete a custom role
zcp role delete developer
```

:::note

The built-in **Owner**, **Service Administrator**, and **Service Viewer** roles cannot be edited or
deleted. The CLI rejects those operations with a clear message.

:::

## Permissions reference

The full catalog of permissions, grouped by area. Most services offer both **Read** and **Manage**;
a few are read-only (noted below).

### Compute

| Service                  | Permissions   | Grants                                                               |
| ------------------------ | ------------- | -------------------------------------------------------------------- |
| Virtual Machine          | Read / Manage | View instances / create, update, delete, and operate instances       |
| Virtual Machine Snapshot | Read / Manage | View VM snapshots / create, update, delete, and restore VM snapshots |
| Virtual Machine Backups  | Read / Manage | View VM backups / create, update, delete, and restore VM backups     |
| VM Autoscale             | Read / Manage | View autoscaling / configure and manage VM autoscaling               |
| Affinity Groups          | Read / Manage | View affinity groups / create, update, and delete affinity groups    |
| Templates                | Read / Manage | View templates / create, update, and delete templates                |
| ISO                      | Read / Manage | View ISOs / import and manage ISOs                                   |
| Marketplace App          | Read only     | View marketplace apps                                                |
| Monitoring               | Read only     | View monitoring data                                                 |

### Containers

| Service    | Permissions   | Grants                                                      |
| ---------- | ------------- | ----------------------------------------------------------- |
| Kubernetes | Read / Manage | View clusters / create, update, delete, and manage clusters |

### Storage

| Service                | Permissions   | Grants                                                              |
| ---------------------- | ------------- | ------------------------------------------------------------------- |
| Block Storage          | Read / Manage | View volumes / create, update, delete, and attach volumes           |
| Block Storage Snapshot | Read / Manage | View volume snapshots / create, update, and delete volume snapshots |
| Block Storage Backup   | Read / Manage | View volume backups / create, update, and delete volume backups     |
| Object Storage         | Read / Manage | View object storage / create and manage buckets and access keys     |

### Networking

| Service        | Permissions   | Grants                                                             |
| -------------- | ------------- | ------------------------------------------------------------------ |
| VPC            | Read / Manage | View VPCs / create, update, delete, and operate VPCs               |
| Network        | Read / Manage | View networks / create, update, and delete networks                |
| Virtual Router | Read / Manage | View virtual routers / create, update, delete, and operate routers |
| Load Balancer  | Read / Manage | View load balancers / create, update, and delete load balancers    |
| VPN            | Read / Manage | View VPNs / create, update, delete, and operate VPN connections    |
| IP Address     | Read / Manage | View IP addresses / acquire, assign, and release IP addresses      |
| Security Group | Read / Manage | View security groups / create, update, delete, and apply rules     |
| DNS            | Read / Manage | View DNS / manage DNS domains and records                          |

### Organization & access

| Service  | Permissions   | Grants                                              |
| -------- | ------------- | --------------------------------------------------- |
| Project  | Read / Manage | View projects / create, update, and delete projects |
| Sub User | Read / Manage | View users / create, update, and delete users       |
| Role     | Read / Manage | View roles / create, update, and delete roles       |
| Profile  | Read / Manage | View profile / update profile settings              |

### Billing

| Service | Permissions   | Grants                                  |
| ------- | ------------- | --------------------------------------- |
| Billing | Read / Manage | View billing / manage billing settings  |
| Quota   | Read / Manage | View quotas / manage resource quotas    |
| Store   | Read / Manage | View the store / manage store purchases |

### Support

| Service              | Permissions   | Grants                                            |
| -------------------- | ------------- | ------------------------------------------------- |
| Support Ticket       | Read / Manage | View tickets / create, update, and manage tickets |
| Support Ticket Reply | Read / Manage | View ticket replies / send replies to tickets     |

## Related

- [Users](/public-cloud/iam/users): assign a role when inviting someone.
- [IAM Overview](/public-cloud/iam/overview): how roles, users, and Project scope fit together.
