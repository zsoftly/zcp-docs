---
title: RabbitMQ
---

RabbitMQ est un courtier de messages open source qui implémente AMQP et d'autres protocoles de
messagerie. Il achemine les messages entre les producteurs et les consommateurs, découplant ainsi
les services d'un système distribué. Un plugin de gestion intégré fournit une interface web et une
API HTTP pour surveiller les files d'attente, les échanges et les connexions.

:::note[Bientôt disponible]

Une image RabbitMQ préconfigurée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer RabbitMQ
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 4 Go       |
| Stockage  | 10 Go   | 40 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **RabbitMQ** et cliquez sur
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

## Installer RabbitMQ

RabbitMQ s'exécute sur Erlang/OTP. Team RabbitMQ publie des dépôts apt pour Erlang et pour le
courtier, ce qui vous maintient sur des versions prises en charge et compatibles. Installez les
prérequis et les clés de signature des dépôts :

```bash
sudo apt-get install -y curl gnupg apt-transport-https

curl -1sLf "https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA" \
  | sudo gpg --dearmor | sudo tee /usr/share/keyrings/com.rabbitmq.team.gpg > /dev/null

curl -1sLf "https://github.com/rabbitmq/signing-keys/releases/download/3.0/cloudsmith.E495BB49CC4BBE5B.key" \
  | sudo gpg --dearmor | sudo tee /usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg > /dev/null
```

Ajoutez les dépôts Erlang et RabbitMQ pour Ubuntu 24.04 (`noble`) :

```bash
sudo tee /etc/apt/sources.list.d/rabbitmq.list > /dev/null <<'EOF'
deb [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://deb1.rabbitmq.com/rabbitmq-erlang/ubuntu/noble noble main
deb [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://deb1.rabbitmq.com/rabbitmq-server/ubuntu/noble noble main
EOF
```

Installez Erlang et le serveur RabbitMQ :

```bash
sudo apt-get update

sudo apt-get install -y erlang-base \
  erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
  erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
  erlang-runtime-tools erlang-snmp erlang-ssl \
  erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl

sudo apt-get install -y rabbitmq-server
```

Le paquet installe un service systemd qui démarre au démarrage du système. Vérifiez qu'il est en
cours d'exécution :

```bash
sudo systemctl enable --now rabbitmq-server
sudo systemctl status rabbitmq-server
```

## Configurer RabbitMQ

Activez le plugin de gestion pour obtenir l'interface web et l'API HTTP sur le port 15672 :

```bash
sudo rabbitmq-plugins enable rabbitmq_management
```

Le compte `guest` par défaut ne peut se connecter que depuis `localhost`. Créez votre propre
administrateur afin de pouvoir vous connecter à l'interface à distance :

```bash
sudo rabbitmqctl add_user admin '<a-strong-password>'
sudo rabbitmqctl set_user_tags admin administrator
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
```

Connectez-vous à l'interface de gestion à l'adresse `http://<your-vm-ip>:15672` avec l'utilisateur
`admin`. Les applications publient et consomment des messages via AMQP sur le port 5672.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le ou les ports dont
RabbitMQ a besoin et ajoutez-les aux règles réseau/de sécurité de l'instance dans le portail :

```bash
sudo ufw allow 5672/tcp
sudo ufw allow 15672/tcp
```

## Étapes suivantes

- [Documentation RabbitMQ](https://www.rabbitmq.com/docs)
- [Guide d'installation RabbitMQ](https://www.rabbitmq.com/docs/install-debian)
