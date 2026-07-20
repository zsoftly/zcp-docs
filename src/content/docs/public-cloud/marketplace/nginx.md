---
title: Nginx
---

Nginx is a high-performance web server, reverse proxy, and load balancer that powers a large share
of the busiest sites on the internet. It serves static content efficiently, proxies requests to
application backends, and terminates TLS with a small memory footprint.

## Software included

| Component | Version   |
| --------- | --------- |
| Nginx     | 1.30.3    |
| Ubuntu    | 24.04 LTS |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Verify Nginx is running

There is no first-boot configuration. Nginx starts immediately after the VM boots.

```bash
systemctl status nginx
```

### 3. Access the default site

Open a browser and navigate to:

```text
http://<your-vm-ip>
```

You can also verify the response from the VM:

```bash
curl -I http://localhost
```

## Managing Nginx

```bash
# Check service status
systemctl status nginx

# Validate the configuration
sudo nginx -t

# Restart
sudo systemctl restart nginx

# View logs
sudo journalctl -u nginx -f
```

| Path                     | Purpose                        |
| ------------------------ | ------------------------------ |
| `/etc/nginx/nginx.conf`  | Main configuration             |
| `/etc/nginx/conf.d/`     | Server and proxy configuration |
| `/usr/share/nginx/html/` | Default web root               |

## Security

Ports 80 and 443 are open on the VM's network interface. UFW is enabled and allows HTTP (port 80),
HTTPS (port 443), and SSH (port 22). Nginx serves HTTP on port 80 by default. Port 443 has no TLS
listener until you configure a certificate and HTTPS server block.

**To restrict HTTP and HTTPS to a specific IP:**

```bash
sudo ufw delete allow 80/tcp
sudo ufw delete allow 443/tcp
sudo ufw allow from <trusted-ip> to any port 80
sudo ufw allow from <trusted-ip> to any port 443
```

**To access the default site without leaving port 80 open, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8080
```

**For production use**, configure Nginx with a trusted TLS certificate and serve public sites on
port 443. Nginx does not add authentication to proxied services, so protect each upstream
application separately.

## Next steps

- [Nginx documentation](https://nginx.org/en/docs/)
- [Nginx installation guide](https://nginx.org/en/linux_packages.html)
