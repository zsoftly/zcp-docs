---
title: WordPress
---

WordPress is the world's most popular open-source content management system, powering over 40% of
all websites. This image ships a complete LAMP stack (Apache, MariaDB, and PHP) with WordPress
pre-installed and ready to configure.

## Software included

| Component | Version      |
| --------- | ------------ |
| WordPress | 6.x (latest) |
| Apache    | 2.4.x        |
| MariaDB   | 10.x         |
| PHP       | 8.3          |
| Ubuntu    | 24.04 LTS    |

## Environment variables

Set these when deploying WordPress from the marketplace. `SITE_URL` and `ADMIN_EMAIL` must contain
your deployment's real values. You can leave `ADMIN_USER` and `ADMIN_PASSWORD` blank to have secure
random values generated automatically.

| Variable         | Description                 |
| ---------------- | --------------------------- |
| `SITE_URL`       | Public URL of the site      |
| `ADMIN_USER`     | Administrator username      |
| `ADMIN_PASSWORD` | Administrator password      |
| `ADMIN_EMAIL`    | Administrator email address |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script runs automatically. It:

- Creates the WordPress database and a dedicated database user with a randomly generated password
- Writes `wp-config.php` with the database credentials and unique secret keys

This takes under 30 seconds. Track progress:

```bash
journalctl -u wordpress-first-boot.service -f
```

### 3. Complete the WordPress setup wizard

Open a browser and navigate to:

```text
http://<your-vm-ip>
```

The WordPress setup wizard will guide you through:

1. Selecting your language
2. Setting your site title
3. Creating your WordPress admin username and password
4. Entering your admin email address

:::caution

Choose a strong admin password. This is the account that controls your entire WordPress site.

:::

### 4. Log in to the WordPress dashboard

After completing the wizard, log in at:

```text
http://<your-vm-ip>/wp-admin
```

## Managing WordPress

**Restart Apache:**

```bash
sudo systemctl restart apache2
```

**Restart MariaDB:**

```bash
sudo systemctl restart mariadb
```

**WordPress files** are located in `/var/www/wordpress/`.

**PHP configuration**: `/etc/php/8.3/apache2/php.ini`

**Apache virtual host**: `/etc/apache2/sites-available/wordpress.conf`

## Setting up HTTPS

WordPress is served on port 80 (HTTP) by default. To enable HTTPS:

1. Point a domain name at your VM's IP address
2. Install Certbot: `sudo apt install certbot python3-certbot-apache`
3. Run: `sudo certbot --apache -d yourdomain.com`

Certbot will automatically configure Apache for HTTPS and set up certificate renewal.

## Security

Port 80 is open by default. UFW is enabled.

After setting up HTTPS, restrict HTTP traffic:

```bash
sudo ufw allow 443/tcp
sudo ufw delete allow 80/tcp
```

:::caution

Change the WordPress admin password immediately after setup. Install a security plugin such as
Wordfence to monitor for threats and limit login attempts.

:::

## Next steps

- [WordPress documentation](https://wordpress.org/documentation/)
- [WordPress theme directory](https://wordpress.org/themes/)
- [WordPress plugin directory](https://wordpress.org/plugins/)
