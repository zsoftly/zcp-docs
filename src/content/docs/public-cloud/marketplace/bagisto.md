---
title: Bagisto
---

Bagisto is an open-source e-commerce platform built on the Laravel PHP framework and Vue.js. It
ships a full storefront, multi-channel admin, inventory, and order management out of the box. The
official Docker setup bundles every dependency, so it is the fastest way to stand it up.

## Software included

| Component | Version   |
| --------- | --------- |
| Bagisto   | 2.4.8     |
| PHP       | 8.3       |
| Ubuntu    | 24.04 LTS |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script configures MySQL and Redis, creates the Bagisto environment, runs
database migrations and seeders, generates the administrator password, and starts the queue worker.
This can take a few minutes. Track progress:

```bash
journalctl -u bagisto-first-boot.service -f
```

The login message (MOTD) confirms when Bagisto is ready.

### 3. Verify Bagisto is running

```bash
systemctl status nginx php8.3-fpm mysql redis-server bagisto-queue.service
curl -fsS http://127.0.0.1/ > /dev/null
```

### 4. Access the storefront and admin UI

Open the storefront:

```text
http://<your-vm-ip>
```

Open the administration panel:

```text
http://<your-vm-ip>/admin
```

Retrieve the generated credentials:

```bash
sudo cat /root/.credentials/bagisto.txt
```

| Field    | Value                                                      |
| -------- | ---------------------------------------------------------- |
| Email    | Generated on first boot and stored in the credentials file |
| Password | From `/root/.credentials/bagisto.txt`                      |

## Managing Bagisto

```bash
# Check service status
systemctl status nginx php8.3-fpm mysql redis-server bagisto-queue.service

# Restart the web and queue services
sudo systemctl restart nginx php8.3-fpm bagisto-queue.service

# View queue-worker logs
sudo journalctl -u bagisto-queue.service -f
```

| Path                                      | Purpose                   |
| ----------------------------------------- | ------------------------- |
| `/var/www/bagisto/.env`                   | Application configuration |
| `/etc/nginx/sites-available/bagisto.conf` | Nginx virtual host        |
| `/var/www/bagisto/storage/`               | Application storage       |

## Security

Port 80 is accessible on the VM's network interface. UFW is enabled and allows SSH (port 22) and
Bagisto HTTP (port 80) by default.

**To restrict the storefront to a specific IP:**

```bash
sudo ufw delete allow 80/tcp
sudo ufw allow from <trusted-ip> to any port 80
```

**To access Bagisto without exposing port 80, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
```

**For production use**, place Bagisto behind a reverse proxy so you can serve it on port 443 with a
TLS certificate, and update the application URL in `/var/www/bagisto/.env` to your domain.

:::caution

The credentials file also contains database, MySQL root, and Redis passwords. Keep it restricted to
administrators and limit access to the administration panel.

:::

## Next steps

- [Bagisto documentation](https://devdocs.bagisto.com/)
- [Bagisto installation guide](https://github.com/bagisto/bagisto-docker)
