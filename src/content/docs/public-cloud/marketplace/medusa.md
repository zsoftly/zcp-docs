---
title: Medusa
---

Medusa is an open-source headless commerce platform built on Node.js. It provides a modular backend
with a built-in admin dashboard and REST/Store APIs that power custom storefronts. You own the data
and the code, and extend it with TypeScript modules.

## Software included

| Component  | Version   |
| ---------- | --------- |
| Medusa     | 2.17.2    |
| Node.js    | 22        |
| PostgreSQL | 17 Alpine |
| Redis      | 7 Alpine  |
| Ubuntu     | 24.04 LTS |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

Medusa generates secrets, starts PostgreSQL and Redis, runs database migrations, creates the admin
user, and starts the Medusa service. This takes about three to five minutes. Track progress with:

```bash
sudo journalctl -u medusa-first-boot.service -f
```

Then verify the service:

```bash
systemctl status medusa.service
```

### 3. Access the Medusa admin dashboard

Open a browser and navigate to:

```text
http://<your-vm-ip>/app
```

Read the generated login details:

```bash
sudo cat /root/.credentials/medusa.txt
```

| Field    | Value                                  |
| -------- | -------------------------------------- |
| Email    | `admin@example.com`, unless overridden |
| Password | From `/root/.credentials/medusa.txt`   |

The Storefront API is available at `http://<your-vm-ip>`.

## Managing Medusa

```bash
# Check service status
systemctl status medusa.service

# Restart Medusa
sudo systemctl restart medusa.service

# View Medusa logs
sudo journalctl -u medusa.service -f

# Check the PostgreSQL, Redis, and Nginx containers
cd /opt/medusa && docker compose ps
```

| Path                                 | Purpose                                  |
| ------------------------------------ | ---------------------------------------- |
| `/opt/medusa/store/medusa-config.ts` | Medusa application configuration         |
| `/opt/medusa/store/.env`             | Generated environment and secrets        |
| `/opt/medusa/docker-compose.yml`     | PostgreSQL, Redis, and Nginx stack       |
| `/opt/medusa/volumes/db/`            | PostgreSQL data                          |
| `/opt/medusa/volumes/redis/`         | Redis data                               |
| `/root/.credentials/medusa.txt`      | Generated admin and database credentials |

## Security

Medusa is exposed through Nginx on port 80. Its application port 9000 is allowed only from Docker
bridge networks. UFW is enabled and allows HTTP (port 80) and SSH (port 22).

**To restrict the UI and APIs to a specific IP:**

```bash
sudo ufw delete allow 80/tcp
sudo ufw allow from <trusted-ip> to any port 80
```

**To access Medusa without leaving port 80 open, use an SSH tunnel:**

First close the public port on the VM, since it is open by default:

```bash
sudo ufw delete allow 80/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8080/app
```

**For production use**, place Medusa behind a reverse proxy with a trusted TLS certificate and
update the public hostname so the admin and API CORS settings use the correct origin.

:::caution

Treat `/root/.credentials/medusa.txt` as sensitive. Change the initial admin password and restrict
the admin dashboard to trusted users.

:::

## Next steps

- [Medusa documentation](https://docs.medusajs.com/)
- [Medusa installation guide](https://docs.medusajs.com/learn/installation)
