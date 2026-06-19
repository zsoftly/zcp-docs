---
title: Pelican Panel
---

Pelican is a modern, open-source game server management panel and the spiritual successor to
Pterodactyl. It provides a fast web interface for deploying and managing game servers, with
per-server isolation handled by the Wings daemon. Pelican uses PHP and Laravel and ships a guided
web installer.

:::note[Coming soon]

A pre-built Pelican Panel image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Pelican Panel yourself.

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

## Install Pelican Panel

Install PHP 8.4 and the required extensions, a web server, and Composer:

```bash
sudo apt install -y software-properties-common ca-certificates lsb-release apt-transport-https curl tar unzip git
sudo add-apt-repository -y ppa:ondrej/php
sudo apt update
sudo apt install -y php8.4 php8.4-{gd,mysql,mbstring,bcmath,xml,curl,zip,intl,sqlite3,fpm} \
  mariadb-server nginx
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

Download the Panel and install PHP dependencies:

```bash
sudo mkdir -p /var/www/pelican
cd /var/www/pelican
sudo curl -L https://github.com/pelican-dev/panel/releases/latest/download/panel.tar.gz | sudo tar -xzv
sudo COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader
```

:::tip

Pelican also ships an official `compose.yml` for a Docker-based install with an integrated web
server and automatic SSL. If you prefer containers, see the
[Docker guide](https://pelican.dev/docs/panel/advanced/docker) instead of the steps above.

:::

## Configure Pelican Panel

Generate the environment file and application key:

```bash
cd /var/www/pelican
sudo php artisan p:environment:setup
```

Set ownership so the web server can write to the app, then add the scheduler cron and queue worker:

```bash
sudo chown -R www-data:www-data /var/www/pelican
( sudo crontab -u www-data -l 2>/dev/null; echo "* * * * * php /var/www/pelican/artisan schedule:run >> /dev/null 2>&1" ) | sudo crontab -u www-data -
```

Configure your web server (Nginx, Caddy, or Apache) with a TLS certificate following the
[webserver configuration guide](https://pelican.dev/docs/panel/webserver-config), then finish setup
(including the database, admin user, and queue worker) through the **web installer** at
`https://<your-domain>/installer`.

To run game servers you also need the **Wings** daemon, which requires Docker. Install it on this VM
(or a separate node) per the [Wings guide](https://pelican.dev/docs/wings/install), then link the
node in the Panel.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Pelican Panel needs
and add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Wings additionally listens on port 8080 (API) and 2022 (SFTP). Open those if Wings runs on this VM,
along with any game-server port ranges you allocate.

## Next steps

- [Pelican documentation](https://pelican.dev/docs/)
- [Pelican Panel installation guide](https://pelican.dev/docs/panel/getting-started)
