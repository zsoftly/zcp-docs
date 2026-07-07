---
title: Wiki.js
---

Wiki.js is a modern, open-source wiki and documentation platform. It offers a rich Markdown editor,
fine-grained access control, full-text search, and authentication integrations, all backed by a
relational database. It is a strong fit for internal knowledge bases, product documentation, and
team wikis. The web interface runs on port 3000.

:::note[Coming soon]

A pre-built Wiki.js image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Wiki.js yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 20 GB   | 40 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps** and switch to the **Marketplace** tab, search for
   **Ubuntu 24.04 LTS**, and click **Deploy**. You can also create the instance from **Instances →
   Create**. Either way you get a clean Ubuntu 24.04 VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Wiki.js

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

Reconnect over SSH, create a project directory, and add a `compose.yaml`. Wiki.js does not ship with
a database, so this stack pairs it with PostgreSQL 14:

```bash
mkdir ~/wikijs && cd ~/wikijs
```

```yaml
services:
  db:
    image: postgres:14
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASS}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - db-data:/var/lib/postgresql/data

  wiki:
    image: ghcr.io/requarks/wiki:2.5
    restart: unless-stopped
    depends_on:
      - db
    environment:
      - DB_TYPE=postgres
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
      - DB_NAME=${DB_NAME}
    ports:
      - '3000:3000'

volumes:
  db-data:
```

Create a `.env` file in the same directory with the database credentials shared by both services:

```bash
cat > .env <<'EOF'
DB_USER=wikijs
DB_PASS=change-me-to-a-strong-password
DB_NAME=wiki
EOF
```

Start the stack:

```bash
docker compose up -d
```

## Configure Wiki.js

Open `http://<your-vm-ip>:3000` in a browser. The first run shows a setup wizard where you create
the administrator account and set the site URL. After that you can configure authentication,
storage, and content. For a production setup, put Wiki.js behind a reverse proxy such as nginx with
a TLS certificate and serve the UI over HTTPS instead of exposing port 3000 directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Wiki.js needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 3000/tcp
```

## Next steps

- [Wiki.js documentation](https://docs.requarks.io/)
- [Wiki.js installation guide](https://docs.requarks.io/install/docker)
