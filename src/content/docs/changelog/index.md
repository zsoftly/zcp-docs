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
[`zcp-cli/CHANGELOG.md`](https://github.com/zsoftly/zcp-cli/blob/main/CHANGELOG.md). Use it for the
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

### v0.0.25: July 18, 2026

**`MX` records now work from the CLI.** `zcp dns record-create` never sent a record's priority, so
every `MX` create failed with an API error. It now takes a `--priority` flag (0-65535, required for
`MX`): put the mail server in `--content` and the preference number in `--priority`. The CLI sends a
`0` preference correctly and rejects `--priority` on every other type with a clear message. See
[Manage DNS with the CLI](/public-cloud/dns/cli).

```bash
zcp dns record-create --domain examplecom --name @ --type MX --content mail.example.com. --priority 10
```

### v0.0.24: July 16, 2026

**Deleting a VM now releases its auto-assigned public IP.** `instance delete` uses the same
service-cancellation workflow as the console, so the address is no longer left allocated and
billable. `loadbalancer delete` also uses service cancellation, but keeps its separate, reusable
public IP by default. Add `--release-ip` to release the address.

- **`instance list` and `instance get` now show the public IP**, and `get` shows the billing cycle.
- **`ip list` and `loadbalancer list` return every result** instead of stopping at the first page.
- **The CLI and its SDK are now Apache 2.0 licensed**, allowing the Terraform / OpenTofu provider to
  embed the SDK.

### v0.0.23: July 8, 2026

**`--wait` now reports the real instance state.** The platform's cached state sometimes lags minutes
behind reality, so `instance create/start/stop --wait` kept waiting on a VM already up. The CLI now
polls the live state endpoint, which reconciles with the hypervisor, and returns as soon as the VM
is running.

- **Corrected `instance delete --delete-public-ip` help**: the platform does not release the
  auto-assigned public IP on delete yet (an API-side fix is in progress). The option, prompt, and
  help now say so plainly. Release the address manually with `zcp ip release <ip-slug>` after
  deleting.

### v0.0.22: July 7, 2026

**DNS records display and delete correctly.** The DNS service models records as record sets
addressed by name and type. `zcp dns show` and `record-create` now display record content
(multi-value sets included), and `dns record-delete` works with `--name` and `--type`. Record names
are relative: the CLI appends the zone for you.

- **`egress create` reports honestly** when the platform accepts a rule but never lists it, instead
  of failing with a confusing lookup error.
- **Automated validation now covers the command reference**: a script checks all 264 examples
  against the built CLI, and we rewrote six sections to match the real command trees.
- **L2 instances work, and `instance create` examples run as pasted**, contributed by first-time
  community contributor [@cokerrd](https://github.com/cokerrd): the new `--is-public` option
  unblocks `--network-type L2`, and the required `--network-plan` and `--storage-category` options
  are now in every example.

### v0.0.21: July 2, 2026

**Profile defaults now apply to create commands.** With defaults configured through
`zcp profile add`, create and mutate commands no longer error asking for `--region`/`--project`. Set
them once. List and get commands already worked this way.

- **First-run guidance**: the installers print copy-paste setup for the production defaults
  (`--region yul-1 --project default-9`), and the docs use them throughout.
- **We verify every example slug against the live catalog** (templates, plans, backup and load
  balancer plans), so examples run as pasted.

### v0.0.20: June 30, 2026

**`zcp instance delete` requests release of the VM's auto-assigned public IP by default**, so no
address stays allocated and billed after the VM is gone. Pass `--delete-public-ip=false` to keep the
address. Manually acquired and source-NAT addresses are unaffected. See the v0.0.23 note: the
platform-side release is not active yet.

### v0.0.19: June 21, 2026

**Manage IAM from the CLI: sub-users, roles, and permissions.** Everything in the portal's Profile
area is now scriptable. These commands are account-level (no `--region`/`--project`). See
[Roles & Permissions](/public-cloud/iam/roles) and [Users](/public-cloud/iam/users).

- **`zcp permission list`**: browse the permission catalog (filter with `--category`) to find the
  slugs you assign to roles.
- **`zcp role`**: `list`, `get <slug>` (shows permissions + assigned users), `create`, `update`, and
  `delete`. `--permission` is repeatable and **replaces** the role's full set; the built-in
  `owner`/`service-administrator`/`service-viewer` roles are protected from edits.
- **`zcp sub-user`**: `list` (with `--role`/`--blocked` filters), `create`, `update`, `block`,
  `unblock`, and `delete`. Sub-users are referenced by **ID or email**; new sub-users start blocked
  until you `unblock` them.

**Load balancers and instance references.**

- **`zcp loadbalancer create` works**: it now sends the required first rule
  (`--public-port`/`--private-port`/`--algorithm`) and can attach back-ends with `--vm`.
- **Reference an instance by ID, name, or slug** in every `instance` subcommand, with a clear error
  when a name is ambiguous; `instance list` now shows the `ID` column and returns **all** VMs (the
  list is paginated).
- **`reboot` refuses a non-`Running` VM** instead of silently no-op'ing, and `-o json`/`-o yaml`
  emit full objects.

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
- **Tagging** on buckets and objects, **default encryption** (SSE-S3), **lifecycle rules** (expire
  current/old versions and incomplete uploads), and **CORS rules**.
- **Presigned URLs**: time-limited download _and_ upload links that need no credentials, even on a
  private bucket.
- **Server-side copy / move**, **object stat** (full metadata), and `put --metadata`.
- **Make buckets public/private**, **empty a bucket**, and **clean up incomplete uploads**.
- **Simpler create**: `zcp plan object-storage` lists plans, and `create --plan` derives the storage
  category for you.

**CLI usability.**

- **Clear argument errors**: every command names what's missing, the usage, and an example.
- **Unknown subcommands now error** (non-zero exit) instead of silently printing help.
- **Cloud provider auto-detected**: saved to your profile on `zcp auth validate`, so you no longer
  pass `--cloud-provider`.
- **`-o yaml`** is now supported for policy, lifecycle, and CORS output.

### v0.0.16: June 11, 2026

- **VPC subnets (tiers)**: create a network as a VPC subnet with `network create --vpc`, and attach
  a custom network ACL at creation with `--acl`.
- **Network ACL rules**: full rule management: `acl rules`, `acl create-rule`, `acl update-rule` (in
  place), `acl delete-rule`, plus `acl delete` for ACL lists. `--cidr` accepts comma-separated
  lists.
- **`network get`**: show a network's CIDR, state, VPC membership, and attached ACL.
- **`plan network`**: list network plans (the slugs for `--network-plan`).
- **Fixes**: VPC `get`/`create` now show CIDR/status, plan tables include a SLUG column, and
  `vpc delete` polls for completion instead of a false-negative warning. Clearer "already deleted"
  handling.

### v0.0.15: June 10, 2026

- **VPN**: new IKE/ESP Diffie-Hellman and Perfect-Forward-Secrecy flags (`--ike-dh`, `--esp-dh`,
  `--esp-pfs`) on customer-gateway create/update. The full VPN configuration is now returned
  reliably after create/update.
- **`ip allocate --project`**: assign an IP to a specific project at allocation time.
- **Fixes**: VPN gateway/customer-gateway and VPC/network update commands no longer return blank
  fields. Clearing a `--description` now works.

### v0.0.14: June 10, 2026

- **Infrastructure as code**: the CLI's API packages are now importable by external Go modules,
  enabling the [Terraform / OpenTofu provider](https://github.com/zsoftly/terraform-provider-zcp).
  CLI behaviour is unchanged.

### v0.0.12: June 9, 2026

- **`kubernetes upgrade-version`**: upgrade a running cluster's Kubernetes version
  (`--version v1.x.y`). The correct version for the cluster's region is resolved automatically.

### v0.0.11: June 8, 2026

- **`instance create --user-data` / `--user-data-file`**: pass a cloud-init / startup script inline
  or from a file at VM creation.
- **Fixes**: instance Private IP now displays correctly, `instance get` retries the brief window
  right after creation, and `instance create --blockstorage-plan` is now optional (auto-assigned).

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
- **Zero-config mode**: run with only `ZCP_BEARER_TOKEN` and `ZCP_API_URL`, with no config file.
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

- **Reliability fixes**: delete commands now verify the resource is gone, volume list deduplicates
  entries, and messages are clearer for snapshots on detached volumes and for empty accounts.

### v0.0.4: March 27, 2026

- **VPC tier networks**: `vpc create-network` and `vpc update-network`.

### v0.0.3: March 27, 2026

- Added **`host list`**, **`resource quota`**, VPC-tier flags on `network create`, and a full
  integration test suite.

### v0.0.2: March 23, 2026

- **Default zone per profile**: set it once and stop typing `--zone` on every command. An explicit
  flag still overrides.

### v0.0.1: March 15, 2026

- **Initial release** of the `zcp` CLI: 28 top-level commands across compute, storage, networking,
  security, Kubernetes, and billing.
- **Named profiles** with secure (`0600`) credential storage, a **`--wait`** flag for async
  operations, **`instance ssh`**, **shell completions** (bash/zsh/fish/PowerShell), a **`--pager`**
  option, and **multi-platform binaries** (Linux/macOS/Windows, amd64/arm64) with one-line
  installers.

## Terraform / OpenTofu provider

Manage ZCP infrastructure as code with the official provider, published as `zsoftly/zcp` on the
[OpenTofu registry](https://search.opentofu.org/provider/zsoftly/zcp) and the
[Terraform Registry](https://registry.terraform.io/providers/zsoftly/zcp). Source code lives at
[github.com/zsoftly/terraform-provider-zcp](https://github.com/zsoftly/terraform-provider-zcp).

### v0.1.2: July 18, 2026

**`MX` records in `zcp_dns_record`.** A new `priority` argument (0-65535) sets the preference
number. Put the mail server in `content`. The provider requires priority for `MX` and rejects it for
every other type during planning, so invalid configurations fail before apply. Built on the `zcp`
CLI SDK v0.0.25 and verified against the live DNS API.

- **Dropped `SRV` from the documented `type` values.** The DNS API rejects `SRV` and `LOC` records,
  so advertising `SRV` was misleading. `type` stays a free-form string.

### v0.1.1: July 18, 2026

**Destroy operations release auto-assigned public IPs.** `zcp_instance` and `zcp_load_balancer`
release auto-assigned public IPs through the service-cancellation workflow, preventing billable
addresses from remaining after destroy. Set `assign_public_ip = false` to create an instance without
one. This release also upgrades the `zcp` CLI SDK to v0.0.24, which pages through every result in
public IP and load balancer listings.

### v0.1.0: July 8, 2026

**First public release, live on both registries.** 38 resources and 12 data sources cover everything
the `zcp` CLI supports: instances, volumes, snapshots and backups, VPCs and networks, firewall and
egress rules, load balancers, auto-scaling, Kubernetes clusters, DNS, object storage, VPN, and
account governance. Every resource supports `terraform import`, and we sign every release.

```hcl
terraform {
  required_providers {
    zcp = {
      source  = "zsoftly/zcp"
      version = "~> 0.1"
    }
  }
}
```

Set `ZCP_BEARER_TOKEN` in your environment, then run `terraform init` or `tofu init`. Generate the
token in the console under **Account → API Keys**.
