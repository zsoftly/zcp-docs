---
title: Portainer
---

Portainer is a lightweight management UI for Docker and Kubernetes environments. It lets you deploy
containers, manage images, volumes, and networks, and monitor your stacks from a single web console.
The UI runs on port 9443 over HTTPS (port 9000 for plain HTTP).

:::note[Coming soon]

A pre-built Portainer image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Portainer yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 20 GB   | 40 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **Portainer**, and click **Deploy**, or create
   an **Ubuntu 24.04 LTS** instance from **Instances → Create**. Both give you a clean Ubuntu 24.04
   VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Portainer

Portainer runs as a Docker container, so install Docker Engine first using the official convenience
script:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Confirm Docker is running:

```bash
docker version
```

Create a volume for Portainer's persistent data:

```bash
docker volume create portainer_data
```

Run the Portainer CE server container:

```bash
sudo docker run -d \
  -p 8000:8000 \
  -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:lts
```

Confirm the container is running:

```bash
docker ps
```

## Configure Portainer

Portainer serves the UI on port 9443 over HTTPS with a self-signed certificate. Open
`https://<your-vm-ip>:9443` in a browser within a few minutes of starting the container. For
security, Portainer locks initial setup if no admin account is created shortly after first boot.

On first load, create your administrator account by setting a username and a strong password.
Portainer then connects to the local Docker environment through the mounted socket, so your
containers, images, and volumes appear immediately. The self-signed certificate triggers a browser
warning. For a production setup, put Portainer behind a reverse proxy such as nginx with a trusted
TLS certificate.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Portainer needs and
add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 9443/tcp
```

## Next steps

- [Portainer documentation](https://docs.portainer.io/)
- [Portainer installation guide](https://docs.portainer.io/start/install-ce/server/docker/linux)
