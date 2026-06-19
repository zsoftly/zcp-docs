---
title: Changelog
description:
  Everything new across the ZSoftly Cloud Platform. Platform and service features, Marketplace apps,
  the zcp CLI, and the Terraform / OpenTofu provider.
---

The single place to follow what's new across the ZSoftly Cloud Platform. Each section below is its
own changelog: **platform & services**, the **Marketplace**, the **`zcp` CLI**, and the **Terraform
/ OpenTofu provider**, newest first.

:::tip

Each component keeps its own `CHANGELOG.md` on GitHub. The **CLI** section below mirrors
[`zcp-cli/CHANGELOG.md`](https://github.com/zsoftly/zcp-cli/blob/main/CHANGELOG.md); use it for the
complete, commit-level history.

:::

## Platform & services

Updates to the Public Cloud platform and managed services.

- **Kubernetes 1.36** is now supported for managed clusters.
- **Windows Server 2025** images are available for compute instances.
- **ZSoftly Cloud Storage**: dedicated, single-tenant storage clusters are generally available.

## Marketplace

One-click application images for compute instances.

- **20+ one-click apps** available, including cPanel, GitLab, Grafana, WordPress, PostgreSQL, MySQL,
  MariaDB, MongoDB, Elasticsearch, InfluxDB, Docker, n8n, and more. Browse them in the
  [Marketplace](/public-cloud/marketplace).

## CLI (`zcp`)

The official command-line tool for the platform. The entries below mirror the CLI's
[`CHANGELOG.md`](https://github.com/zsoftly/zcp-cli/blob/main/CHANGELOG.md) on GitHub.

### v0.0.18: June 19, 2026

**Region and project are now required for region- and project-scoped commands.** This makes results
predictable and matches how the platform scopes resources. See
[Configuration](/public-cloud/cli/configuration) for how to provide them.

- **Set them once**: `zcp profile add` now prompts for a default region (required) and project, like
  `aws configure`. After that, most commands need no `--region`/`--project`. You can still override
  per command or with the `ZCP_REGION`/`ZCP_PROJECT` environment variables.
- **Lists are scoped to your region and project**: every resource and catalog list now filters its
  output, so `plan`, `template list`, `iso list`, `marketplace list`, and `storage-category list` no
  longer mix entries from other regions. Account-level commands (`dns`, `auth`, `profile`, `region`,
  `project`, and the other discovery commands) are exempt.

**SSH keys.**

- **`ssh-key import` fixed**: it now sends the required project and region, resolving a 500 error on
  import, and validates the key name client-side (20 characters max).
- **`instance create --ssh-key <name>`** now engages SSH-key authentication correctly. Import the
  key first with `ssh-key import`. Key names and public-key material must be unique.

**Clearer errors.**

- **API validation errors** now surface the field-level detail (for example,
  `public_key: The public key has already been taken.`) instead of a generic message.

### v0.0.17: June 17, 2026

**Object storage: the full S3 feature set in the CLI.** Many of these are available only through the
CLI (or an S3 SDK) today, not yet in the Web UI. See the
[Object Storage CLI guide](/public-cloud/storage/object-storage/cli) for the full reference and a
UI-vs-CLI availability matrix.

- **Object versioning workflows**: list versions and delete markers, download or delete a specific
  version, and `restore` (undelete).
- **Download objects** to a local file (`object download`).
- **Bucket policies**: read, set (from a JSON file), or delete a bucket's raw S3 policy.
- **Tagging** on buckets and objects; **default encryption** (SSE-S3); **lifecycle rules** (expire
  current/old versions and incomplete uploads); **CORS rules**.
- **Presigned URLs**: time-limited download _and_ upload links that need no credentials, even on a
  private bucket.
- **Server-side copy / move**, **object stat** (full metadata), and `put --metadata`.
- **Make buckets public/private**, **empty a bucket**, and **clean up incomplete uploads**.
- **Simpler create**: `zcp plan object-storage` lists plans; `create --plan` derives the storage
  category for you.

**CLI usability.**

- **Clear argument errors**: every command names what's missing, the usage, and an example.
- **Unknown subcommands now error** (non-zero exit) instead of silently printing help.
- **Cloud provider auto-detected**: saved to your profile on `zcp auth validate`; you no longer pass
  `--cloud-provider`.
- **`-o yaml`** is now supported for policy, lifecycle, and CORS output.

### v0.0.16: June 11, 2026

- **VPC subnets (tiers)**: create a network as a VPC subnet with `network create --vpc`, and attach
  a custom network ACL at creation with `--acl`.
- **Network ACL rules**: full rule management: `acl rules`, `acl create-rule`, `acl update-rule` (in
  place), `acl delete-rule`, plus `acl delete` for ACL lists. `--cidr` accepts comma-separated
  lists.
- **`network get`**: show a network's CIDR, state, VPC membership, and attached ACL.
- **`plan network`**: list network plans (the slugs for `--network-plan`).
- **Fixes**: VPC `get`/`create` now show CIDR/status; plan tables include a SLUG column;
  `vpc delete` polls for completion instead of a false-negative warning; clearer "already deleted"
  handling.

### v0.0.15: June 10, 2026

- **VPN**: new IKE/ESP Diffie-Hellman and Perfect-Forward-Secrecy flags (`--ike-dh`, `--esp-dh`,
  `--esp-pfs`) on customer-gateway create/update; the full VPN configuration is now returned
  reliably after create/update.
- **`ip allocate --project`**: assign an IP to a specific project at allocation time.
- **Fixes**: VPN gateway/customer-gateway and VPC/network update commands no longer return blank
  fields; clearing a `--description` now works.

### v0.0.14: June 10, 2026

- **Infrastructure as code**: the CLI's API packages are now importable by external Go modules,
  enabling the [Terraform / OpenTofu provider](https://github.com/zsoftly/terraform-provider-zcp).
  CLI behaviour is unchanged.

### v0.0.12: June 9, 2026

- **`kubernetes upgrade-version`**: upgrade a running cluster's Kubernetes version
  (`--version v1.x.y`); the correct version for the cluster's region is resolved automatically.

### v0.0.11: June 8, 2026

- **`instance create --user-data` / `--user-data-file`**: pass a cloud-init / startup script inline
  or from a file at VM creation.
- **Fixes**: instance Private IP now displays correctly; `instance get` retries the brief window
  right after creation; `instance create --blockstorage-plan` is now optional (auto-assigned).

### v0.0.10: June 7, 2026

- **Object storage** introduced: manage S3-compatible storage instances (list, get, create, delete,
  resize), buckets (list, get, create, delete), and objects (list, get, upload, delete), plus
  `credentials` to view S3 access keys.
- **Delete commands** added across instances, networks, volumes, snapshots, backups, VPCs, and VM
  backups (`instance delete --force` for immediate expunge).
- **Kubernetes**: `scale` worker nodes (with `--wait`) and `get-config` (download kubeconfig).
- **Load balancer**: `delete-rule` and `detach-vm`.

### v0.0.9: April 14, 2026

- **Environment-variable overrides**: `ZCP_PROJECT`, `ZCP_REGION`, `ZCP_CLOUD_PROVIDER`,
  `ZCP_OUTPUT`, `ZCP_DEBUG` reduce repetitive flags in scripts and CI/CD.
- **Zero-config mode**: run with only `ZCP_BEARER_TOKEN` and `ZCP_API_URL`, no config file needed;
  `ZCP_PROFILE` selects the active profile.

### v0.0.8: April 9, 2026

- **VPC tier/subnet creation** confirmed end to end, with `--cloud-provider`, `--region`, and
  `--project` flags added to network, VPC, virtual-router, DNS, VPN, and autoscale create commands.
- A published **feature roadmap** documenting what works, what's coming, and what's blocked.

### v0.0.7: April 8, 2026

- **New commands**: `region list`, `profile-info` (user profile management), `vm-backup`, and
  discovery commands: `cloud-provider list`, `server list`, `currency list`, `billing-cycle list`,
  `storage-category list`.
- **Cleanup**: removed legacy commands that targeted retired endpoints.

### v0.0.6: April 8, 2026

Rebuilt on the current ZSoftly Cloud Platform API with **Bearer-token authentication** and a
consistent response format. A large set of command groups arrived:

- **DNS**, **projects**, **monitoring**, **billing**, **support**, **autoscale**, **dashboard**,
  **plans**, **store**, **marketplace**, **product**, **ISO**, **affinity groups**, and **backups**.
- **VM operations**: reboot, reset, tags, change-hostname/password/plan/OS, add-network, addons.
- **Global `--auto-approve` / `-y`** to skip confirmation prompts in automation.

### v0.0.5: March 31, 2026

- **Reliability fixes**: delete commands now verify the resource is gone; volume list deduplicates
  entries; clearer messages for snapshots on detached volumes and for empty accounts.

### v0.0.4: March 27, 2026

- **VPC tier networks**: `vpc create-network` and `vpc update-network`.

### v0.0.3: March 27, 2026

- Added **`host list`**, **`resource quota`**, VPC-tier flags on `network create`, and a full
  integration test suite.

### v0.0.2: March 23, 2026

- **Default zone per profile**: set it once and stop typing `--zone` on every command; an explicit
  flag still overrides.

### v0.0.1: March 15, 2026

- **Initial release** of the `zcp` CLI: 28 top-level commands across compute, storage, networking,
  security, Kubernetes, and billing.
- **Named profiles** with secure (`0600`) credential storage, a **`--wait`** flag for async
  operations, **`instance ssh`**, **shell completions** (bash/zsh/fish/PowerShell), a **`--pager`**
  option, and **multi-platform binaries** (Linux/macOS/Windows, amd64/arm64) with one-line
  installers.

## Terraform / OpenTofu provider

Manage ZCP infrastructure as code. The provider is in active development at
[github.com/zsoftly/terraform-provider-zcp](https://github.com/zsoftly/terraform-provider-zcp);
released versions will be listed here.
