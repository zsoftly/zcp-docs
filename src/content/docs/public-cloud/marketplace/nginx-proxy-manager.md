---
title: Nginx Proxy Manager
---

Nginx Proxy Manager is a self-hosted reverse proxy with a clean web UI for routing traffic to your
services and issuing free Let's Encrypt TLS certificates. It wraps Nginx so you can manage proxy
hosts, redirects, and SSL without editing config files by hand.

:::note[Coming soon]

A pre-built Nginx Proxy Manager image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS**
instance from the marketplace and follow the steps below to install Nginx Proxy Manager yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 10 GB   | 20 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **Nginx Proxy Manager**, and click **Deploy**
   or create an **Ubuntu 24.04 LTS** instance from **Instances → Create**. Both give you a clean
   Ubuntu 24.04 VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Nginx Proxy Manager

Nginx Proxy Manager runs in Docker, so install Docker Engine and the Compose plugin first using the
official convenience script:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
```

Log out and back in so the new group membership takes effect, then create a project directory and a
`docker-compose.yml` file:

```bash
mkdir -p ~/npm && cd ~/npm
```

```bash
cat > docker-compose.yml <<'EOF'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
EOF
```

Start the stack:

```bash
docker compose up -d
```

## Configure Nginx Proxy Manager

1. Open the admin UI in your browser at `http://<your-vm-ip>:81`.
2. Sign in with the default credentials:

```text
Email:    admin@example.com
Password: changeme
```

3. You are prompted to set your real name, email, and a new password immediately. Do this before
   anything else, as the default account is publicly known.
4. Go to **Hosts → Proxy Hosts → Add Proxy Host**, enter the domain that points at this VM and the
   internal address of the service you want to publish (for example `http://127.0.0.1:3000`).
5. On the **SSL** tab, choose **Request a new SSL Certificate** to have Let's Encrypt issue a
   certificate automatically. Ports 80 and 443 must be reachable from the internet for the challenge
   to succeed.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Nginx Proxy Manager
needs and add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 81/tcp
sudo ufw allow 443/tcp
```

Port 81 is the admin UI, while 80 and 443 carry proxied HTTP and HTTPS traffic. Once setup is done,
consider restricting port 81 to a trusted IP range.

## Next steps

- [Nginx Proxy Manager documentation](https://nginxproxymanager.com/guide/)
- [Nginx Proxy Manager installation guide](https://nginxproxymanager.com/setup/)
