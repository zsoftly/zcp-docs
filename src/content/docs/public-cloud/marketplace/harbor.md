---
title: Harbor
---

Harbor is an open-source container registry that stores, signs, and scans container images and OCI
artifacts. It adds role-based access control, vulnerability scanning, and image replication on top
of the standard registry API. The web UI runs on ports 80 and 443.

:::note[Coming soon]

A pre-built Harbor image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Harbor yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 40 GB   | 100 GB      |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **Harbor**, and click **Deploy**, or create an
   **Ubuntu 24.04 LTS** instance from **Instances → Create**. Both give you a clean Ubuntu 24.04 VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Harbor

Harbor runs as a set of containers orchestrated by Docker Compose, so install Docker Engine (which
includes the Compose plugin) first using the official convenience script:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Confirm Docker and Compose are available:

```bash
docker version
docker compose version
```

Download the latest Harbor online installer from the official releases page (check
[github.com/goharbor/harbor/releases](https://github.com/goharbor/harbor/releases) for the current
version and update the URL accordingly):

```bash
cd /opt
sudo curl -L -O https://github.com/goharbor/harbor/releases/download/v2.14.0/harbor-online-installer-v2.14.0.tgz
sudo tar -xzf harbor-online-installer-v2.14.0.tgz
cd harbor
```

Copy the configuration template:

```bash
sudo cp harbor.yml.tmpl harbor.yml
```

## Configure Harbor

Edit `harbor.yml` before running the installer:

```bash
sudo nano harbor.yml
```

Set at least these values:

- `hostname`: your VM's public IP address or DNS name (clients use this to reach the registry).
- `harbor_admin_password`: change it from the default `Harbor12345`.
- TLS: for a quick start, comment out the entire `https:` block to serve over HTTP on port 80. For
  production, keep `https:` enabled and point `certificate` and `private_key` at a valid TLS
  certificate. Container clients require HTTPS unless the registry is explicitly trusted as
  insecure.

Run the installer:

```bash
sudo ./install.sh
```

The installer pulls the Harbor images and starts the stack with Docker Compose. When it finishes,
open `http://<your-vm-ip>` (or `https://` if TLS is enabled) in a browser and sign in:

- Username: `admin`
- Password: the `harbor_admin_password` you set in `harbor.yml`

Manage the running stack with Docker Compose from the `/opt/harbor` directory:

```bash
sudo docker compose ps
sudo docker compose down
sudo docker compose up -d
```

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Harbor needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Next steps

- [Harbor documentation](https://goharbor.io/docs/)
- [Harbor installation guide](https://goharbor.io/docs/latest/install-config/)
