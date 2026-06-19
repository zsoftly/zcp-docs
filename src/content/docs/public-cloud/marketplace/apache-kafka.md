---
title: Apache Kafka
---

Apache Kafka is an open-source distributed event-streaming platform. It ingests, stores, and
processes high-throughput streams of records across topics, powering messaging, log aggregation, and
real-time data pipelines. Modern Kafka runs in KRaft mode, so it no longer needs a separate
ZooKeeper cluster.

:::note[Coming soon]

A pre-built Apache Kafka image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance
from the marketplace and follow the steps below to install Apache Kafka yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 20 GB   | 100 GB      |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **Apache Kafka**, and click **Deploy**, or
   create an **Ubuntu 24.04 LTS** instance from **Instances → Create**. Both give you a clean Ubuntu
   24.04 VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Apache Kafka

Kafka runs on the JVM. Install a supported OpenJDK first:

```bash
sudo apt install -y openjdk-21-jre-headless
java -version
```

Download and extract the latest Kafka release from kafka.apache.org. The `2.13` prefix is the Scala
build. Check the [downloads page](https://kafka.apache.org/downloads) for the current version and
adjust the URL accordingly:

```bash
KAFKA_VERSION=4.3.0
curl -fsSL "https://downloads.apache.org/kafka/${KAFKA_VERSION}/kafka_2.13-${KAFKA_VERSION}.tgz" \
  -o /tmp/kafka.tgz
sudo tar -xzf /tmp/kafka.tgz -C /opt
sudo mv /opt/kafka_2.13-${KAFKA_VERSION} /opt/kafka
```

Create a dedicated `kafka` system user and give it ownership of the install and data directories:

```bash
sudo useradd --system --home /opt/kafka --shell /usr/sbin/nologin kafka
sudo mkdir -p /var/lib/kafka
sudo chown -R kafka:kafka /opt/kafka /var/lib/kafka
```

Point the broker at the data directory, generate a cluster ID, and format storage for KRaft mode:

```bash
sudo sed -i 's|^log.dirs=.*|log.dirs=/var/lib/kafka|' /opt/kafka/config/server.properties

KAFKA_CLUSTER_ID=$(/opt/kafka/bin/kafka-storage.sh random-uuid)
sudo -u kafka /opt/kafka/bin/kafka-storage.sh format \
  --standalone -t "$KAFKA_CLUSTER_ID" -c /opt/kafka/config/server.properties
```

## Configure Apache Kafka

Run Kafka as a systemd service so it starts on boot and restarts on failure. Create the unit file:

```bash
sudo tee /etc/systemd/system/kafka.service > /dev/null <<'EOF'
[Unit]
Description=Apache Kafka (KRaft)
After=network.target

[Service]
Type=simple
User=kafka
Group=kafka
Environment=JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ExecStart=/opt/kafka/bin/kafka-server-start.sh /opt/kafka/config/server.properties
ExecStop=/opt/kafka/bin/kafka-server-stop.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now kafka
sudo systemctl status kafka
```

Kafka listens on port 9092. Verify the broker by creating a test topic:

```bash
/opt/kafka/bin/kafka-topics.sh --create --topic test \
  --bootstrap-server localhost:9092
/opt/kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

To accept connections from other hosts, set `advertised.listeners` in
`/opt/kafka/config/server.properties` to a reachable address (for example
`PLAINTEXT://<your-vm-ip>:9092`) and restart the service.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Apache Kafka needs
and add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 9092/tcp
```

## Next steps

- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
- [Apache Kafka installation guide](https://kafka.apache.org/quickstart)
