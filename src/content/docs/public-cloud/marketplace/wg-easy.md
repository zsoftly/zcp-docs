---
title: WG-Easy
---

WG-Easy is the easiest way to run a WireGuard VPN together with a web-based admin UI. It lets you
create and manage VPN clients, view connection stats, and download or scan client configurations
from a browser, all backed by the fast, modern WireGuard protocol. The web UI runs on port 51821/tcp
and the VPN itself on port 51820/udp.

## Software included

| Component | Version   |
| --------- | --------- |
| WG-Easy   | 15        |
| Ubuntu    | 24.04 LTS |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable             | Description              |
| -------------------- | ------------------------ |
| `WIREGUARD_HOST`     | Public WireGuard host    |
| `WIREGUARD_PASSWORD` | WireGuard admin password |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates a self-signed TLS certificate, reloads Nginx, and starts
WG-Easy with Docker Compose. Track progress:

```bash
sudo journalctl -u wg-easy-first-boot.service -f
```

The login message (MOTD) confirms when WG-Easy is ready. You can also verify the container and
Nginx:

```bash
cd /data/wg-easy && docker compose ps
systemctl status nginx
```

### 3. Access the WG-Easy UI

Open a browser and navigate to:

```text
https://<your-vm-ip>:51821
```

The self-signed certificate triggers a browser warning. Accept the exception to proceed.

### 4. Complete the setup wizard

On the first visit, create your administrator account and set the WireGuard endpoint to the public
IP or domain that VPN clients can reach. The image does not create shared default credentials.

## Managing WG-Easy

WG-Easy runs as a Docker Compose stack in `/data/wg-easy`, with Nginx terminating TLS.

```bash
# Check status
cd /data/wg-easy && docker compose ps
systemctl status nginx

# Restart
cd /data/wg-easy && docker compose restart
sudo systemctl restart nginx

# View application logs
cd /data/wg-easy && docker compose logs -f

# View Nginx logs
sudo journalctl -u nginx -f
```

| Path                               | Purpose                          |
| ---------------------------------- | -------------------------------- |
| `/data/wg-easy/docker-compose.yml` | Docker Compose configuration     |
| `/data/wg-easy/wireguard/`         | WireGuard configuration and data |
| `/data/wg-easy/ssl/cert.pem`       | Self-signed TLS certificate      |
| `/data/wg-easy/ssl/key.pem`        | TLS private key                  |
| `/data/wg-easy/info.txt`           | Access and management details    |

## Security

The WireGuard VPN uses port 51820/udp, and the Nginx-proxied web UI uses port 51821/tcp. UFW is
enabled and allows SSH (port 22) plus both WG-Easy ports by default. The container's unencrypted web
port is bound to `127.0.0.1:51822` and is not exposed externally.

**To restrict the web UI to a specific IP:**

```bash
sudo ufw delete allow 51821/tcp
sudo ufw allow from <trusted-ip> to any port 51821
```

**To access the web UI through an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 51821:localhost:51821 ubuntu@<your-vm-ip>

# Then open in your browser
https://localhost:51821
```

Keep port 51820/udp open so VPN clients can connect. Nginx already acts as the TLS reverse proxy for
the UI. **For production use**, replace `/data/wg-easy/ssl/cert.pem` and `/data/wg-easy/ssl/key.pem`
with a trusted certificate and key.

:::caution

Complete the setup wizard immediately and restrict the web UI to trusted administrator IPs. Treat
downloaded WireGuard client configurations as credentials.

:::

## Next steps

- [WG-Easy documentation](https://wg-easy.github.io/wg-easy/)
- [WG-Easy installation guide](https://wg-easy.github.io/wg-easy/v15.2/getting-started/)
