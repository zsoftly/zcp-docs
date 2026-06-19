---
title: Démarrage rapide de la CLI
sidebar_position: 2
---

## Démarrage rapide de la CLI

Authentifiez-vous et gérez votre première ressource depuis le terminal.

### Étape 1 : S'authentifier

```bash
zcp profile add
```

Vous serez invité à fournir :

- **Nom du profil** (par exemple, `default`)
- **Jeton Bearer** : obtenez-le dans le portail sous **Profile → API Tokens**
- **API URL**: `https://api.zcp.zsoftly.ca/api`
- **Région par défaut** (par exemple, `yow-1`) et **projet par défaut** (par exemple, `default-9`)

La région et le projet par défaut sont enregistrés dans le profil et utilisés par toutes les
commandes liées à une région ou à un projet, donc vous n'avez pas à passer `--region`/`--project` à
chaque fois (comme `aws configure`).

Vérifiez l'authentification :

```bash
zcp auth validate
```

:::note

Presque toutes les commandes exigent une région et un projet. Les valeurs par défaut du profil
ci-dessus suffisent. Vous pouvez aussi les remplacer par commande avec `--region`/`--project` ou
`ZCP_REGION`/`ZCP_PROJECT`. Seules les commandes de niveau compte (`dns`, `auth`, `profile`,
`region`, `project`, `cloud-provider`, `currency`, `billing-cycle`, `server`,
`billing`/`support`/`dashboard`) sont exemptées.

:::

### Étape 2 : Explorer

```bash
# List available regions
zcp region list

# List available plans
zcp plan vm

# List your projects
zcp project list
```

### Étape 3 : Créer une VM

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

### Étape 4 : La gérer

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

### Formats de sortie

```bash
# JSON output (great for scripting)
zcp instance list --output json

# YAML output
zcp instance list --output yaml

# Pipe to jq
zcp instance list -o json | jq '.[].name'
```

### Utilisation CI/CD

```bash
# Use environment variables — no config file needed
export ZCP_BEARER_TOKEN="your-token"
export ZCP_API_URL="https://api.zcp.zsoftly.ca/api"
export ZCP_PROJECT="default"

zcp instance list -o json
```

Voir aussi : [Configuration](/fr/public-cloud/cli/configuration),
[Référence CLI](/fr/public-cloud/cli/reference)
