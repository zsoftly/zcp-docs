---
title: Forgejo
---

Forgejo is a self-hosted Git forge, maintained as a community-driven fork of Gitea. It bundles
repository hosting, pull requests, issue tracking, packages, and CI actions into a single Go binary
that runs well on modest hardware. The web UI runs on port 3000 and Git over SSH on port 22.

:::note[Coming soon]

A pre-built Forgejo image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Forgejo yourself.

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

## Install Forgejo

Install Git and a couple of dependencies first:

```bash
sudo apt install -y git git-lfs
```

Download the latest Forgejo binary and install it to `/usr/local/bin`. Check the
[Forgejo download page](https://forgejo.org/download/) for the current version and replace `15.0.3`
below if a newer release is available:

```bash
wget -O forgejo \
  https://codeberg.org/forgejo/forgejo/releases/download/v15.0.3/forgejo-15.0.3-linux-amd64
sudo cp forgejo /usr/local/bin/forgejo
sudo chmod 755 /usr/local/bin/forgejo
```

Create a dedicated `git` system user that Forgejo runs as:

```bash
sudo adduser --system --shell /bin/bash --gecos 'Git Version Control' \
  --group --disabled-password --home /home/git git
```

Create the data and configuration directories:

```bash
sudo mkdir -p /var/lib/forgejo
sudo chown git:git /var/lib/forgejo && sudo chmod 750 /var/lib/forgejo
sudo mkdir /etc/forgejo
sudo chown root:git /etc/forgejo && sudo chmod 770 /etc/forgejo
```

Install the systemd service shipped with Forgejo, then enable and start it:

```bash
sudo wget -O /etc/systemd/system/forgejo.service \
  https://codeberg.org/forgejo/forgejo/raw/branch/forgejo/contrib/systemd/forgejo.service
sudo systemctl daemon-reload
sudo systemctl enable --now forgejo
sudo systemctl status forgejo
```

## Configure Forgejo

Forgejo listens on port 3000. Open `http://<your-vm-ip>:3000` in a browser to run the initial
installation wizard. Accept the default SQLite database for a small instance, or point Forgejo at
PostgreSQL/MySQL for larger deployments.

Before finishing, set the **Application URL** to your server's address and create the first
administrator account at the bottom of the form. The first registered user becomes the admin. The
wizard writes its settings to `/etc/forgejo/app.ini`, so tighten file permissions afterward:

```bash
sudo chmod 750 /etc/forgejo
sudo chmod 640 /etc/forgejo/app.ini
```

For a production setup, put Forgejo behind a reverse proxy such as nginx with a TLS certificate,
then serve the UI over HTTPS instead of exposing port 3000 directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Forgejo needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 3000/tcp
```

Git over SSH uses the existing port 22. To run Forgejo's built-in SSH server on a separate port
instead, open that port as well (for example `sudo ufw allow 2222/tcp`).

## Next steps

- [Forgejo documentation](https://forgejo.org/docs/latest/)
- [Forgejo installation guide](https://forgejo.org/docs/latest/admin/installation/binary/)
