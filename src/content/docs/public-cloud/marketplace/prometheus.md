---
title: Prometheus
---

Prometheus is an open-source systems monitoring and alerting toolkit. It scrapes metrics from
configured targets at intervals, stores them in a time-series database, and evaluates rules to
trigger alerts. It exposes a query interface and built-in expression browser on port 9090, and pairs
well with Grafana for dashboards.

:::note[Coming soon]

A pre-built Prometheus image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Prometheus yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 50 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps** and switch to the **Marketplace** tab. It opens on
   **Featured** by default, so select **Marketplace** next to it. Pick your region (YOW-1 or YUL-1),
   search for **Ubuntu 24.04 LTS**, and click **Deploy**. You can also create the instance from
   **Instances → Create**. Either way you get a clean Ubuntu 24.04 VM.

   ![The Marketplace tab in the ZSoftly Cloud portal, showing the region selector, category list, search box, and Deploy buttons](../../../../assets/marketplace/deploy-marketplace-tab.webp)

   ![Searching the Marketplace for an app, with the search box filtering the catalog down to a matching Deploy card](../../../../assets/marketplace/deploy-marketplace-search.webp)

2. Choose a plan that meets the requirements above.

3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Prometheus

Install Prometheus from the official binary release and run it as a systemd service. This is the
common production method and gives you full control over the version.

Create a dedicated, unprivileged system user and the config and data directories:

```bash
sudo useradd --no-create-home --shell /bin/false prometheus
sudo mkdir -p /etc/prometheus /var/lib/prometheus
```

Download the latest release from prometheus.io and extract it. Check the
[releases page](https://prometheus.io/download/) for the current version and update it below:

```bash
PROM_VERSION=3.4.1
cd /tmp
curl -fsSLO https://github.com/prometheus/prometheus/releases/download/v${PROM_VERSION}/prometheus-${PROM_VERSION}.linux-amd64.tar.gz
tar -xzf prometheus-${PROM_VERSION}.linux-amd64.tar.gz
cd prometheus-${PROM_VERSION}.linux-amd64
```

Install the binaries and supporting files, then set ownership to the `prometheus` user:

```bash
sudo cp prometheus promtool /usr/local/bin/
sudo cp -r consoles console_libraries /etc/prometheus/
sudo cp prometheus.yml /etc/prometheus/prometheus.yml
sudo chown -R prometheus:prometheus /usr/local/bin/prometheus /usr/local/bin/promtool /etc/prometheus /var/lib/prometheus
```

Write a minimal scrape configuration. The default scrapes Prometheus itself on port 9090. Add your
own targets under `scrape_configs`:

```bash
sudo tee /etc/prometheus/prometheus.yml > /dev/null <<'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]
EOF
sudo chown prometheus:prometheus /etc/prometheus/prometheus.yml
```

Create the systemd service unit:

```bash
sudo tee /etc/systemd/system/prometheus.service > /dev/null <<'EOF'
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus/ \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries \
  --web.listen-address=0.0.0.0:9090
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

Reload systemd, then enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now prometheus
sudo systemctl status prometheus
```

## Configure Prometheus

1. Open `http://<your-vm-ip>:9090` in a browser to reach the Prometheus expression browser and
   built-in UI.
2. Add scrape targets by editing `/etc/prometheus/prometheus.yml` (for example, a `node_exporter`
   running on a host), then validate and reload:

```bash
promtool check config /etc/prometheus/prometheus.yml
sudo systemctl reload prometheus
```

3. Prometheus has no authentication of its own. For production, place it behind a reverse proxy such
   as Nginx or Caddy to add TLS and access control on port 443, and restrict direct access to
   port 9090.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port Prometheus needs and add
it to the instance's network/security rules in the portal:

```bash
sudo ufw allow 9090/tcp
```

## Next steps

- [Prometheus documentation](https://prometheus.io/docs/introduction/overview/)
- [Prometheus installation guide](https://prometheus.io/docs/prometheus/latest/installation/)
