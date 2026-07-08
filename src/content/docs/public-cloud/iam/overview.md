---
title: IAM Overview
description: >-
  How identity and access management works in ZSoftly Public Cloud: users, roles, and project-scoped
  access.
---

**Identity and Access Management (IAM)** controls who can sign in to your organization and what each
person is allowed to do. ZSoftly Public Cloud uses **Role-Based Access Control (RBAC)**: instead of
granting permissions to people one by one, you define **roles** that bundle a set of permissions,
then assign a role to each **user**.

## The model

| Concept           | What it is                                                                                            |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| **Account owner** | The primary account holder. Has full access and manages users, roles, and organization-wide settings. |
| **User**          | A person you invite into your organization. Each user is assigned one role.                           |
| **Role**          | A named bundle of permissions (e.g. an _Accountant_ role with billing-only access).                   |
| **Permission**    | The ability to perform a specific action or access a specific feature.                                |
| **Project scope** | An optional restriction limiting a user to specific [Projects](/public-cloud/projects).               |

## How it works

- The **account owner** creates **roles** with exactly the permissions a job needs. For example, an
  _Accountant_ role might carry billing permissions only, while a _Developer_ role carries compute
  and networking permissions.
- The owner **invites users** and assigns each one a role, so they get only the access that role
  grants.
- Access can be **scoped to specific [Projects](/public-cloud/projects)**, so a user only sees and
  manages the resources in the Projects they're authorized for. This pairs RBAC (what actions) with
  Projects (which resources).

Every account ships with three built-in roles: **Owner**, **Service Administrator**, and **Service
Viewer**. You define your own under [Roles & Permissions](/public-cloud/iam/roles), which also has
the full permissions catalog.

:::tip

Follow **least privilege**: give each role the smallest set of permissions that still lets people do
their job, and scope users to only the Projects they need.

:::

## Where to manage IAM

All IAM settings live under the **Profile** menu, opened by clicking your **username** in the
top-right corner of the portal:

- [Users](/public-cloud/iam/users): invite, edit, re-invite, and deactivate people in your
  organization.
- [Roles & Permissions](/public-cloud/iam/roles): create custom roles and assign permissions.
- [Account Security](/public-cloud/iam/security): two-factor authentication and password management.

For personal settings (your own details, theme, time zone, activity logs, login history), see
[Profile Setup](/public-cloud/getting-started/profile-setup).
