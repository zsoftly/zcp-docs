---
title: CLI Quickstart
sidebar_position: 2
---

## CLI Quickstart

Get authenticated and manage your first resource from the terminal.

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
  --template ubuntu-2604-lts \
  --plan ci1xs \
  --region yow \
  --network my-public-network
```

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
