---
title: Uptime Kuma
---

Uptime Kuma est un outil de surveillance auto-hébergé qui suit la disponibilité des sites web, des
API, des ports TCP et plus encore. Il envoie des notifications lorsqu'un service tombe en panne et
publie des pages d'état publiques. Il s'exécute dans un seul conteneur Docker et s'administre
entièrement par une interface web sur le port 3001.

## Logiciels inclus

| Composant   | Version       |
| ----------- | ------------- |
| Uptime Kuma | 2.4.0         |
| Docker      | Latest stable |
| Ubuntu      | 24.04 LTS     |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration lance Uptime Kuma avec Docker Compose. Cette
opération prend moins d'une minute. Suivez la progression :

```bash
sudo journalctl -u uptime-kuma-first-boot.service -f
```

Le message de connexion (MOTD) confirme qu'Uptime Kuma est prêt. Vous pouvez également vérifier le
conteneur :

```bash
cd /opt/uptime-kuma && docker compose ps
```

### 3. Ouvrir un tunnel SSH

Uptime Kuma est lié à localhost afin de protéger son assistant non authentifié de premier démarrage.
Depuis votre machine locale, ouvrez un tunnel :

```bash
ssh -L 3001:127.0.0.1:3001 ubuntu@<your-vm-ip>
```

### 4. Créer le compte administrateur

Pendant que le tunnel fonctionne, ouvrez un navigateur et accédez à :

```text
http://127.0.0.1:3001
```

Terminez l'assistant de premier démarrage pour créer votre nom d'utilisateur et votre mot de passe
d'administrateur. L'image ne crée pas de compte administrateur partagé par défaut.

## Gérer Uptime Kuma

Uptime Kuma fonctionne comme une pile Docker Compose dans `/opt/uptime-kuma`.

```bash
# Check status
cd /opt/uptime-kuma && docker compose ps

# Restart
cd /opt/uptime-kuma && docker compose restart

# View logs
cd /opt/uptime-kuma && docker compose logs -f
```

| Chemin                                | Fonction                           |
| ------------------------------------- | ---------------------------------- |
| `/opt/uptime-kuma/docker-compose.yml` | Configuration Docker Compose       |
| `/var/lib/uptime-kuma/`               | Moniteurs et données persistantes  |
| `/etc/uptime-kuma/info.txt`           | Informations d'accès et de gestion |

## Sécurité

Uptime Kuma écoute sur le port 3001, mais le conteneur ne le publie que sur `127.0.0.1`. UFW est
activé et n'autorise par défaut que SSH (port 22). Utilisez le tunnel SSH ci-dessus pour terminer la
configuration de l'administrateur avant d'exposer l'interface.

Conservez la liaison `127.0.0.1:3001:3001` dans `/opt/uptime-kuma/docker-compose.yml`. Les ports
publiés par Docker contournent UFW parce que Docker gère ses propres règles iptables. Une liaison à
`3001:3001` expose donc l'interface à tout le monde, quelle que soit la règle UFW. Accédez à
l'interface par le tunnel SSH ci-dessus ou placez-la derrière un proxy inverse. Si vous devez
publier le port, ajoutez une règle dans la chaîne `DOCKER-USER` ou utilisez nftables pour le
limiter.

**Pour une utilisation en production**, placez Uptime Kuma derrière un proxy inverse afin de le
servir en HTTPS avec un certificat TLS de confiance. N'exposez pas publiquement l'assistant de
premier démarrage.

:::caution

Créez le premier administrateur par le tunnel SSH avant de modifier la liaison limitée à localhost.
Tant que vous n'avez pas terminé l'assistant, toute personne qui accède à l'interface peut
s'attribuer le compte administrateur.

:::

## Étapes suivantes

- [Documentation d'Uptime Kuma](https://github.com/louislam/uptime-kuma/wiki)
- [Guide d'installation d'Uptime Kuma](https://github.com/louislam/uptime-kuma/wiki/%F0%9F%94%A7-How-to-Install)
