---
title: Artifactory
---

JFrog Artifactory is a universal binary and artifact repository manager. The open-source edition
stores and proxies packages for many formats, including Maven, Gradle, Debian, and generic binaries,
and acts as the single source of truth for your build artifacts. The web UI runs on port 8082.

:::note[Coming soon]

A pre-built Artifactory image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Artifactory yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 40 GB   | 100 GB      |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **Artifactory**, and click **Deploy**, or
   create an **Ubuntu 24.04 LTS** instance from **Instances → Create**. Both give you a clean Ubuntu
   24.04 VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Artifactory

The simplest supported path is the official Docker image. Install Docker Engine first using the
official convenience script:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Confirm Docker is running:

```bash
docker version
```

Create a host directory for Artifactory's persistent data and set the ownership the container
expects (uid/gid `1030`):

```bash
sudo mkdir -p /opt/artifactory/var
sudo chown -R 1030:1030 /opt/artifactory/var
```

Run the Artifactory OSS container from the official JFrog registry:

```bash
sudo docker run -d \
  --name artifactory \
  --restart=always \
  -p 8081:8081 \
  -p 8082:8082 \
  -v /opt/artifactory/var:/var/opt/jfrog/artifactory \
  releases-docker.jfrog.io/jfrog/artifactory-oss:latest
```

Confirm the container is running:

```bash
docker ps
```

## Configure Artifactory

Artifactory takes a minute or two to initialize on first start. Port 8082 serves the JFrog Platform
UI and unified repository endpoints, while port 8081 serves the legacy API. Open
`http://<your-vm-ip>:8082/ui/` in a browser and sign in with the default credentials:

- Username: `admin`
- Password: `password`

You are prompted to change the admin password immediately and to set the base URL. Complete the
setup wizard to configure your repositories. For a production setup, put Artifactory behind a
reverse proxy such as nginx with a TLS certificate and serve the UI over HTTPS instead of exposing
port 8082 directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Artifactory needs and
add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8082/tcp
```

## Next steps

- [Artifactory documentation](https://jfrog.com/help/r/jfrog-artifactory-documentation)
- [Artifactory installation guide](https://jfrog.com/help/r/jfrog-installation-setup-documentation/install-artifactory-single-node-with-docker)
