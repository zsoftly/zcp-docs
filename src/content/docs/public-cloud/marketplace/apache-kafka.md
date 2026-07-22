---
title: Apache Kafka
---

Apache Kafka is an open-source distributed event-streaming platform. It ingests, stores, and
processes high-throughput streams of records across topics, powering messaging, log aggregation, and
real-time data pipelines. Modern Kafka runs in KRaft mode, so it no longer needs a separate
ZooKeeper cluster.

## Software included

| Component    | Version   |
| ------------ | --------- |
| Apache Kafka | 4.3.1     |
| OpenJDK      | 21 (JRE)  |
| Ubuntu       | 24.04 LTS |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script configures `advertised.listeners`, formats the KRaft storage, and
starts Kafka. Track progress:

```bash
journalctl -u kafka-first-boot.service -f
```

The login message (MOTD) confirms when Kafka is ready.

### 3. Verify Apache Kafka is running

```bash
systemctl status kafka
```

List the available topics to verify the broker:

```bash
sudo -u kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --list
```

### 4. Connect to the broker

The bootstrap server listens on:

```text
<your-vm-ip>:9092
```

You can review the connection guidance written at first boot:

```bash
sudo cat /root/.credentials/kafka.txt
```

## Managing Apache Kafka

```bash
# Check service status
systemctl status kafka

# Restart
sudo systemctl restart kafka

# View logs
sudo journalctl -u kafka -f
```

| Path                                  | Purpose                        |
| ------------------------------------- | ------------------------------ |
| `/opt/kafka/config/server.properties` | Broker and KRaft configuration |
| `/opt/kafka/data/`                    | Kafka data                     |

## Security

Port 9092 is accessible on the VM's network interface. UFW is enabled and allows SSH (port 22) only
by default.

**To allow broker access from a specific IP:**

```bash
sudo ufw allow from <trusted-ip> to any port 9092
```

The advertised listener address is generated from the VM's local IP on first boot. To connect
without opening the firewall, point the advertised listener at `localhost` on the VM, restart Kafka,
then open an SSH tunnel:

```bash
# On the VM: advertise localhost instead of the VM's IP, then restart Kafka
sudo sed -i 's|^advertised.listeners=.*|advertised.listeners=PLAINTEXT://localhost:9092|' /opt/kafka/config/server.properties
sudo systemctl restart kafka
```

```bash
# Run this on your local machine
ssh -L 9092:localhost:9092 ubuntu@<your-vm-ip>
```

Kafka uses plaintext transport and has no authentication in this single-node image. Configure
authentication and encrypted listeners before using it for production workloads, and restrict port
9092 to trusted clients.

:::caution

Do not expose port 9092 broadly to the internet. Update the advertised listener to an address your
approved clients can reach, then limit access with UFW and network security rules.

:::

## Next steps

- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
- [Apache Kafka installation guide](https://kafka.apache.org/quickstart)
