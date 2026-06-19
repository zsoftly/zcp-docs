---
title: Uptime Kuma
---

Uptime Kuma est un outil de surveillance auto-hébergé qui suit la disponibilité de sites web, d'API,
de ports TCP et plus encore. Il envoie des notifications lorsqu'un service tombe en panne et publie
des pages de statut publiques. Il s'exécute comme un unique conteneur Docker et s'administre
entièrement via une interface web sur le port 3001.

:::note[Bientôt disponible]

Une image Uptime Kuma préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu
24.04 LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer Uptime Kuma
vous-même.

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

3. Lorsque l'instance est **Running**, connectez-vous en SSH :

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Uptime Kuma

Uptime Kuma est distribué sous forme d'image Docker officielle. Installez d'abord Docker à l'aide du
script d'installation officiel :

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Ajoutez l'utilisateur `ubuntu` au groupe `docker` afin de pouvoir exécuter Docker sans `sudo`, puis
réappliquez votre appartenance au groupe :

```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

Démarrez le conteneur Uptime Kuma. Il lie le port 3001 et stocke ses données dans un volume nommé
afin de survivre aux redémarrages et aux mises à jour du conteneur :

```bash
docker run -d \
  --restart=unless-stopped \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  --name uptime-kuma \
  louislam/uptime-kuma:1
```

Vérifiez que le conteneur est en cours d'exécution :

```bash
docker ps
```

## Configurer Uptime Kuma

1. Ouvrez `http://<your-vm-ip>:3001` dans un navigateur.
2. Sur l'écran de premier démarrage, créez votre compte administrateur (nom d'utilisateur et mot de
   passe). Ce compte a le contrôle total de l'instance.
3. Cliquez sur **Add New Monitor** pour commencer à surveiller un service. Choisissez un type de
   moniteur (HTTP(s), TCP Port, Ping, etc.), saisissez la cible et enregistrez.
4. Configurez les notifications sous **Settings → Notifications** (e-mail, Slack, Telegram, webhooks
   et plus encore).

Pour mettre à jour plus tard, récupérez la dernière image et recréez le conteneur. Vos données
persistent dans le volume :

```bash
docker pull louislam/uptime-kuma:1
docker stop uptime-kuma && docker rm uptime-kuma
docker run -d --restart=unless-stopped -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

En production, placez Uptime Kuma derrière un reverse proxy tel que Nginx ou Caddy pour le servir
sur le port 443 avec un certificat TLS, et restreignez l'accès direct au port 3001.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le port dont Uptime Kuma a
besoin et ajoutez-le aux règles réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 3001/tcp
```

## Étapes suivantes

- [Documentation Uptime Kuma](https://github.com/louislam/uptime-kuma/wiki)
- [Guide d'installation Uptime Kuma](https://github.com/louislam/uptime-kuma/wiki/%F0%9F%94%A7-How-to-Install)
