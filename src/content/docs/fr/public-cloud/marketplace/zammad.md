---
title: Zammad
---

Zammad est un système open source de helpdesk et de gestion de tickets destiné aux équipes de
support client et de service informatique. Il regroupe les canaux e-mail, chat, réseaux sociaux et
téléphone dans une boîte de réception partagée, avec gestion des tickets, SLA, base de connaissances
et reporting. Il s'exécute comme une application web auto-hébergée s'appuyant sur PostgreSQL et
Elasticsearch.

:::note[Bientôt disponible]

Une image Zammad préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** neuve depuis la marketplace et suivez les étapes ci-dessous pour installer Zammad vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 40 Go   | 80 Go      |

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

## Installer Zammad

Zammad recommande un hôte dédié disposant d'au moins **4 Go de RAM** et dépend d'**Elasticsearch**
pour la recherche, le reporting et l'indexation des pièces jointes. Installez d'abord Elasticsearch,
puis Zammad depuis le dépôt apt officiel packager.io.

Installez Elasticsearch (8.x ou 9.x):

```bash
curl -fsSL https://artifacts.elastic.co/GPG-KEY-elasticsearch \
  | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/9.x/apt stable main" \
  | sudo tee /etc/apt/sources.list.d/elastic-9.x.list
sudo apt update
sudo apt install -y elasticsearch
sudo systemctl enable --now elasticsearch
```

Ajoutez le dépôt officiel Zammad et installez Zammad depuis la liste Ubuntu 24.04:

```bash
sudo curl -fsSL "https://dl.packager.io/srv/zammad/zammad/key" \
  | gpg --dearmor | sudo tee /etc/apt/keyrings/pkgr-zammad.gpg > /dev/null
sudo curl -fsSL "https://dl.packager.io/srv/zammad/zammad/stable/installer/ubuntu/24.04.list" \
  -o /etc/apt/sources.list.d/zammad.list
sudo apt update
sudo apt install -y zammad
```

Le paquet installe Zammad, sa base de données PostgreSQL, un site nginx et tous les services, puis
les démarre automatiquement.

## Configurer Zammad

1. Pointez Zammad vers Elasticsearch et construisez l'index de recherche:

   ```bash
   sudo zammad run rails r "Setting.set('es_url', 'http://localhost:9200')"
   sudo zammad run rake zammad:searchindex:rebuild
   ```

2. Ouvrez `http://<your-vm-ip>/` dans votre navigateur et complétez l'assistant de configuration
   web. Le premier compte que vous créez devient l'administrateur système.
3. Le paquet fournit un vhost nginx sur le port 80. Pour la production, modifiez
   `/etc/nginx/sites-enabled/zammad.conf` afin d'ajouter votre domaine et un certificat TLS (Let's
   Encrypt via certbot est pris en charge) pour que l'interface soit servie en HTTPS sur le
   port 443.
4. Configurez votre canal e-mail sous **Admin → Channels** pour commencer à recevoir et envoyer des
   tickets.

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que le SSH (port 22) depuis l'extérieur. Ouvrez les ports dont
Zammad a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Gardez Elasticsearch (port 9200) lié à localhost et ne l'exposez pas vers l'extérieur.

## Étapes suivantes

- [Documentation Zammad](https://docs.zammad.org/)
- [Guide d'installation de Zammad](https://docs.zammad.org/en/latest/install/package.html)
