---
title: Pterodactyl
---

Pterodactyl is a free, open-source game server management panel built on PHP, Nginx, and Docker. It
lets you deploy and manage game servers through a clean web interface, with per-server isolation
handled by the Wings daemon. It powers game hosting for thousands of providers and self-hosters.

:::note[Coming soon]

A pre-built Pterodactyl image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Pterodactyl yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps** and switch to the **Marketplace** tab. It opens on
   **Featured** by default, so select **Marketplace** next to it. Pick your region (YOW-1 or YUL-1),
   search for **Ubuntu 24.04 LTS**, and click **Deploy**. You can also create the instance from
   **Instances → Create**. Either way you get a clean Ubuntu 24.04 VM.

   ![The Marketplace tab in the ZSoftly Cloud portal, showing the region selector, category list, search box, and Deploy buttons](../../../../assets/marketplace/deploy-marketplace-tab.webp)

   ![Searching the Marketplace for an app, with the search box filtering the catalog down to a matching Deploy card](../../../../assets/marketplace/deploy-marketplace-search.webp)

2. Choose a plan that meets the requirements above.

3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Pterodactyl

The Pterodactyl Panel and the Wings daemon are installed separately. The steps below install the
**Panel**. See the Wings note at the end for the daemon.

Install the dependencies (PHP 8.3, MariaDB, Nginx, Redis, Composer):

```bash
sudo apt install -y software-properties-common ca-certificates lsb-release apt-transport-https
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
sudo apt install -y php8.3 php8.3-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip} \
  mariadb-server nginx tar unzip git redis-server
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

Download the Panel and install PHP dependencies:

```bash
sudo mkdir -p /var/www/pterodactyl
cd /var/www/pterodactyl
sudo curl -Lo panel.tar.gz https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz
sudo tar -xzvf panel.tar.gz
sudo chmod -R 755 storage/* bootstrap/cache/
sudo cp .env.example .env
sudo COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader
```

## Configure Pterodactyl

Create the database and user in MariaDB:

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

Generate the app key, run the interactive setup wizards, migrate the database, and create your admin
user:

```bash
cd /var/www/pterodactyl
sudo php artisan key:generate --force
sudo php artisan p:environment:setup
sudo php artisan p:environment:database
sudo php artisan migrate --seed --force
sudo php artisan p:user:make
```

Set ownership, add the scheduler cron and queue worker, then configure Nginx:

```bash
sudo chown -R www-data:www-data /var/www/pterodactyl/*
( sudo crontab -l 2>/dev/null; echo "* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1" ) | sudo crontab -
```

Create a systemd service for the queue worker and an Nginx server block (with a TLS certificate from
Let's Encrypt for production) by following the
[webserver and queue worker steps](https://pterodactyl.io/panel/1.0/webserver_configuration.html) in
the official guide. The Panel must be served behind Nginx over HTTPS for production use.

To run game servers you also need the **Wings** daemon, which requires Docker. Install it on this VM
(or a separate node) per the
[Wings installation guide](https://pterodactyl.io/wings/1.0/installing.html), then add the node in
the Panel.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Pterodactyl needs and
add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Wings additionally listens on port 8080 (API) and 2022 (SFTP). Open those if Wings runs on this VM,
along with any game-server port ranges you allocate.

## Next steps

- [Pterodactyl documentation](https://pterodactyl.io/)
- [Pterodactyl Panel installation guide](https://pterodactyl.io/panel/1.0/getting_started.html)
