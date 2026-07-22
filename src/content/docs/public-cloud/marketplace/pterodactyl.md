---
title: Pterodactyl
---

Pterodactyl is a free, open-source game server management panel built on PHP, Nginx, and Docker. It
lets you deploy and manage game servers through a clean web interface, with per-server isolation
handled by the Wings daemon. It powers game hosting for thousands of providers and self-hosters.

## Software included

| Component         | Version       |
| ----------------- | ------------- |
| Pterodactyl Panel | v1.12.4       |
| Wings             | v1.12.3       |
| PHP               | 8.3           |
| Docker            | Latest stable |
| Ubuntu            | 24.04 LTS     |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script configures MariaDB and Redis, creates the administrator, runs the
Panel migrations, and links Wings to a default node. This takes a few minutes. Track progress:

```bash
sudo journalctl -u pterodactyl-first-boot.service -f
```

The login message (MOTD) confirms when the Panel and Wings are ready. You can also verify the main
services directly:

```bash
systemctl status nginx php8.3-fpm mariadb redis-server pteroq wings
```

### 3. Retrieve the administrator credentials

The generated credentials are stored in a root-only file:

```bash
sudo cat /root/.credentials/pterodactyl.txt
```

| Field    | Value                                                            |
| -------- | ---------------------------------------------------------------- |
| Email    | Generated on first boot and stored in the credentials file above |
| Password | Generated on first boot and stored in the credentials file above |

### 4. Access the Pterodactyl Panel

Open a browser and navigate to:

```text
http://<your-vm-ip>
```

A default location named `zmi` and a default node named `default` are created and linked to Wings on
the same VM. The node starts with one allocation on port 25565. Add allocations under **Admin >
Nodes > default > Allocations** before creating servers that need other ports.

## Managing Pterodactyl

```bash
# Check service status
systemctl status nginx php8.3-fpm mariadb redis-server pteroq wings

# Restart the Panel web services, queue worker, and Wings
sudo systemctl restart nginx php8.3-fpm pteroq wings

# View Panel queue logs
sudo journalctl -u pteroq -f

# View Wings logs
sudo journalctl -u wings -f
```

| Path                                 | Purpose                                 |
| ------------------------------------ | --------------------------------------- |
| `/var/www/pterodactyl/.env`          | Panel environment configuration         |
| `/etc/pterodactyl/config.yml`        | Wings configuration                     |
| `/var/lib/pterodactyl/volumes/`      | Game server data                        |
| `/root/.credentials/pterodactyl.txt` | Generated credentials and setup details |

## Security

The Panel uses port 80, the Wings API uses port 8080, and Wings SFTP uses port 2022. UFW is enabled
and allows SSH (port 22) plus ports 80, 8080, and 2022 by default. Game server ports, including the
initial allocation on port 25565, are not opened automatically.

**To restrict Panel access to a specific IP:**

```bash
sudo ufw delete allow 80/tcp
sudo ufw allow from <trusted-ip> to any port 80
```

**To restrict the Wings API and SFTP ports to a specific IP:**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
sudo ufw delete allow 2022/tcp
sudo ufw allow from <trusted-ip> to any port 2022
```

**To access the Panel without leaving port 80 open, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
```

Restrict the Wings API and SFTP ports to trusted networks. Open only the game server ports your
allocations require.

**For production use**, place the Panel behind a reverse proxy so you can serve it over HTTPS with a
trusted TLS certificate, then update the application URL in `/var/www/pterodactyl/.env` to the
public URL.

:::caution

Sign in with the generated administrator password, then replace it with a password you control. Keep
the credentials file root-only and restrict the Panel and Wings interfaces to trusted IPs.

:::

## Next steps

- [Pterodactyl documentation](https://pterodactyl.io/)
- [Pterodactyl Panel installation guide](https://pterodactyl.io/panel/1.0/getting_started.html)
