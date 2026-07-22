---
title: RabbitMQ
---

RabbitMQ is an open-source message broker that implements AMQP and other messaging protocols. It
routes messages between producers and consumers, decoupling the services in a distributed system. A
built-in management plugin provides a web UI and HTTP API for monitoring queues, exchanges, and
connections.

## Software included

| Component | Version   |
| --------- | --------- |
| RabbitMQ  | 4.3.2     |
| Ubuntu    | 24.04 LTS |

## Environment variables

Set these optionally when you deploy from the marketplace. Leave a field blank to have a secure
value generated.

| Variable                | Description                                                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RABBITMQ_DEFAULT_USER` | Administrator username. Cannot be `guest`; on first boot, the image removes the default `guest` user and creates this administrator so a usable configured administrator remains |
| `RABBITMQ_DEFAULT_PASS` | RabbitMQ default user password                                                                                                                                                   |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script enables the management plugin, creates the administrator, applies
virtual-host permissions, and removes the default `guest` user. Track progress:

```bash
sudo journalctl -u rabbitmq-first-boot.service -f
```

The login message (MOTD) confirms when RabbitMQ is ready. You can also verify the broker directly:

```bash
systemctl status rabbitmq-server
sudo rabbitmq-diagnostics ping
```

### 3. Retrieve the administrator credentials

The generated credentials and connection details are stored in a root-only file:

```bash
sudo cat /etc/rabbitmq/credentials.txt
```

| Field        | Value                                                                 |
| ------------ | --------------------------------------------------------------------- |
| Username     | Value of `RABBITMQ_DEFAULT_USER`, or generated securely on first boot |
| Password     | Value of `RABBITMQ_DEFAULT_PASS`, or generated securely on first boot |
| Virtual host | `/`                                                                   |

### 4. Access RabbitMQ

Applications connect to the AMQP endpoint at:

```text
<your-vm-ip>:5672
```

The management UI is available at:

```text
http://<your-vm-ip>:15672
```

## Managing RabbitMQ

```bash
# Check service status
systemctl status rabbitmq-server

# Restart
sudo systemctl restart rabbitmq-server

# View logs
sudo journalctl -u rabbitmq-server -f
```

| Path                            | Purpose                                |
| ------------------------------- | -------------------------------------- |
| `/etc/rabbitmq/`                | RabbitMQ configuration and state files |
| `/var/lib/rabbitmq/`            | Broker database and persistent state   |
| `/var/log/rabbitmq/`            | RabbitMQ log files                     |
| `/etc/rabbitmq/credentials.txt` | Generated credentials and endpoints    |

## Security

RabbitMQ uses port 5672 for AMQP and port 15672 for the management UI. UFW is enabled and allows SSH
(port 22) only by default. Both RabbitMQ ports remain blocked until you allow trusted sources.

**To allow access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 5672
sudo ufw allow from <trusted-ip> to any port 15672
```

**To access the management UI without opening its port, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 15672:localhost:15672 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:15672
```

**For production use**, keep AMQP on a private network or configure RabbitMQ TLS. Place the
management UI behind a reverse proxy so you can serve it over HTTPS with a trusted TLS certificate.

:::caution

The image removes RabbitMQ's default `guest` user. Protect the generated administrator credentials
and restrict AMQP and management access to known application and administrator networks.

:::

## Next steps

- [RabbitMQ documentation](https://www.rabbitmq.com/docs)
- [RabbitMQ installation guide](https://www.rabbitmq.com/docs/install-debian)
