---
title: Wiki.js
---

Wiki.js est une plateforme moderne et open source de wiki et de documentation. Elle offre un éditeur
Markdown riche, un contrôle d'accès granulaire, une recherche plein texte et des intégrations
d'authentification, le tout reposant sur une base de données relationnelle. Elle convient bien aux
bases de connaissances internes, à la documentation de produits et aux wikis d'équipe. L'interface
web fonctionne sur le port 3000.

## Logiciels inclus

| Composant  | Version       |
| ---------- | ------------- |
| Wiki.js    | 2.5.312       |
| PostgreSQL | 18            |
| Docker     | Latest stable |
| Ubuntu     | 24.04 LTS     |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable  | Description                          |
| --------- | ------------------------------------ |
| `DB_USER` | Nom d'utilisateur PostgreSQL         |
| `DB_PASS` | Mot de passe PostgreSQL              |
| `DB_NAME` | Nom de la base de données PostgreSQL |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration génère le mot de passe de la base de données et
lance Wiki.js et PostgreSQL avec Docker Compose. Suivez la progression :

```bash
sudo journalctl -u wikijs-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Wiki.js est prêt. Vous pouvez également vérifier les
deux conteneurs :

```bash
cd /opt/wikijs && docker compose ps
```

### 3. Accéder à l'interface Wiki.js

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>:3000
```

### 4. Créer le compte administrateur

Terminez l'assistant de premier démarrage pour créer l'administrateur et configurer le site. L'image
ne crée pas de compte administrateur partagé par défaut.

## Gérer Wiki.js

Wiki.js fonctionne comme une pile Docker Compose dans `/opt/wikijs`.

```bash
# Check status
cd /opt/wikijs && docker compose ps

# Restart
cd /opt/wikijs && docker compose restart

# View logs
cd /opt/wikijs && docker compose logs -f
```

| Chemin                           | Fonction                                        |
| -------------------------------- | ----------------------------------------------- |
| `/opt/wikijs/docker-compose.yml` | Configuration Docker Compose                    |
| `/opt/wikijs/.env`               | Mot de passe interne de la base                 |
| `/opt/wikijs/data/postgres/`     | Données PostgreSQL                              |
| `/etc/wikijs/credentials.txt`    | Identifiants de la base et informations d'accès |

## Sécurité

Wiki.js utilise le port 3000. UFW est activé et autorise par défaut SSH (port 22) ainsi que le
port 3000. Le conteneur PostgreSQL n'est accessible que sur le réseau Docker interne.

**Pour limiter Wiki.js à une adresse IP précise :**

```bash
sudo ufw delete allow 3000/tcp
sudo ufw allow from <trusted-ip> to any port 3000
```

**Pour accéder à l'interface sans laisser le port 3000 ouvert, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 3000:localhost:3000 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:3000
```

**Pour une utilisation en production**, placez Wiki.js derrière un proxy inverse afin de le servir
en HTTPS avec un certificat TLS de confiance.

:::caution

Terminez rapidement l'assistant de premier démarrage et limitez l'interface aux utilisateurs et aux
réseaux de confiance. Le premier compte créé par l'assistant devient l'administrateur.

:::

## Étapes suivantes

- [Documentation de Wiki.js](https://docs.requarks.io/)
- [Guide d'installation de Wiki.js](https://docs.requarks.io/install/docker)
