---
title: Vaultwarden
---

Vaultwarden is a lightweight, self-hosted password manager that implements the Bitwarden API. It is
fully compatible with official Bitwarden client apps and browser extensions, letting you store and
sync passwords, secure notes, and other secrets on infrastructure you control.

:::note[Coming soon]

A pre-built Vaultwarden image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Vaultwarden yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 10 GB   | 20 GB       |

Vaultwarden is resource-light. A domain name and TLS certificate are strongly recommended, since
Bitwarden clients require HTTPS to connect.

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

## Install Vaultwarden

Vaultwarden is distributed as an official Docker image, so install Docker Engine and the Compose
plugin first.

Set up Docker's official APT repository for Ubuntu 24.04 LTS (`noble`):

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

Install Docker Engine and the Compose plugin:

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Generate an `ADMIN_TOKEN` for the admin page. The `hash` command outputs an Argon2 PHC string. Copy
the full value, including the leading `$argon2id$`:

```bash
docker run --rm -it vaultwarden/server /vaultwarden hash
```

Run Vaultwarden, persisting data to the host and mapping the container's internal port 80 to host
port 8080:

```bash
docker run -d --name vaultwarden --restart unless-stopped \
  -e ADMIN_TOKEN='<paste-the-argon2-hash-here>' \
  -e DOMAIN='https://vault.example.com' \
  -v /opt/vaultwarden/data:/data \
  -p 8080:80 \
  vaultwarden/server:latest
```

## Configure Vaultwarden

:::caution

Bitwarden client apps refuse to connect over plain HTTP. Do not expose Vaultwarden directly. Always
place it behind a reverse proxy (Caddy, nginx, or Traefik) that terminates TLS and forwards to host
port 8080.

:::

A minimal Caddy reverse proxy gives you automatic HTTPS. Point your domain's DNS at the VM, then:

```bash
sudo apt install -y caddy
echo 'vault.example.com {
  reverse_proxy 127.0.0.1:8080
}' | sudo tee /etc/caddy/Caddyfile
sudo systemctl restart caddy
```

Set `DOMAIN` in the `docker run` command above to your real `https://` URL so vault item icons,
attachments, and WebAuthn work correctly. Once TLS is live, reach the admin page at
`https://vault.example.com/admin` and sign in with the password you hashed into `ADMIN_TOKEN`. Treat
that token like a root password.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the HTTPS port your reverse proxy
serves and add it to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Next steps

- [Vaultwarden documentation](https://github.com/dani-garcia/vaultwarden/wiki)
- [Vaultwarden installation guide](https://github.com/dani-garcia/vaultwarden/wiki/Starting-with-Docker)
