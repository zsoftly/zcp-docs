---
title: Installation
sidebar_position: 1
---

## Installing the ZCP CLI

The ZCP CLI (`zcp`) is the official command-line interface for ZSoftly Public Cloud. It lets you
manage VMs, networks, storage, Kubernetes, and more from your terminal.

**Current version:** v0.0.15  
**GitHub:** https://github.com/zsoftly/zcp-cli  
**Releases:** https://github.com/zsoftly/zcp-cli/releases

:::note

v0.0.14 moved all API service packages from `internal/` to `pkg/` so external Go modules (including
the ZCP Terraform provider) can import them. Binary behaviour for CLI users is unchanged. If you
import CLI packages directly in your own Go code, update import paths from
`github.com/zsoftly/zcp-cli/internal/api/<service>` to
`github.com/zsoftly/zcp-cli/pkg/api/<service>`.

:::

### Linux and macOS

```bash
curl -fsSL https://raw.githubusercontent.com/zsoftly/zcp-cli/main/scripts/install.sh | bash
```

After installation, verify:

```bash
zcp version
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/zsoftly/zcp-cli/main/scripts/install.ps1 | iex
```

### Manual download

Download the binary for your platform from the
[GitHub releases page](https://github.com/zsoftly/zcp-cli/releases):

| Platform | Architecture          | Binary                  |
| -------- | --------------------- | ----------------------- |
| Linux    | amd64                 | `zcp-linux-amd64`       |
| Linux    | arm64                 | `zcp-linux-arm64`       |
| macOS    | amd64                 | `zcp-darwin-amd64`      |
| macOS    | arm64 (Apple Silicon) | `zcp-darwin-arm64`      |
| Windows  | amd64                 | `zcp-windows-amd64.exe` |

Make the binary executable (Linux/macOS):

```bash
chmod +x zcp-linux-amd64
sudo mv zcp-linux-amd64 /usr/local/bin/zcp
```

### Build from source

Requires Go 1.26+:

```bash
git clone https://github.com/zsoftly/zcp-cli
cd zcp-cli
make build
sudo mv bin/zcp /usr/local/bin/zcp
```

### Shell completions

```bash
# Bash
zcp completion bash > /etc/bash_completion.d/zcp

# Zsh
zcp completion zsh > "${fpath[1]}/_zcp"

# Fish
zcp completion fish > ~/.config/fish/completions/zcp.fish

# PowerShell
zcp completion powershell >> $PROFILE
```

See also: [Quickstart](./quickstart), [Configuration](./configuration)
