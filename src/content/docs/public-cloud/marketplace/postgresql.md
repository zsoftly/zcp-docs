---
title: PostgreSQL 17
---

PostgreSQL is an open-source object-relational database known for its reliability, standards
compliance, and extensibility. It supports advanced data types, full-text search, JSON, and a wide
range of extensions.

## Software included

| Component  | Version   |
| ---------- | --------- |
| PostgreSQL | 17.x      |
| Ubuntu     | 24.04 LTS |

## Environment variables

You can optionally set these when deploying PostgreSQL from the marketplace. Leave any field blank
to have a secure random value generated automatically.

| Variable            | Description                                |
| ------------------- | ------------------------------------------ |
| `POSTGRES_PASSWORD` | Password for the postgres superuser        |
| `POSTGRES_DB`       | Name of the application database to create |
| `POSTGRES_USER`     | Application database username              |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script runs automatically. It generates a random password for the
`postgres` superuser and saves it to `/etc/postgresql/postgres-password.txt`. This takes under 30
seconds.

Track progress:

```bash
journalctl -u postgresql-first-boot.service -f
```

### 3. Retrieve credentials

```bash
sudo cat /etc/postgresql/postgres-password.txt
```

This file contains the postgres superuser password. It is only readable by root.

### 4. Connect to PostgreSQL

```bash
PG_PASS=$(sudo cat /etc/postgresql/postgres-password.txt)
psql -U postgres -h 127.0.0.1 -p 5432 -W
```

Enter the password from the credentials file when prompted.

To avoid the password prompt, set the `PGPASSWORD` environment variable:

```bash
PGPASSWORD="$PG_PASS" psql -U postgres -h 127.0.0.1
```

## Managing PostgreSQL

```bash
# Check service status
systemctl status postgresql

# Restart
sudo systemctl restart postgresql

# View logs
sudo journalctl -u postgresql -f
```

Configuration directory: `/etc/postgresql/17/main/`

Key files:

- `postgresql.conf`: server settings
- `pg_hba.conf`: client authentication rules

To allow remote connections, set `listen_addresses = '*'` in `postgresql.conf` and add an entry in
`pg_hba.conf`. Restart PostgreSQL and open the firewall for specific IPs only (see
[Security](#security)).

## Security

Port 5432 is **not** open externally by default. UFW is enabled and allows SSH (port 22) only.

**To allow access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 5432
```

**To connect without opening the firewall (recommended), use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 5432:localhost:5432 ubuntu@<your-vm-ip>

# Then connect locally
psql -U postgres -h 127.0.0.1
```

:::caution

Avoid exposing port 5432 to `0.0.0.0`. Restrict access to known IPs or use an SSH tunnel.

:::

## Next steps

- [PostgreSQL 17 documentation](https://www.postgresql.org/docs/17/)
- [PostgreSQL security guide](https://www.postgresql.org/docs/current/security.html)
