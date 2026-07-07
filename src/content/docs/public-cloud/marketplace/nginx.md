---
title: Nginx
---

Nginx is a high-performance web server, reverse proxy, and load balancer that powers a large share
of the busiest sites on the internet. It serves static content efficiently, proxies requests to
application backends, and terminates TLS with a small memory footprint.

:::note[Coming soon]

A pre-built Nginx image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Nginx yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 10 GB   | 20 GB       |

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

## Install Nginx

Install the latest stable Nginx from the official nginx.org apt repository. First add the
prerequisites and the signing key:

```bash
sudo apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring
```

```bash
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
  | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
```

Add the stable repository for your Ubuntu release:

```bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
https://nginx.org/packages/ubuntu $(lsb_release -cs) nginx" \
  | sudo tee /etc/apt/sources.list.d/nginx.list
```

Install and start Nginx:

```bash
sudo apt update && sudo apt install -y nginx
sudo systemctl enable --now nginx
```

Verify it is serving:

```bash
curl -I http://localhost
```

## Configure Nginx

The main config lives at `/etc/nginx/nginx.conf`, and site config files go in `/etc/nginx/conf.d/`.
Create a simple reverse proxy that forwards to a backend on port 3000:

```bash
sudo tee /etc/nginx/conf.d/app.conf >/dev/null <<'EOF'
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
```

Test the configuration and reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

For HTTPS, install Certbot and request a Let's Encrypt certificate:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Nginx needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Next steps

- [Nginx documentation](https://nginx.org/en/docs/)
- [Nginx installation guide](https://nginx.org/en/linux_packages.html)
