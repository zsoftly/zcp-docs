---
title: Uptime Kuma
---

Uptime Kuma is a self-hosted monitoring tool that tracks the availability of websites, APIs, TCP
ports, and more. It sends notifications when a service goes down and publishes public status pages.
It runs as a single Docker container and is administered entirely through a web UI on port 3001.

## Software included

| Component   | Version       |
| ----------- | ------------- |
| Uptime Kuma | 2.4.0         |
| Docker      | Latest stable |
| Ubuntu      | 24.04 LTS     |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script starts Uptime Kuma with Docker Compose. This takes under a minute.
Track progress:

```bash
sudo journalctl -u uptime-kuma-first-boot.service -f
```

The login message (MOTD) confirms when Uptime Kuma is ready. You can also verify the container:

```bash
cd /opt/uptime-kuma && docker compose ps
```

### 3. Open an SSH tunnel

Uptime Kuma is bound to localhost to protect its unauthenticated first-run setup wizard. From your
local machine, open a tunnel:

```bash
ssh -L 3001:127.0.0.1:3001 ubuntu@<your-vm-ip>
```

### 4. Create the administrator account

With the tunnel running, open a browser and navigate to:

```text
http://127.0.0.1:3001
```

Complete the first-run wizard to create your administrator username and password. The image does not
create a shared default administrator account.

## Managing Uptime Kuma

Uptime Kuma runs as a Docker Compose stack in `/opt/uptime-kuma`.

```bash
# Check status
cd /opt/uptime-kuma && docker compose ps

# Restart
cd /opt/uptime-kuma && docker compose restart

# View logs
cd /opt/uptime-kuma && docker compose logs -f
```

| Path                                  | Purpose                       |
| ------------------------------------- | ----------------------------- |
| `/opt/uptime-kuma/docker-compose.yml` | Docker Compose configuration  |
| `/var/lib/uptime-kuma/`               | Monitors and persistent data  |
| `/etc/uptime-kuma/info.txt`           | Access and management details |

## Security

Uptime Kuma listens on port 3001, but the container publishes it on `127.0.0.1` only. UFW is enabled
and allows SSH (port 22) only by default. Use the SSH tunnel above to complete the administrator
setup before exposing the UI.

Keep the `127.0.0.1:3001:3001` binding in `/opt/uptime-kuma/docker-compose.yml`. Docker's published
ports bypass UFW because Docker manages its own iptables rules, so binding to `3001:3001` exposes
the UI to everyone regardless of any UFW rule. Reach the UI through the SSH tunnel above, or put it
behind a reverse proxy. If you must publish the port, add a rule in the `DOCKER-USER` chain or use
nftables to restrict it.

**For production use**, place Uptime Kuma behind a reverse proxy so you can serve it over HTTPS with
a trusted TLS certificate. Do not expose the first-run wizard publicly.

:::caution

Create the first administrator through the SSH tunnel before changing the localhost-only binding.
Until you complete the wizard, anyone who reaches the UI can claim the administrator account.

:::

## Next steps

- [Uptime Kuma documentation](https://github.com/louislam/uptime-kuma/wiki)
- [Uptime Kuma installation guide](https://github.com/louislam/uptime-kuma/wiki/%F0%9F%94%A7-How-to-Install)
