---
title: Neo4j
---

Neo4j is a native graph database that stores data as nodes and relationships rather than rows and
tables. It uses the Cypher query language to traverse highly connected data efficiently, which makes
it a strong fit for recommendation engines, fraud detection, knowledge graphs, and network analysis.
The HTTP browser runs on port 7474 and the Bolt protocol on port 7687.

## Software included

| Component | Version   |
| --------- | --------- |
| Neo4j     | 2026.06.0 |
| Ubuntu    | 24.04 LTS |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable         | Description    |
| ---------------- | -------------- |
| `NEO4J_PASSWORD` | Neo4j password |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

Neo4j generates a unique initial password, configures its advertised address, and starts the native
systemd service. This takes about two to three minutes. Track progress with:

```bash
sudo journalctl -u neo4j-first-boot.service -f
```

Then verify the service:

```bash
systemctl status neo4j
```

### 3. Access the Neo4j Browser

Open a browser and navigate to:

```text
http://<your-vm-ip>:7474
```

Read the generated connection details:

```bash
sudo cat /root/.credentials/neo4j.txt
```

| Field    | Value                               |
| -------- | ----------------------------------- |
| Username | `neo4j`                             |
| Password | From `/root/.credentials/neo4j.txt` |

You will be prompted to set a new password on first login. Applications connect over Bolt at
`bolt://<your-vm-ip>:7687`.

## Managing Neo4j

```bash
# Check service status
systemctl status neo4j

# Restart Neo4j
sudo systemctl restart neo4j

# View logs
sudo journalctl -u neo4j -f
```

| Path                           | Purpose                       |
| ------------------------------ | ----------------------------- |
| `/etc/neo4j/neo4j.conf`        | Main configuration            |
| `/var/lib/neo4j/data/`         | Databases and graph data      |
| `/var/log/neo4j/`              | Neo4j logs                    |
| `/root/.credentials/neo4j.txt` | Generated initial credentials |

## Security

Ports 7474 and 7687 are open on the VM's network interface. UFW is enabled and allows the Browser
(port 7474), Bolt (port 7687), and SSH (port 22).

**To restrict both endpoints to a specific IP:**

```bash
sudo ufw delete allow 7474/tcp
sudo ufw delete allow 7687/tcp
sudo ufw allow from <trusted-ip> to any port 7474
sudo ufw allow from <trusted-ip> to any port 7687
```

**To access Neo4j without leaving those ports open, use an SSH tunnel:**

First close the public port on the VM, since it is open by default:

```bash
sudo ufw delete allow 7474/tcp
sudo ufw delete allow 7687/tcp
```

```bash
# Run this on your local machine
ssh -L 7474:localhost:7474 -L 7687:localhost:7687 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:7474
```

**For production use**, restrict Neo4j to private application and administrator networks. Put the
Browser behind a TLS reverse proxy and configure encrypted Bolt connections before sending
credentials or graph data over an untrusted network.

:::caution

Change the generated initial password when Neo4j prompts you on first login. Do not expose the
Browser or Bolt endpoints broadly to the internet.

:::

## Next steps

- [Neo4j documentation](https://neo4j.com/docs/)
- [Neo4j installation guide](https://neo4j.com/docs/operations-manual/current/docker/docker-compose-standalone/)
