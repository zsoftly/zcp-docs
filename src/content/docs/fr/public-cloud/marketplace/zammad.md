---
title: Zammad
---

Zammad est un système open source de centre d'assistance et de billetterie destiné aux équipes de
soutien à la clientèle et de services informatiques. Il regroupe les canaux de courriel, de
clavardage, de réseaux sociaux et de téléphone dans une boîte de réception partagée avec
billetterie, SLA, base de connaissances et rapports. Il fonctionne comme une application web
auto-hébergée reposant sur PostgreSQL et Elasticsearch.

## Logiciels inclus

| Composant     | Version       |
| ------------- | ------------- |
| Zammad        | 7.1.1         |
| PostgreSQL    | 17-alpine     |
| Redis         | 7.2-alpine    |
| Elasticsearch | 9.4.3         |
| Docker        | Latest stable |
| Ubuntu        | 24.04 LTS     |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration génère le mot de passe de la base de données et
lance les conteneurs Zammad, PostgreSQL, Redis et Elasticsearch. Cette opération peut prendre de 5 à
10 minutes. Suivez la progression :

```bash
sudo journalctl -u zammad-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Zammad est prêt. Vous pouvez également vérifier
directement la pile :

```bash
cd /opt/zammad && docker compose ps
```

### 3. Accéder à l'interface Zammad

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>:8080
```

### 4. Créer le compte administrateur

Terminez l'assistant de premier démarrage pour créer votre adresse courriel et votre mot de passe
d'administrateur. L'image ne crée pas d'identifiants d'administrateur partagés par défaut.

## Gérer Zammad

Zammad fonctionne comme une pile Docker Compose dans `/opt/zammad`.

```bash
# Check status
cd /opt/zammad && docker compose ps

# Restart
cd /opt/zammad && docker compose restart

# View logs
cd /opt/zammad && docker compose logs -f
```

| Chemin                            | Fonction                                        |
| --------------------------------- | ----------------------------------------------- |
| `/opt/zammad/docker-compose.yml`  | Configuration Docker Compose                    |
| `/opt/zammad/.env`                | Mot de passe interne de la base et nom d'hôte   |
| `/opt/zammad/data/postgresql/`    | Données PostgreSQL                              |
| `/opt/zammad/data/elasticsearch/` | Données Elasticsearch                           |
| `/opt/zammad/data/redis/`         | Données Redis                                   |
| `/opt/zammad/data/zammad/`        | Pièces jointes et stockage persistant Zammad    |
| `/root/.credentials/zammad.txt`   | Identifiants de la base et informations d'accès |

## Sécurité

Zammad utilise le port 8080. UFW est activé et autorise par défaut SSH (port 22) ainsi que le
port 8080. PostgreSQL, Redis et Elasticsearch restent sur le réseau Docker interne et ne sont pas
publiés sur l'interface réseau de la VM.

**Pour limiter Zammad à une adresse IP précise :**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

**Pour accéder à l'interface sans laisser le port 8080 ouvert, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 8080:localhost:8080 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
```

**Pour une utilisation en production**, placez Zammad derrière un proxy inverse afin de le servir en
HTTPS avec un certificat TLS de confiance.

:::caution

Terminez rapidement l'assistant de configuration et limitez le centre d'assistance aux utilisateurs
et aux réseaux de confiance. Le premier compte créé par l'assistant devient l'administrateur.

:::

## Étapes suivantes

- [Documentation de Zammad](https://docs.zammad.org/)
- [Guide d'installation de Zammad](https://docs.zammad.org/en/latest/install/package.html)
