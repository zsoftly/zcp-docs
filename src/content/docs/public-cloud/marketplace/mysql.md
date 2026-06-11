---
title: MySQL 8.4
---

MySQL is one of the most widely deployed open-source relational databases in the world. This image
ships MySQL 8.4 LTS, a long-term support release intended for production workloads.

## Software included

| Component    | Version     |
| ------------ | ----------- |
| MySQL Server | 8.4.x (LTS) |
| Ubuntu       | 24.04 LTS   |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script runs automatically. It generates a random root password and saves
it to `/etc/mysql/mysql-root-password.txt`. This takes under 30 seconds.

Track progress:

```bash
journalctl -u mysql-first-boot.service -f
```

### 3. Retrieve credentials

```bash
sudo cat /etc/mysql/mysql-root-password.txt
```

This file contains the root password. It is only readable by root.

### 4. Connect to MySQL

```bash
ROOT_PASS=$(sudo cat /etc/mysql/mysql-root-password.txt)
mysql -u root -p"$ROOT_PASS"
```

## Managing MySQL

```bash
# Check service status
systemctl status mysql

# Restart
sudo systemctl restart mysql

# View logs
sudo journalctl -u mysql -f
```

Configuration directory: `/etc/mysql/mysql.conf.d/`

To allow remote connections, edit `/etc/mysql/mysql.conf.d/mysqld.cnf` and change `bind-address`
from `127.0.0.1` to `0.0.0.0`, then restart MySQL. Open the firewall for specific IPs only (see
[Security](#security)).

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
mysql -u root -p"<root-password>"
```

:::caution

Avoid exposing port 3306 to `0.0.0.0`. Restrict access to known IPs or use an SSH tunnel.

:::

## Next steps

- [MySQL 8.4 documentation](https://dev.mysql.com/doc/refman/8.4/en/)
- [MySQL security guide](https://dev.mysql.com/doc/refman/8.4/en/security.html)
