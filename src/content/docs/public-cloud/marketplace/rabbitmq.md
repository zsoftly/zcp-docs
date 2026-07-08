---
title: RabbitMQ
---

RabbitMQ is an open-source message broker that implements AMQP and other messaging protocols. It
routes messages between producers and consumers, decoupling the services in a distributed system. A
built-in management plugin provides a web UI and HTTP API for monitoring queues, exchanges, and
connections.

:::note[Coming soon]

A pre-built RabbitMQ image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install RabbitMQ yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 4 GB        |
| Storage  | 10 GB   | 40 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps** and switch to the **Marketplace** tab, search for
   **Ubuntu 24.04 LTS**, and click **Deploy**. You can also create the instance from **Instances →
   Create**. Either way you get a clean Ubuntu 24.04 VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install RabbitMQ

RabbitMQ runs on Erlang/OTP. Team RabbitMQ publishes apt repositories for both Erlang and the
broker, which keeps you on supported, matched versions. Install the prerequisites and the repository
signing keys:

```bash
sudo apt-get install -y curl gnupg apt-transport-https

curl -1sLf "https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA" \
  | sudo gpg --dearmor | sudo tee /usr/share/keyrings/com.rabbitmq.team.gpg > /dev/null

curl -1sLf "https://github.com/rabbitmq/signing-keys/releases/download/3.0/cloudsmith.E495BB49CC4BBE5B.key" \
  | sudo gpg --dearmor | sudo tee /usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg > /dev/null
```

Add the Erlang and RabbitMQ repositories for Ubuntu 24.04 (`noble`):

```bash
sudo tee /etc/apt/sources.list.d/rabbitmq.list > /dev/null <<'EOF'
deb [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://deb1.rabbitmq.com/rabbitmq-erlang/ubuntu/noble noble main
deb [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://deb1.rabbitmq.com/rabbitmq-server/ubuntu/noble noble main
EOF
```

Install Erlang and the RabbitMQ server:

```bash
sudo apt-get update

sudo apt-get install -y erlang-base \
  erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
  erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
  erlang-runtime-tools erlang-snmp erlang-ssl \
  erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl

sudo apt-get install -y rabbitmq-server
```

The package installs a systemd service that starts on boot. Confirm it is running:

```bash
sudo systemctl enable --now rabbitmq-server
sudo systemctl status rabbitmq-server
```

## Configure RabbitMQ

Enable the management plugin to get the web UI and HTTP API on port 15672:

```bash
sudo rabbitmq-plugins enable rabbitmq_management
```

The default `guest` account can only connect from `localhost`. Create your own administrator so you
can sign in to the UI remotely:

```bash
sudo rabbitmqctl add_user admin '<a-strong-password>'
sudo rabbitmqctl set_user_tags admin administrator
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

Sign in to the management UI at `http://<your-vm-ip>:15672` with the `admin` user. Applications
publish and consume messages over AMQP on port 5672.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) RabbitMQ needs and
add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 5672/tcp
sudo ufw allow 15672/tcp
```

## Next steps

- [RabbitMQ documentation](https://www.rabbitmq.com/docs)
- [RabbitMQ installation guide](https://www.rabbitmq.com/docs/install-debian)
