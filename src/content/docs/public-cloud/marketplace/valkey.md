---
title: Valkey 9.0
---

Valkey is an open-source, high-performance in-memory data store and Redis-compatible alternative. It
is commonly used for caching, session storage, real-time leaderboards, pub/sub messaging, and job
queues.

## Software included

| Component | Version   |
| --------- | --------- |
| Valkey    | 9.0.x     |
| Ubuntu    | 24.04 LTS |

## Environment variables

You can optionally set these when deploying Valkey from the marketplace. Leave any field blank to
have a secure random value generated automatically.

| Variable          | Description                            |
| ----------------- | -------------------------------------- |
| `VALKEY_PASSWORD` | Password required to connect to Valkey |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script runs automatically. It generates a random password and configures
Valkey to require authentication on every connection. This takes under 30 seconds.

Track progress:

```bash
journalctl -u valkey-first-boot.service -f
```

### 3. Retrieve credentials

```bash
sudo cat /etc/valkey/credentials.txt
```

This file contains the password and connection instructions. It is only readable by root.

### 4. Connect to Valkey

```bash
VALKEY_PASS=$(sudo awk '/^Valkey password:/{print $NF}' /etc/valkey/credentials.txt)
valkey-cli -a "$VALKEY_PASS"
```

Confirm the connection:

```text
127.0.0.1:6379> PING
PONG
```

## Managing Valkey

```bash
# Check service status
systemctl status valkey

# Restart
sudo systemctl restart valkey

# View logs
sudo journalctl -u valkey -f
```

Configuration files:

| File                         | Purpose                          |
| ---------------------------- | -------------------------------- |
| `/etc/valkey/valkey.conf`    | Main configuration               |
| `/etc/valkey/99-memory.conf` | Memory limit and eviction policy |

**To set a memory limit**, edit `/etc/valkey/99-memory.conf`:

```text
maxmemory 512mb
maxmemory-policy noeviction
```

Then restart Valkey. The default policy is `noeviction`, which returns an error when memory is full
rather than silently evicting data.

## Security

Port 6379 is **not** open externally by default. UFW is enabled and allows SSH (port 22) only.

**To allow access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 6379
```

**To connect without opening the firewall (recommended), use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 6379:localhost:6379 ubuntu@<your-vm-ip>

# Then connect locally
valkey-cli -a "<password>"
```

:::caution

Avoid exposing port 6379 to `0.0.0.0`. Valkey is an in-memory store. Unauthorised access exposes all
cached data. Restrict to known IPs or use an SSH tunnel.

:::

## Next steps

- [Valkey documentation](https://valkey.io/docs/)
- [Valkey configuration reference](https://valkey.io/topics/config/)
- [Valkey commands reference](https://valkey.io/commands/)
