---
title: Headplane
---

Headplane est une interface web complète pour [Headscale](https://headscale.net), l'implémentation
open source et auto-hébergée du serveur de contrôle Tailscale. Elle permet de gérer les nœuds, les
clés de pré-authentification, les ACL et le DNS depuis un navigateur plutôt que via la CLI
Headscale. Headplane ne remplace pas Headscale. Elle gère un serveur Headscale en cours d'exécution,
vous déployez donc les deux ensemble sur cette instance.

:::note[Bientôt disponible]

Une image Headplane préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu
24.04 LTS** neuve depuis la marketplace et suivez les étapes ci-dessous pour installer Headplane
vous-même.

:::

:::tip[Headscale est le serveur, pas le client]

L'application marketplace Tailscale de ZCP installe le **client** Tailscale qui rejoint un tailnet
existant. Headscale est le **serveur de contrôle** auto-hébergé auquel un client se connecte, et
Headplane en est l'interface d'administration. Exécutez Headscale + Headplane ici, puis pointez vos
clients Tailscale vers l'URL de ce serveur.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 10 Go   | 20 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps** et passez à l'onglet **Marketplace**. Il s'ouvre
   sur **Featured** par défaut, sélectionnez donc **Marketplace** à côté. Choisissez votre région
   (YOW-1 ou YUL-1), recherchez **Ubuntu 24.04 LTS** et cliquez sur **Deploy**. Vous pouvez aussi
   créer l'instance depuis **Instances → Create**. Dans les deux cas, vous obtenez une VM Ubuntu
   24.04 propre.

   ![L'onglet Marketplace du portail ZSoftly Cloud, avec le sélecteur de région, la liste des catégories, la barre de recherche et les boutons Deploy](../../../../../assets/marketplace/deploy-marketplace-tab.webp)

   ![Recherche d'une application dans le Marketplace, la barre de recherche filtrant le catalogue jusqu'à une carte Deploy correspondante](../../../../../assets/marketplace/deploy-marketplace-search.webp)

2. Choisissez un plan qui répond aux prérequis ci-dessus.

3. Lorsque l'instance est **Running**, connectez-vous en SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour:

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Headplane

Headplane et Headscale sont distribués sous forme d'images Docker et s'exécutent ensemble via Docker
Compose. Installez d'abord Docker:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
```

Déconnectez-vous puis reconnectez-vous pour que votre utilisateur prenne en compte le groupe
`docker`, puis créez un répertoire de travail:

```bash
mkdir -p ~/headplane && cd ~/headplane
mkdir -p config data
```

Créez `~/headplane/compose.yaml`:

```yaml
services:
  headscale:
    image: headscale/headscale:0.26.0
    container_name: headscale
    restart: unless-stopped
    command: serve
    ports:
      - '8080:8080'
    volumes:
      - './config/headscale.yaml:/etc/headscale/config.yaml'
      - './data/headscale:/var/lib/headscale'
    labels:
      me.tale.headplane.target: headscale

  headplane:
    image: ghcr.io/tale/headplane:latest
    container_name: headplane
    restart: unless-stopped
    ports:
      - '3000:3000'
    volumes:
      - './config/headplane.yaml:/etc/headplane/config.yaml'
      - './config/headscale.yaml:/etc/headscale/config.yaml'
      - './data/headplane:/var/lib/headplane'
      - '/var/run/docker.sock:/var/run/docker.sock:ro'
```

Téléchargez une configuration Headscale dans `config/headscale.yaml` et définissez `server_url` sur
votre URL publique (par exemple `https://hs.example.com`). Créez ensuite `config/headplane.yaml`
avec l'intégration Headscale et un secret de cookie:

```yaml
server:
  host: '0.0.0.0'
  port: 3000
  cookie_secret: '<32-character-random-string>'
  cookie_secure: false

headscale:
  url: 'http://headscale:8080'
  config_path: '/etc/headscale/config.yaml'
  config_strict: true

integration:
  docker:
    enabled: true
    container_name: 'headscale'
    socket: 'unix:///var/run/docker.sock'
```

Générez un secret de cookie avec `openssl rand -hex 16` et collez-le dans `cookie_secret`. Démarrez
la pile:

```bash
docker compose up -d
```

## Configurer Headplane

1. Ouvrez Headplane dans votre navigateur à l'adresse `http://<your-vm-ip>:3000`.
2. Headplane s'authentifie auprès de Headscale avec une clé API. Générez-en une à l'intérieur du
   conteneur Headscale et utilisez-la (ou collez-la dans l'interface lorsqu'elle vous est demandée):

   ```bash
   docker exec headscale headscale apikeys create
   ```

3. Pour l'authentification unique (SSO), ajoutez un bloc `oidc` à `config/headplane.yaml` avec les
   champs `issuer`, `client_id` et `client_secret` de votre fournisseur, puis redémarrez avec
   `docker compose restart headplane`.
4. Placez un reverse proxy (Caddy, Nginx ou Traefik) en frontal pour terminer le TLS et servir à la
   fois le `server_url` de Headscale et l'interface Headplane en HTTPS. Définissez
   `cookie_secure: true` une fois le HTTPS en place. Le TLS est requis pour les tailnets de
   production.

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que le SSH (port 22) depuis l'extérieur. Ouvrez les ports dont
Headplane et Headscale ont besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le
portail:

```bash
sudo ufw allow 3000/tcp
sudo ufw allow 8080/tcp
```

Le port 3000 sert l'interface Headplane et le port 8080 est le serveur de contrôle Headscale. Si
vous les placez derrière un reverse proxy, exposez plutôt les ports 80/443 et gardez ces ports
internes.

## Étapes suivantes

- [Documentation Headplane](https://headplane.net)
- [Guide d'installation de Headplane](https://github.com/tale/headplane)
