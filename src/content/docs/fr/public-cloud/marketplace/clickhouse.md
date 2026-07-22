---
title: ClickHouse
---

ClickHouse est un système de gestion de base de données open source orienté colonnes, conçu pour le
traitement analytique en ligne (OLAP). Il ingère et interroge de grands volumes de données avec une
très faible latence, ce qui convient bien aux analyses en temps réel, aux tableaux de bord, à
l'observabilité et au stockage de journaux. L'interface HTTP fonctionne sur le port 8123 et le
protocole natif sur le port 9000.

## Logiciels inclus

| Composant         | Version     |
| ----------------- | ----------- |
| ClickHouse Server | 26.6.1.1193 |
| ClickHouse Client | 26.6.1.1193 |
| Ubuntu            | 24.04 LTS   |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable              | Description                  |
| --------------------- | ---------------------------- |
| `CLICKHOUSE_USER`     | Nom d'utilisateur ClickHouse |
| `CLICKHOUSE_PASSWORD` | Mot de passe ClickHouse      |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration génère le mot de passe, configure l'utilisateur
intégré `default` et démarre ClickHouse. Cette opération prend une ou deux minutes. Suivez la
progression :

```bash
journalctl -u clickhouse-first-boot.service -f
```

Le message de connexion (MOTD) confirme que ClickHouse est prêt.

### 3. Vérifier que ClickHouse fonctionne

```bash
systemctl status clickhouse-server
```

### 4. Se connecter à ClickHouse

Récupérez les identifiants générés :

```bash
sudo cat /etc/clickhouse/credentials.txt
```

| Champ             | Valeur                                 |
| ----------------- | -------------------------------------- |
| Nom d'utilisateur | `default`                              |
| Mot de passe      | Dans `/etc/clickhouse/credentials.txt` |

Connectez-vous avec le client natif :

```bash
clickhouse-client --user default --password
```

Les points de terminaison HTTP et natif sont :

```text
http://<your-vm-ip>:8123
<your-vm-ip>:9000
```

## Gérer ClickHouse

```bash
# Check service status
systemctl status clickhouse-server

# Restart
sudo systemctl restart clickhouse-server

# View logs
sudo journalctl -u clickhouse-server -f
```

| Chemin                            | Fonction                          |
| --------------------------------- | --------------------------------- |
| `/etc/clickhouse-server/`         | Configuration du serveur          |
| `/etc/clickhouse/credentials.txt` | Identifiants de connexion générés |
| `/var/lib/clickhouse/`            | Données de la base de données     |
| `/var/log/clickhouse-server/`     | Fichiers journaux du serveur      |

## Sécurité

Les ports 8123 et 9000 sont accessibles sur l'interface réseau de la VM. UFW est activé et
n'autorise par défaut que SSH (port 22).

**Pour autoriser l'accès depuis une adresse IP précise :**

```bash
sudo ufw allow from <trusted-ip> to any port 8123
sudo ufw allow from <trusted-ip> to any port 9000
```

**Pour accéder à ClickHouse sans ouvrir le pare-feu, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 8123:localhost:8123 -L 9000:localhost:9000 ubuntu@<your-vm-ip>
```

**Pour une utilisation en production**, placez l'interface HTTP derrière un proxy inverse afin de la
servir avec un certificat TLS. Configurez séparément les connexions natives chiffrées et limitez les
deux ports aux réseaux d'applications et d'administrateurs de confiance.

:::caution

N'exposez pas largement ClickHouse à Internet. Gardez ses identifiants générés confidentiels et
limitez les deux interfaces aux clients de confiance.

:::

## Étapes suivantes

- [Documentation de ClickHouse](https://clickhouse.com/docs)
- [Guide d'installation de ClickHouse](https://clickhouse.com/docs/install/docker)
