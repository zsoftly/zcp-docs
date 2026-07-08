---
title: Keycloak
---

Keycloak is an open-source identity and access management platform. It provides single sign-on
(SSO), user federation, social and identity-broker login, and fine-grained authorization through
standard protocols such as OpenID Connect, OAuth 2.0, and SAML.

## Software included

| Component  | Version       |
| ---------- | ------------- |
| Keycloak   | 26.0.7        |
| PostgreSQL | 16            |
| Docker     | Latest stable |
| Ubuntu     | 24.04 LTS     |

Keycloak runs in production mode (`start`) with a PostgreSQL database, as a Docker Compose stack.

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

## Environment variables

You can optionally set these when deploying Keycloak from the marketplace. Leave a password field
blank to have a secure random value generated automatically.

| Variable                  | Description                                                                    |
| ------------------------- | ------------------------------------------------------------------------------ |
| `KEYCLOAK_ADMIN`          | Username for the initial admin account. Defaults to `admin`                    |
| `KEYCLOAK_ADMIN_PASSWORD` | Password for the initial admin account                                         |
| `KC_HOSTNAME`             | Public hostname or IP Keycloak is served from. Defaults to the VM's private IP |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates the admin and database passwords, writes the environment
file, and starts the stack with Docker Compose. This takes 1-2 minutes. Track progress:

```bash
journalctl -u keycloak-first-boot.service -f
```

The login message (MOTD) confirms when Keycloak is ready and prints the admin credentials.

### 3. Retrieve the admin credentials

The credentials are also written to a root-only file:

```bash
sudo cat /etc/keycloak/credentials.txt
```

### 4. Access the admin console

Open a browser and navigate to:

```text
http://<your-vm-ip>:8080
```

Sign in with the `admin` user and the generated password.

| Field    | Value                                |
| -------- | ------------------------------------ |
| Username | `admin`                              |
| Password | From `/etc/keycloak/credentials.txt` |

## Managing Keycloak

Keycloak runs as a Docker Compose stack in `/opt/keycloak`.

```bash
# Check status
cd /opt/keycloak && docker compose ps

# Restart
cd /opt/keycloak && docker compose restart

# View logs
cd /opt/keycloak && docker compose logs -f
```

Environment configuration: `/opt/keycloak/.env`. PostgreSQL data is stored under
`/opt/keycloak/data/postgres` and is not exposed outside the Docker network.

## Security

Port 8080 is open on the VM's network interface. UFW is enabled and allows SSH (port 22) and
Keycloak (port 8080). Keycloak serves plain HTTP on 8080.

:::caution

`KC_HOSTNAME` defaults to the VM's private IP. If you later attach a public IP, DNS name, or reverse
proxy, set `KC_HOSTNAME` at deploy time (or edit `/opt/keycloak/.env` and run
`cd /opt/keycloak && docker compose up -d`), otherwise production-mode hostname checks can reject
requests from the new address.

:::

**For production use**, front Keycloak with a reverse proxy (Caddy, nginx, or Traefik) that
terminates TLS on port 443 and forwards to port 8080, and set `KC_PROXY_HEADERS=xforwarded` in
`/opt/keycloak/.env`. Restrict direct access to port 8080:

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

## Next steps

- [Keycloak documentation](https://www.keycloak.org/documentation)
- [Configuring the hostname](https://www.keycloak.org/server/hostname)
- [Reverse proxy setup](https://www.keycloak.org/server/reverseproxy)
