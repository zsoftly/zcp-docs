---
title: ClickHouse
---

ClickHouse is an open-source, column-oriented database management system built for online analytical
processing (OLAP). It ingests and queries large volumes of data with very low latency, which makes
it a strong fit for real-time analytics, dashboards, observability, and log storage. The HTTP
interface runs on port 8123 and the native protocol on port 9000.

## Software included

| Component         | Version     |
| ----------------- | ----------- |
| ClickHouse Server | 26.6.1.1193 |
| ClickHouse Client | 26.6.1.1193 |
| Ubuntu            | 24.04 LTS   |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable              | Description         |
| --------------------- | ------------------- |
| `CLICKHOUSE_USER`     | ClickHouse username |
| `CLICKHOUSE_PASSWORD` | ClickHouse password |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates the password, configures the built-in `default` user,
and starts ClickHouse. This takes one or two minutes. Track progress:

```bash
journalctl -u clickhouse-first-boot.service -f
```

The login message (MOTD) confirms when ClickHouse is ready.

### 3. Verify ClickHouse is running

```bash
systemctl status clickhouse-server
```

### 4. Connect to ClickHouse

Retrieve the generated credentials:

```bash
sudo cat /etc/clickhouse/credentials.txt
```

| Field    | Value                                  |
| -------- | -------------------------------------- |
| Username | `default`                              |
| Password | From `/etc/clickhouse/credentials.txt` |

Connect with the native client:

```bash
clickhouse-client --user default --password
```

The HTTP and native endpoints are:

```text
http://<your-vm-ip>:8123
<your-vm-ip>:9000
```

## Managing ClickHouse

```bash
# Check service status
systemctl status clickhouse-server

# Restart
sudo systemctl restart clickhouse-server

# View logs
sudo journalctl -u clickhouse-server -f
```

| Path                              | Purpose                          |
| --------------------------------- | -------------------------------- |
| `/etc/clickhouse-server/`         | Server configuration             |
| `/etc/clickhouse/credentials.txt` | Generated connection credentials |
| `/var/lib/clickhouse/`            | Database data                    |
| `/var/log/clickhouse-server/`     | Server log files                 |

## Security

Ports 8123 and 9000 are accessible on the VM's network interface. UFW is enabled and allows SSH
(port 22) only by default.

**To allow access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 8123
sudo ufw allow from <trusted-ip> to any port 9000
```

**To access ClickHouse without opening the firewall, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8123:localhost:8123 -L 9000:localhost:9000 ubuntu@<your-vm-ip>
```

**For production use**, place the HTTP interface behind a reverse proxy so you can serve it with a
TLS certificate. Configure encrypted native connections separately, and restrict both ports to
trusted application and administrator networks.

:::caution

Do not expose ClickHouse broadly to the internet. Keep its generated credentials private and limit
both interfaces to trusted clients.

:::

## Next steps

- [ClickHouse documentation](https://clickhouse.com/docs)
- [ClickHouse installation guide](https://clickhouse.com/docs/install/docker)
