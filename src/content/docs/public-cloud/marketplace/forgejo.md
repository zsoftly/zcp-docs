---
title: Forgejo
---

Forgejo is a self-hosted Git forge, maintained as a community-driven fork of Gitea. It bundles
repository hosting, pull requests, issue tracking, packages, and CI actions into a single Go binary
that runs well on modest hardware. This image ships the Forgejo LTS line, which is released every
April and supported for about 15 months.

## Software included

| Component  | Version       |
| ---------- | ------------- |
| Forgejo    | 15.0.3 (LTS)  |
| PostgreSQL | 18            |
| Docker     | Latest stable |
| Ubuntu     | 24.04 LTS     |

Forgejo runs with PostgreSQL as a Docker Compose stack. The web UI is served on port 3000 and Git
over SSH on port 2222, which leaves the VM's own SSH daemon on port 22.

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 20 GB   | 40 GB       |

The storage figure is your root disk size. Choose it on the **OS Disk Offering** step when you
create the instance. You pay for it per GB, separate from the plan.

## Environment variables

These values are optional during marketplace deployment. Leave a password field blank to have a
secure random value generated automatically.

| Variable                 | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| `FORGEJO_ADMIN_PASSWORD` | Password for the initial `zadmin` account                   |
| `FORGEJO_DB_PASSWORD`    | Password for the `forgejo` PostgreSQL user                  |
| `FORGEJO_DOMAIN`         | Public hostname used in clone URLs, defaults to the VM's IP |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates the database password, starts Forgejo and PostgreSQL
with Docker Compose, and creates the administrator account. This takes 1-2 minutes. Track progress:

```bash
journalctl -u forgejo-first-boot.service -f
```

The login message (MOTD) confirms when Forgejo is ready and prints the admin credentials.

### 3. Retrieve the admin credentials

The credentials are also written to a root-only file:

```bash
sudo cat /etc/forgejo/credentials.txt
```

### 4. Access the web interface

Open a browser and navigate to:

```text
http://<your-vm-ip>:3000
```

Sign in as `zadmin` with the generated password. The web installer is locked, so the instance is
configured from the moment it boots.

:::note

`admin` is a reserved username in Forgejo, so the administrator account is named `zadmin`.

:::

### 5. Clone over SSH

Add your public key under **Settings → SSH / GPG Keys**, then clone using port 2222:

```bash
git clone ssh://git@<your-vm-ip>:2222/<owner>/<repo>.git
```

## Managing Forgejo

Forgejo and PostgreSQL run as a Docker Compose stack in `/opt/forgejo`.

```bash
# Check status
cd /opt/forgejo && docker compose ps

# Restart
cd /opt/forgejo && docker compose restart

# View logs
cd /opt/forgejo && docker compose logs -f server
```

Repository data lives in `/opt/forgejo/data/forgejo` and the database in
`/opt/forgejo/data/postgres`. Configuration is generated at
`/opt/forgejo/data/forgejo/gitea/conf/app.ini`, and most settings accept overrides through
`FORGEJO__section__KEY` environment variables in the compose file.

## Security

Ports 3000 (HTTP) and 2222 (Git over SSH) are open on the VM's network interface. UFW is enabled and
allows those ports plus SSH (port 22).

Each VM generates its own `SECRET_KEY` and `INTERNAL_TOKEN` the first time Forgejo starts, so no two
deployments share encryption secrets.

:::caution

Do not copy `app.ini` between VMs, and do not rotate `SECRET_KEY` after use. Doing so makes existing
two-factor secrets and stored credentials impossible to decrypt.

:::

**To restrict access to a specific IP:**

```bash
sudo ufw delete allow 3000/tcp
sudo ufw allow from <trusted-ip> to any port 3000
```

**For production use**, point a DNS record at the VM and front Forgejo with TLS via a reverse proxy
(Caddy, nginx, or Traefik), then set `FORGEJO_DOMAIN` so clone URLs match.

## Next steps

- [Forgejo documentation](https://forgejo.org/docs/latest/)
- [Forgejo administration guide](https://forgejo.org/docs/latest/admin/)
- [Forgejo Actions](https://forgejo.org/docs/latest/user/actions/)
