---
title: Authentik
---

Authentik is an open-source identity provider that centralises authentication for your applications.
It supports SSO over OAuth 2.0, OpenID Connect, SAML, LDAP, and proxy/forward-auth, with flexible
flows, policies, and a self-service user portal. This guide deploys Authentik with its official
Docker Compose stack.

:::note[Coming soon]

A pre-built Authentik image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Authentik yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 2 GB    | 4 GB        |
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

## Install Authentik

Authentik ships an official Docker Compose stack, so install Docker Engine and the Compose plugin
first.

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

Create a directory for the deployment and download the official Compose file:

```bash
sudo mkdir -p /opt/authentik && cd /opt/authentik
sudo wget -O docker-compose.yml https://docs.goauthentik.io/compose.yml
```

Generate a PostgreSQL password and a secret key into a `.env` file:

```bash
echo "PG_PASS=$(openssl rand -base64 36 | tr -d '\n')" | sudo tee -a .env
echo "AUTHENTIK_SECRET_KEY=$(openssl rand -base64 60 | tr -d '\n')" | sudo tee -a .env
```

## Configure Authentik

Pull the images and start the stack:

```bash
sudo docker compose pull
sudo docker compose up -d
```

Authentik serves HTTP on port 9000 and HTTPS on port 9443 by default. Complete the first-run setup
by browsing to the initial-setup flow, which creates the default `akadmin` account and sets its
password:

```text
http://<your-vm-ip>:9000/if/flow/initial-setup/
```

For a production deployment, point a DNS record at the VM and front Authentik with TLS. You can use
the built-in HTTPS on port 9443, or place it behind a reverse proxy (Caddy, nginx, or Traefik) that
terminates TLS and forwards to port 9000.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the ports Authentik serves and
add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 9000/tcp
sudo ufw allow 9443/tcp
```

## Next steps

- [Authentik documentation](https://docs.goauthentik.io/)
- [Authentik installation guide](https://docs.goauthentik.io/install-config/install/docker-compose/)
