---
title: NocoDB
---

NocoDB is an open-source no-code database platform and an Airtable alternative. It turns any
database into a smart spreadsheet with grid, gallery, kanban, and form views, plus REST and GraphQL
APIs. You can run it with a single Docker command.

:::note[Coming soon]

A pre-built NocoDB image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install NocoDB yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 10 GB   | 20 GB       |

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

## Install NocoDB

Install Docker:

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Run NocoDB with a persistent data volume:

```bash
sudo docker run -d --name nocodb \
  --restart unless-stopped \
  -v "$(pwd)"/nocodb:/usr/app/data/ \
  -p 8080:8080 \
  nocodb/nocodb:latest
```

:::tip

For a production-grade stack with Postgres and Redis, the official quick-install script generates a
full Docker Compose deployment for you:

```bash
sudo curl -fsSL https://install.nocodb.com/noco.sh | sudo bash -s -- --quick
```

:::

## Configure NocoDB

Open `http://<your-vm-ip>:8080` in a browser. On first visit, NocoDB prompts you to create the
super-admin account (email and password). The single-container setup above stores its data in SQLite
under the mounted `./nocodb` volume.

For production, connect an external database with the `NC_DB` environment variable and place NocoDB
behind a reverse proxy (Nginx or Caddy) with a TLS certificate and a real domain name instead of
serving port 8080 directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) NocoDB needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8080/tcp
```

If you front NocoDB with a reverse proxy over HTTPS, open `80` and `443` instead and keep `8080`
internal.

## Next steps

- [NocoDB documentation](https://docs.nocodb.com/)
- [NocoDB installation guide](https://nocodb.com/docs/self-hosting/installation/quickstart)
