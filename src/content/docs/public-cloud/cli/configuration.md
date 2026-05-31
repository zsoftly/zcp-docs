---
title: Configuration
sidebar_position: 3
---

## CLI Configuration

The ZCP CLI uses a YAML configuration file to store credential profiles.

### Config file location

| Platform    | Path                                       |
| ----------- | ------------------------------------------ |
| Linux/macOS | `~/.config/zcp/config.yaml`                |
| Windows     | `%APPDATA%\zcp\config.yaml`                |
| Custom      | Set `XDG_CONFIG_HOME` environment variable |

### Config file structure

```yaml
active_profile: default
profiles:
  - name: default
    bearer_token: 'your-token-here'
    api_url: 'https://api.zcp.zsoftly.ca/api'
  - name: staging
    bearer_token: 'staging-token-here'
    api_url: 'https://api.staging.zcp.zsoftly.ca/api'
```

### Profile management

```bash
# Add a new profile interactively
zcp profile add

# List all profiles
zcp profile list

# Switch to a different profile
zcp profile use staging

# Show the active profile
zcp profile show

# Update a profile field
zcp profile update --name default --token new-token

# Delete a profile
zcp profile delete staging
```

### Environment variables

Environment variables override the config file. Useful for CI/CD pipelines:

| Variable             | Description                       |
| -------------------- | --------------------------------- |
| `ZCP_BEARER_TOKEN`   | Authentication token              |
| `ZCP_API_URL`        | API base URL                      |
| `ZCP_PROFILE`        | Profile to use                    |
| `ZCP_PROJECT`        | Default project                   |
| `ZCP_REGION`         | Default region                    |
| `ZCP_CLOUD_PROVIDER` | Default cloud provider            |
| `ZCP_OUTPUT`         | Output format (table, json, yaml) |
| `ZCP_DEBUG`          | Enable debug output (true/false)  |

### Global flags

These flags work on every command:

| Flag             | Short | Default | Description                      |
| ---------------- | ----- | ------- | -------------------------------- |
| `--profile`      |       |         | Config profile to use            |
| `--output`       | `-o`  | `table` | Output format: table, json, yaml |
| `--api-url`      |       |         | Override API base URL            |
| `--timeout`      |       | `30`    | Request timeout in seconds       |
| `--debug`        |       | `false` | Enable debug output to stderr    |
| `--no-color`     |       | `false` | Disable color output             |
| `--pager`        |       | `false` | Pipe table output through less   |
| `--auto-approve` | `-y`  | `false` | Skip confirmation prompts        |

See also: [Installation](./installation), [Quickstart](./quickstart)
