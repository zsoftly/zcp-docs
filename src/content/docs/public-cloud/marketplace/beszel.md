---
title: Beszel
---

Beszel is a lightweight server monitoring platform with historical data, Docker statistics, and
configurable alerts. It has two parts: a **hub** that serves the web dashboard on port 8090, and an
**agent** that runs on each monitored machine and reports system metrics to the hub. This guide
installs the hub on this VM and adds an agent to monitor the same machine.

:::note[Coming soon]

A pre-built Beszel image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Beszel yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 512 MB  | 1 GB        |
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

## Install Beszel

The hub runs as an official Docker container. Install Docker first using the official convenience
script:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Add the `ubuntu` user to the `docker` group, then re-apply your group membership:

```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

Start the Beszel hub. It binds port 8090 and persists its data in a named volume:

```bash
docker run -d \
  --restart=unless-stopped \
  -p 8090:8090 \
  -v beszel_data:/beszel_data \
  --name beszel \
  henrygd/beszel:latest
```

Confirm the container is running:

```bash
docker ps
```

## Configure Beszel

1. Open `http://<your-vm-ip>:8090` in a browser and create your admin account on the first-run
   screen.
2. Click **Add System**. Enter a name and the host the agent will run on (use `localhost` to monitor
   this same VM). Beszel generates a **public key** and a **token**. Keep them; the agent needs
   them.

### Add the agent

To monitor this VM, install the Beszel agent on it. The official installer registers the agent as a
systemd service and listens on port 45876:

```bash
curl -sL https://get.beszel.dev -o /tmp/install-agent.sh && chmod +x /tmp/install-agent.sh && sudo /tmp/install-agent.sh
```

When prompted, paste the **public key** and **token** shown by the hub when you added the system.
The agent then connects to the hub and the dashboard begins showing metrics within a minute.

To monitor additional servers, run the same agent installer on each one and add it as a new system
in the hub, opening port 45876 between the hub and that server.

For production, place the hub behind a reverse proxy such as Nginx or Caddy to serve it on port 443
with a TLS certificate, and set `APP_URL` to your public URL.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the hub port (and the agent port
only if remote servers must reach this agent) and add them to the instance's network/security rules
in the portal:

```bash
sudo ufw allow 8090/tcp
```

## Next steps

- [Beszel documentation](https://beszel.dev/guide/getting-started)
- [Beszel hub installation guide](https://beszel.dev/guide/hub-installation)
