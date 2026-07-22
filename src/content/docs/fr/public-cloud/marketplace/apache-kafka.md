---
title: Apache Kafka
---

Apache Kafka est une plateforme open source distribuée de diffusion d'événements. Elle ingère,
stocke et traite des flux d'enregistrements à haut débit répartis entre des topics, ce qui alimente
la messagerie, l'agrégation de journaux et les pipelines de données en temps réel. Kafka moderne
fonctionne en mode KRaft et n'a donc plus besoin d'un cluster ZooKeeper distinct.

## Logiciels inclus

| Composant    | Version   |
| ------------ | --------- |
| Apache Kafka | 4.3.1     |
| OpenJDK      | 21 (JRE)  |
| Ubuntu       | 24.04 LTS |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration règle `advertised.listeners`, formate le stockage
KRaft et démarre Kafka. Suivez la progression :

```bash
journalctl -u kafka-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Kafka est prêt.

### 3. Vérifier qu'Apache Kafka fonctionne

```bash
systemctl status kafka
```

Répertoriez les topics disponibles pour vérifier le broker :

```bash
sudo -u kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --list
```

### 4. Se connecter au broker

Le serveur d'amorçage écoute sur :

```text
<your-vm-ip>:9092
```

Vous pouvez consulter les instructions de connexion écrites au premier démarrage :

```bash
sudo cat /root/.credentials/kafka.txt
```

## Gérer Apache Kafka

```bash
# Check service status
systemctl status kafka

# Restart
sudo systemctl restart kafka

# View logs
sudo journalctl -u kafka -f
```

| Chemin                                | Fonction                         |
| ------------------------------------- | -------------------------------- |
| `/opt/kafka/config/server.properties` | Configuration du broker et KRaft |
| `/opt/kafka/data/`                    | Données Kafka                    |

## Sécurité

Le port 9092 est accessible sur l'interface réseau de la VM. UFW est activé et n'autorise par défaut
que SSH (port 22).

**Pour autoriser l'accès au broker depuis une adresse IP précise :**

```bash
sudo ufw allow from <trusted-ip> to any port 9092
```

L'adresse de l'écouteur annoncé est générée à partir de l'adresse IP locale de la VM au premier
démarrage. Pour vous connecter sans ouvrir le pare-feu, faites pointer l'écouteur annoncé vers
`localhost` sur la VM, redémarrez Kafka, puis ouvrez un tunnel SSH :

```bash
# On the VM: advertise localhost instead of the VM's IP, then restart Kafka
sudo sed -i 's|^advertised.listeners=.*|advertised.listeners=PLAINTEXT://localhost:9092|' /opt/kafka/config/server.properties
sudo systemctl restart kafka
```

```bash
# Run this on your local machine
ssh -L 9092:localhost:9092 ubuntu@<your-vm-ip>
```

Kafka utilise un transport en texte clair sans authentification dans cette image à nœud unique.
Configurez l'authentification et des écouteurs chiffrés avant de l'utiliser pour des charges de
travail en production, et limitez le port 9092 aux clients de confiance.

:::caution

N'exposez pas largement le port 9092 à Internet. Remplacez l'écouteur annoncé par une adresse que
vos clients autorisés peuvent joindre, puis limitez l'accès avec UFW et les règles de sécurité
réseau.

:::

## Étapes suivantes

- [Documentation d'Apache Kafka](https://kafka.apache.org/documentation/)
- [Guide d'installation d'Apache Kafka](https://kafka.apache.org/quickstart)
