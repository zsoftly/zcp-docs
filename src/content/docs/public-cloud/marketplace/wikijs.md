---
title: Wiki.js
---

Wiki.js is a modern, open-source wiki and documentation platform. It offers a rich Markdown editor,
fine-grained access control, full-text search, and authentication integrations, all backed by a
relational database. It is a strong fit for internal knowledge bases, product documentation, and
team wikis. The web interface runs on port 3000.

## Software included

| Component  | Version       |
| ---------- | ------------- |
| Wiki.js    | 2.5.312       |
| PostgreSQL | 18            |
| Docker     | Latest stable |
| Ubuntu     | 24.04 LTS     |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable  | Description              |
| --------- | ------------------------ |
| `DB_USER` | PostgreSQL username      |
| `DB_PASS` | PostgreSQL password      |
| `DB_NAME` | PostgreSQL database name |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates the database password and starts Wiki.js and PostgreSQL
with Docker Compose. Track progress:

```bash
sudo journalctl -u wikijs-first-boot.service -f
```

The login message (MOTD) confirms when Wiki.js is ready. You can also verify both containers:

```bash
cd /opt/wikijs && docker compose ps
```

### 3. Access the Wiki.js UI

Open a browser and navigate to:

```text
http://<your-vm-ip>:3000
```

### 4. Create the administrator account

Complete the first-run setup wizard to create the administrator and configure the site. The image
does not create a shared default administrator account.

## Managing Wiki.js

Wiki.js runs as a Docker Compose stack in `/opt/wikijs`.

```bash
# Check status
cd /opt/wikijs && docker compose ps

# Restart
cd /opt/wikijs && docker compose restart

# View logs
cd /opt/wikijs && docker compose logs -f
```

| Path                             | Purpose                                 |
| -------------------------------- | --------------------------------------- |
| `/opt/wikijs/docker-compose.yml` | Docker Compose configuration            |
| `/opt/wikijs/.env`               | Internal database password              |
| `/opt/wikijs/data/postgres/`     | PostgreSQL data                         |
| `/etc/wikijs/credentials.txt`    | Database credentials and access details |

## Security

Wiki.js uses port 3000. UFW is enabled and allows SSH (port 22) plus port 3000 by default. The
PostgreSQL container is available only on the internal Docker network.

**To restrict Wiki.js to a specific IP:**

```bash
sudo ufw delete allow 3000/tcp
sudo ufw allow from <trusted-ip> to any port 3000
```

**To access the UI without leaving port 3000 open, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 3000:localhost:3000 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:3000
```

**For production use**, place Wiki.js behind a reverse proxy so you can serve it over HTTPS with a
trusted TLS certificate.

:::caution

Complete the first-run wizard promptly and restrict the UI to trusted users and networks. The first
account created through the wizard becomes the administrator.

:::

## Next steps

- [Wiki.js documentation](https://docs.requarks.io/)
- [Wiki.js installation guide](https://docs.requarks.io/install/docker)
