---
title: Neo4j
---

Neo4j is a native graph database that stores data as nodes and relationships rather than rows and
tables. It uses the Cypher query language to traverse highly connected data efficiently, which makes
it a strong fit for recommendation engines, fraud detection, knowledge graphs, and network analysis.
The HTTP browser runs on port 7474 and the Bolt protocol on port 7687.

:::note[Coming soon]

A pre-built Neo4j image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Neo4j yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **Neo4j**, and click **Deploy**, or create an
   **Ubuntu 24.04 LTS** instance from **Instances → Create**. Both give you a clean Ubuntu 24.04 VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Neo4j

Install Docker Engine and the Docker Compose plugin from Docker's official repository:

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Add the `ubuntu` user to the `docker` group so you can run Docker without `sudo`, then reconnect:

```bash
sudo usermod -aG docker ubuntu
exit
```

Reconnect over SSH, create a project directory, and add a `compose.yaml`:

```bash
mkdir ~/neo4j && cd ~/neo4j
```

```yaml
services:
  neo4j:
    image: neo4j:5
    restart: unless-stopped
    environment:
      - NEO4J_AUTH=neo4j/${NEO4J_PASSWORD}
    ports:
      - '7474:7474'
      - '7687:7687'
    volumes:
      - neo4j-data:/data
volumes:
  neo4j-data:
```

Create a `.env` file in the same directory with a strong password:

```bash
cat > .env <<'EOF'
NEO4J_PASSWORD=change-me-to-a-strong-password
EOF
```

Start the stack:

```bash
docker compose up -d
```

## Configure Neo4j

Open `http://<your-vm-ip>:7474` in a browser to reach the Neo4j Browser. Sign in with the username
`neo4j` and the password you set in `.env`. From there you can run Cypher queries, inspect the
graph, and manage users. Applications connect over Bolt at `bolt://<your-vm-ip>:7687`. For a
production setup, put Neo4j behind a reverse proxy such as nginx with a TLS certificate and serve
the browser and Bolt endpoints over encrypted connections instead of exposing the ports directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Neo4j needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 7474/tcp
sudo ufw allow 7687/tcp
```

## Next steps

- [Neo4j documentation](https://neo4j.com/docs/)
- [Neo4j installation guide](https://neo4j.com/docs/operations-manual/current/docker/docker-compose-standalone/)
