---
title: Uptime Kuma
---

Uptime Kuma is a self-hosted monitoring tool that tracks the availability of websites, APIs, TCP
ports, and more. It sends notifications when a service goes down and publishes public status pages.
It runs as a single Docker container and is administered entirely through a web UI on port 3001.

:::note[Coming soon]

A pre-built Uptime Kuma image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Uptime Kuma yourself.

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

## Install Uptime Kuma

Uptime Kuma is distributed as an official Docker image. Install Docker first using the official
convenience script:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Add the `ubuntu` user to the `docker` group so you can run Docker without `sudo`, then re-apply your
group membership:

```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

Start the Uptime Kuma container. It binds port 3001 and stores its data in a named volume so it
survives container restarts and updates:

```bash
docker run -d \
  --restart=unless-stopped \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  --name uptime-kuma \
  louislam/uptime-kuma:1
```

Confirm the container is running:

```bash
docker ps
```

## Configure Uptime Kuma

1. Open `http://<your-vm-ip>:3001` in a browser.
2. On the first-run screen, create your admin account (username and password). This account has full
   control of the instance.
3. Click **Add New Monitor** to start tracking a service. Pick a monitor type (HTTP(s), TCP Port,
   Ping, etc.), enter the target, and save.
4. Configure notifications under **Settings → Notifications** (email, Slack, Telegram, webhooks, and
   more).

To update later, pull the latest image and recreate the container. Your data persists in the volume:

```bash
docker pull louislam/uptime-kuma:1
docker stop uptime-kuma && docker rm uptime-kuma
docker run -d --restart=unless-stopped -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

For production, place Uptime Kuma behind a reverse proxy such as Nginx or Caddy to serve it on port
443 with a TLS certificate, and restrict direct access to port 3001.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port Uptime Kuma needs and
add it to the instance's network/security rules in the portal:

```bash
sudo ufw allow 3001/tcp
```

## Next steps

- [Uptime Kuma documentation](https://github.com/louislam/uptime-kuma/wiki)
- [Uptime Kuma installation guide](https://github.com/louislam/uptime-kuma/wiki/%F0%9F%94%A7-How-to-Install)
