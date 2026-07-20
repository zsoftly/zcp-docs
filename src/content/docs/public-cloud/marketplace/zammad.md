---
title: Zammad
---

Zammad is an open-source helpdesk and ticketing system for customer support and IT service teams. It
consolidates email, chat, social, and phone channels into a shared inbox with ticketing, SLAs,
knowledge base, and reporting. It runs as a self-hosted web application backed by PostgreSQL and
Elasticsearch.

## Software included

| Component     | Version       |
| ------------- | ------------- |
| Zammad        | 7.1.1         |
| PostgreSQL    | 17-alpine     |
| Redis         | 7.2-alpine    |
| Elasticsearch | 9.4.3         |
| Docker        | Latest stable |
| Ubuntu        | 24.04 LTS     |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates the database password and starts the Zammad, PostgreSQL,
Redis, and Elasticsearch containers. This can take 5 to 10 minutes. Track progress:

```bash
sudo journalctl -u zammad-first-boot.service -f
```

The login message (MOTD) confirms when Zammad is ready. You can also verify the stack directly:

```bash
cd /opt/zammad && docker compose ps
```

### 3. Access the Zammad UI

Open a browser and navigate to:

```text
http://<your-vm-ip>:8080
```

### 4. Create the administrator account

Complete the first-run setup wizard to create your administrator email address and password. The
image does not create shared default administrator credentials.

## Managing Zammad

Zammad runs as a Docker Compose stack in `/opt/zammad`.

```bash
# Check status
cd /opt/zammad && docker compose ps

# Restart
cd /opt/zammad && docker compose restart

# View logs
cd /opt/zammad && docker compose logs -f
```

| Path                              | Purpose                                   |
| --------------------------------- | ----------------------------------------- |
| `/opt/zammad/docker-compose.yml`  | Docker Compose configuration              |
| `/opt/zammad/.env`                | Internal database password and hostname   |
| `/opt/zammad/data/postgresql/`    | PostgreSQL data                           |
| `/opt/zammad/data/elasticsearch/` | Elasticsearch data                        |
| `/opt/zammad/data/redis/`         | Redis data                                |
| `/opt/zammad/data/zammad/`        | Zammad attachments and persistent storage |
| `/root/.credentials/zammad.txt`   | Database credentials and access details   |

## Security

Zammad uses port 8080. UFW is enabled and allows SSH (port 22) plus port 8080 by default.
PostgreSQL, Redis, and Elasticsearch remain on the internal Docker network and are not published on
the VM's network interface.

**To restrict Zammad to a specific IP:**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

**To access the UI without leaving port 8080 open, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 8080:localhost:8080 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
```

**For production use**, place Zammad behind a reverse proxy so you can serve it over HTTPS with a
trusted TLS certificate.

:::caution

Complete the setup wizard promptly and restrict the helpdesk to trusted users and networks. The
first account created through the wizard becomes the administrator.

:::

## Next steps

- [Zammad documentation](https://docs.zammad.org/)
- [Zammad installation guide](https://docs.zammad.org/en/latest/install/package.html)
