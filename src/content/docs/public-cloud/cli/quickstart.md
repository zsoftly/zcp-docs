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

Verify authentication:

```bash
zcp auth validate
```

### Step 2: Explore

```bash
# List available regions
zcp region list

# List available plans
zcp plan list

# List your projects
zcp project list
```

### Step 3: Create a VM

```bash
# List available templates (OS images)
zcp template list

# Create an instance
zcp instance create \
  --name my-server \
  --template ubuntu-24-04 \
  --plan general-1vcpu-1gb \
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
# Use environment variables — no config file needed
export ZCP_BEARER_TOKEN="your-token"
export ZCP_API_URL="https://api.zcp.zsoftly.ca/api"
export ZCP_PROJECT="my-project"

zcp instance list -o json
```

See also: [Configuration](./configuration), [CLI Reference](./reference)
