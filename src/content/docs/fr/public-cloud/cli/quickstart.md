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

Vérifiez l'authentification :

```bash
zcp auth validate
```

### Étape 2 : Explorer

```bash
# List available regions
zcp region list

# List available plans
zcp plan list

# List your projects
zcp project list
```

### Étape 3 : Créer une VM

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
export ZCP_PROJECT="my-project"

zcp instance list -o json
```

Voir aussi : [Configuration](/fr/public-cloud/cli/configuration),
[Référence CLI](/fr/public-cloud/cli/reference)
