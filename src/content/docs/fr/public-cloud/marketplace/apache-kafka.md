---
title: Apache Kafka
---

Apache Kafka est une plateforme open source de diffusion d'événements distribuée. Elle ingère,
stocke et traite des flux d'enregistrements à haut débit organisés en topics, et alimente la
messagerie, l'agrégation de journaux et les pipelines de données en temps réel. Kafka moderne
s'exécute en mode KRaft, il n'a donc plus besoin d'un cluster ZooKeeper distinct.

:::note[Bientôt disponible]

Une image Apache Kafka préconfigurée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Apache
Kafka vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 20 Go   | 100 Go     |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Apache Kafka** et cliquez sur
   **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Dans les
   deux cas, vous obtenez une VM Ubuntu 24.04 propre.
2. Choisissez un plan qui répond aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH :

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Apache Kafka

Kafka s'exécute sur la JVM. Installez d'abord un OpenJDK pris en charge :

```bash
sudo apt install -y openjdk-21-jre-headless
java -version
```

Téléchargez et extrayez la dernière version de Kafka depuis kafka.apache.org. Le préfixe `2.13`
correspond à la version Scala. Consultez la
[page de téléchargements](https://kafka.apache.org/downloads) pour la version actuelle et ajustez
l'URL en conséquence :

```bash
KAFKA_VERSION=4.3.0
curl -fsSL "https://downloads.apache.org/kafka/${KAFKA_VERSION}/kafka_2.13-${KAFKA_VERSION}.tgz" \
  -o /tmp/kafka.tgz
sudo tar -xzf /tmp/kafka.tgz -C /opt
sudo mv /opt/kafka_2.13-${KAFKA_VERSION} /opt/kafka
```

Créez un utilisateur système `kafka` dédié et donnez-lui la propriété des répertoires d'installation
et de données :

```bash
sudo useradd --system --home /opt/kafka --shell /usr/sbin/nologin kafka
sudo mkdir -p /var/lib/kafka
sudo chown -R kafka:kafka /opt/kafka /var/lib/kafka
```

Pointez le courtier vers le répertoire de données, générez un identifiant de cluster et formatez le
stockage pour le mode KRaft :

```bash
sudo sed -i 's|^log.dirs=.*|log.dirs=/var/lib/kafka|' /opt/kafka/config/server.properties

KAFKA_CLUSTER_ID=$(/opt/kafka/bin/kafka-storage.sh random-uuid)
sudo -u kafka /opt/kafka/bin/kafka-storage.sh format \
  --standalone -t "$KAFKA_CLUSTER_ID" -c /opt/kafka/config/server.properties
```

## Configurer Apache Kafka

Exécutez Kafka en tant que service systemd afin qu'il démarre au démarrage du système et redémarre
en cas de panne. Créez le fichier d'unité :

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

Activez et démarrez le service :

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now kafka
sudo systemctl status kafka
```

Kafka écoute sur le port 9092. Vérifiez le courtier en créant un topic de test :

```bash
/opt/kafka/bin/kafka-topics.sh --create --topic test \
  --bootstrap-server localhost:9092
/opt/kafka/bin/kafka-topics.sh --list --bootstrap-server localhost:9092
```

Pour accepter des connexions depuis d'autres hôtes, définissez `advertised.listeners` dans
`/opt/kafka/config/server.properties` sur une adresse accessible (par exemple
`PLAINTEXT://<your-vm-ip>:9092`) puis redémarrez le service.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le ou les ports dont Apache
Kafka a besoin et ajoutez-les aux règles réseau/de sécurité de l'instance dans le portail :

```bash
sudo ufw allow 9092/tcp
```

## Étapes suivantes

- [Documentation Apache Kafka](https://kafka.apache.org/documentation/)
- [Guide d'installation Apache Kafka](https://kafka.apache.org/quickstart)
