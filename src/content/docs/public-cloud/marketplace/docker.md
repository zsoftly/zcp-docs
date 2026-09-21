---
title: Docker
---

Docker is an open-source platform for building, shipping, and running applications in containers.
This image provides a clean Ubuntu 24.04 environment with Docker CE and Docker Compose
pre-installed, ready for you to deploy any containerised workload.

## Software included

| Component             | Version       |
| --------------------- | ------------- |
| Docker CE             | Latest stable |
| Docker Compose plugin | Latest stable |
| Ubuntu                | 24.04 LTS     |

:::note

Docker Engine 29 stores images in the containerd image store on a fresh install. Images you pull or
build are held there rather than in the classic graph driver, which changes the output of some
`docker image` commands and enables multi-platform images by default.

:::

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Verify Docker is running

There is no first-boot configuration. Docker starts immediately after the VM boots.

```bash
docker version
docker compose version
```

The `ubuntu` user is pre-added to the `docker` group, so you can run Docker commands without `sudo`.

### 3. Run your first container

```bash
docker run --rm hello-world
```

### 4. Deploy with Docker Compose

Create a `docker-compose.yml` file and bring up your stack:

```bash
docker compose up -d
```

## Managing Docker

```bash
# List running containers
docker ps

# View logs for a container
docker logs <container-name> -f

# Stop a container
docker stop <container-name>

# Pull the latest image
docker pull <image-name>
```

```bash
# Check Docker service status
systemctl status docker

# Restart Docker
sudo systemctl restart docker
```

Docker log files are limited to 10 MB per file with a maximum of 3 rotated files to prevent disk
exhaustion.

## Security

UFW is not enabled by default in the current marketplace image.

The [ZCP firewall](/public-cloud/compute/settings/firewall/) and
[port-forwarding](/public-cloud/compute/settings/port-forwarding/) rules remain part of exposure
control. Before you expose application ports, enable and configure UFW or another host firewall. To
use UFW, allow SSH before you enable it:

```bash
sudo ufw allow 22/tcp
sudo ufw enable
sudo ufw status
```

When you publish container ports with `-p` or `ports:` in Compose, Docker manages its own iptables
rules. These rules can bypass UFW, so do not rely on UFW alone to restrict a published port.

**To make a published port available only on the VM**, bind it to the loopback interface:

```bash
docker run -p 127.0.0.1:80:80 <image>
```

Or in `docker-compose.yml`:

```yaml
ports:
  - '127.0.0.1:80:80'
```

## Next steps

- [Docker documentation](https://docs.docker.com/)
- [Docker Compose reference](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
