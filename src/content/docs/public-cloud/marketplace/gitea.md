---
title: Gitea
---

Gitea is a lightweight, self-hosted Git service written in Go. Its server binary includes repository
hosting, code review, issue tracking, and Gitea Actions for server-side CI/CD. The server runs
comfortably on a small VM. Running workflows requires a separate `act_runner` (Gitea Runner) that
you install and register. The web UI runs on port 3000 and Git over SSH on port 22.

## Software included

| Component | Version   |
| --------- | --------- |
| Gitea     | 1.27.0    |
| Ubuntu    | 24.04 LTS |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable               | Description          |
| ---------------------- | -------------------- |
| `GITEA_DOMAIN`         | Public Gitea domain  |
| `GITEA_ADMIN_USER`     | Gitea admin username |
| `GITEA_ADMIN_PASSWORD` | Gitea admin password |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates application secrets, configures Gitea with SQLite,
starts the service, and creates the administrator account. Track progress:

```bash
journalctl -u gitea-first-boot.service -f
```

The login message (MOTD) confirms when Gitea is ready.

### 3. Verify Gitea is running

```bash
systemctl status gitea
curl -fsS http://127.0.0.1:3000/api/healthz
```

### 4. Access the Gitea UI

Open a browser and navigate to:

```text
http://<your-vm-ip>:3000
```

Retrieve the generated credentials:

```bash
sudo cat /etc/gitea/credentials.txt
```

| Field    | Value                                                                                    |
| -------- | ---------------------------------------------------------------------------------------- |
| Username | `zadmin` by default, or the `GITEA_ADMIN_USER` you set. See `/etc/gitea/credentials.txt` |
| Password | From `/etc/gitea/credentials.txt`                                                        |

Git over SSH uses the VM's SSH service on port 22.

## Managing Gitea

```bash
# Check service status
systemctl status gitea

# Restart
sudo systemctl restart gitea

# View logs
sudo journalctl -u gitea -f
```

| Path                   | Purpose                                    |
| ---------------------- | ------------------------------------------ |
| `/etc/gitea/app.ini`   | Main configuration                         |
| `/var/lib/gitea/data/` | Repositories, SQLite database, and uploads |
| `/var/lib/gitea/log/`  | Gitea log files                            |

## Security

Port 3000 is accessible on the VM's network interface. UFW is enabled and allows SSH (port 22) and
Gitea (port 3000) by default.

**To restrict the UI to a specific IP:**

```bash
sudo ufw delete allow 3000/tcp
sudo ufw allow from <trusted-ip> to any port 3000
```

**To access the UI without exposing port 3000, use an SSH tunnel:**

First close the public port on the VM, since it is open by default:

```bash
sudo ufw delete allow 3000/tcp
```

```bash
# Run this on your local machine
ssh -L 3000:localhost:3000 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:3000
```

**For production use**, place Gitea behind a reverse proxy so you can serve it on port 443 with a
TLS certificate. Keep SSH access on port 22 restricted to approved users and networks.

:::caution

Keep `/etc/gitea/credentials.txt` private and change the initial administrator password after your
first login.

:::

## Next steps

- [Gitea documentation](https://docs.gitea.com/)
- [Gitea installation guide](https://docs.gitea.com/installation/install-from-binary)
