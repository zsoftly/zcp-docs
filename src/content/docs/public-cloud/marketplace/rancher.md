---
title: Rancher
---

Rancher is an open-source platform for deploying and managing Kubernetes clusters at scale. It gives
you a single web console to provision, import, monitor, and operate clusters across clouds, data
centres, and the edge, with centralised authentication, RBAC, and app catalogues. This guide runs
the official single-node Rancher server in Docker.

:::note[Coming soon]

A pre-built Rancher image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Rancher yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 40 GB   | 80 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps** and switch to the **Marketplace** tab, search for
   **Ubuntu 24.04 LTS**, and click **Deploy**. You can also create the instance from **Instances →
   Create**. Either way you get a clean Ubuntu 24.04 VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Rancher

Rancher is distributed as an official Docker image, so install Docker Engine first.

Set up Docker's official APT repository for Ubuntu 24.04 LTS (`noble`):

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

Install Docker Engine:

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Run the Rancher server, publishing the web UI on ports 80 and 443 and persisting data to the host:

```bash
sudo docker run -d --name rancher --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /opt/rancher:/var/lib/rancher \
  --privileged \
  rancher/rancher:latest
```

## Configure Rancher

Rancher generates a one-time bootstrap password on first start. Wait a minute for the container to
initialise, then read it from the logs:

```bash
sudo docker logs rancher 2>&1 | grep "Bootstrap Password:"
```

Open `https://<your-vm-ip>` in a browser. Rancher serves a self-signed certificate by default, so
your browser will warn about it on first visit. Sign in with the bootstrap password, then set a
permanent admin password and confirm the **Server URL** when prompted.

For a trusted certificate, point a DNS record at the VM and put Rancher behind a reverse proxy that
terminates TLS, or supply your own certificate following the Rancher documentation.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the ports Rancher serves and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Next steps

- [Rancher documentation](https://ranchermanager.docs.rancher.com/)
- [Rancher installation guide](https://ranchermanager.docs.rancher.com/getting-started/installation-and-upgrade/other-installation-methods/rancher-on-a-single-node-with-docker)
