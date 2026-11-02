---
title: CLI Quickstart
sidebar_position: 2
---

## CLI Quickstart

Get authenticated and manage your first resource from the terminal.

This quickstart uses CLI v1.2.0. Install or upgrade with the
[installation guide](/public-cloud/cli/installation).

### Step 1: Authenticate

```bash
zcp profile add
```

You'll be prompted for:

- **Profile name** (e.g., `default`)
- **Bearer token**: get this from the portal under **Profile → API Tokens**
- **API URL**: `https://api.zcp.zsoftly.ca/api`
- **Default region** (e.g., `yow-1`) and **default project** (e.g., `default-9`)

The default region and project are saved to the profile and used by every region/project-scoped
command, so you don't have to pass `--region`/`--project` each time (like `aws configure`).

Verify authentication:

```bash
zcp auth validate
```

:::note

Almost every command requires a region and project. The profile defaults above satisfy that
requirement. You can still override per command with `--region`/`--project` or
`ZCP_REGION`/`ZCP_PROJECT`. Only account-level commands (`dns`, `auth`, `profile`, `region`,
`project`, `cloud-provider`, `currency`, `billing-cycle`, `server`, billing/support/dashboard) are
exempt.

:::

### Step 2: Explore

```bash
# List available regions
zcp region list

# List available plans
zcp plan vm
zcp plan storage
zcp plan network
zcp storage-category list

# List your projects
zcp project list
```

### Step 3: Create a VM

```bash
# List available templates (OS images)
zcp template list --region yow-1

# Create an instance
zcp instance create \
  --name my-server \
  --template "<template-slug>" \
  --plan "<compute-plan-slug>" \
  --blockstorage-plan "<root-storage-plan-slug>" \
  --root-disk-size 100 \
  --network-plan "<network-plan-slug>" \
  --storage-category "<storage-category-slug>" \
  --billing-cycle hourly
```

:::note

Plans are compute-only. CLI v1.0.0 and later require `--blockstorage-plan` for the named root
storage tier and `--root-disk-size` in GB. List values in your selected region with `zcp plan vm`,
`zcp plan storage`, `zcp plan network`, and `zcp storage-category list`.

Replace each quoted placeholder with a slug from your account. Set `--root-disk-size` to a positive
number that meets or exceeds the template's minimum disk size. `--network-plan` creates an isolated
network. Use a plan slug from `zcp plan network`.

:::

### Step 4: Manage it

```bash
# List your instances
zcp instance list

# Get instance details
zcp instance get my-server

# Power off
zcp instance stop my-server

# Reboot
zcp instance reboot my-server

# Delete
zcp instance delete my-server
```

### Output formats

```bash
# JSON output (great for scripting)
zcp instance list --output json

# YAML output
zcp instance list --output yaml

# Pipe to jq
zcp instance list -o json | jq '.[].name'
```

### CI/CD usage

```bash
# Use environment variables with no config file
export ZCP_BEARER_TOKEN="your-token"
export ZCP_API_URL="https://api.zcp.zsoftly.ca/api"
export ZCP_PROJECT="default"

zcp instance list -o json
```

See also: [Configuration](/public-cloud/cli/configuration),
[CLI Reference](/public-cloud/cli/reference)
