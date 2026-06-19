---
title: Gatus
---

Gatus is an automated, developer-oriented health dashboard and status page with built-in alerting
and incident support. It monitors HTTP, TCP, DNS, ICMP, and other endpoints against conditions you
define, and publishes the results on a clean status page served on port 8080. It is configured
entirely through a single `config.yaml` file.

:::note[Coming soon]

A pre-built Gatus image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Gatus yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 1           |
| RAM      | 256 MB  | 512 MB      |
| Storage  | 5 GB    | 10 GB       |

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

## Install Gatus

Gatus is distributed as an official Docker image. Install Docker first using the official
convenience script:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Add the `ubuntu` user to the `docker` group, then re-apply your group membership:

```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

Create a configuration file. The minimal config below monitors one website and exposes the dashboard
on port 8080:

```bash
mkdir -p ~/gatus
cat > ~/gatus/config.yaml <<'EOF'
web:
  port: 8080

endpoints:
  - name: example-website
    url: https://example.com
    interval: 30s
    conditions:
      - "[STATUS] == 200"
      - "[RESPONSE_TIME] < 300"
EOF
```

Start the Gatus container, mounting the config file and binding port 8080:

```bash
docker run -d \
  --restart=unless-stopped \
  -p 8080:8080 \
  --mount type=bind,source="$HOME/gatus/config.yaml",target=/config/config.yaml \
  --name gatus \
  ghcr.io/twin/gatus:stable
```

Confirm the container is running:

```bash
docker ps
```

## Configure Gatus

1. Open `http://<your-vm-ip>:8080` in a browser to see the status page.
2. Edit `~/gatus/config.yaml` to add endpoints, conditions, alerting providers (Slack, email,
   PagerDuty, webhooks, and more), and group settings. See the configuration reference for all
   available keys.
3. Apply changes by restarting the container:

```bash
docker restart gatus
```

For production, place Gatus behind a reverse proxy such as Nginx or Caddy to serve it on port 443
with a TLS certificate, and restrict direct access to port 8080.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port Gatus needs and add it
to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8080/tcp
```

## Next steps

- [Gatus documentation](https://github.com/TwiN/gatus)
- [Gatus configuration guide](https://github.com/TwiN/gatus#configuration)
