---
title: ClickHouse
---

ClickHouse is an open-source, column-oriented database management system built for online analytical
processing (OLAP). It ingests and queries large volumes of data with very low latency, which makes
it a strong fit for real-time analytics, dashboards, observability, and log storage. The HTTP
interface runs on port 8123 and the native protocol on port 9000.

:::note[Coming soon]

A pre-built ClickHouse image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install ClickHouse yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 80 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **ClickHouse**, and click **Deploy**, or
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

## Install ClickHouse

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

Reconnect over SSH, create a project directory, and add a `compose.yaml`:

```bash
mkdir ~/clickhouse && cd ~/clickhouse
```

```yaml
services:
  clickhouse:
    image: clickhouse/clickhouse-server:latest
    restart: unless-stopped
    environment:
      - CLICKHOUSE_USER=${CLICKHOUSE_USER}
      - CLICKHOUSE_PASSWORD=${CLICKHOUSE_PASSWORD}
    volumes:
      - clickhouse-data:/var/lib/clickhouse
      - clickhouse-logs:/var/log/clickhouse-server
volumes:
  clickhouse-data:
  clickhouse-logs:
```

Create a `.env` file in the same directory with your admin user and password:

```bash
cat > .env <<'EOF'
CLICKHOUSE_USER=admin
CLICKHOUSE_PASSWORD=change-me-to-a-strong-password
EOF
```

Start the stack:

```bash
docker compose up -d
```

## Configure ClickHouse

The user and password from `.env` are created on first start. Verify the server is responding over
the HTTP interface:

```bash
curl http://localhost:8123/ping
```

Open an interactive SQL session with the bundled client:

```bash
docker compose exec clickhouse clickhouse-client --user admin --password
```

The HTTP interface listens on port 8123 and the native protocol on port 9000. For a production
setup, put ClickHouse behind a reverse proxy such as nginx with a TLS certificate and serve queries
over an encrypted connection instead of exposing the ports directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) ClickHouse needs and
add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8123/tcp
sudo ufw allow 9000/tcp
```

## Next steps

- [ClickHouse documentation](https://clickhouse.com/docs)
- [ClickHouse installation guide](https://clickhouse.com/docs/install/docker)
