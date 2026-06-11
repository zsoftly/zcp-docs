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

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Verify Docker is running

There is no first-boot configuration — Docker starts immediately after the VM boots.

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

No application ports are open by default. UFW is enabled and allows SSH (port 22) only.

When you publish container ports with `-p` or `ports:` in Compose, Docker manages its own iptables
rules. These rules bypass UFW, so a published port (e.g. `-p 80:80`) is accessible externally
regardless of your UFW configuration.

**To restrict a published port to a specific IP**, bind it explicitly:

```bash
docker run -p <trusted-ip>:80:80 <image>
```

Or in `docker-compose.yml`:

```yaml
ports:
  - '<trusted-ip>:80:80'
```

## Next steps

- [Docker documentation](https://docs.docker.com/)
- [Docker Compose reference](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
