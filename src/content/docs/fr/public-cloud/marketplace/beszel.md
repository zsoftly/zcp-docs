---
title: Beszel
---

Beszel est une plateforme de surveillance de serveurs légère, avec données historiques, statistiques
Docker et alertes configurables. Elle comporte deux parties : un **hub** qui sert le tableau de bord
web sur le port 8090, et un **agent** qui s'exécute sur chaque machine surveillée et rapporte les
métriques système au hub. Ce guide installe le hub sur cette VM et y ajoute un agent pour surveiller
la même machine.

:::note[Bientôt disponible]

Une image Beszel préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer Beszel vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 512 Mo  | 1 Go       |
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

## Installer Beszel

Le hub s'exécute comme un conteneur Docker officiel. Installez d'abord Docker à l'aide du script
d'installation officiel :

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Ajoutez l'utilisateur `ubuntu` au groupe `docker`, puis réappliquez votre appartenance au groupe :

```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

Démarrez le hub Beszel. Il lie le port 8090 et conserve ses données dans un volume nommé :

```bash
docker run -d \
  --restart=unless-stopped \
  -p 8090:8090 \
  -v beszel_data:/beszel_data \
  --name beszel \
  henrygd/beszel:latest
```

Vérifiez que le conteneur est en cours d'exécution :

```bash
docker ps
```

## Configurer Beszel

1. Ouvrez `http://<your-vm-ip>:8090` dans un navigateur et créez votre compte administrateur sur
   l'écran de premier démarrage.
2. Cliquez sur **Add System**. Saisissez un nom et l'hôte sur lequel l'agent s'exécutera (utilisez
   `localhost` pour surveiller cette même VM). Beszel génère une **clé publique** et un **jeton**.
   Conservez-les, l'agent en a besoin.

### Ajouter l'agent

Pour surveiller cette VM, installez l'agent Beszel sur celle-ci. L'installateur officiel enregistre
l'agent comme service systemd et écoute sur le port 45876 :

```bash
curl -sL https://get.beszel.dev -o /tmp/install-agent.sh && chmod +x /tmp/install-agent.sh && sudo /tmp/install-agent.sh
```

Lorsque vous y êtes invité, collez la **clé publique** et le **jeton** affichés par le hub lors de
l'ajout du système. L'agent se connecte alors au hub et le tableau de bord commence à afficher les
métriques en moins d'une minute.

Pour surveiller des serveurs supplémentaires, exécutez le même installateur d'agent sur chacun et
ajoutez-le comme nouveau système dans le hub, en ouvrant le port 45876 entre le hub et ce serveur.

En production, placez le hub derrière un reverse proxy tel que Nginx ou Caddy pour le servir sur le
port 443 avec un certificat TLS, et définissez `APP_URL` sur votre URL publique.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le port du hub (et le port
de l'agent uniquement si des serveurs distants doivent joindre cet agent) et ajoutez-les aux règles
réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 8090/tcp
```

## Étapes suivantes

- [Documentation Beszel](https://beszel.dev/guide/getting-started)
- [Guide d'installation du hub Beszel](https://beszel.dev/guide/hub-installation)
