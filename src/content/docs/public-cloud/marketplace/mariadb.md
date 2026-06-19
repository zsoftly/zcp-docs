---
title: MariaDB 11.4
---

MariaDB is an open-source relational database management system and a drop-in replacement for MySQL.
It is widely used for web applications, content management systems, and general-purpose data
storage.

## Software included

| Component      | Version      |
| -------------- | ------------ |
| MariaDB Server | 11.4.x (LTS) |
| Ubuntu         | 24.04 LTS    |

## Environment variables

You can optionally set these when deploying MariaDB from the marketplace. Leave any field blank to
have a secure random value generated automatically.

| Variable              | Description                                |
| --------------------- | ------------------------------------------ |
| `MYSQL_ROOT_PASSWORD` | Database root password                     |
| `MYSQL_DATABASE`      | Name of the application database to create |
| `MYSQL_USER`          | Application database username              |
| `MYSQL_PASSWORD`      | Application database user password         |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script runs automatically. It:

- Sets a random root password
- Removes anonymous users and the test database
- Creates an `app` database and an `app` user with a random password
- Writes all credentials to `/etc/mariadb/credentials.txt`
- Configures `/root/.my.cnf` so root can connect without typing a password

This takes under 30 seconds. Track progress:

```bash
journalctl -u mariadb-first-boot.service -f
```

### 3. Retrieve credentials

```bash
sudo cat /etc/mariadb/credentials.txt
```

This file contains the root password, application database name, application user, and application
password. It is only readable by root.

### 4. Connect to MariaDB

**As root (no password prompt):**

```bash
sudo mariadb
```

**As the application user:**

```bash
APP_PASS=$(sudo awk '/^Application password:/{print $NF}' /etc/mariadb/credentials.txt)
mariadb -u app -p"$APP_PASS" app
```

## Managing MariaDB

```bash
# Check service status
systemctl status mariadb

# Restart
sudo systemctl restart mariadb

# View logs
sudo journalctl -u mariadb -f
```

Configuration directory: `/etc/mysql/mariadb.conf.d/`

To allow remote connections, edit `/etc/mysql/mariadb.conf.d/50-server.cnf` and change
`bind-address` from `127.0.0.1` to `0.0.0.0`, then restart MariaDB. Open the firewall for specific
IPs only (see [Security](#security)).

## Security

Port 3306 is **not** open externally by default. UFW is enabled and allows SSH (port 22) only.

**To allow access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 3306
```

**To connect without opening the firewall (recommended), use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 3306:localhost:3306 ubuntu@<your-vm-ip>

# Then connect locally
mariadb -u app -p"<app-password>" app
```

:::caution

Avoid exposing port 3306 to `0.0.0.0`. Restrict access to known IPs or use an SSH tunnel.

:::

## Next steps

- [MariaDB documentation](https://mariadb.com/kb/en/)
- [MariaDB security hardening guide](https://mariadb.com/kb/en/securing-mariadb/)
