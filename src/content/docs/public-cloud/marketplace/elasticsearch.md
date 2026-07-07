---
title: Elasticsearch 8
---

Elasticsearch is a distributed, RESTful search and analytics engine built on Apache Lucene. It is
used for full-text search, log aggregation, application monitoring, and real-time data analysis.

## Software included

| Component     | Version   |
| ------------- | --------- |
| Elasticsearch | 8.x       |
| Ubuntu        | 24.04 LTS |

## Environment variables

You can optionally set these when deploying Elasticsearch from the marketplace. Leave any field
blank to have a secure random value generated automatically.

| Variable           | Description                        |
| ------------------ | ---------------------------------- |
| `ELASTIC_PASSWORD` | Password for the elastic superuser |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script runs automatically. It:

- Clears any pre-existing data so the cluster initialises fresh
- Sets the cluster name to the VM hostname
- Starts Elasticsearch and waits for it to become ready
- Resets the `elastic` superuser password to a randomly generated value
- Saves the password to `/etc/elasticsearch/elastic-password.txt`

Elasticsearch 8 takes 60–90 seconds to start before the password reset can run. Total first-boot
time is approximately 2–3 minutes.

Track progress:

```bash
journalctl -u elasticsearch-first-boot.service -f
```

### 3. Retrieve credentials

```bash
sudo cat /etc/elasticsearch/elastic-password.txt
```

This file contains the `elastic` superuser password. It is only readable by root.

### 4. Connect to Elasticsearch

Elasticsearch 8 uses HTTPS with a self-signed certificate by default. Use `-k` to skip certificate
verification for local connections, or use the CA certificate at
`/etc/elasticsearch/certs/http_ca.crt`.

```bash
ES_PASS=$(sudo cat /etc/elasticsearch/elastic-password.txt)
curl -k -u elastic:"$ES_PASS" https://localhost:9200
```

Expected output:

```json
{
  "name" : "your-vm-hostname",
  "cluster_name" : "your-vm-hostname",
  "version" : { ... },
  "tagline" : "You Know, for Search"
}
```

## Managing Elasticsearch

```bash
# Check service status
systemctl status elasticsearch

# Restart
sudo systemctl restart elasticsearch

# View logs
sudo journalctl -u elasticsearch -f
```

Configuration directory: `/etc/elasticsearch/`

Key files:

- `elasticsearch.yml`: cluster, network, and node settings
- `jvm.options.d/`: JVM heap and GC settings

**To adjust the heap size**, create a file in `/etc/elasticsearch/jvm.options.d/`:

```text
-Xms2g
-Xmx2g
```

Set heap to no more than half the available VM RAM. Restart Elasticsearch after changes.

## Security

Ports 9200 (REST API) and 9300 (inter-node transport) are **not** open externally by default. UFW is
enabled and allows SSH (port 22) only.

**To allow REST API access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 9200
```

**To connect without opening the firewall (recommended), use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 9200:localhost:9200 ubuntu@<your-vm-ip>

# Then query locally
curl -k -u elastic:"<password>" https://localhost:9200
```

:::caution

Elasticsearch 8 enables security by default. The `elastic` user has full cluster access. Create
role-scoped users for individual applications.

:::

## Next steps

- [Elasticsearch documentation](https://www.elastic.co/docs/current/elasticsearch)
- [Index management guide](https://www.elastic.co/docs/reference/elasticsearch/index-settings/index-modules)
- [Security overview](https://www.elastic.co/demo-gallery/security-overview)
