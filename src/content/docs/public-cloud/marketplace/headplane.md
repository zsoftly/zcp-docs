---
title: Headplane
---

Headplane is a feature-complete web UI for [Headscale](https://headscale.net), the open-source,
self-hosted implementation of the Tailscale control server. It lets you manage nodes, pre-auth keys,
ACLs, and DNS from a browser instead of the Headscale CLI. Headplane does not replace Headscale. It
manages a running Headscale server, so you deploy both together on this instance.

:::note[Coming soon]

A pre-built Headplane image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Headplane yourself.

:::

:::tip[Headscale is the server, not the client]

The ZCP Tailscale marketplace app installs the Tailscale **client** that joins an existing tailnet.
Headscale is the self-hosted **control server** that a client connects to, and Headplane is its
admin UI. Run Headscale + Headplane here, then point your Tailscale clients at this server's URL.

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

## Install Headplane

Headplane and Headscale are distributed as Docker images and run together via Docker Compose.
Install Docker first:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
```

Log out and back in so your user picks up the `docker` group, then create a working directory:

```bash
mkdir -p ~/headplane && cd ~/headplane
mkdir -p config data
```

Create `~/headplane/compose.yaml`:

```yaml
services:
  headscale:
    image: headscale/headscale:0.26.0
    container_name: headscale
    restart: unless-stopped
    command: serve
    ports:
      - '8080:8080'
    volumes:
      - './config/headscale.yaml:/etc/headscale/config.yaml'
      - './data/headscale:/var/lib/headscale'
    labels:
      me.tale.headplane.target: headscale

  headplane:
    image: ghcr.io/tale/headplane:latest
    container_name: headplane
    restart: unless-stopped
    ports:
      - '3000:3000'
    volumes:
      - './config/headplane.yaml:/etc/headplane/config.yaml'
      - './config/headscale.yaml:/etc/headscale/config.yaml'
      - './data/headplane:/var/lib/headplane'
      - '/var/run/docker.sock:/var/run/docker.sock:ro'
```

Download a Headscale config to `config/headscale.yaml` and set `server_url` to your public URL (for
example `https://hs.example.com`). Then create `config/headplane.yaml` with the Headscale
integration and a cookie secret:

```yaml
server:
  host: '0.0.0.0'
  port: 3000
  cookie_secret: '<32-character-random-string>'
  cookie_secure: false

headscale:
  url: 'http://headscale:8080'
  config_path: '/etc/headscale/config.yaml'
  config_strict: true

integration:
  docker:
    enabled: true
    container_name: 'headscale'
    socket: 'unix:///var/run/docker.sock'
```

Generate a cookie secret with `openssl rand -hex 16` and paste it into `cookie_secret`. Start the
stack:

```bash
docker compose up -d
```

## Configure Headplane

1. Open Headplane in your browser at `http://<your-vm-ip>:3000`.
2. Headplane authenticates to Headscale with an API key. Generate one inside the Headscale container
   and use it (or paste it into the UI when prompted):

   ```bash
   docker exec headscale headscale apikeys create
   ```

3. For single sign-on, add an `oidc` block to `config/headplane.yaml` with your provider's `issuer`,
   `client_id`, and `client_secret`, then restart with `docker compose restart headplane`.
4. Put a reverse proxy (Caddy, Nginx, or Traefik) in front to terminate TLS and serve both the
   Headscale `server_url` and the Headplane UI over HTTPS. Set `cookie_secure: true` once HTTPS is
   in place. TLS is required for production tailnets.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the ports Headplane and Headscale
need and add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 3000/tcp
sudo ufw allow 8080/tcp
```

Port 3000 serves the Headplane UI and 8080 is the Headscale control server. If you front them with a
reverse proxy, expose 80/443 instead and keep these internal.

## Next steps

- [Headplane documentation](https://headplane.net)
- [Headplane installation guide](https://github.com/tale/headplane)
