---
title: n8n
---

n8n is an open-source workflow automation platform that lets you connect apps, APIs, and services
using a visual node-based editor. It supports hundreds of integrations and can run custom JavaScript
logic inside workflows.

## Software included

| Component      | Version       |
| -------------- | ------------- |
| n8n            | 1.121.0       |
| Docker         | Latest stable |
| Docker Compose | Latest stable |
| Ubuntu         | 24.04 LTS     |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script runs automatically. It:

- Generates a random encryption key for securing credentials stored in n8n
- Writes the environment configuration to `/opt/n8n/.env`
- Starts n8n using Docker Compose

This takes under 60 seconds. Track progress:

```bash
journalctl -u n8n-first-boot.service -f
```

### 3. Access the n8n UI

Open a browser and navigate to:

```text
http://<your-vm-ip>:5678
```

On the first visit, n8n will prompt you to create an owner account (email and password of your
choice). This account is stored locally on the VM.

## Optional: set a custom webhook URL

If n8n will be accessible via a domain name, provide the URL at deploy time using cloud-init
userdata. This allows webhooks to use your domain instead of the VM's IP.

Add this to your VM's userdata at deploy time:

```yaml
#cloud-config
write_files:
  - path: /run/n8n-webhook-url
    content: 'https://n8n.example.com'
    permissions: '0600'
    owner: root:root
```

If no URL is provided, n8n defaults to `http://<vm-ip>:5678`.

## Managing n8n

n8n runs as a Docker Compose service in `/opt/n8n`.

```bash
# Check status
cd /opt/n8n && docker compose ps

# Restart
cd /opt/n8n && docker compose restart

# View logs
cd /opt/n8n && docker compose logs -f

# Stop
cd /opt/n8n && docker compose down

# Start
cd /opt/n8n && docker compose up -d
```

Workflow data is persisted in `/opt/n8n/data`.

Environment configuration: `/opt/n8n/.env`

## Security

Port 5678 is accessible on the VM's network interface. UFW is enabled and allows SSH (port 22) only
by default.

**To allow browser access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 5678
```

**To access the UI without opening the firewall, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 5678:localhost:5678 ubuntu@<your-vm-ip>

# Then open in browser
http://localhost:5678
```

**For production use**, place n8n behind a reverse proxy with HTTPS and a domain name, then set
`N8N_SECURE_COOKIE=true` in `/opt/n8n/.env`.

## Next steps

- [n8n documentation](https://docs.n8n.io/)
- [n8n workflow templates](https://n8n.io/workflows/)
- [Self-hosting guide](https://docs.n8n.io/hosting/)
