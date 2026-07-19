---
title: Installation
sidebar_position: 1
---

## Installer la CLI ZCP

La CLI ZCP (`zcp`) est l'interface en ligne de commande officielle de ZSoftly Public Cloud. Elle
permet de gérer les VM, les réseaux, le stockage, Kubernetes et plus encore depuis votre terminal.

**Version actuelle :**
<a href="https://github.com/zsoftly/zcp-cli/releases/latest"><img src="https://img.shields.io/github/v/release/zsoftly/zcp-cli?style=flat&label=&color=3b82f6" alt="Dernière version de la CLI zcp" style="vertical-align: middle;" /></a>  
**GitHub:**
https://github.com/zsoftly/zcp-cli  
**Releases:** https://github.com/zsoftly/zcp-cli/releases

:::note

**Changement incompatible en v0.0.14 pour les consommateurs de modules Go.** Tous les packages de
services API et le client HTTP sont passés de `internal/` à `pkg/` afin que les modules externes (y
compris le fournisseur Terraform ZCP) puissent les importer. Les utilisateurs finaux de la CLI ne
sont pas touchés. Mettez à jour les chemins d'importation :

| Ancien chemin                                       | Nouveau chemin                                 |
| --------------------------------------------------- | ---------------------------------------------- |
| `github.com/zsoftly/zcp-cli/internal/api/<service>` | `github.com/zsoftly/zcp-cli/pkg/api/<service>` |
| `github.com/zsoftly/zcp-cli/internal/httpclient`    | `github.com/zsoftly/zcp-cli/pkg/httpclient`    |

:::

### Linux and macOS

```bash
curl -fsSL https://raw.githubusercontent.com/zsoftly/zcp-cli/main/scripts/install.sh | bash
```

Après l'installation, vérifiez :

```bash
zcp version
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/zsoftly/zcp-cli/main/scripts/install.ps1 | iex
```

### Téléchargement manuel

Téléchargez le binaire pour votre plateforme depuis la
[page des versions GitHub](https://github.com/zsoftly/zcp-cli/releases) :

| Plateforme | Architecture          | Binaire                 |
| ---------- | --------------------- | ----------------------- |
| Linux      | amd64                 | `zcp-linux-amd64`       |
| Linux      | arm64                 | `zcp-linux-arm64`       |
| macOS      | amd64                 | `zcp-darwin-amd64`      |
| macOS      | arm64 (Apple Silicon) | `zcp-darwin-arm64`      |
| Windows    | amd64                 | `zcp-windows-amd64.exe` |

Rendez le binaire exécutable (Linux/macOS) :

```bash
chmod +x zcp-linux-amd64
sudo mv zcp-linux-amd64 /usr/local/bin/zcp
```

### Compiler depuis la source

Nécessite Go 1.26 ou une version ultérieure :

```bash
git clone https://github.com/zsoftly/zcp-cli
cd zcp-cli
make build
sudo mv bin/zcp /usr/local/bin/zcp
```

### Complétions shell

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

Voir aussi : [Démarrage rapide](/fr/public-cloud/cli/quickstart),
[Configuration](/fr/public-cloud/cli/configuration)
