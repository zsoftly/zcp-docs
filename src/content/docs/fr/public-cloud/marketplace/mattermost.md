---
title: Mattermost
---

Mattermost est une plateforme open source, auto-hébergée, de messagerie et de collaboration pour les
équipes. Elle fournit des canaux, des messages directs, le partage de fichiers, la recherche et des
intégrations comme solution privée de remplacement des services de clavardage hébergés, tout en
conservant vos données sur votre propre infrastructure. Le serveur écoute sur le port 8065.

## Logiciels inclus

| Composant               | Version   |
| ----------------------- | --------- |
| Mattermost Team Edition | 11.8.3    |
| PostgreSQL              | 18 Alpine |
| Ubuntu                  | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable                     | Description                     |
| ---------------------------- | ------------------------------- |
| `DOMAIN`                     | Domaine public de Mattermost    |
| `POSTGRES_PASSWORD`          | Mot de passe PostgreSQL         |
| `MM_SERVICESETTINGS_SITEURL` | URL publique du site Mattermost |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, Mattermost génère un mot de passe de base de données et lance PostgreSQL,
Mattermost et Nginx dans une pile Docker Compose. Suivez la progression avec :

```bash
sudo journalctl -u mattermost-first-boot.service -f
```

Vérifiez ensuite la pile :

```bash
cd /opt/mattermost && docker compose ps
```

### 3. Accéder à l'interface Mattermost

Si vous avez défini `DOMAIN` ou `MM_SERVICESETTINGS_SITEURL` lors du déploiement, faites pointer un
enregistrement DNS pour ce nom d'hôte vers la VM et ouvrez-le en HTTPS par un proxy inverse qui
termine TLS :

```text
https://<your-domain>
```

Si vous ne les avez pas définis, accédez directement à la VM par son adresse IP :

```text
http://<your-vm-ip>
```

Terminez l'assistant de configuration pour créer votre compte administrateur. Le premier compte créé
devient administrateur système. L'image ne crée pas d'identifiants de connexion partagés par défaut.

## Gérer Mattermost

Mattermost fonctionne comme une pile Docker Compose dans `/opt/mattermost`.

```bash
# Check status
cd /opt/mattermost && docker compose ps

# Restart
cd /opt/mattermost && docker compose restart

# View logs
cd /opt/mattermost && docker compose logs -f
```

| Chemin                                    | Fonction                                                   |
| ----------------------------------------- | ---------------------------------------------------------- |
| `/opt/mattermost/docker-compose.yml`      | Pile Compose                                               |
| `/opt/mattermost/.env`                    | Environnement de la base et de Mattermost                  |
| `/opt/mattermost/volumes/db/`             | Données PostgreSQL                                         |
| `/opt/mattermost/volumes/app/mattermost/` | Configuration, fichiers, journaux et données de Mattermost |

## Sécurité

Mattermost est exposé par Nginx sur le port 80. Le port 8065 de l'application reste dans le réseau
Docker. UFW est activé et autorise HTTP (port 80) et SSH (port 22).

**Pour limiter l'interface à une adresse IP précise :**

```bash
sudo ufw delete allow 80/tcp
sudo ufw allow from <trusted-ip> to any port 80
```

**Pour accéder à l'interface sans laisser le port 80 ouvert, utilisez un tunnel SSH :**

Fermez d'abord le port public sur la VM, puisqu'il est ouvert par défaut :

```bash
sudo ufw delete allow 80/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8080
```

**Pour une utilisation en production**, placez Mattermost derrière un proxy inverse avec un
certificat TLS de confiance et définissez l'URL de son site sur votre domaine HTTPS public.

:::caution

Créez rapidement le premier administrateur et limitez l'accès aux utilisateurs de confiance pendant
la configuration. Le premier compte créé reçoit les privilèges d'administrateur système.

:::

## Étapes suivantes

- [Documentation de Mattermost](https://docs.mattermost.com/)
- [Guide d'installation de Mattermost](https://docs.mattermost.com/deployment-guide/server/deploy-containers.html)
