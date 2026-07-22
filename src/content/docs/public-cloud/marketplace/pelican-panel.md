---
title: Pelican Panel
---

Pelican is a modern, open-source game server management panel and the spiritual successor to
Pterodactyl. It provides a fast web interface for deploying and managing game servers, with
per-server isolation handled by the Wings daemon. Pelican uses PHP and Laravel and ships a guided
web installer.

## Software included

| Component     | Version      |
| ------------- | ------------ |
| Pelican Panel | 1.0.0_beta35 |
| Pelican Wings | 1.0.0_beta26 |
| PHP           | 8.5          |
| Ubuntu        | 24.04 LTS    |

Wings and Docker are installed, but Wings does not start until you create a node in the Panel and
save its generated configuration on the VM.

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

Pelican configures MariaDB, writes its environment file, generates the Laravel application key,
starts Nginx and PHP-FPM, and prepares Wings. Track progress with:

```bash
sudo journalctl -u pelican-first-boot.service -f
```

Then verify the Panel services:

```bash
systemctl status nginx php8.5-fpm mariadb
```

### 3. Access the installer

The installer is available through an SSH tunnel because HTTP is not open publicly by default. From
your local machine, run:

```bash
ssh -L 8080:127.0.0.1:80 ubuntu@<your-vm-ip>
```

Then open:

```text
http://127.0.0.1:8080/installer
```

Complete the installer and create your first administrator account. The image does not create shared
default login credentials.

### 4. Enable scheduled tasks and the queue worker

After the installer completes, enable Pelican's scheduler and queue worker:

```bash
CRON="* * * * * php /var/www/pelican/artisan schedule:run >> /dev/null 2>&1"
sudo crontab -u www-data -l 2>/dev/null | grep -qF "$CRON" \
  || ( sudo crontab -u www-data -l 2>/dev/null; echo "$CRON" ) | sudo crontab -u www-data -
sudo systemctl enable --now pelican-queue
```

### 5. Configure Wings

Create a node in the Pelican admin UI and save its generated Wings configuration as:

```text
/etc/pelican/config.yml
```

Then start Wings:

```bash
sudo systemctl start wings
systemctl status wings
```

## Managing Pelican Panel

```bash
# Check Panel services and the queue worker
systemctl status nginx php8.5-fpm mariadb pelican-queue

# Restart the web services
sudo systemctl restart nginx php8.5-fpm

# View first-boot logs
sudo journalctl -u pelican-first-boot.service -f

# View Wings logs after configuring a node
sudo journalctl -u wings.service -f
```

| Path                                 | Purpose                                   |
| ------------------------------------ | ----------------------------------------- |
| `/var/www/pelican/`                  | Pelican application                       |
| `/var/www/pelican/.env`              | Panel environment configuration           |
| `/etc/pelican-panel/credentials.txt` | Generated MariaDB details and Wings notes |
| `/etc/pelican/config.yml`            | Wings node configuration                  |

## Security

Pelican listens behind Nginx on port 80, but UFW allows SSH (port 22) only by default. Ports 80,
443, 2022, and 8080 remain closed until you decide how to expose the Panel, Wings, and game-server
allocations.

Use the SSH tunnel from the getting-started steps to complete the installer. To allow Panel access
from a trusted IP after setup:

```bash
sudo ufw allow from <trusted-ip> to any port 80
```

**For production use**, point DNS at the VM, put the Panel behind a reverse proxy with a trusted TLS
certificate, and update the application URL in `/var/www/pelican/.env` to the public HTTPS URL. Open
Wings and game allocation ports only after you configure the node.

:::caution

The web installer creates sensitive administrator state. Complete it through the SSH tunnel before
opening HTTP or HTTPS access.

:::

## Next steps

- [Pelican documentation](https://pelican.dev/docs/)
- [Pelican Panel installation guide](https://pelican.dev/docs/panel/getting-started)
- [Pelican Wings installation](https://pelican.dev/docs/wings/install/)
