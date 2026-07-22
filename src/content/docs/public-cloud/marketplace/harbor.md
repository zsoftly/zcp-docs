---
title: Harbor
---

Harbor is an open-source container registry that stores, signs, and scans container images and OCI
artifacts. It adds role-based access control, vulnerability scanning, and image replication on top
of the standard registry API. The web UI runs on ports 80 and 443.

## Software included

| Component | Version   |
| --------- | --------- |
| Harbor    | 2.15.0    |
| Ubuntu    | 24.04 LTS |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable                | Description                |
| ----------------------- | -------------------------- |
| `HARBOR_HOSTNAME`       | Public hostname for Harbor |
| `HARBOR_ADMIN_PASSWORD` | Harbor admin password      |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

Harbor generates unique credentials, prepares its Docker Compose stack, and starts automatically.
This can take several minutes. Track progress with:

```bash
sudo journalctl -u harbor-first-boot.service -f
```

Then verify the stack:

```bash
cd /opt/harbor/harbor && docker compose ps
```

### 3. Access the Harbor UI

Open a browser and navigate to:

```text
http://<your-vm-ip>
```

Read the generated login details:

```bash
sudo cat /root/.credentials/harbor.txt
```

| Field    | Value                                |
| -------- | ------------------------------------ |
| Username | `admin`                              |
| Password | From `/root/.credentials/harbor.txt` |

## Managing Harbor

Harbor runs as a Docker Compose stack in `/opt/harbor/harbor`.

```bash
# Check status
cd /opt/harbor/harbor && docker compose ps

# Restart
cd /opt/harbor/harbor && docker compose restart

# View logs
cd /opt/harbor/harbor && docker compose logs -f
```

| Path                            | Purpose                              |
| ------------------------------- | ------------------------------------ |
| `/opt/harbor/harbor/harbor.yml` | Main Harbor configuration            |
| `/data/harbor/`                 | Registry and application data        |
| `/root/.credentials/harbor.txt` | Generated login and database details |

If you attach an extra blank data disk before first boot, the image formats and mounts it at
`/data`. Without an extra disk, `/data/harbor` uses the root filesystem.

## Security

Harbor listens on port 80 by default. UFW is enabled and allows HTTP (port 80), HTTPS (port 443),
and SSH (port 22). Port 443 is reserved for Harbor HTTPS and has no TLS service until you enable it.

**To restrict Harbor to a specific IP:**

```bash
sudo ufw delete allow 80/tcp
sudo ufw delete allow 443/tcp
sudo ufw allow from <trusted-ip> to any port 80
sudo ufw allow from <trusted-ip> to any port 443
```

**To access the UI without leaving port 80 open, use an SSH tunnel:**

First close the public port on the VM, since it is open by default:

```bash
sudo ufw delete allow 80/tcp
sudo ufw delete allow 443/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8080
```

**For production use**, configure Harbor with a DNS name and trusted TLS certificate, or place it
behind a reverse proxy that terminates TLS before clients push images or artifacts.

:::caution

Treat `/root/.credentials/harbor.txt` as sensitive. Restrict registry access to approved users and
networks, and use TLS before sending registry credentials over the network.

:::

## Next steps

- [Harbor documentation](https://goharbor.io/docs/)
- [Harbor installation guide](https://goharbor.io/docs/latest/install-config/)
