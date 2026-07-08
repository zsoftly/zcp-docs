---
title: Vaultwarden
---

Vaultwarden is a lightweight, self-hosted password manager that implements the Bitwarden API. It is
fully compatible with official Bitwarden client apps and browser extensions, letting you store and
sync passwords, secure notes, and other secrets on infrastructure you control.

## Software included

| Component      | Version       |
| -------------- | ------------- |
| Vaultwarden    | 1.36.0        |
| Docker         | Latest stable |
| Docker Compose | Latest stable |
| Ubuntu         | 24.04 LTS     |

Vaultwarden stores its data in an embedded SQLite database and serves the web vault over HTTPS on
port 8000 with a self-signed certificate generated on first boot.

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 10 GB   | 20 GB       |

Vaultwarden is resource-light.

## Environment variables

You can optionally set these when deploying Vaultwarden from the marketplace. Leave `ADMIN_TOKEN`
blank to have a secure random value generated automatically.

| Variable             | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| `VAULTWARDEN_DOMAIN` | Full public URL clients use, for example `https://vault.example.com` |
| `ADMIN_TOKEN`        | Token for the `/admin` panel                                         |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates a self-signed TLS certificate and the admin token, then
starts the container with Docker Compose. This takes under a minute. Track progress:

```bash
journalctl -u vaultwarden-first-boot.service -f
```

The login message (MOTD) confirms when Vaultwarden is ready.

### 3. Retrieve the admin token

The admin token signs in to the `/admin` panel. It is written to a root-only file:

```bash
sudo cat /root/.credentials/vaultwarden.txt
```

### 4. Open the web vault

Open a browser and navigate to:

```text
https://<your-vm-ip>:8000
```

The self-signed certificate triggers a browser warning. Accept the exception to proceed. The admin
panel is at `https://<your-vm-ip>:8000/admin`.

:::note

User self-registration is disabled by default (`SIGNUPS_ALLOWED=false`). To add users, open the
admin panel and invite them under **Users**, or enable open registration under **General Settings**.

:::

## Managing Vaultwarden

Vaultwarden runs as a Docker Compose stack in `/data/vaultwarden`.

```bash
# Check status
cd /data/vaultwarden && docker compose ps

# Restart
cd /data/vaultwarden && docker compose restart

# View logs
cd /data/vaultwarden && docker compose logs -f
```

Environment configuration: `/data/vaultwarden/vaultwarden.env`. The vault database and certificate
are stored under `/data/vaultwarden/data`.

## Security

Port 8000 is open on the VM's network interface. UFW is enabled and allows SSH (port 22) and the
Vaultwarden web vault (port 8000). Bitwarden clients require HTTPS, which the image serves with a
self-signed certificate by default.

Treat the admin token like a root password.

**For production use**, set `DOMAIN` to the full public URL clients use, including the scheme and
any port or path (for example `https://vault.example.com` or `https://<public-ip>:8000`), in
`/data/vaultwarden/vaultwarden.env`, replace the self-signed certificate with a trusted one (or
front Vaultwarden with a reverse proxy such as Caddy that terminates TLS), and restart the stack:

```bash
cd /data/vaultwarden && docker compose restart
```

## Next steps

- [Vaultwarden documentation](https://github.com/dani-garcia/vaultwarden/wiki)
- [Enabling HTTPS](https://github.com/dani-garcia/vaultwarden/wiki/Enabling-HTTPS)
