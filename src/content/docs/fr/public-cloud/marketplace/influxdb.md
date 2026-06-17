---
title: InfluxDB 2
---

InfluxDB est une base de données de séries temporelles conçue pour stocker et interroger des
métriques, des événements et des analyses en temps réel. Elle est souvent utilisée avec Grafana pour
la surveillance d'infrastructure et les pipelines de données IoT.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| InfluxDB  | 2.x       |
| Ubuntu    | 24.04 LTS |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il:

- démarre InfluxDB et attend qu'il soit prêt;
- exécute la configuration initiale avec un mot de passe administrateur et un jeton API générés
  aléatoirement;
- crée l'organisation par défaut (`zsoftly`) et le bucket par défaut (`default`);
- enregistre tous les identifiants dans `/etc/influxdb/credentials.txt`.

Cela prend moins de 60 secondes. Suivez la progression:

```bash
journalctl -u influxdb-first-boot.service -f
```

### 3. Récupérez les identifiants

```bash
sudo cat /etc/influxdb/credentials.txt
```

Ce fichier contient le nom d'utilisateur administrateur, le mot de passe, l'organisation, le bucket
par défaut et le jeton API. Il est lisible uniquement par `root`.

### 4. Accédez à l'interface InfluxDB

Ouvrez un navigateur et accédez à:

```text
http://<your-vm-ip>:8086
```

Connectez-vous avec le nom d'utilisateur administrateur et le mot de passe indiqués dans le fichier
d'identifiants.

### 5. Connectez-vous avec la CLI

La CLI `influx` est préinstallée. Configurez-la avec les identifiants du fichier:

```bash
TOKEN=$(sudo awk '/^Token:/{print $NF}' /etc/influxdb/credentials.txt)
influx config create \
  --config-name default \
  --host-url http://localhost:8086 \
  --org zsoftly \
  --token "$TOKEN" \
  --active
```

Vérifiez la connexion:

```bash
influx ping
```

## Gérer InfluxDB

```bash
# Vérifier l'état du service
systemctl status influxdb

# Redémarrer
sudo systemctl restart influxdb

# Consulter les journaux
sudo journalctl -u influxdb -f
```

Fichier de configuration: `/etc/influxdb/config.toml`

## Sécurité

Le port 8086 est accessible sur l'interface réseau de la VM. UFW est activé et n'autorise que SSH
(port 22) par défaut.

**Pour autoriser l'accès navigateur ou API depuis une adresse IP précise:**

```bash
sudo ufw allow from <trusted-ip> to any port 8086
```

**Pour accéder à l'interface sans ouvrir le pare-feu, utilisez un tunnel SSH:**

```bash
# Exécutez ceci sur votre poste local
ssh -L 8086:localhost:8086 ubuntu@<your-vm-ip>

# Ouvrez ensuite dans le navigateur
http://localhost:8086
```

:::caution

Le jeton API administrateur accorde un accès complet à toutes les données. Conservez-le en lieu sûr
et créez des jetons à portée limitée pour chaque application.

:::

## Prochaines étapes

- [Documentation InfluxDB 2](https://docs.influxdata.com/influxdb/v2/)
- [Référence de l'API InfluxDB](https://docs.influxdata.com/influxdb/v2/api/)
- [Telegraf pour la collecte de métriques](https://docs.influxdata.com/telegraf/)
