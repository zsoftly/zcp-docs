---
title: Artifactory
---

JFrog Artifactory est un gestionnaire universel de dépôts de binaires et d'artefacts. L'édition open
source stocke et relaie des paquets dans de nombreux formats, notamment Maven, Gradle, Debian et les
binaires génériques, et constitue la source de référence unique pour vos artefacts de build.
L'interface web fonctionne sur le port 8082.

## Logiciels inclus

| Composant       | Version   |
| --------------- | --------- |
| Artifactory OSS | 7.146.27  |
| PostgreSQL      | 16        |
| Ubuntu          | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable                     | Description                             |
| ---------------------------- | --------------------------------------- |
| `ARTIFACTORY_ADMIN_PASSWORD` | Mot de passe administrateur Artifactory |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration prépare le stockage persistant, génère le mot de
passe PostgreSQL et démarre les conteneurs Artifactory et PostgreSQL. Suivez la progression :

```bash
journalctl -u artifactory-first-boot.service -f
```

Si vous attachez un disque de données vierge supplémentaire avant le premier démarrage, le script le
formate et le monte sur `/data`. Sinon, les données sont stockées sous `/data` sur le système de
fichiers racine.

### 3. Vérifier qu'Artifactory fonctionne

```bash
cd /opt/artifactory
docker compose ps
curl -fsS http://127.0.0.1:8082/ui/ > /dev/null
```

### 4. Accéder à l'interface d'Artifactory

Artifactory est lié à localhost jusqu'à ce que vous ayez terminé l'assistant de configuration.
Depuis votre machine locale, démarrez un tunnel SSH :

```bash
ssh -L 8082:127.0.0.1:8082 -L 8081:127.0.0.1:8081 ubuntu@<your-vm-ip>
```

Ouvrez ensuite :

```text
http://127.0.0.1:8082/ui/
```

Connectez-vous avec les identifiants par défaut du projet amont :

| Champ             | Valeur     |
| ----------------- | ---------- |
| Nom d'utilisateur | `admin`    |
| Mot de passe      | `password` |

Modifiez le mot de passe dans l'assistant de configuration avant de rendre le service accessible
depuis un réseau.

## Gérer Artifactory

```bash
# Check container status
cd /opt/artifactory && docker compose ps

# Restart
cd /opt/artifactory && docker compose restart

# View logs
cd /opt/artifactory && docker compose logs -f
```

| Chemin                                | Fonction                     |
| ------------------------------------- | ---------------------------- |
| `/opt/artifactory/docker-compose.yml` | Configuration Docker Compose |
| `/opt/artifactory/.env`               | Mot de passe PostgreSQL      |
| `/data/artifactory/var/`              | Données Artifactory          |
| `/data/artifactory/postgresql/`       | Données PostgreSQL           |

## Sécurité

Les ports 8081 et 8082 sont liés à localhost. UFW est activé et n'autorise par défaut que SSH (port
22). Utilisez le tunnel SSH ci-dessus pour la configuration initiale.

Après avoir modifié le mot de passe administrateur, exposez Artifactory uniquement par un chemin
réseau de confiance. Pour publier directement le port 8082, vous devez d'abord remplacer la liaison
de port Docker Compose `127.0.0.1:8082:8082` par `8082:8082`, puis autoriser une adresse IP de
confiance :

```bash
sudo ufw allow from <trusted-ip> to any port 8082
```

**Pour une utilisation en production**, gardez Artifactory lié à localhost et placez-le derrière un
proxy inverse afin de le servir sur le port 443 avec un certificat TLS.

:::caution

Le mot de passe `admin` du projet amont est public. Modifiez-le immédiatement par le tunnel SSH et
limitez l'accès aux adresses IP connues.

:::

## Étapes suivantes

- [Documentation d'Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation)
- [Guide d'installation d'Artifactory](https://jfrog.com/help/r/jfrog-installation-setup-documentation/install-artifactory-single-node-with-docker)
