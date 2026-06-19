---
title: Pterodactyl
---

Pterodactyl est un panneau de gestion de serveurs de jeu libre et open source, construit sur PHP,
Nginx et Docker. Il vous permet de déployer et de gérer des serveurs de jeu via une interface web
épurée, avec une isolation par serveur assurée par le démon Wings. Il propulse l'hébergement de jeu
de milliers de fournisseurs et d'auto-hébergeurs.

:::note[Bientôt disponible]

Une image Pterodactyl préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu
24.04 LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer Pterodactyl
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

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

## Installer Pterodactyl

Le panneau Pterodactyl et le démon Wings s'installent séparément. Les étapes ci-dessous installent
le **panneau**. Voir la note sur Wings à la fin pour le démon.

Installez les dépendances (PHP 8.3, MariaDB, Nginx, Redis, Composer) :

```bash
sudo apt install -y software-properties-common ca-certificates lsb-release apt-transport-https
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
sudo apt install -y php8.3 php8.3-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip} \
  mariadb-server nginx tar unzip git redis-server
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

Téléchargez le panneau et installez les dépendances PHP :

```bash
sudo mkdir -p /var/www/pterodactyl
cd /var/www/pterodactyl
sudo curl -Lo panel.tar.gz https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz
sudo tar -xzvf panel.tar.gz
sudo chmod -R 755 storage/* bootstrap/cache/
sudo cp .env.example .env
sudo COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader
```

## Configurer Pterodactyl

Créez la base de données et l'utilisateur dans MariaDB :

```bash
sudo mysql -u root
```

```sql
CREATE USER 'pterodactyl'@'127.0.0.1' IDENTIFIED BY 'use-a-strong-password';
CREATE DATABASE panel;
GRANT ALL PRIVILEGES ON panel.* TO 'pterodactyl'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

Générez la clé d'application, lancez les assistants de configuration interactifs, migrez la base de
données et créez votre utilisateur administrateur :

```bash
cd /var/www/pterodactyl
sudo php artisan key:generate --force
sudo php artisan p:environment:setup
sudo php artisan p:environment:database
sudo php artisan migrate --seed --force
sudo php artisan p:user:make
```

Définissez les permissions, ajoutez la tâche cron du planificateur et le worker de file d'attente,
puis configurez Nginx :

```bash
sudo chown -R www-data:www-data /var/www/pterodactyl/*
( sudo crontab -l 2>/dev/null; echo "* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1" ) | sudo crontab -
```

Créez un service systemd pour le worker de file d'attente et un bloc serveur Nginx (avec un
certificat TLS Let's Encrypt en production) en suivant les
[étapes serveur web et worker de file d'attente](https://pterodactyl.io/panel/1.0/webserver_configuration.html)
du guide officiel. Le panneau doit être servi derrière Nginx en HTTPS en production.

Pour exécuter des serveurs de jeu, vous avez aussi besoin du démon **Wings**, qui requiert Docker.
Installez-le sur cette VM (ou sur un nœud séparé) en suivant le
[guide d'installation de Wings](https://pterodactyl.io/wings/1.0/installing.html), puis ajoutez le
nœud dans le panneau.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) depuis l'extérieur. Ouvrez le ou les ports
dont Pterodactyl a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Wings écoute en plus sur les ports 8080 (API) et 2022 (SFTP). Ouvrez-les si Wings s'exécute sur
cette VM, ainsi que toutes les plages de ports de serveur de jeu que vous allouez.

## Étapes suivantes

- [Documentation Pterodactyl](https://pterodactyl.io/)
- [Guide d'installation du panneau Pterodactyl](https://pterodactyl.io/panel/1.0/getting_started.html)
