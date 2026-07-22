---
title: Artifactory
---

JFrog Artifactory is a universal binary and artifact repository manager. The open-source edition
stores and proxies packages for many formats, including Maven, Gradle, Debian, and generic binaries,
and acts as the single source of truth for your build artifacts. The web UI runs on port 8082.

## Software included

| Component       | Version   |
| --------------- | --------- |
| Artifactory OSS | 7.146.27  |
| PostgreSQL      | 16        |
| Ubuntu          | 24.04 LTS |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable                     | Description                |
| ---------------------------- | -------------------------- |
| `ARTIFACTORY_ADMIN_PASSWORD` | Artifactory admin password |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script prepares persistent storage, generates the PostgreSQL password,
and starts the Artifactory and PostgreSQL containers. Track progress:

```bash
journalctl -u artifactory-first-boot.service -f
```

If you attach an extra blank data disk before first boot, the script formats and mounts it at
`/data`. Otherwise, it stores data under `/data` on the root filesystem.

### 3. Verify Artifactory is running

```bash
cd /opt/artifactory
docker compose ps
curl -fsS http://127.0.0.1:8082/ui/ > /dev/null
```

### 4. Access the Artifactory UI

Artifactory is bound to localhost until you complete the setup wizard. From your local machine,
start an SSH tunnel:

```bash
ssh -L 8082:127.0.0.1:8082 -L 8081:127.0.0.1:8081 ubuntu@<your-vm-ip>
```

Then open:

```text
http://127.0.0.1:8082/ui/
```

Log in with the upstream default credentials:

| Field    | Value      |
| -------- | ---------- |
| Username | `admin`    |
| Password | `password` |

Change the password in the setup wizard before making the service reachable from a network.

## Managing Artifactory

```bash
# Check container status
cd /opt/artifactory && docker compose ps

# Restart
cd /opt/artifactory && docker compose restart

# View logs
cd /opt/artifactory && docker compose logs -f
```

| Path                                  | Purpose                      |
| ------------------------------------- | ---------------------------- |
| `/opt/artifactory/docker-compose.yml` | Docker Compose configuration |
| `/opt/artifactory/.env`               | PostgreSQL password          |
| `/data/artifactory/var/`              | Artifactory data             |
| `/data/artifactory/postgresql/`       | PostgreSQL data              |

## Security

Ports 8081 and 8082 are bound to localhost. UFW is enabled and allows SSH (port 22) only by default.
Use the SSH tunnel above for initial setup.

After changing the administrator password, expose Artifactory only through a trusted network path.
To publish port 8082 directly, you must first change its Docker Compose port binding from
`127.0.0.1:8082:8082` to `8082:8082`, then allow a trusted IP:

```bash
sudo ufw allow from <trusted-ip> to any port 8082
```

**For production use**, keep Artifactory bound to localhost and place it behind a reverse proxy so
you can serve it on port 443 with a TLS certificate.

:::caution

The upstream `admin` password is public. Change it immediately through the SSH tunnel and restrict
access to known IPs.

:::

## Next steps

- [Artifactory documentation](https://jfrog.com/help/r/jfrog-artifactory-documentation)
- [Artifactory installation guide](https://jfrog.com/help/r/jfrog-installation-setup-documentation/install-artifactory-single-node-with-docker)
