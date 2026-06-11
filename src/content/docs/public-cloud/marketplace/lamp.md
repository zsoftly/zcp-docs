---
title: LAMP Stack
---

The LAMP stack — Linux, Apache, MariaDB, and PHP — is the classic combination for hosting web
applications and dynamic websites. This image ships all four components pre-installed and configured
to work together, ready for you to deploy your application.

## Software included

| Component      | Version                                                |
| -------------- | ------------------------------------------------------ |
| Apache         | 2.4.x                                                  |
| MariaDB        | Latest stable                                          |
| PHP            | 8.3                                                    |
| PHP extensions | cli, mysql, curl, gd, mbstring, xml, zip, bcmath, intl |
| Ubuntu         | 24.04 LTS                                              |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Verify services are running

There is no first-boot configuration — all services start immediately.

```bash
systemctl status apache2
systemctl status mariadb
php --version
```

### 3. Access the default web page

Open a browser and navigate to:

```text
http://<your-vm-ip>
```

### 4. Deploy your application

Place your application files in the web root:

```bash
sudo cp -r my-app/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
```

### 5. Set up a database

Connect to MariaDB as root (no password required on a fresh install — authentication uses the system
socket):

```bash
sudo mariadb
```

Create a database and user for your application:

```sql
CREATE DATABASE myapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'myapp'@'localhost' IDENTIFIED BY '<strong-password>';
GRANT ALL PRIVILEGES ON myapp.* TO 'myapp'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Managing the LAMP stack

```bash
# Restart Apache
sudo systemctl restart apache2

# Restart MariaDB
sudo systemctl restart mariadb

# View Apache logs
sudo tail -f /var/log/apache2/error.log

# View MariaDB logs
sudo journalctl -u mariadb -f
```

Key directories and files:

| Path                            | Purpose                      |
| ------------------------------- | ---------------------------- |
| `/var/www/html/`                | Default web root             |
| `/etc/apache2/sites-available/` | Apache virtual hosts         |
| `/etc/php/8.3/apache2/php.ini`  | PHP configuration for Apache |
| `/etc/mysql/mariadb.conf.d/`    | MariaDB configuration        |

**To create a virtual host** for a domain, add a configuration file to
`/etc/apache2/sites-available/` and enable it:

```bash
sudo a2ensite myapp.conf
sudo systemctl reload apache2
```

## Security

Port 80 is open by default. UFW is enabled.

After setting up HTTPS, restrict HTTP traffic:

```bash
sudo ufw allow 443/tcp
sudo ufw delete allow 80/tcp
```

:::caution

Set a strong MariaDB root password and restrict database users to `localhost` unless remote access
is required.

:::

## Next steps

- [Apache documentation](https://httpd.apache.org/docs/)
- [MariaDB documentation](https://mariadb.com/kb/en/)
- [PHP documentation](https://www.php.net/docs.php)
