---
title: Gitea
---

Gitea is a lightweight, self-hosted Git service written in Go. It packages repository hosting, code
review, issue tracking, and a built-in CI runner into a single binary that runs comfortably on a
small VM. The web UI runs on port 3000 and Git over SSH on port 22.

:::note[Coming soon]

A pre-built Gitea image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Gitea yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 20 GB   | 40 GB       |

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

## Install Gitea

Install Git and a couple of dependencies first:

```bash
sudo apt install -y git git-lfs
```

Download the latest Gitea binary and install it to `/usr/local/bin`. Check
[dl.gitea.com](https://dl.gitea.com/gitea/) for the current version and replace `1.26.2` below if a
newer release is available:

```bash
wget -O gitea https://dl.gitea.com/gitea/1.26.2/gitea-1.26.2-linux-amd64
sudo cp gitea /usr/local/bin/gitea
sudo chmod 755 /usr/local/bin/gitea
```

Create a dedicated `git` system user that Gitea runs as:

```bash
sudo adduser --system --shell /bin/bash --gecos 'Git Version Control' \
  --group --disabled-password --home /home/git git
```

Create the data and configuration directories:

```bash
sudo mkdir -p /var/lib/gitea/{custom,data,log}
sudo chown -R git:git /var/lib/gitea/
sudo chmod -R 750 /var/lib/gitea/
sudo mkdir /etc/gitea
sudo chown root:git /etc/gitea
sudo chmod 770 /etc/gitea
```

Install the systemd service shipped with Gitea, then enable and start it:

```bash
sudo wget -O /etc/systemd/system/gitea.service \
  https://raw.githubusercontent.com/go-gitea/gitea/release/v1.26/contrib/systemd/gitea.service
sudo systemctl daemon-reload
sudo systemctl enable --now gitea
sudo systemctl status gitea
```

## Configure Gitea

Gitea listens on port 3000. Open `http://<your-vm-ip>:3000` in a browser to run the initial
installation wizard. Accept the default SQLite database for a small instance, or point Gitea at
PostgreSQL/MySQL for larger deployments.

Before finishing, set the **Application URL** to your server's address and create the first
administrator account at the bottom of the form. The first registered user becomes the admin. The
wizard writes its settings to `/etc/gitea/app.ini`, so tighten file permissions afterward:

```bash
sudo chmod 750 /etc/gitea
sudo chmod 640 /etc/gitea/app.ini
```

For a production setup, put Gitea behind a reverse proxy such as nginx with a TLS certificate, then
serve the UI over HTTPS instead of exposing port 3000 directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Gitea needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 3000/tcp
```

Git over SSH uses the existing port 22. To run Gitea's built-in SSH server on a separate port
instead, open that port as well (for example `sudo ufw allow 2222/tcp`).

## Next steps

- [Gitea documentation](https://docs.gitea.com/)
- [Gitea installation guide](https://docs.gitea.com/installation/install-from-binary)
