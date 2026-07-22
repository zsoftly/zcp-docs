---
title: ERPNext
---

ERPNext is a free, open-source ERP suite built on the Frappe framework. It covers accounting,
inventory, manufacturing, CRM, HR, projects, and more in a single web application. The easiest way
to run it is with the official `frappe_docker` images via Docker Compose.

## Software included

| Component | Version   |
| --------- | --------- |
| ERPNext   | 16.28.0   |
| MariaDB   | 11.8      |
| Redis     | 6.2       |
| Ubuntu    | 24.04 LTS |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable         | Description            |
| ---------------- | ---------------------- |
| `SITE_NAME`      | ERPNext site name      |
| `ADMIN_PASSWORD` | ERPNext admin password |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates unique ERPNext and MariaDB passwords, starts the Docker
Compose stack, and creates the initial site. This can take several minutes. Track progress:

```bash
journalctl -u erpnext-first-boot.service -f
```

The login message (MOTD) confirms when ERPNext is ready.

### 3. Verify ERPNext is running

```bash
cd /opt/erpnext
docker compose ps
curl -fsS http://127.0.0.1:8080/login > /dev/null
```

### 4. Access the ERPNext UI

Open a browser and navigate to:

```text
http://<your-vm-ip>:8080
```

Retrieve the generated credentials:

```bash
sudo cat /etc/erpnext/credentials.txt
```

| Field    | Value                               |
| -------- | ----------------------------------- |
| Username | `Administrator`                     |
| Password | From `/etc/erpnext/credentials.txt` |

Complete the setup wizard after you sign in.

## Managing ERPNext

```bash
# Check container status
cd /opt/erpnext && docker compose ps

# Restart
cd /opt/erpnext && docker compose restart

# View logs
cd /opt/erpnext && docker compose logs -f
```

| Path                              | Purpose                             |
| --------------------------------- | ----------------------------------- |
| `/opt/erpnext/docker-compose.yml` | Docker Compose configuration        |
| `/opt/erpnext/.env`               | Stack version, ports, and passwords |
| `/etc/erpnext/credentials.txt`    | Generated login credentials         |

Database, site, log, and Redis data persist in the `db-data`, `sites`, `logs`, and
`redis-queue-data` Docker volumes.

## Security

Port 8080 is accessible on the VM's network interface. UFW is enabled and allows SSH (port 22) and
ERPNext (port 8080) by default.

**To restrict the UI to a specific IP:**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

**To access ERPNext without exposing port 8080, use an SSH tunnel:**

First close the public port on the VM, since it is open by default:

```bash
sudo ufw delete allow 8080/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:8080 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
```

**For production use**, place ERPNext behind a reverse proxy so you can serve it on port 443 with a
TLS certificate, then restrict direct access to port 8080.

:::caution

The credentials file contains the ERPNext administrator and MariaDB root passwords. Keep it
restricted to administrators.

:::

## Next steps

- [ERPNext documentation](https://docs.frappe.io/erpnext)
- [frappe_docker installation guide](https://github.com/frappe/frappe_docker/blob/main/docs/getting-started.md)
