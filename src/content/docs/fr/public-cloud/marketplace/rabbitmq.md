---
title: RabbitMQ
---

RabbitMQ est un broker de messages open source qui implémente AMQP et d'autres protocoles de
messagerie. Il achemine les messages entre producteurs et consommateurs, ce qui découple les
services d'un système distribué. Un plugin de gestion intégré fournit une interface web et une API
HTTP pour surveiller les files d'attente, les échanges et les connexions.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| RabbitMQ  | 4.3.2     |
| Ubuntu    | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable                | Description                                                                                                                                                                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RABBITMQ_DEFAULT_USER` | Nom d'utilisateur administrateur. Ne peut pas être `guest` ; au premier démarrage, l'image supprime l'utilisateur `guest` par défaut et crée cet administrateur afin qu'un administrateur configuré et utilisable reste disponible |
| `RABBITMQ_DEFAULT_PASS` | Mot de passe de l'utilisateur RabbitMQ par défaut                                                                                                                                                                                  |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration active le plugin de gestion, crée l'administrateur,
applique les autorisations de l'hôte virtuel et supprime l'utilisateur `guest` par défaut. Suivez la
progression :

```bash
sudo journalctl -u rabbitmq-first-boot.service -f
```

Le message de connexion (MOTD) confirme que RabbitMQ est prêt. Vous pouvez également vérifier
directement le broker :

```bash
systemctl status rabbitmq-server
sudo rabbitmq-diagnostics ping
```

### 3. Récupérer les identifiants de l'administrateur

Les identifiants et les informations de connexion générés sont stockés dans un fichier réservé à
l'utilisateur racine :

```bash
sudo cat /etc/rabbitmq/credentials.txt
```

| Champ             | Valeur                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------- |
| Nom d'utilisateur | Valeur de `RABBITMQ_DEFAULT_USER`, ou générée de manière sécurisée au premier démarrage |
| Mot de passe      | Valeur de `RABBITMQ_DEFAULT_PASS`, ou générée de manière sécurisée au premier démarrage |
| Hôte virtuel      | `/`                                                                                     |

### 4. Accéder à RabbitMQ

Les applications se connectent au point de terminaison AMQP à :

```text
<your-vm-ip>:5672
```

L'interface de gestion est accessible à :

```text
http://<your-vm-ip>:15672
```

## Gérer RabbitMQ

```bash
# Check service status
systemctl status rabbitmq-server

# Restart
sudo systemctl restart rabbitmq-server

# View logs
sudo journalctl -u rabbitmq-server -f
```

| Chemin                          | Fonction                                      |
| ------------------------------- | --------------------------------------------- |
| `/etc/rabbitmq/`                | Configuration et fichiers d'état RabbitMQ     |
| `/var/lib/rabbitmq/`            | Base du broker et état persistant             |
| `/var/log/rabbitmq/`            | Fichiers journaux RabbitMQ                    |
| `/etc/rabbitmq/credentials.txt` | Identifiants et points de terminaison générés |

## Sécurité

RabbitMQ utilise le port 5672 pour AMQP et le port 15672 pour l'interface de gestion. UFW est activé
et n'autorise par défaut que SSH (port 22). Les deux ports RabbitMQ restent bloqués jusqu'à ce que
vous autorisiez des sources de confiance.

**Pour autoriser l'accès depuis une adresse IP précise :**

```bash
sudo ufw allow from <trusted-ip> to any port 5672
sudo ufw allow from <trusted-ip> to any port 15672
```

**Pour accéder à l'interface de gestion sans ouvrir son port, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 15672:localhost:15672 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:15672
```

**Pour une utilisation en production**, gardez AMQP sur un réseau privé ou configurez TLS dans
RabbitMQ. Placez l'interface de gestion derrière un proxy inverse afin de la servir en HTTPS avec un
certificat TLS de confiance.

:::caution

L'image supprime l'utilisateur `guest` par défaut de RabbitMQ. Protégez les identifiants
d'administrateur générés et limitez l'accès AMQP et de gestion aux réseaux d'applications et
d'administrateurs connus.

:::

## Étapes suivantes

- [Documentation de RabbitMQ](https://www.rabbitmq.com/docs)
- [Guide d'installation de RabbitMQ](https://www.rabbitmq.com/docs/install-debian)
