---
title: LEMP Stack
---

The LEMP stack (Linux, Nginx, MariaDB, and PHP) is a high-performance alternative to the classic
LAMP stack. Nginx handles HTTP traffic more efficiently under load than Apache, making it a good
choice for production web applications. This image runs the entire stack in Docker Compose for easy
management.

## Software included

| Component      | Version       |
| -------------- | ------------- |
| Nginx          | Latest stable |
| MariaDB        | Latest stable |
| PHP-FPM        | 8.3           |
| Docker         | Latest stable |
| Docker Compose | Latest stable |
| Ubuntu         | 24.04 LTS     |

## Environment variables

You can optionally set these when deploying LEMP from the marketplace. Leave any field blank to have
a secure random value generated automatically.

| Variable                | Description                                |
| ----------------------- | ------------------------------------------ |
| `MARIADB_ROOT_PASSWORD` | Database root password                     |
| `MARIADB_DATABASE`      | Name of the application database to create |
| `MARIADB_USER`          | Application database username              |
| `MARIADB_PASSWORD`      | Application database user password         |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script runs automatically. It:

- Generates random passwords for the MariaDB root and application users
- Writes the environment configuration to `/opt/lemp/.env`
- Saves credentials to `/etc/lemp/credentials.txt`
- Starts the Nginx, PHP-FPM, and MariaDB containers via Docker Compose

This takes under 60 seconds. Track progress:

```bash
journalctl -u lemp-first-boot.service -f
```

### 3. Retrieve credentials

```bash
sudo cat /etc/lemp/credentials.txt
```

This file contains the MariaDB root password and application database credentials. It is only
readable by root.

### 4. Verify the stack is running

```bash
cd /opt/lemp && docker compose ps
```

Open a browser and navigate to:

```text
http://<your-vm-ip>
```

## Deploying your application

Place your PHP application files in the web root:

```bash
sudo cp -r my-app/* /opt/lemp/www/
```

Connect to MariaDB from within the stack:

```bash
cd /opt/lemp && docker compose exec mariadb mariadb -u root -p
```

## Managing the LEMP stack

All management is done via Docker Compose from `/opt/lemp`:

```bash
# Check status
docker compose ps

# Restart all services
docker compose restart

# View Nginx logs
docker compose logs nginx -f

# View PHP-FPM logs
docker compose logs php -f

# View MariaDB logs
docker compose logs mariadb -f

# Stop the stack
docker compose down

# Start the stack
docker compose up -d
```

Key paths:

| Path                        | Purpose                           |
| --------------------------- | --------------------------------- |
| `/opt/lemp/www/`            | Web root                          |
| `/opt/lemp/.env`            | Environment variables (passwords) |
| `/opt/lemp/nginx/`          | Nginx configuration               |
| `/etc/lemp/credentials.txt` | Credentials reference             |

## Security

Port 80 is open by default. UFW is enabled.

After setting up HTTPS, restrict HTTP traffic:

```bash
sudo ufw allow 443/tcp
sudo ufw delete allow 80/tcp
```

:::note

MariaDB is not exposed outside the Docker network. Only Nginx is bound to the host network. To
enable HTTPS, configure an SSL certificate in the Nginx container or place a reverse proxy in front.

:::

## Next steps

- [Nginx documentation](https://nginx.org/en/docs/)
- [MariaDB documentation](https://mariadb.com/kb/en/)
- [PHP documentation](https://www.php.net/docs.php)
