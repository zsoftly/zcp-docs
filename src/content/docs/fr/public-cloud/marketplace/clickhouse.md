---
title: ClickHouse
---

ClickHouse est un système de gestion de base de données libre, orienté colonnes, conçu pour le
traitement analytique en ligne (OLAP). Il ingère et interroge de grands volumes de données avec une
très faible latence, ce qui en fait un excellent choix pour l'analyse en temps réel, les tableaux de
bord, l'observabilité et le stockage de journaux. L'interface HTTP s'exécute sur le port 8123 et le
protocole natif sur le port 9000.

:::note[Bientôt disponible]

Une image ClickHouse préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu
24.04 LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer ClickHouse
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 80 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **ClickHouse**, puis cliquez sur
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

## Installer ClickHouse

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

Reconnectez-vous en SSH, créez un répertoire de projet et ajoutez un fichier `compose.yaml` :

```bash
mkdir ~/clickhouse && cd ~/clickhouse
```

```yaml
services:
  clickhouse:
    image: clickhouse/clickhouse-server:latest
    restart: unless-stopped
    environment:
      - CLICKHOUSE_USER=${CLICKHOUSE_USER}
      - CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD}
    volumes:
      - clickhouse-data:/var/lib/clickhouse
      - clickhouse-logs:/var/log/clickhouse-server
volumes:
  clickhouse-data:
  clickhouse-logs:
```

Créez un fichier `.env` dans le même répertoire avec votre utilisateur administrateur et son mot de
passe :

```bash
cat > .env <<'EOF'
CLICKHOUSE_USER=admin
CLICKHOUSE_PASSWORD=change-me-to-a-strong-password
EOF
```

Démarrez la pile :

```bash
docker compose up -d
```

## Configurer ClickHouse

L'utilisateur et le mot de passe du fichier `.env` sont créés au premier démarrage. Vérifiez que le
serveur répond via l'interface HTTP :

```bash
curl http://localhost:8123/ping
```

Ouvrez une session SQL interactive avec le client intégré :

```bash
docker compose exec clickhouse clickhouse-client --user admin --password
```

L'interface HTTP écoute sur le port 8123 et le protocole natif sur le port 9000. Pour un déploiement
en production, placez ClickHouse derrière un proxy inverse tel que nginx avec un certificat TLS et
exposez les requêtes via une connexion chiffrée plutôt que d'exposer les ports directement.

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que SSH (port 22) depuis l'extérieur. Ouvrez le ou les ports dont
ClickHouse a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 8123/tcp
sudo ufw allow 9000/tcp
```

## Étapes suivantes

- [Documentation ClickHouse](https://clickhouse.com/docs)
- [Guide d'installation ClickHouse](https://clickhouse.com/docs/install/docker)
