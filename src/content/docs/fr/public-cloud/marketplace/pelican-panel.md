---
title: Pelican Panel
---

Pelican est un panneau de gestion de serveurs de jeu open source moderne et le successeur spirituel
de Pterodactyl. Il offre une interface web rapide pour déployer et gérer des serveurs de jeu, avec
une isolation par serveur assurée par le démon Wings. Pelican utilise PHP et Laravel et propose un
installateur web guidé.

:::note[Bientôt disponible]

Une image Pelican Panel préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu
24.04 LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer Pelican
Panel vous-même.

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

## Installer Pelican Panel

Installez PHP 8.4 et les extensions requises, un serveur web et Composer :

```bash
sudo apt install -y software-properties-common ca-certificates lsb-release apt-transport-https curl tar unzip git
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
sudo apt install -y php8.4 php8.4-{gd,mysql,mbstring,bcmath,xml,curl,zip,intl,sqlite3,fpm} \
  mariadb-server nginx
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

Téléchargez le panneau et installez les dépendances PHP :

```bash
sudo mkdir -p /var/www/pelican
cd /var/www/pelican
sudo curl -L https://github.com/pelican-dev/panel/releases/latest/download/panel.tar.gz | sudo tar -xzv
sudo COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader
```

:::tip[Astuce]

Pelican propose aussi un fichier `compose.yml` officiel pour une installation basée sur Docker avec
un serveur web intégré et un SSL automatique. Si vous préférez les conteneurs, consultez le
[guide Docker](https://pelican.dev/docs/panel/advanced/docker) au lieu des étapes ci-dessus.

:::

## Configurer Pelican Panel

Générez le fichier d'environnement et la clé d'application :

```bash
cd /var/www/pelican
sudo php artisan p:environment:setup
```

Définissez les permissions pour que le serveur web puisse écrire dans l'application, puis ajoutez la
tâche cron du planificateur et le worker de file d'attente :

```bash
sudo chown -R www-data:www-data /var/www/pelican
( sudo crontab -u www-data -l 2>/dev/null; echo "* * * * * php /var/www/pelican/artisan schedule:run >> /dev/null 2>&1" ) | sudo crontab -u www-data -
```

Configurez votre serveur web (Nginx, Caddy ou Apache) avec un certificat TLS en suivant le
[guide de configuration du serveur web](https://pelican.dev/docs/panel/webserver-config), puis
terminez la configuration (y compris la base de données, l'utilisateur administrateur et le worker
de file d'attente) via l'**installateur web** à l'adresse `https://<your-domain>/installer`.

Pour exécuter des serveurs de jeu, vous avez aussi besoin du démon **Wings**, qui requiert Docker.
Installez-le sur cette VM (ou sur un nœud séparé) en suivant le
[guide Wings](https://pelican.dev/docs/wings/install), puis liez le nœud dans le panneau.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) depuis l'extérieur. Ouvrez le ou les ports
dont Pelican Panel a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail
:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Wings écoute en plus sur les ports 8080 (API) et 2022 (SFTP). Ouvrez-les si Wings s'exécute sur
cette VM, ainsi que toutes les plages de ports de serveur de jeu que vous allouez.

## Étapes suivantes

- [Documentation Pelican](https://pelican.dev/docs/)
- [Guide d'installation de Pelican Panel](https://pelican.dev/docs/panel/getting-started)
