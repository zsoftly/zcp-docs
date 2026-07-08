---
title: Authentik
---

Authentik is an open-source identity provider that centralises authentication for your applications.
It supports SSO over OAuth 2.0, OpenID Connect, SAML, LDAP, and proxy/forward-auth, with flexible
flows, policies, and a self-service user portal.

## Software included

| Component  | Version       |
| ---------- | ------------- |
| Authentik  | 2025.6.3      |
| PostgreSQL | 16            |
| Redis      | Alpine        |
| Docker     | Latest stable |
| Ubuntu     | 24.04 LTS     |

Authentik runs its server and worker containers with PostgreSQL and Redis, as a Docker Compose
stack.

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

## Environment variables

You can optionally set these when deploying Authentik from the marketplace. Leave a password field
blank to have a secure random value generated automatically.

| Variable                       | Description                                    |
| ------------------------------ | ---------------------------------------------- |
| `AUTHENTIK_HOSTNAME`           | Public hostname or IP Authentik is served from |
| `AUTHENTIK_BOOTSTRAP_EMAIL`    | Email for the initial `akadmin` account        |
| `AUTHENTIK_BOOTSTRAP_PASSWORD` | Password for the initial `akadmin` account     |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates the admin, database, and secret-key values, writes the
environment file, and starts the stack with Docker Compose. This takes 1-2 minutes. Track progress:

```bash
journalctl -u authentik-first-boot.service -f
```

The login message (MOTD) confirms when Authentik is ready and prints the admin credentials.

### 3. Retrieve the admin credentials

The credentials are also written to a root-only file:

```bash
sudo cat /etc/authentik/credentials.txt
```

### 4. Access the admin interface

Open a browser and navigate to:

```text
http://<your-vm-ip>:9000
```

Sign in with the `akadmin` email and the generated password. HTTPS is also available on port 9443
with a self-signed certificate.

## Managing Authentik

Authentik runs as a Docker Compose stack in `/opt/authentik`.

```bash
# Check status
cd /opt/authentik && docker compose ps

# Restart
cd /opt/authentik && docker compose restart

# View logs
cd /opt/authentik && docker compose logs -f
```

Environment configuration: `/opt/authentik/.env`. Database, media, and certificate data are stored
under `/opt/authentik`.

## Security

Ports 9000 (HTTP) and 9443 (HTTPS) are open on the VM's network interface. UFW is enabled and allows
those ports plus SSH (port 22). Authentik serves a default self-signed certificate on 9443.

**To restrict access to a specific IP:**

```bash
sudo ufw delete allow 9000/tcp
sudo ufw delete allow 9443/tcp
sudo ufw allow from <trusted-ip> to any port 9000
sudo ufw allow from <trusted-ip> to any port 9443
```

**For production use**, point a DNS record at the VM and front Authentik with TLS, either using the
built-in HTTPS on 9443 with your own certificate, or a reverse proxy (Caddy, nginx, or Traefik) that
terminates TLS and forwards to port 9000.

## Next steps

- [Authentik documentation](https://docs.goauthentik.io/)
- [Configuration reference](https://docs.goauthentik.io/docs/install-config/configuration/)
