---
title: Beszel
---

Beszel is a lightweight server monitoring platform with historical data, Docker statistics, and
configurable alerts. It has two parts: a **hub** that serves the web dashboard on port 8090, and an
**agent** that runs on each monitored machine and reports system metrics to the hub. This guide
installs the hub on this VM and adds an agent to monitor the same machine.

## Software included

| Component    | Version   |
| ------------ | --------- |
| Beszel Hub   | 0.18.7    |
| Beszel Agent | 0.18.7    |
| Ubuntu       | 24.04 LTS |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script starts the Beszel hub. This takes under a minute. Track progress:

```bash
journalctl -u beszel-first-boot.service -f
```

The login message (MOTD) confirms when Beszel is ready.

### 3. Verify Beszel is running

```bash
cd /opt/beszel
docker compose ps
curl -fsS http://127.0.0.1:8090/ > /dev/null
```

### 4. Create the first administrator

Beszel is bound to localhost to protect its unauthenticated first-admin setup wizard. From your
local machine, start an SSH tunnel:

```bash
ssh -L 8090:127.0.0.1:8090 ubuntu@<your-vm-ip>
```

Then open `http://127.0.0.1:8090` and create the first administrator account. The image does not
create a shared default administrator password.

### 5. Add the local agent

The agent image is included but the agent is not started by default. In the Beszel UI, add this VM
as a system and copy the generated token and public key. Add those values to
`/opt/beszel/docker-compose.yml`, then start the agent profile.

```bash
cd /opt/beszel
docker compose --profile agent up -d beszel-agent
```

## Managing Beszel

```bash
# Check container status
cd /opt/beszel && docker compose ps

# Restart
cd /opt/beszel && docker compose restart

# View logs
cd /opt/beszel && docker compose logs -f
```

| Path                             | Purpose                      |
| -------------------------------- | ---------------------------- |
| `/opt/beszel/docker-compose.yml` | Docker Compose configuration |
| `/var/lib/beszel/`               | Hub data                     |
| `/var/lib/beszel-agent/`         | Local agent data             |

## Security

Port 8090 is bound to localhost. UFW is enabled and allows SSH (port 22) only by default. Use the
SSH tunnel above to create the first administrator safely.

To make the hub reachable from a trusted network after setup, change its Docker Compose port binding
from `127.0.0.1:8090:8090` to `8090:8090`, then allow a trusted IP:

```bash
sudo ufw allow from <trusted-ip> to any port 8090
```

**For production use**, keep Beszel bound to localhost and place it behind a reverse proxy so you
can serve it on port 443 with a TLS certificate.

:::caution

The first-admin setup wizard is unauthenticated until you create the first account. Complete setup
through the SSH tunnel before exposing the hub.

:::

## Next steps

- [Beszel documentation](https://beszel.dev/guide/getting-started)
- [Beszel hub installation guide](https://beszel.dev/guide/hub-installation)
