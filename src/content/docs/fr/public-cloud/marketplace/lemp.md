---
title: Pile LEMP
---

La pile LEMP (Linux, Nginx, MariaDB et PHP) est une solution de rechange haute performance à la pile
LAMP classique. Nginx gère le trafic HTTP plus efficacement qu'Apache sous charge, ce qui en fait un
bon choix pour les applications Web de production. Cette image exécute toute la pile dans Docker
Compose pour simplifier la gestion.

## Logiciels inclus

| Composant      | Version         |
| -------------- | --------------- |
| Nginx          | Dernière stable |
| MariaDB        | Dernière stable |
| PHP-FPM        | 8.3             |
| Docker         | Dernière stable |
| Docker Compose | Dernière stable |
| Ubuntu         | 24.04 LTS       |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il:

- génère des mots de passe aléatoires pour l'utilisateur `root` MariaDB et l'utilisateur applicatif;
- écrit la configuration d'environnement dans `/opt/lemp/.env`;
- enregistre les identifiants dans `/etc/lemp/credentials.txt`;
- démarre les conteneurs Nginx, PHP-FPM et MariaDB avec Docker Compose.

Cela prend moins de 60 secondes. Suivez la progression:

```bash
journalctl -u lemp-first-boot.service -f
```

### 3. Récupérez les identifiants

```bash
sudo cat /etc/lemp/credentials.txt
```

Ce fichier contient le mot de passe `root` MariaDB et les identifiants de la base de données
applicative. Il est lisible uniquement par `root`.

### 4. Vérifiez que la pile est en cours d'exécution

```bash
cd /opt/lemp && docker compose ps
```

Ouvrez un navigateur et accédez à:

```text
http://<your-vm-ip>
```

## Déployer votre application

Placez les fichiers de votre application PHP dans la racine Web:

```bash
sudo cp -r my-app/* /opt/lemp/www/
```

Connectez-vous à MariaDB depuis l'intérieur de la pile:

```bash
cd /opt/lemp && docker compose exec mariadb mariadb -u root -p
```

## Gérer la pile LEMP

Toute la gestion se fait avec Docker Compose depuis `/opt/lemp`:

```bash
# Vérifier l'état
docker compose ps

# Redémarrer tous les services
docker compose restart

# Consulter les journaux Nginx
docker compose logs nginx -f

# Consulter les journaux PHP-FPM
docker compose logs php -f

# Consulter les journaux MariaDB
docker compose logs mariadb -f

# Arrêter la pile
docker compose down

# Démarrer la pile
docker compose up -d
```

Chemins importants:

| Chemin                      | Rôle                                      |
| --------------------------- | ----------------------------------------- |
| `/opt/lemp/www/`            | Racine Web                                |
| `/opt/lemp/.env`            | Variables d'environnement (mots de passe) |
| `/opt/lemp/nginx/`          | Configuration Nginx                       |
| `/etc/lemp/credentials.txt` | Référence des identifiants                |

## Sécurité

Le port 80 est ouvert par défaut. UFW est activé.

Après avoir configuré HTTPS, limitez le trafic HTTP:

```bash
sudo ufw allow 443/tcp
sudo ufw delete allow 80/tcp
```

:::note

MariaDB n'est pas exposé à l'extérieur du réseau Docker. Seul Nginx est lié au réseau de l'hôte.
Pour activer HTTPS, configurez un certificat SSL dans le conteneur Nginx ou placez un proxy inverse
en amont.

:::

## Prochaines étapes

- [Documentation Nginx](https://nginx.org/en/docs/)
- [Documentation MariaDB](https://mariadb.com/kb/en/)
- [Documentation PHP](https://www.php.net/docs.php)
