---
title: Grafana
---

Grafana is an open-source observability platform for visualising metrics, logs, and traces. It
connects to data sources such as InfluxDB, Prometheus, Elasticsearch, and MySQL, and renders them as
interactive dashboards with alerting. It is widely used for infrastructure monitoring, application
performance tracking, and business intelligence.

## Software included

| Component   | Version       |
| ----------- | ------------- |
| Grafana OSS | Latest stable |
| Ubuntu      | 24.04 LTS     |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Verify Grafana is running

There is no first-boot configuration — Grafana starts immediately after the VM boots.

```bash
systemctl status grafana-server
```

### 3. Access the Grafana UI

Open a browser and navigate to:

```text
http://<your-vm-ip>:3000
```

Log in with the default credentials:

| Field    | Value   |
| -------- | ------- |
| Username | `admin` |
| Password | `admin` |

You will be prompted to set a new password on first login.

### 4. Add a data source

Once logged in:

1. Go to **Connections** → **Data sources**
2. Click **Add data source**
3. Select your data source type (InfluxDB, Prometheus, MySQL, etc.)
4. Enter the connection details and click **Save & test**

## Managing Grafana

```bash
# Check service status
systemctl status grafana-server

# Restart
sudo systemctl restart grafana-server

# View logs
sudo journalctl -u grafana-server -f
```

| Path                       | Purpose                           |
| -------------------------- | --------------------------------- |
| `/etc/grafana/grafana.ini` | Main configuration                |
| `/var/lib/grafana/`        | Dashboards, plugins, and database |

## Security

Port 3000 is accessible on the VM's network interface. UFW is enabled and allows SSH (port 22) only
by default.

**To allow browser access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 3000
```

**To access the UI without opening the firewall, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 3000:localhost:3000 ubuntu@<your-vm-ip>

# Then open in browser
http://localhost:3000
```

**For production use**, place Grafana behind a reverse proxy such as Nginx or Caddy so you can serve
it on port 443 with a TLS certificate.

:::caution

Change the default `admin` password immediately after first login. Grafana has access to all
connected data sources — treat it as a sensitive internal tool and restrict access to known IPs.

:::

## Next steps

- [Grafana documentation](https://grafana.com/docs/grafana/latest/)
- [Dashboard best practices](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/)
- [Grafana alerting](https://grafana.com/docs/grafana/latest/alerting/)
