---
title: Directus
---

Directus est un CMS headless et une plateforme de données open source qui enveloppe toute base de
données SQL d'une API REST et GraphQL ainsi que d'une application d'administration sans code. Vous
le connectez à une base de données et obtenez immédiatement la gestion de contenu, le stockage de
ressources et un contrôle d'accès granulaire. L'image Docker officielle constitue la méthode
recommandée pour l'auto-hébergement.

## Logiciels inclus

| Composant               | Version   |
| ----------------------- | --------- |
| Directus                | 12.1.1    |
| PostgreSQL with PostGIS | 16 / 3.5  |
| Ubuntu                  | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable         | Description                                   |
| ---------------- | --------------------------------------------- |
| `ADMIN_EMAIL`    | Adresse courriel de l'administrateur Directus |
| `ADMIN_PASSWORD` | Mot de passe de l'administrateur Directus     |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration génère des secrets uniques pour l'application et la
base de données, démarre PostgreSQL/PostGIS et Directus, puis crée le compte administrateur. Suivez
la progression :

```bash
journalctl -u directus-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Directus est prêt.

### 3. Vérifier que Directus fonctionne

```bash
cd /opt/directus
docker compose ps
curl -fsS http://127.0.0.1:8055/server/ping
```

### 4. Accéder à l'interface Directus

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>:8055
```

Récupérez les identifiants de l'administrateur :

```bash
sudo cat /etc/directus/credentials.txt
```

| Champ            | Valeur                               |
| ---------------- | ------------------------------------ |
| Adresse courriel | Dans `/etc/directus/credentials.txt` |
| Mot de passe     | Dans `/etc/directus/credentials.txt` |

## Gérer Directus

```bash
# Check container status
cd /opt/directus && docker compose ps

# Restart
cd /opt/directus && docker compose restart

# View logs
cd /opt/directus && docker compose logs -f
```

| Chemin                             | Fonction                                  |
| ---------------------------------- | ----------------------------------------- |
| `/opt/directus/docker-compose.yml` | Configuration Docker Compose              |
| `/opt/directus/.env`               | Paramètres de l'application et de la base |
| `/var/lib/directus/database/`      | Données PostgreSQL/PostGIS                |
| `/var/lib/directus/uploads/`       | Fichiers téléversés                       |
| `/var/lib/directus/extensions/`    | Extensions Directus                       |

## Sécurité

Le port 8055 est accessible sur l'interface réseau de la VM. UFW est activé et autorise par défaut
SSH (port 22) et Directus (port 8055).

**Pour limiter l'interface et l'API à une adresse IP précise :**

```bash
sudo ufw delete allow 8055/tcp
sudo ufw allow from <trusted-ip> to any port 8055
```

**Pour accéder à Directus sans exposer le port 8055, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 8055:localhost:8055 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8055
```

**Pour une utilisation en production**, placez Directus derrière un proxy inverse afin de le servir
sur le port 443 avec un certificat TLS, puis remplacez l'URL publique de Directus par l'URL HTTPS.

:::caution

Réservez `/opt/directus/.env` et `/etc/directus/credentials.txt` aux administrateurs. Les deux
fichiers contiennent des mots de passe et des secrets d'application.

:::

## Étapes suivantes

- [Documentation de Directus](https://directus.io/docs)
- [Guide d'installation de Directus](https://directus.io/docs/self-hosted/docker-guide)
