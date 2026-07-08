---
title: InfluxDB 2
---

InfluxDB is a purpose-built time series database optimised for storing and querying metrics, events,
and real-time analytics. It is commonly paired with Grafana for infrastructure monitoring and IoT
data pipelines.

## Software included

| Component | Version   |
| --------- | --------- |
| InfluxDB  | 2.x       |
| Ubuntu    | 24.04 LTS |

## Environment variables

You can optionally set these when deploying InfluxDB from the marketplace. Leave any field blank to
have a secure random value generated automatically.

| Variable                        | Description               |
| ------------------------------- | ------------------------- |
| `DOCKER_INFLUXDB_INIT_USERNAME` | Initial admin username    |
| `DOCKER_INFLUXDB_INIT_PASSWORD` | Initial admin password    |
| `DOCKER_INFLUXDB_INIT_ORG`      | Initial organisation name |
| `DOCKER_INFLUXDB_INIT_BUCKET`   | Initial bucket name       |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script runs automatically. It:

- Starts InfluxDB and waits for it to become ready
- Runs the initial setup with a randomly generated admin password and API token
- Creates the default organisation (`zsoftly`) and bucket (`default`)
- Saves all credentials to `/etc/influxdb/credentials.txt`

This takes under 60 seconds. Track progress:

```bash
journalctl -u influxdb-first-boot.service -f
```

### 3. Retrieve credentials

```bash
sudo cat /etc/influxdb/credentials.txt
```

This file contains the admin username, password, organisation, default bucket, and API token. It is
only readable by root.

### 4. Access the InfluxDB UI

Open a browser and navigate to:

```text
http://<your-vm-ip>:8086
```

Log in with the `admin` username and password from the credentials file.

### 5. Connect via the CLI

The `influx` CLI is pre-installed. Configure it with the credentials from the file:

```bash
TOKEN=$(sudo awk '/^Token:/{print $NF}' /etc/influxdb/credentials.txt)
influx config create \
  --config-name default \
  --host-url http://localhost:8086 \
  --org zsoftly \
  --token "$TOKEN" \
  --active
```

Verify the connection:

```bash
influx ping
```

## Managing InfluxDB

```bash
# Check service status
systemctl status influxdb

# Restart
sudo systemctl restart influxdb

# View logs
sudo journalctl -u influxdb -f
```

Configuration file: `/etc/influxdb/config.toml`

## Security

Port 8086 is accessible on the VM's network interface. UFW is enabled and allows SSH (port 22) only
by default.

**To allow browser or API access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 8086
```

**To access the UI without opening the firewall, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8086:localhost:8086 ubuntu@<your-vm-ip>

# Then open in browser
http://localhost:8086
```

:::caution

The admin API token grants full access to all data. Store it securely and create scoped tokens for
individual applications.

:::

## Next steps

- [InfluxDB 2 documentation](https://docs.influxdata.com/influxdb/v2/)
- [InfluxDB API reference](https://docs.influxdata.com/influxdb/v2/api/)
- [Telegraf for metrics collection](https://docs.influxdata.com/telegraf/)
