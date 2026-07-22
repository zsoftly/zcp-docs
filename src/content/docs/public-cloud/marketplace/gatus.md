---
title: Gatus
---

Gatus is an automated, developer-oriented health dashboard and status page with built-in alerting
and incident support. It monitors HTTP, TCP, DNS, ICMP, and other endpoints against conditions you
define, and publishes the results on a clean status page served on port 8080. It is configured
entirely through a single `config.yaml` file.

## Software included

| Component | Version   |
| --------- | --------- |
| Gatus     | 5.36.0    |
| Ubuntu    | 24.04 LTS |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script starts the Gatus Docker Compose stack. This takes under a minute.
Track progress:

```bash
journalctl -u gatus-first-boot.service -f
```

The login message (MOTD) confirms when Gatus is ready.

### 3. Verify Gatus is running

```bash
cd /opt/gatus
docker compose ps
curl -fsS http://127.0.0.1:8080/ > /dev/null
```

### 4. Access the Gatus dashboard

Open a browser and navigate to:

```text
http://<your-vm-ip>:8080
```

The included configuration monitors `https://example.com` every 30 seconds and records results in
SQLite.

## Managing Gatus

```bash
# Check container status
cd /opt/gatus && docker compose ps

# Restart
cd /opt/gatus && docker compose restart

# View logs
cd /opt/gatus && docker compose logs -f
```

| Path                            | Purpose                            |
| ------------------------------- | ---------------------------------- |
| `/opt/gatus/config.yaml`        | Monitors, conditions, and alerting |
| `/opt/gatus/docker-compose.yml` | Docker Compose configuration       |
| `/var/lib/gatus/gatus.db`       | Persistent SQLite data             |

After editing `/opt/gatus/config.yaml`, restart Gatus to apply the changes.

## Security

Port 8080 is accessible on the VM's network interface. UFW is enabled and allows SSH (port 22) and
Gatus (port 8080) by default.

**To restrict the dashboard to a specific IP:**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

**To access Gatus without exposing port 8080, use an SSH tunnel:**

First close the public port on the VM, since it is open by default:

```bash
sudo ufw delete allow 8080/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:8080 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
```

**For production use**, place Gatus behind a reverse proxy so you can serve it on port 443 with a
TLS certificate, and restrict direct access to port 8080.

:::caution

The status page can reveal service names, endpoints, and incident details. Restrict it to the
intended audience.

:::

## Next steps

- [Gatus documentation](https://github.com/TwiN/gatus)
- [Gatus configuration guide](https://github.com/TwiN/gatus#configuration)
