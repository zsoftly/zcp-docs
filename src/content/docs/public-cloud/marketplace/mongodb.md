---
title: MongoDB 8.0
---

MongoDB is a general-purpose, document-oriented NoSQL database that stores data as flexible
JSON-like documents. It is well suited for applications that need rich queries, horizontal scaling,
or schemas that evolve over time.

## Software included

| Component         | Version   |
| ----------------- | --------- |
| MongoDB Community | 8.0.x     |
| Ubuntu            | 24.04 LTS |

## Environment variables

You can optionally set these when deploying MongoDB from the marketplace. Leave any field blank to
have a secure random value generated automatically.

| Variable                     | Description           |
| ---------------------------- | --------------------- |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB root username |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB root password |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script runs automatically. It creates the superuser defined by
`MONGO_INITDB_ROOT_USERNAME`, which defaults to `admin`, using the configured or generated password,
and enables authentication. This takes under 60 seconds.

Track progress:

```bash
journalctl -u mongodb-first-boot.service -f
```

Wait for the service to exit, then disconnect and reconnect. On login, the MOTD reports the MongoDB
version with a `READY` status once setup is complete.

### 3. Retrieve credentials

```bash
sudo cat /etc/mongodb/credentials.txt
```

This file contains the admin username, password, and connection instructions. It is only readable by
root. The following command reads the configured username from the file. `mongosh` then prompts for
the password so it does not appear in the process list.

### 4. Connect to MongoDB

```bash
MONGO_USER=$(sudo awk '/^Username:/{print $NF}' /etc/mongodb/credentials.txt)
mongosh -u "$MONGO_USER" --authenticationDatabase admin
```

Expected output:

```text
test>
```

## Managing MongoDB

```bash
# Check service status
systemctl status mongod

# Restart
sudo systemctl restart mongod

# View logs
sudo journalctl -u mongod -f
```

Configuration file: `/etc/mongod.conf`

## Security

Port 27017 is **not** open externally by default. UFW is enabled and allows SSH (port 22) only.

**To allow access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 27017
```

**To connect without opening the firewall (recommended), use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 27017:localhost:27017 ubuntu@<your-vm-ip>

# Then connect locally using the username from /etc/mongodb/credentials.txt
mongosh -u <username> --authenticationDatabase admin
```

:::caution

Avoid exposing port 27017 to `0.0.0.0`. Restrict access to known IPs or use an SSH tunnel.

:::

## Next steps

- [MongoDB documentation](https://www.mongodb.com/docs/)
- [mongosh reference](https://www.mongodb.com/docs/mongodb-shell/)
- [Security checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)
