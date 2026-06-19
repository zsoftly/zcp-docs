---
title: Directus
---

Directus is an open-source headless CMS and data platform that wraps any SQL database with a REST
and GraphQL API plus a no-code admin app. You point it at a database and instantly get content
management, asset storage, and granular access control. The official Docker image is the recommended
way to self-host it.

:::note[Coming soon]

A pre-built Directus image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Directus yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps** and switch to the **Marketplace** tab. It opens on
   **Featured** by default, so select **Marketplace** next to it. Pick your region (YOW-1 or YUL-1),
   search for **Ubuntu 24.04 LTS**, and click **Deploy**. You can also create the instance from
   **Instances → Create**. Either way you get a clean Ubuntu 24.04 VM.

   ![The Marketplace tab in the ZSoftly Cloud portal, showing the region selector, category list, search box, and Deploy buttons](../../../../assets/marketplace/deploy-marketplace-tab.webp)

   ![Searching the Marketplace for an app, with the search box filtering the catalog down to a matching Deploy card](../../../../assets/marketplace/deploy-marketplace-search.webp)

2. Choose a plan that meets the requirements above.

3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Directus

The official Docker image (`directus/directus`) ships the application and all runtime dependencies.
Running it alongside a PostgreSQL container with Docker Compose is the recommended setup.

Install Docker Engine and the Compose plugin:

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker ubuntu
```

Log out and back in so the `docker` group applies. Create a project directory and a `compose.yml`
file:

```bash
mkdir ~/directus && cd ~/directus
```

```yaml
services:
  database:
    image: postgis/postgis:16-master
    volumes:
      - ./data/database:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: directus
      POSTGRES_PASSWORD: change-me
      POSTGRES_DB: directus
    healthcheck:
      test: ['CMD', 'pg_isready', '-U', 'directus']
      interval: 10s
      retries: 5

  directus:
    image: directus/directus:latest
    ports:
      - '8055:8055'
    volumes:
      - ./uploads:/directus/uploads
    depends_on:
      database:
        condition: service_healthy
    environment:
      SECRET: 'replace-with-a-long-random-string'
      DB_CLIENT: 'pg'
      DB_HOST: 'database'
      DB_PORT: '5432'
      DB_DATABASE: 'directus'
      DB_USER: 'directus'
      DB_PASSWORD: 'change-me'
      ADMIN_EMAIL: 'admin@example.com'
      ADMIN_PASSWORD: 'change-me-too'
      PUBLIC_URL: 'http://<your-vm-ip>:8055'
```

Start the stack:

```bash
docker compose up -d
```

## Configure Directus

On first boot Directus runs migrations against the PostgreSQL container and creates the admin
account from `ADMIN_EMAIL` / `ADMIN_PASSWORD`. The app listens on **port 8055**.

Open the admin app and sign in:

```text
http://<your-vm-ip>:8055
```

For production, pin the image to a specific version (for example `directus/directus:11`), set a
strong unique `SECRET`, set `PUBLIC_URL` to your domain, and place Directus behind nginx with TLS.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Directus needs and
add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8055/tcp
```

## Next steps

- [Directus documentation](https://directus.io/docs)
- [Directus installation guide](https://directus.io/docs/self-hosted/docker-guide)
