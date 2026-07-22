---
title: Directus
---

Directus is an open-source headless CMS and data platform that wraps any SQL database with a REST
and GraphQL API plus a no-code admin app. You point it at a database and instantly get content
management, asset storage, and granular access control. The official Docker image is the recommended
way to self-host it.

## Software included

| Component               | Version   |
| ----------------------- | --------- |
| Directus                | 12.1.1    |
| PostgreSQL with PostGIS | 16 / 3.5  |
| Ubuntu                  | 24.04 LTS |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable         | Description                  |
| ---------------- | ---------------------------- |
| `ADMIN_EMAIL`    | Directus admin email address |
| `ADMIN_PASSWORD` | Directus admin password      |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates unique application and database secrets, starts
PostgreSQL/PostGIS and Directus, and creates the administrator account. Track progress:

```bash
journalctl -u directus-first-boot.service -f
```

The login message (MOTD) confirms when Directus is ready.

### 3. Verify Directus is running

```bash
cd /opt/directus
docker compose ps
curl -fsS http://127.0.0.1:8055/server/ping
```

### 4. Access the Directus UI

Open a browser and navigate to:

```text
http://<your-vm-ip>:8055
```

Retrieve the administrator credentials:

```bash
sudo cat /etc/directus/credentials.txt
```

| Field    | Value                                |
| -------- | ------------------------------------ |
| Email    | From `/etc/directus/credentials.txt` |
| Password | From `/etc/directus/credentials.txt` |

## Managing Directus

```bash
# Check container status
cd /opt/directus && docker compose ps

# Restart
cd /opt/directus && docker compose restart

# View logs
cd /opt/directus && docker compose logs -f
```

| Path                               | Purpose                           |
| ---------------------------------- | --------------------------------- |
| `/opt/directus/docker-compose.yml` | Docker Compose configuration      |
| `/opt/directus/.env`               | Application and database settings |
| `/var/lib/directus/database/`      | PostgreSQL/PostGIS data           |
| `/var/lib/directus/uploads/`       | Uploaded files                    |
| `/var/lib/directus/extensions/`    | Directus extensions               |

## Security

Port 8055 is accessible on the VM's network interface. UFW is enabled and allows SSH (port 22) and
Directus (port 8055) by default.

**To restrict the UI and API to a specific IP:**

```bash
sudo ufw delete allow 8055/tcp
sudo ufw allow from <trusted-ip> to any port 8055
```

**To access Directus without exposing port 8055, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8055:localhost:8055 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8055
```

**For production use**, place Directus behind a reverse proxy so you can serve it on port 443 with a
TLS certificate, and update the public URL in Directus to the HTTPS URL.

:::caution

Keep `/opt/directus/.env` and `/etc/directus/credentials.txt` restricted to administrators. Both
files contain passwords and application secrets.

:::

## Next steps

- [Directus documentation](https://directus.io/docs)
- [Directus installation guide](https://directus.io/docs/self-hosted/docker-guide)
