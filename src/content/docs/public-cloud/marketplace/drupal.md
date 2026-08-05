---
title: Drupal
---

Drupal is an open-source content management system for content-heavy websites and applications. Its
entity model, taxonomy, and module ecosystem let teams build custom content types, editorial
workflows, and multilingual sites without writing the underlying code themselves.

:::note

PHP's `mail()` function and the local mail transfer agent deliver mail directly over port 25, which
is blocked by default. Use an SMTP plugin or authenticated relay on port 587, or see
[SMTP Port 25](../networking/public-network/smtp-port-25) to request access.

:::

## Software included

| Component | Version   |
| --------- | --------- |
| Drupal    | 11.4.1    |
| PHP       | 8.3       |
| Apache    | Latest    |
| MariaDB   | Latest    |
| Drush     | 13        |
| Ubuntu    | 24.04 LTS |

Drupal runs on a native LAMP stack (Apache, MariaDB, PHP). The site is pre-installed with the
**Standard** profile, so it is ready to use as soon as the VM boots.

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

Storage needs grow with media uploads and the number of installed modules.

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script creates the database, installs the Drupal site with Drush, and
generates the admin and database passwords. This takes 1-2 minutes. Track progress:

```bash
journalctl -u drupal-first-boot.service -f
```

The login message (MOTD) confirms when Drupal is ready.

### 3. Retrieve the admin credentials

The admin password, along with the database credentials, is written to a root-only file:

```bash
sudo cat /root/.credentials/drupal.txt
```

### 4. Sign in to the admin area

Open the site in a browser:

```text
http://<your-vm-ip>/
```

Sign in at the admin login page:

```text
http://<your-vm-ip>/user/login
```

| Field    | Value                                |
| -------- | ------------------------------------ |
| Username | `admin`                              |
| Password | From `/root/.credentials/drupal.txt` |

## Managing Drupal

Drupal is served by Apache with MariaDB, both managed by systemd.

```bash
# Service status
systemctl status apache2
systemctl status mariadb

# Restart the web server
sudo systemctl restart apache2

# Run Drush commands from the project root
cd /var/www/drupal && vendor/bin/drush status
cd /var/www/drupal && vendor/bin/drush cache:rebuild
```

| Path                                             | Purpose                  |
| ------------------------------------------------ | ------------------------ |
| `/var/www/drupal`                                | Project root             |
| `/var/www/drupal/web`                            | Web docroot              |
| `/var/www/drupal/web/sites/default/settings.php` | Site configuration       |
| `/var/www/drupal/web/sites/default/files`        | Uploaded files and media |

## Security

Port 80 is open on the VM's network interface. UFW is enabled and allows SSH (port 22) and HTTP
(port 80). The image serves plain HTTP only.

:::caution

The site ships with `$settings['trusted_host_patterns']` set to allow any host (`^.+$`). Before
putting the site on a public domain, tighten this in
`/var/www/drupal/web/sites/default/settings.php` to match your hostname.

:::

**For production use**, put the instance behind a reverse proxy with TLS (for example Nginx or
Caddy) so the site is served over HTTPS, and update `trusted_host_patterns` accordingly.

## Next steps

- [Drupal documentation](https://www.drupal.org/docs)
- [Drush documentation](https://www.drush.org/)
