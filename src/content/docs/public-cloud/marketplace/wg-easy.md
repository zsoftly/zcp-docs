---
title: WG-Easy
---

WG-Easy is the easiest way to run a WireGuard VPN together with a web-based admin UI. It lets you
create and manage VPN clients, view connection stats, and download or scan client configurations
from a browser, all backed by the fast, modern WireGuard protocol. The web UI runs on port 51821/tcp
and the VPN itself on port 51820/udp.

:::note[Coming soon]

A pre-built WG-Easy image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install WG-Easy yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 1           |
| RAM      | 512 MB  | 1 GB        |
| Storage  | 10 GB   | 20 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **WG-Easy**, and click **Deploy**, or create
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

## Install WG-Easy

Install Docker Engine and the Docker Compose plugin from Docker's official repository:

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Add the `ubuntu` user to the `docker` group so you can run Docker without `sudo`, then reconnect:

```bash
sudo usermod -aG docker ubuntu
exit
```

Reconnect over SSH, create a project directory, and add a `compose.yaml`. WG-Easy needs elevated
network capabilities and IP forwarding to route VPN traffic:

```bash
mkdir ~/wg-easy && cd ~/wg-easy
```

```yaml
services:
  wg-easy:
    image: ghcr.io/wg-easy/wg-easy:15
    restart: unless-stopped
    environment:
      - INIT_ENABLED=1
      - INIT_HOST=${WIREGUARD_HOST}
      - INIT_PORT=51820
      - INIT_USERNAME=admin
      - INIT_PASSWORD=${WIREGUARD_PASSWORD}
      - INIT_DNS=1.1.1.1,8.8.8.8
      - PORT=51821
    ports:
      - '51820:51820/udp'
      - '51821:51821/tcp'
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
      - NET_RAW
    sysctls:
      - net.ipv4.ip_forward=1
      - net.ipv4.conf.all.src_valid_mark=1
    volumes:
      - wg-easy-data:/etc/wireguard

volumes:
  wg-easy-data:
```

Create a `.env` file in the same directory. Set `WIREGUARD_HOST` to the instance's public IP or DNS
name that clients will connect to:

```bash
cat > .env <<'EOF'
WIREGUARD_HOST=<your-vm-ip>
WIREGUARD_PASSWORD=change-me-to-a-strong-password
EOF
```

Start the stack:

```bash
docker compose up -d
```

## Configure WG-Easy

Open `http://<your-vm-ip>:51821` in a browser and sign in with the username `admin` and the password
from `.env`. From the dashboard you can add clients, then download or scan each client's WireGuard
configuration. `INIT_HOST` must be the public address clients can reach, otherwise generated client
configs will point at the wrong endpoint. For a production setup, put the web UI behind a reverse
proxy such as nginx with a TLS certificate and serve it over HTTPS instead of exposing port 51821
directly. The VPN port 51820/udp stays exposed.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) WG-Easy needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 51820/udp
sudo ufw allow 51821/tcp
```

## Next steps

- [WG-Easy documentation](https://wg-easy.github.io/wg-easy/)
- [WG-Easy installation guide](https://wg-easy.github.io/wg-easy/v15.2/getting-started/)
