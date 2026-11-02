---
title: Portainer
---

Portainer is a lightweight management UI for Docker and Kubernetes environments. It lets you deploy
containers, manage images, volumes, and networks, and monitor your stacks from a single web console.
The UI runs on port 9443 over HTTPS.

## Software included

| Component    | Version       |
| ------------ | ------------- |
| Portainer CE | 2.39.4        |
| Docker       | Latest stable |
| Ubuntu       | 24.04 LTS     |

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 20 GB   | 40 GB       |

The storage figure is your root disk size. Choose it on the **OS Disk Offering** step when you
create the instance. You pay for it per GB, separate from the plan.

## Environment variables

This image takes no deploy-time variables. It creates no shared administrator account. Open the
Portainer UI after first boot and create the first administrator there.

If the first-user setup session expires before you finish, restart Portainer and reload the UI:

```bash
cd /opt/portainer && docker compose restart portainer
```

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script starts the Portainer container with Docker Compose. This takes
under a minute. Track progress:

```bash
journalctl -u portainer-first-boot.service -f
```

The login message (MOTD) confirms when Portainer is ready.

### 3. Create the administrator account

Open a browser and navigate to:

```text
https://<your-vm-ip>:9443
```

On first load, create your administrator account by setting a username and a strong password.
Portainer connects to the local Docker environment through the mounted socket, so your containers,
images, and volumes appear immediately.

:::caution

Portainer locks initial setup if no admin account is created shortly after the container starts. If
the setup window expires, restart Portainer and reload the page:

```bash
cd /opt/portainer && docker compose restart
```

The UI uses a self-signed certificate, so your browser shows a security warning. Accept the
exception to proceed.

:::

## Managing Portainer

Portainer runs as a Docker Compose stack in `/opt/portainer`.

```bash
# Check status
cd /opt/portainer && docker compose ps

# Restart
cd /opt/portainer && docker compose restart

# View logs
cd /opt/portainer && docker compose logs -f
```

Portainer's persistent data is stored in `/var/lib/portainer`. A summary of URLs and paths is
written to `/etc/portainer/info.txt`.

## Security

Port 9443 is open on the VM's network interface. UFW is enabled and allows SSH (port 22) and
Portainer (port 9443). Ports 8000, 9000, and the Docker API are not opened by default.

Portainer bind-mounts the host Docker socket, giving it full control of the VM's Docker daemon.
Restrict access to port 9443:

```bash
sudo ufw delete allow 9443/tcp
sudo ufw allow from <trusted-ip> to any port 9443
```

**For production use**, place Portainer behind a reverse proxy such as nginx with a trusted TLS
certificate.

## Next steps

- [Portainer documentation](https://docs.portainer.io/)
- [Managing Docker environments](https://docs.portainer.io/user/docker)
