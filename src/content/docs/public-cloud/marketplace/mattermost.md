---
title: Mattermost
---

Mattermost is an open-source, self-hosted messaging and collaboration platform for teams. It
provides channels, direct messages, file sharing, search, and integrations as a private alternative
to hosted chat services, with your data staying on your own infrastructure. The server listens on
port 8065.

:::note[Coming soon]

A pre-built Mattermost image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Mattermost yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 50 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **Mattermost**, and click **Deploy**, or
   create an **Ubuntu 24.04 LTS** instance from **Instances → Create**. Both give you a clean Ubuntu
   24.04 VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Mattermost

Install Docker Engine and the Docker Compose plugin from Docker's official repository:

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Add the `ubuntu` user to the `docker` group so you can run Docker without `sudo`, then reconnect:

```bash
sudo usermod -aG docker ubuntu
exit
```

Reconnect over SSH, create a project directory, and add a `compose.yaml`. This stack, based on the
official `mattermost-docker` project, runs Mattermost Team Edition against a PostgreSQL 17 database:

```bash
mkdir ~/mattermost && cd ~/mattermost
```

```yaml
services:
  postgres:
    image: postgres:17
    restart: unless-stopped
    environment:
      - TZ=${TZ}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres-data:/var/lib/postgresql/data

  mattermost:
    image: mattermost/mattermost-team-edition:10.6.1
    restart: unless-stopped
    depends_on:
      - postgres
    environment:
      - TZ=${TZ}
      - MM_SQLSETTINGS_DRIVERNAME=postgres
      - MM_SQLSETTINGS_DATASOURCE=${MM_SQLSETTINGS_DATASOURCE}
      - MM_SERVICESETTINGS_SITEURL=${MM_SERVICESETTINGS_SITEURL}
    ports:
      - '${APP_PORT}:8065'
    volumes:
      - mattermost-data:/mattermost/data
      - mattermost-logs:/mattermost/logs
      - mattermost-config:/mattermost/config
      - mattermost-plugins:/mattermost/plugins
      - mattermost-client-plugins:/mattermost/client/plugins

volumes:
  postgres-data:
  mattermost-data:
  mattermost-logs:
  mattermost-config:
  mattermost-plugins:
  mattermost-client-plugins:
```

Create a `.env` file in the same directory. Replace the domain and passwords with your own values:

```bash
cat > .env <<'EOF'
DOMAIN=mattermost.example.com
TZ=America/Toronto
POSTGRES_USER=mmuser
POSTGRES_PASSWORD=change-me-to-a-strong-password
POSTGRES_DB=mattermost
APP_PORT=8065
MM_SQLSETTINGS_DRIVERNAME=postgres
MM_SQLSETTINGS_DATASOURCE=postgres://mmuser:change-me-to-a-strong-password@postgres:5432/mattermost?sslmode=disable&connect_timeout=10
MM_SERVICESETTINGS_SITEURL=https://mattermost.example.com
EOF
```

Make sure the `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` values match the credentials
embedded in `MM_SQLSETTINGS_DATASOURCE`. Start the stack:

```bash
docker compose up -d
```

## Configure Mattermost

Open `http://<your-vm-ip>:8065` in a browser. The first account you create becomes the system
administrator. From there, create your first team and invite members. For a production setup, put
Mattermost behind a reverse proxy such as nginx with a TLS certificate, set
`MM_SERVICESETTINGS_SITEURL` to your public `https://` domain, and serve the UI over HTTPS instead
of exposing port 8065 directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Mattermost needs and
add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8065/tcp
```

## Next steps

- [Mattermost documentation](https://docs.mattermost.com/)
- [Mattermost installation guide](https://docs.mattermost.com/deployment-guide/server/deploy-containers.html)
