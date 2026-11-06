---
title: Terraform and OpenTofu Provider
description: Use version 1.3.0 of the ZCP provider for Terraform and CLI profile authentication.
---

The ZCP provider lets Terraform and OpenTofu manage instances, networks, Kubernetes, DNS, storage,
and related platform resources. The
[v1.3.0](https://github.com/zsoftly/terraform-provider-zcp/releases/tag/v1.3.0) provider adds CLI
profile authentication and builds against CLI v1.3.0.

## Install the Provider

Provider v1.3.0 is available from the Terraform Registry. The OpenTofu Registry currently lists
v1.2.0, so profile authentication requires the Terraform release until OpenTofu lists v1.3.0.

```hcl
# OpenTofu
terraform {
  required_providers {
    zcp = {
      source  = "registry.opentofu.org/zsoftly/zcp"
      version = "~> 1.2.0"
    }
  }
}
```

```hcl
# Terraform
terraform {
  required_providers {
    zcp = {
      source  = "registry.terraform.io/zsoftly/zcp"
      version = "~> 1.3.0"
    }
  }
}
```

## Authentication

Set a bearer token outside version control. The provider reads `ZCP_BEARER_TOKEN`, `ZCP_API_URL`,
and `ZCP_PROJECT` from the environment. `ZCP_API_URL` is optional and defaults to
`https://api.zcp.zsoftly.ca/api`. Set it only when using a different API endpoint.

```bash
export ZCP_BEARER_TOKEN="your-token"
export ZCP_PROJECT="your-project-slug"
```

Provider v1.3.0 also supports a CLI profile. Set `profile` in the provider configuration or
`ZCP_PROFILE` in the environment. Without either selector, the provider uses the active CLI profile.

```hcl
provider "zcp" {
  profile = "development"
}
```

The provider uses `bearer_token` in provider configuration, then `ZCP_BEARER_TOKEN`, then the
selected CLI profile's token. An explicitly selected profile must exist even when a
higher-precedence token is set. A rejected token returns an error without trying another token.
Unknown provider configuration values return diagnostics instead of falling back to environment or
profile values.

For connection settings, `api_url` uses provider configuration, `ZCP_API_URL`, the selected profile,
then the public default. `default_project` uses provider configuration, `ZCP_PROJECT`, then the
selected profile. A profile fills only values that a provider setting or environment variable has
not set.

## Upgrade Existing Configuration

Update your provider version constraint, then run the matching commands from the directory that
contains your configuration:

```bash
terraform init -upgrade
terraform plan
```

```bash
tofu init -upgrade
tofu plan
```

Review the plan before applying it. The migration notes below identify replacements that version
1.0.0 can propose.

## Named Compute and Root Storage

New instances require a named compute plan, a named root-storage plan, and root-disk capacity. The
provider rejects custom CPU, memory, and disk inputs for new instances. Query plan values available
to your account with the CLI before writing configuration.

Supply the referenced `var.*` values through your variables or module inputs.

```hcl
resource "zcp_instance" "web" {
  name              = "web"
  cloud_provider    = var.cloud_provider_slug
  region            = var.region_slug
  template          = var.template_slug
  plan              = var.compute_plan_slug
  blockstorage_plan = var.root_storage_plan_slug
  root_disk_size    = 100
  billing_cycle     = "hourly"
  network           = var.network_slug
  storage_category  = var.storage_category_slug
}
```

`blockstorage_plan` and `root_disk_size` force replacement when changed. Existing custom-plan state
remains readable and destroyable, but a new or replacement instance must use named plans.

## Kubernetes Cluster Migration

New clusters use separate fixed plans for control-plane nodes, worker nodes, and root storage. The
root-disk size applies to every cluster node.

Supply the `var.*` values for your cluster configuration.

```hcl
resource "zcp_kubernetes_cluster" "main" {
  name               = "main"
  cloud_provider     = var.cloud_provider_slug
  region             = var.region_slug
  version            = var.kubernetes_version
  control_plane_plan = var.control_plane_plan_slug
  worker_plan        = var.worker_plan_slug
  storage_plan       = var.root_storage_plan_slug
  root_disk_size     = 100
  billing_cycle      = "hourly"
  workers            = 3
  storage_category   = var.storage_category_slug
  ssh_key            = var.ssh_key_name
}
```

The legacy `plan` field remains only for existing state. Switching an existing cluster to the
separate plan shape replaces the cluster because the API has no role-specific plan update operation.
Review `terraform plan` or `tofu plan` before applying. Cluster cancellation can leave a network you
must delete separately.

The provider records requested Kubernetes autoscaling bounds. It does not confirm an immediate
worker increase, and automatic scale-out remains unverified.

## VM Backup Schedules

`zcp_vm_backup_schedule` manages a recurring VM backup policy, including its interval, time zone,
retention, and paused state.

```hcl
resource "zcp_vm_backup_schedule" "web" {
  virtual_machine = zcp_instance.web.id
  interval        = "dailyAt"
  at              = "02:00"
  timezone        = "America/Toronto"
  retention       = 7
  paused          = false
  region          = var.region_slug
}
```

Use `hourly`, `dailyAt`, `weeklyOn`, or `monthlyOn`. The provider rejects `everyOtherDay` before
writing a policy because the platform can persist that interval and then report an error.

## Other Version 1.0.0 Changes

- `zcp_volume` accepts a named storage `plan` with `size` for capacity in GB.
- DNS domain lookups retrieve pages until the requested slug is found.
- Updating an instance `name` changes its hostname and can restart a running instance or start a
  stopped instance.
- The provider does not store kubeconfig or cluster credentials.

See the [provider source and generated reference](https://github.com/zsoftly/terraform-provider-zcp)
for the complete schema and import formats. See also: [CLI Reference](/public-cloud/cli/reference),
[API Authentication](/public-cloud/api/authentication).
