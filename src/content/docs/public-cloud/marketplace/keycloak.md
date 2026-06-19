---
title: Keycloak
---

Keycloak is an open-source identity and access management platform. It provides single sign-on
(SSO), user federation, social and identity-broker login, and fine-grained authorization through
standard protocols such as OpenID Connect, OAuth 2.0, and SAML. This guide runs the official
Keycloak container, with notes for both a quick development start and a production setup.

:::note[Coming soon]

A pre-built Keycloak image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Keycloak yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **Keycloak**, and click **Deploy**, or create
   an **Ubuntu 24.04 LTS** instance from **Instances → Create**. Both give you a clean Ubuntu 24.04
   VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Keycloak

Keycloak is distributed as an official Docker image from `quay.io`, so install Docker Engine first.

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

To try Keycloak quickly, start it in development mode. This bootstraps an initial admin user and
serves the console on port 8080:

```bash
sudo docker run -d --name keycloak --restart unless-stopped \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD='<choose-a-strong-password>' \
  quay.io/keycloak/keycloak:latest start-dev
```

Open `http://<your-vm-ip>:8080` and sign in to the admin console with the credentials above.

## Configure Keycloak

Development mode uses an in-memory database and insecure defaults, so it is not suitable for
production. For a production deployment, run Keycloak with the `start` command, an external
database, HTTPS on port 8443, and an explicit hostname.

The example below uses Docker Compose with PostgreSQL. Create `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: <db-password>
    volumes:
      - postgres_data:/var/lib/postgresql/data

  keycloak:
    image: quay.io/keycloak/keycloak:latest
    restart: unless-stopped
    command: start
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: <admin-password>
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: <db-password>
      KC_HOSTNAME: auth.example.com
      KC_PROXY_HEADERS: xforwarded
      KC_HTTP_ENABLED: 'true'
    ports:
      - '8080:8080'
    depends_on:
      - postgres

volumes:
  postgres_data:
```

Start the stack:

```bash
sudo docker compose up -d
```

Point `auth.example.com` at the VM and place Keycloak behind a reverse proxy (Caddy, nginx, or
Traefik) that terminates TLS on 443 and forwards to host port 8080.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port Keycloak serves and add
it to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8080/tcp
```

If you front Keycloak with a reverse proxy, open 443 instead and keep 8080 internal.

## Next steps

- [Keycloak documentation](https://www.keycloak.org/documentation)
- [Keycloak installation guide](https://www.keycloak.org/getting-started/getting-started-docker)
