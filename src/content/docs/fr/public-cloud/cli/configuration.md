---
title: Configuration
sidebar_position: 3
---

## Configuration de la CLI

La CLI ZCP utilise un fichier de configuration YAML pour stocker les profils d'identifiants.

### Emplacement du fichier de configuration

| Plateforme   | Chemin                                                   |
| ------------ | -------------------------------------------------------- |
| Linux/macOS  | `~/.config/zcp/config.yaml`                              |
| Windows      | `%APPDATA%\zcp\config.yaml`                              |
| Personnalisé | Définissez la variable d'environnement `XDG_CONFIG_HOME` |

### Structure du fichier de configuration

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

### Gestion des profils

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

### Variables d'environnement

Les variables d'environnement remplacent le fichier de configuration. Elles sont utiles pour les
pipelines CI/CD :

| Variable             | Description                                |
| -------------------- | ------------------------------------------ |
| `ZCP_BEARER_TOKEN`   | Jeton d'authentification                   |
| `ZCP_API_URL`        | URL de base de l'API                       |
| `ZCP_PROFILE`        | Profil à utiliser                          |
| `ZCP_PROJECT`        | Projet par défaut                          |
| `ZCP_REGION`         | Région par défaut                          |
| `ZCP_CLOUD_PROVIDER` | Fournisseur cloud par défaut               |
| `ZCP_OUTPUT`         | Format de sortie (table, json, yaml)       |
| `ZCP_DEBUG`          | Activer la sortie de débogage (true/false) |

### Options globales

Ces options fonctionnent avec toutes les commandes :

| Option           | Court | Défaut  | Description                                  |
| ---------------- | ----- | ------- | -------------------------------------------- |
| `--profile`      |       |         | Profil de configuration à utiliser           |
| `--output`       | `-o`  | `table` | Format de sortie : table, json, yaml         |
| `--api-url`      |       |         | Remplacer l'URL de base de l'API             |
| `--timeout`      |       | `30`    | Délai d'expiration des requêtes, en secondes |
| `--debug`        |       | `false` | Activer la sortie de débogage vers stderr    |
| `--no-color`     |       | `false` | Désactiver les couleurs                      |
| `--pager`        |       | `false` | Acheminer la sortie tabulaire vers less      |
| `--auto-approve` | `-y`  | `false` | Ignorer les demandes de confirmation         |

Voir aussi : [Installation](/fr/public-cloud/cli/installation),
[Démarrage rapide](/fr/public-cloud/cli/quickstart)
