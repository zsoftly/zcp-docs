---
title: Coolify
---

Coolify is an open-source, self-hosted PaaS and a drop-in alternative to Heroku, Netlify, and
Vercel. It deploys applications, databases, and services to your own server with Git-based workflows
and a web dashboard, while keeping all your data under your control.

## Software included

| Component      | Version       |
| -------------- | ------------- |
| Coolify        | 4.1.2         |
| Docker         | Latest stable |
| Docker Compose | Latest stable |
| Ubuntu         | 24.04 LTS     |

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 30 GB   | 60 GB       |

Coolify also runs the applications you deploy, so size the instance for those workloads too.

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates the application secrets and starts the full Coolify
stack with Docker Compose. This takes 1-2 minutes. Track progress:

```bash
journalctl -u coolify-first-boot.service -f
```

The login message (MOTD) confirms when Coolify is ready.

### 3. Create the administrator account

Open the dashboard in your browser:

```text
http://<your-vm-ip>:8000
```

The first account you create becomes the root administrator. Set a strong email and password
immediately, since registration closes after the first user.

### 4. Configure your instance

1. Under **Settings**, set your instance's domain so Coolify can issue Let's Encrypt TLS
   certificates and serve the dashboard over HTTPS. Coolify includes a built-in reverse proxy that
   handles routing and certificates for both the dashboard and your deployed apps. DNS must point at
   the VM before certificates can be issued.
2. Connect a Git source (GitHub, GitLab, or a generic repository) to start deploying applications.

## Managing Coolify

Coolify runs as a Docker Compose stack in `/data/coolify/source`.

```bash
# Check status
cd /data/coolify/source && docker compose ps

# Restart
cd /data/coolify/source && docker compose restart

# View logs
cd /data/coolify/source && docker compose logs -f
```

A summary of URLs and paths is written to `/data/coolify/info.txt`.

## Security

Ports 8000 (dashboard), 6001 (realtime), 6002 (terminal), 80, and 443 are open on the VM's network
interface. UFW is enabled and allows those ports plus SSH (port 22). Ports 80 and 443 serve your
deployed apps and TLS.

Once you configure a custom domain with Let's Encrypt, reach the dashboard over HTTPS on port 443.
You can then close ports 8000, 6001, and 6002 if you no longer need direct access:

```bash
sudo ufw delete allow 8000/tcp
sudo ufw delete allow 6001/tcp
sudo ufw delete allow 6002/tcp
```

Complete the administrator setup promptly after first boot so no one else can claim the root
account.

## Next steps

- [Coolify documentation](https://coolify.io/docs)
- [Getting started with Coolify](https://coolify.io/docs/get-started/introduction)
