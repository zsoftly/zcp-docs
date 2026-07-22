---
title: Mattermost
---

Mattermost is an open-source, self-hosted messaging and collaboration platform for teams. It
provides channels, direct messages, file sharing, search, and integrations as a private alternative
to hosted chat services, with your data staying on your own infrastructure. The server listens on
port 8065.

## Software included

| Component               | Version   |
| ----------------------- | --------- |
| Mattermost Team Edition | 11.8.3    |
| PostgreSQL              | 18 Alpine |
| Ubuntu                  | 24.04 LTS |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable                     | Description                    |
| ---------------------------- | ------------------------------ |
| `DOMAIN`                     | Public domain for Mattermost   |
| `POSTGRES_PASSWORD`          | PostgreSQL password            |
| `MM_SERVICESETTINGS_SITEURL` | Public site URL for Mattermost |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On first boot, Mattermost generates a database password and starts PostgreSQL, Mattermost, and Nginx
as a Docker Compose stack. Track progress with:

```bash
sudo journalctl -u mattermost-first-boot.service -f
```

Then verify the stack:

```bash
cd /opt/mattermost && docker compose ps
```

### 3. Access the Mattermost UI

If you set `DOMAIN` or `MM_SERVICESETTINGS_SITEURL` at deploy time, point a DNS record for that
hostname at the VM and open it over HTTPS through a reverse proxy that terminates TLS:

```text
https://<your-domain>
```

If you left those unset, reach the VM directly by IP:

```text
http://<your-vm-ip>
```

Complete the setup wizard to create your administrator account. The first account you create becomes
the System Administrator. The image does not create shared default login credentials.

## Managing Mattermost

Mattermost runs as a Docker Compose stack in `/opt/mattermost`.

```bash
# Check status
cd /opt/mattermost && docker compose ps

# Restart
cd /opt/mattermost && docker compose restart

# View logs
cd /opt/mattermost && docker compose logs -f
```

| Path                                      | Purpose                                  |
| ----------------------------------------- | ---------------------------------------- |
| `/opt/mattermost/docker-compose.yml`      | Compose stack                            |
| `/opt/mattermost/.env`                    | Database and Mattermost environment      |
| `/opt/mattermost/volumes/db/`             | PostgreSQL data                          |
| `/opt/mattermost/volumes/app/mattermost/` | Mattermost config, files, logs, and data |

## Security

Mattermost is exposed through Nginx on port 80. The application port 8065 stays inside the Docker
network. UFW is enabled and allows HTTP (port 80) and SSH (port 22).

**To restrict the UI to a specific IP:**

```bash
sudo ufw delete allow 80/tcp
sudo ufw allow from <trusted-ip> to any port 80
```

**To access the UI without leaving port 80 open, use an SSH tunnel:**

First close the public port on the VM, since it is open by default:

```bash
sudo ufw delete allow 80/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8080
```

**For production use**, place Mattermost behind a reverse proxy with a trusted TLS certificate and
set its site URL to your public HTTPS domain.

:::caution

Create the first administrator promptly and restrict access to trusted users while you complete
setup. The first account created receives System Administrator privileges.

:::

## Next steps

- [Mattermost documentation](https://docs.mattermost.com/)
- [Mattermost installation guide](https://docs.mattermost.com/deployment-guide/server/deploy-containers.html)
