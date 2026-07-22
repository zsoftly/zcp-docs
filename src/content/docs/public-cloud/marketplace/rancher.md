---
title: Rancher
---

Rancher is an open-source platform for deploying and managing Kubernetes clusters at scale. It gives
you a single web console to provision, import, monitor, and operate clusters across clouds, data
centres, and the edge, with centralised authentication, RBAC, and app catalogues. This guide runs
the official single-node Rancher server in Docker.

## Software included

| Component | Version       |
| --------- | ------------- |
| Rancher   | 2.14.3        |
| Docker    | Latest stable |
| Ubuntu    | 24.04 LTS     |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable             | Description                |
| -------------------- | -------------------------- |
| `RANCHER_HOSTNAME`   | Public Rancher hostname    |
| `BOOTSTRAP_PASSWORD` | Rancher bootstrap password |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script prepares persistent storage, starts Rancher with Docker Compose,
imports the cached K3s system images, and waits for the API and dashboard. This can take several
minutes. Track progress:

```bash
sudo journalctl -u rancher-first-boot.service -f
```

The login message (MOTD) confirms when Rancher is ready. You can also verify the container directly:

```bash
cd /opt/rancher && docker compose ps
```

### 3. Retrieve the bootstrap credentials

The generated bootstrap password and setup details are stored in a root-only file:

```bash
sudo cat /etc/rancher/credentials.txt
```

| Field    | Value                                                              |
| -------- | ------------------------------------------------------------------ |
| Username | `admin`                                                            |
| Password | Value of `BOOTSTRAP_PASSWORD`, or generated securely on first boot |

### 4. Access the Rancher UI

Open a browser and navigate to your Rancher URL. If you set `RANCHER_HOSTNAME` at deploy time, use
it and make sure a DNS record for that hostname resolves to the VM first:

```text
https://<RANCHER_HOSTNAME>
```

If you left `RANCHER_HOSTNAME` unset, reach the VM directly by IP:

```text
https://<your-vm-ip>
```

Rancher starts with a self-signed certificate, so your browser displays a warning. Accept the
exception, sign in with the bootstrap password, then set a permanent administrator password.

## Managing Rancher

Rancher runs as a Docker Compose stack in `/opt/rancher`.

```bash
# Check status
cd /opt/rancher && docker compose ps

# Restart
cd /opt/rancher && docker compose restart

# View logs
cd /opt/rancher && docker compose logs -f
```

| Path                              | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| `/opt/rancher/docker-compose.yml` | Docker Compose configuration              |
| `/opt/rancher/.env`               | Bootstrap password and server URL         |
| `/data/rancher/`                  | Persistent Rancher data                   |
| `/etc/rancher/credentials.txt`    | Bootstrap credentials and storage details |

If the VM has an extra blank data disk at first boot, the image formats it as ext4, mounts it at
`/data`, and stores Rancher data there. Otherwise, `/data/rancher` remains on the root filesystem.

## Security

Rancher uses port 80 for HTTP and port 443 for HTTPS. UFW is enabled and allows SSH (port 22) plus
ports 80 and 443 by default.

**To restrict web access to a specific IP:**

```bash
sudo ufw delete allow 80/tcp
sudo ufw delete allow 443/tcp
sudo ufw allow from <trusted-ip> to any port 443
```

**To access Rancher through an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8443:localhost:443 ubuntu@<your-vm-ip>

# Then open in your browser
https://localhost:8443
```

**For production use**, place Rancher behind a reverse proxy with a trusted TLS certificate. The
single-node Docker installation is intended for development and testing. Rancher recommends a
high-availability Kubernetes installation for production.

:::caution

Change the bootstrap password during your first login. Rancher controls connected Kubernetes
clusters, so restrict its UI to trusted administrator networks.

:::

## Next steps

- [Rancher documentation](https://ranchermanager.docs.rancher.com/)
- [Rancher installation guide](https://ranchermanager.docs.rancher.com/getting-started/installation-and-upgrade/other-installation-methods/rancher-on-a-single-node-with-docker)
