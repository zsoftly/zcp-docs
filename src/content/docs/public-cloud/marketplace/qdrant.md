---
title: Qdrant
---

Qdrant is an open-source vector database and similarity-search engine built for storing and querying
high-dimensional embeddings. It powers semantic search, recommendations, and retrieval-augmented
generation (RAG) workloads, exposing both a REST and a gRPC API plus a built-in web dashboard.

## Software included

| Component | Version       |
| --------- | ------------- |
| Qdrant    | 1.18.2        |
| Docker    | Latest stable |
| Ubuntu    | 24.04 LTS     |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates the API key and starts Qdrant with Docker Compose. Track
progress:

```bash
sudo journalctl -u qdrant-first-boot.service -f
```

The login message (MOTD) confirms when Qdrant is ready. You can also verify the container directly:

```bash
cd /opt/qdrant && docker compose ps
```

### 3. Retrieve the API key

The generated connection details and API key are stored in a root-only file:

```bash
sudo cat /etc/qdrant/credentials.txt
```

| Field   | Value                            |
| ------- | -------------------------------- |
| API key | Generated securely on first boot |

### 4. Access Qdrant

The REST API and dashboard are available at:

```text
http://<your-vm-ip>:6333
http://<your-vm-ip>:6333/dashboard
```

The gRPC API is available at `<your-vm-ip>:6334`. Verify the REST API locally with the API key from
the credentials file:

```bash
curl -H "api-key: <your-api-key>" http://127.0.0.1:6333/healthz
```

## Managing Qdrant

Qdrant runs as a Docker Compose stack in `/opt/qdrant`.

```bash
# Check status
cd /opt/qdrant && docker compose ps

# Restart
cd /opt/qdrant && docker compose restart

# View logs
cd /opt/qdrant && docker compose logs -f
```

| Path                             | Purpose                         |
| -------------------------------- | ------------------------------- |
| `/opt/qdrant/docker-compose.yml` | Docker Compose configuration    |
| `/opt/qdrant/.env`               | Qdrant API key environment      |
| `/var/lib/qdrant/storage/`       | Collections and persistent data |
| `/etc/qdrant/credentials.txt`    | API key and connection details  |

## Security

The REST API and dashboard use port 6333, and the gRPC API uses port 6334. UFW is enabled and allows
SSH (port 22) plus ports 6333 and 6334 by default. Qdrant requires the generated API key for access.

**To restrict API access to a specific IP:**

```bash
sudo ufw delete allow 6333/tcp
sudo ufw delete allow 6334/tcp
sudo ufw allow from <trusted-ip> to any port 6333
sudo ufw allow from <trusted-ip> to any port 6334
```

**To access the dashboard without leaving port 6333 open, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 6333:localhost:6333 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:6333/dashboard
```

**For production use**, place Qdrant behind a reverse proxy so you can serve the REST API and
dashboard over HTTPS with a trusted TLS certificate. Keep the gRPC API on a trusted private network
or configure a TLS-capable proxy for it.

:::caution

Treat the API key as a secret. Restrict both Qdrant ports to trusted application and administrator
networks rather than exposing them broadly to the internet.

:::

## Next steps

- [Qdrant documentation](https://qdrant.tech/documentation/)
- [Qdrant installation guide](https://qdrant.tech/documentation/guides/installation/)
