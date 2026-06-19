---
title: Mattermost
---

Mattermost est une plateforme de messagerie et de collaboration libre et auto-hébergée pour les
équipes. Elle offre des canaux, des messages directs, le partage de fichiers, la recherche et des
intégrations, comme alternative privée aux services de messagerie hébergés, vos données restant sur
votre propre infrastructure. Le serveur écoute sur le port 8065.

:::note[Bientôt disponible]

Une image Mattermost préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu
24.04 LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer Mattermost
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 50 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Mattermost**, puis cliquez sur
   **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Les deux
   vous donnent une VM Ubuntu 24.04 vierge.
2. Choisissez un forfait qui répond aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH :

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Mattermost

Installez Docker Engine et le plugin Docker Compose depuis le dépôt officiel de Docker :

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Ajoutez l'utilisateur `ubuntu` au groupe `docker` afin de pouvoir exécuter Docker sans `sudo`, puis
reconnectez-vous :

```bash
sudo usermod -aG docker ubuntu
exit
```

Reconnectez-vous en SSH, créez un répertoire de projet et ajoutez un fichier `compose.yaml`. Cette
pile, basée sur le projet officiel `mattermost-docker`, exécute Mattermost Team Edition avec une
base de données PostgreSQL 17 :

```bash
mkdir ~/mattermost && cd ~/mattermost
```

```yaml
services:
  postgres:
    image: postgres:17
    restart: unless-stopped
    environment:
      - TZ=${TZ}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres-data:/var/lib/postgresql/data

  mattermost:
    image: mattermost/mattermost-team-edition:10.6.1
    restart: unless-stopped
    depends_on:
      - postgres
    environment:
      - TZ=${TZ}
      - MM_SQLSETTINGS_DRIVERNAME=postgres
      - MM_SQLSETTINGS_DATASOURCE=${MM_SQLSETTINGS_DATASOURCE}
      - MM_SERVICESETTINGS_SITEURL=${MM_SERVICESETTINGS_SITEURL}
    ports:
      - '${APP_PORT}:8065'
    volumes:
      - mattermost-data:/mattermost/data
      - mattermost-logs:/mattermost/logs
      - mattermost-config:/mattermost/config
      - mattermost-plugins:/mattermost/plugins
      - mattermost-client-plugins:/mattermost/client/plugins

volumes:
  postgres-data:
  mattermost-data:
  mattermost-logs:
  mattermost-config:
  mattermost-plugins:
  mattermost-client-plugins:
```

Créez un fichier `.env` dans le même répertoire. Remplacez le domaine et les mots de passe par vos
propres valeurs :

```bash
cat > .env <<'EOF'
DOMAIN=mattermost.example.com
TZ=America/Toronto
POSTGRES_USER=mmuser
POSTGRES_PASSWORD=change-me-to-a-strong-password
POSTGRES_DB=mattermost
APP_PORT=8065
MM_SQLSETTINGS_DRIVERNAME=postgres
MM_SQLSETTINGS_DATASOURCE=postgres://mmuser:change-me-to-a-strong-password@postgres:5432/mattermost?sslmode=disable&connect_timeout=10
MM_SERVICESETTINGS_SITEURL=https://mattermost.example.com
EOF
```

Assurez-vous que les valeurs `POSTGRES_USER`, `POSTGRES_PASSWORD` et `POSTGRES_DB` correspondent aux
identifiants intégrés dans `MM_SQLSETTINGS_DATASOURCE`. Démarrez la pile :

```bash
docker compose up -d
```

## Configurer Mattermost

Ouvrez `http://<your-vm-ip>:8065` dans un navigateur. Le premier compte que vous créez devient
l'administrateur système. Vous pouvez ensuite créer votre première équipe et inviter des membres.
Pour un déploiement en production, placez Mattermost derrière un proxy inverse tel que nginx avec un
certificat TLS, définissez `MM_SERVICESETTINGS_SITEURL` sur votre domaine public `https://` et
exposez l'interface via HTTPS plutôt que d'exposer le port 8065 directement.

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que SSH (port 22) depuis l'extérieur. Ouvrez le ou les ports dont
Mattermost a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 8065/tcp
```

## Étapes suivantes

- [Documentation Mattermost](https://docs.mattermost.com/)
- [Guide d'installation Mattermost](https://docs.mattermost.com/deployment-guide/server/deploy-containers.html)
