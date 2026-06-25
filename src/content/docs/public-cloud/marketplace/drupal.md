---
title: Drupal
---

Drupal is an open-source content management system for content-heavy websites and applications. Its
entity model, taxonomy, and module ecosystem let teams build custom content types, editorial
workflows, and multilingual sites without writing the underlying code themselves.

:::note[Coming soon]

A pre-built Drupal image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Drupal yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

Drupal 11 runs on a LAMP stack (Linux, Apache, MySQL/MariaDB, PHP 8.3+). Storage needs grow with
media uploads and the number of installed modules.

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

## Install the LAMP stack

Install Apache, MariaDB, PHP 8.3, and the PHP extensions Drupal needs:

```bash
sudo apt install -y apache2 mariadb-server \
  php php-cli php-mysql php-gd php-xml php-mbstring php-curl php-zip php-intl php-apcu \
  libapache2-mod-php composer git unzip
```

Lock down the database and answer the prompts (set a root password, remove anonymous users, and
disallow remote root login):

```bash
sudo mysql_secure_installation
```

Create a database and a dedicated user for Drupal:

```bash
sudo mysql <<'SQL'
CREATE DATABASE drupal CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'drupal'@'localhost' IDENTIFIED BY 'change-this-password';
GRANT ALL PRIVILEGES ON drupal.* TO 'drupal'@'localhost';
FLUSH PRIVILEGES;
SQL
```

## Install Drupal

Create the project with Composer and hand ownership of the docroot to Apache:

```bash
cd /var/www
sudo composer create-project drupal/recommended-project drupal
sudo chown -R www-data:www-data /var/www/drupal
```

Point Apache at the `web/` docroot and enable URL rewriting:

```bash
sudo tee /etc/apache2/sites-available/drupal.conf >/dev/null <<'EOF'
<VirtualHost *:80>
    DocumentRoot /var/www/drupal/web
    <Directory /var/www/drupal/web>
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog ${APACHE_LOG_DIR}/drupal-error.log
    CustomLog ${APACHE_LOG_DIR}/drupal-access.log combined
</VirtualHost>
EOF
sudo a2ensite drupal
sudo a2dissite 000-default
sudo a2enmod rewrite
sudo systemctl reload apache2
```

## Complete the web installer

Open the site in a browser and follow the setup wizard:

```text
http://<your-vm-ip>/
```

Choose the **Standard** profile, then enter the database name, user, and password you created above.
The installer writes `web/sites/default/settings.php` and creates the admin account. For production,
put the instance behind your own domain and enable HTTPS (for example with Certbot and the Apache
plugin).

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open HTTP and HTTPS, and add the same
ports to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Next steps

- [Drupal documentation](https://www.drupal.org/docs)
- [Installing Drupal](https://www.drupal.org/docs/getting-started/installing-drupal)
