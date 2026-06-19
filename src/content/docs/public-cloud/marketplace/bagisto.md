---
title: Bagisto
---

Bagisto is an open-source e-commerce platform built on the Laravel PHP framework and Vue.js. It
ships a full storefront, multi-channel admin, inventory, and order management out of the box. The
official Docker setup bundles every dependency, so it is the fastest way to stand it up.

:::note[Coming soon]

A pre-built Bagisto image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Bagisto yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 25 GB   | 50 GB       |

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

## Install Bagisto

The official Docker setup is the recommended path: it provides PHP-FPM, Nginx, MySQL, and Redis as
containers, so you do not install PHP or a database on the host. Bagisto's own requirements target
PHP 8.2+ and MySQL 8.0 / MariaDB. The Docker images satisfy these automatically.

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

Log out and back in so the `docker` group applies, then clone the official Docker repository and run
the setup:

```bash
git clone https://github.com/bagisto/bagisto-docker.git
cd bagisto-docker
sh setup.sh
```

`setup.sh` builds the images and brings the stack up. If you prefer to run it manually:

```bash
docker compose build
docker compose up -d
```

## Configure Bagisto

The Docker stack provisions the database and installs Bagisto on first run. The application is
served on **port 80** by default. Edit `docker-compose.yml` to change the published port before
bringing the stack up.

Once the containers are healthy, open the admin panel:

```text
http://<your-vm-ip>/admin/login
```

Sign in with the default credentials and change them immediately:

- Email: `admin@example.com`
- Password: `admin123`

For production, point a domain at the VM and terminate TLS with nginx or a reverse proxy in front of
the stack. Application settings live in the `src/.env` file inside the project.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Bagisto needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Next steps

- [Bagisto documentation](https://devdocs.bagisto.com/)
- [Bagisto installation guide](https://github.com/bagisto/bagisto-docker)
