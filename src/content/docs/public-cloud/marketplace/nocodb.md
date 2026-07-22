---
title: NocoDB
---

NocoDB is an open-source no-code database platform and an Airtable alternative. It turns any
database into a smart spreadsheet with grid, gallery, kanban, and form views, plus REST and GraphQL
APIs. You can run it with a single Docker command.

## Software included

| Component | Version   |
| --------- | --------- |
| NocoDB    | 2026.07.0 |
| Ubuntu    | 24.04 LTS |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable            | Description                |
| ------------------- | -------------------------- |
| `NC_ADMIN_EMAIL`    | NocoDB admin email address |
| `NC_ADMIN_PASSWORD` | NocoDB admin password      |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

NocoDB starts automatically from its pre-installed Docker image and persists data under
`/var/lib/nocodb`. Track progress with:

```bash
sudo journalctl -u nocodb-first-boot.service -f
```

Then verify the container:

```bash
cd /opt/nocodb && docker compose ps
```

### 3. Create the first super-admin account

NocoDB is bound to localhost because the first setup screen is unauthenticated. From your local
machine, open an SSH tunnel:

```bash
ssh -L 8080:127.0.0.1:8080 ubuntu@<your-vm-ip>
```

Then open:

```text
http://127.0.0.1:8080
```

Create the first super-admin account in the browser. The image does not create shared default login
credentials.

## Managing NocoDB

NocoDB runs as a Docker Compose service in `/opt/nocodb`.

```bash
# Check status
cd /opt/nocodb && docker compose ps

# Restart
cd /opt/nocodb && docker compose restart

# View logs
cd /opt/nocodb && docker compose logs -f
```

| Path                             | Purpose                    |
| -------------------------------- | -------------------------- |
| `/opt/nocodb/docker-compose.yml` | Compose stack              |
| `/var/lib/nocodb/`               | Persistent SQLite app data |
| `/etc/nocodb/info.txt`           | First-boot notes           |

## Security

NocoDB listens on `127.0.0.1:8080`, not on the VM's public network interface. UFW is enabled and
allows SSH (port 22) only. This protects the unauthenticated first super-admin setup screen.

Use the SSH tunnel from the getting-started steps to complete setup. To allow access from a trusted
IP after setup, first change the port mapping in `/opt/nocodb/docker-compose.yml` from
`127.0.0.1:8080:8080` to `8080:8080`, restart the stack, and add a restricted UFW rule:

```bash
cd /opt/nocodb && docker compose up -d
sudo ufw allow from <trusted-ip> to any port 8080
```

**For production use**, keep NocoDB behind a reverse proxy with a trusted TLS certificate instead of
exposing port 8080 directly.

:::caution

Do not expose port 8080 until you have created the first super-admin account. The initial setup
screen does not require authentication.

:::

## Next steps

- [NocoDB documentation](https://docs.nocodb.com/)
- [NocoDB installation guide](https://nocodb.com/docs/self-hosting/installation/quickstart)
