---
title: Prometheus
---

Prometheus is an open-source systems monitoring and alerting toolkit. It scrapes metrics from
configured targets at intervals, stores them in a time-series database, and evaluates rules to
trigger alerts. It exposes a query interface and built-in expression browser on port 9090, and pairs
well with Grafana for dashboards.

## Software included

| Component  | Version   |
| ---------- | --------- |
| Prometheus | 3.4.1     |
| Ubuntu     | 24.04 LTS |

The image ships the Prometheus server only. Add exporters (such as `node_exporter`) as scrape
targets, and run Alertmanager separately as its own component to handle alert routing.

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 50 GB       |

Storage requirements grow with the number of series and the retention period.

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script starts the service. This takes under a minute. Track progress:

```bash
journalctl -u prometheus-first-boot.service -f
```

The login message (MOTD) confirms when Prometheus is ready.

### 3. Access the Prometheus UI

Open a browser and navigate to the expression browser and built-in UI:

```text
http://<your-vm-ip>:9090
```

### 4. Add scrape targets

Edit the scrape configuration, validate it, and reload without a restart:

```bash
sudo nano /etc/prometheus/prometheus.yml
promtool check config /etc/prometheus/prometheus.yml
sudo systemctl reload prometheus
```

## Managing Prometheus

Prometheus runs as a systemd service under a dedicated `prometheus` user.

```bash
# Check status
systemctl status prometheus

# Restart
sudo systemctl restart prometheus

# Reload the config without restarting
sudo systemctl reload prometheus

# View logs
sudo journalctl -u prometheus -f
```

| Path                             | Purpose                     |
| -------------------------------- | --------------------------- |
| `/etc/prometheus/prometheus.yml` | Main configuration          |
| `/var/lib/prometheus/`           | Time-series database (TSDB) |

## Security

Port 9090 is open on the VM's network interface, and Prometheus has **no built-in authentication**.
UFW is enabled and allows SSH (port 22) and Prometheus (port 9090).

**To restrict the UI to a specific IP:**

```bash
sudo ufw delete allow 9090/tcp
sudo ufw allow from <trusted-ip> to any port 9090
```

**To reach the UI without opening the firewall, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 9090:localhost:9090 ubuntu@<your-vm-ip>
```

**For production use**, place Prometheus behind a reverse proxy such as Nginx or Caddy to add TLS
and access control on port 443, and restrict direct access to port 9090.

## Next steps

- [Prometheus documentation](https://prometheus.io/docs/introduction/overview/)
- [Configuration reference](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)
