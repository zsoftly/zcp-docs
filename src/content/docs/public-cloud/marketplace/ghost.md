---
title: Ghost
---

Ghost is an open-source publishing platform for blogs, newsletters, and membership sites. It pairs a
fast editor and built-in email delivery with a clean, theme-driven front end.

## Software included

| Component | Version   |
| --------- | --------- |
| Ghost     | 5.97.0    |
| Node.js   | 20.x      |
| MySQL     | 8.0       |
| nginx     | Latest    |
| Ubuntu    | 24.04 LTS |

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

:::caution

Ghost requires a domain name. It does not run against a bare IP address. Provide `GHOST_URL` at
deploy time (see below) and point that domain's DNS at the VM.

:::

## Environment variables

You can optionally set these when deploying Ghost from the marketplace. Leave `GHOST_DB_PASSWORD`
blank to have a secure random value generated automatically.

| Variable            | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `GHOST_URL`         | Full site URL, for example `https://blog.example.com` |
| `GHOST_ADMIN_EMAIL` | Email for the Ghost admin account                     |
| `GHOST_DB_PASSWORD` | Password for the MySQL `ghost` database user          |

If `GHOST_URL` is not set, the VM serves a placeholder page and leaves Ghost unconfigured until you
provide a domain.

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script creates the MySQL database, configures Ghost for your `GHOST_URL`,
writes the nginx virtual host, and starts the site as a systemd service. This takes 1-2 minutes.
Track progress:

```bash
journalctl -u ghost-first-boot.service -f
```

The login message (MOTD) confirms when Ghost is ready.

### 3. Finish admin setup

Open the admin area in a browser and create the first administrator account:

```text
https://your-domain.com/ghost
```

The generated database credentials are written to a root-only file:

```bash
sudo cat /etc/ghost/credentials.txt
```

### 4. Enable HTTPS

TLS is not configured automatically, because it requires your domain's DNS to point at the VM first.
Once that resolves, provision a free Let's Encrypt certificate:

```bash
cd /var/www/ghost
ghost setup ssl
```

## Managing Ghost

Ghost runs as a per-site systemd service named `ghost_<hostname>` (for example
`ghost_blog-example-com`). Manage it from the install directory:

```bash
# Show the running instance and its service name
cd /var/www/ghost && ghost ls

# Restart, stop, and start
ghost restart
ghost stop
ghost start
```

Install directory: `/var/www/ghost`. Content (themes, images, and data) lives under
`/var/www/ghost/content`.

## Security

Ports 80 and 443 are open on the VM's network interface. UFW is enabled and allows SSH (port 22),
HTTP (80), and HTTPS (443).

**For production use**, complete the Let's Encrypt step above so the site is served over HTTPS, and
restrict SSH access to known IP ranges.

## Next steps

- [Ghost documentation](https://ghost.org/docs/)
- [Configuring Ghost](https://ghost.org/docs/config/)
