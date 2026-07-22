---
title: Nginx Proxy Manager
---

Nginx Proxy Manager is a self-hosted reverse proxy with a clean web UI for routing traffic to your
services and issuing free Let's Encrypt TLS certificates. It wraps Nginx so you can manage proxy
hosts, redirects, and SSL without editing config files by hand.

## Software included

| Component           | Version   |
| ------------------- | --------- |
| Nginx Proxy Manager | 2.15.1    |
| Ubuntu              | 24.04 LTS |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable             | Description                             |
| -------------------- | --------------------------------------- |
| `NPM_ADMIN_EMAIL`    | Nginx Proxy Manager admin email address |
| `NPM_ADMIN_PASSWORD` | Nginx Proxy Manager admin password      |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

Nginx Proxy Manager starts automatically as a Docker Compose stack. This usually takes under a
minute. Track progress with:

```bash
sudo journalctl -u nginx-proxy-manager-first-boot.service -f
```

Then verify the container:

```bash
cd /opt/nginx-proxy-manager && docker compose ps
```

### 3. Access the admin UI

Open a browser and navigate to:

```text
http://<your-vm-ip>:81
```

Log in with the default credentials:

| Field    | Value               |
| -------- | ------------------- |
| Email    | `admin@example.com` |
| Password | `changeme`          |

You will be prompted to change the account details after first login.

## Managing Nginx Proxy Manager

Nginx Proxy Manager runs as a Docker Compose stack in `/opt/nginx-proxy-manager`.

```bash
# Check status
cd /opt/nginx-proxy-manager && docker compose ps

# Restart
cd /opt/nginx-proxy-manager && docker compose restart

# View logs
cd /opt/nginx-proxy-manager && docker compose logs -f
```

| Path                                          | Purpose                    |
| --------------------------------------------- | -------------------------- |
| `/opt/nginx-proxy-manager/docker-compose.yml` | Compose stack              |
| `/var/lib/nginx-proxy-manager/data/`          | Application data           |
| `/var/lib/nginx-proxy-manager/letsencrypt/`   | Let's Encrypt certificates |

## Security

Ports 80, 81, and 443 are open on the VM's network interface. UFW is enabled and allows HTTP proxy
traffic (port 80), the admin UI (port 81), HTTPS proxy traffic (port 443), and SSH (port 22).

**To restrict the admin UI to a specific IP:**

```bash
sudo ufw delete allow 81/tcp
sudo ufw allow from <trusted-ip> to any port 81
```

**To access the admin UI without leaving port 81 open, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8181:localhost:81 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8181
```

Keep ports 80 and 443 reachable for public proxy hosts and Let's Encrypt HTTP-01 validation. For
production use, restrict the admin UI to a trusted network or publish it through a protected TLS
endpoint.

:::caution

Change the default email and password immediately after first login. Port 81 provides administrative
control over every proxy host and certificate on the VM.

:::

## Next steps

- [Nginx Proxy Manager documentation](https://nginxproxymanager.com/guide/)
- [Nginx Proxy Manager installation guide](https://nginxproxymanager.com/setup/)
