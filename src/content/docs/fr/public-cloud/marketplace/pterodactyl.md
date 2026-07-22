---
title: Pterodactyl
---

Pterodactyl est un panneau libre et open source de gestion de serveurs de jeu, bâti sur PHP, Nginx
et Docker. Il vous permet de déployer et de gérer des serveurs de jeu au moyen d'une interface web
épurée, avec une isolation par serveur assurée par le démon Wings. Il alimente l'hébergement de jeux
de milliers de fournisseurs et d'auto-hébergeurs.

## Logiciels inclus

| Composant         | Version       |
| ----------------- | ------------- |
| Pterodactyl Panel | v1.12.4       |
| Wings             | v1.12.3       |
| PHP               | 8.3           |
| Docker            | Latest stable |
| Ubuntu            | 24.04 LTS     |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration règle MariaDB et Redis, crée l'administrateur,
exécute les migrations du panneau et relie Wings à un nœud par défaut. Cette opération prend
quelques minutes. Suivez la progression :

```bash
sudo journalctl -u pterodactyl-first-boot.service -f
```

Le message de connexion (MOTD) confirme que le panneau et Wings sont prêts. Vous pouvez également
vérifier directement les principaux services :

```bash
systemctl status nginx php8.3-fpm mariadb redis-server pteroq wings
```

### 3. Récupérer les identifiants de l'administrateur

Les identifiants générés sont stockés dans un fichier réservé à l'utilisateur racine :

```bash
sudo cat /root/.credentials/pterodactyl.txt
```

| Champ            | Valeur                                                                           |
| ---------------- | -------------------------------------------------------------------------------- |
| Adresse courriel | Générée au premier démarrage et stockée dans le fichier d'identifiants ci-dessus |
| Mot de passe     | Généré au premier démarrage et stocké dans le fichier d'identifiants ci-dessus   |

### 4. Accéder au panneau Pterodactyl

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>
```

Un emplacement par défaut nommé `zmi` et un nœud par défaut nommé `default` sont créés et reliés à
Wings sur la même VM. Le nœud commence avec une allocation sur le port 25565. Ajoutez des
allocations sous **Admin > Nodes > default > Allocations** avant de créer des serveurs qui ont
besoin d'autres ports.

## Gérer Pterodactyl

```bash
# Check service status
systemctl status nginx php8.3-fpm mariadb redis-server pteroq wings

# Restart the Panel web services, queue worker, and Wings
sudo systemctl restart nginx php8.3-fpm pteroq wings

# View Panel queue logs
sudo journalctl -u pteroq -f

# View Wings logs
sudo journalctl -u wings -f
```

| Chemin                               | Fonction                                              |
| ------------------------------------ | ----------------------------------------------------- |
| `/var/www/pterodactyl/.env`          | Configuration d'environnement du panneau              |
| `/etc/pterodactyl/config.yml`        | Configuration de Wings                                |
| `/var/lib/pterodactyl/volumes/`      | Données des serveurs de jeu                           |
| `/root/.credentials/pterodactyl.txt` | Identifiants et informations de configuration générés |

## Sécurité

Le panneau utilise le port 80, l'API Wings le port 8080 et le SFTP Wings le port 2022. UFW est
activé et autorise par défaut SSH (port 22) ainsi que les ports 80, 8080 et 2022. Les ports des
serveurs de jeu, y compris l'allocation initiale sur le port 25565, ne sont pas ouverts
automatiquement.

**Pour limiter l'accès au panneau à une adresse IP précise :**

```bash
sudo ufw delete allow 80/tcp
sudo ufw allow from <trusted-ip> to any port 80
```

**Pour limiter les ports de l'API et du SFTP Wings à une adresse IP précise :**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
sudo ufw delete allow 2022/tcp
sudo ufw allow from <trusted-ip> to any port 2022
```

**Pour accéder au panneau sans laisser le port 80 ouvert, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
```

Limitez les ports de l'API et du SFTP Wings aux réseaux de confiance. N'ouvrez que les ports de
serveurs de jeu requis par vos allocations.

**Pour une utilisation en production**, placez le panneau derrière un proxy inverse afin de le
servir en HTTPS avec un certificat TLS de confiance, puis remplacez l'URL de l'application dans
`/var/www/pterodactyl/.env` par l'URL publique.

:::caution

Connectez-vous avec le mot de passe administrateur généré, puis remplacez-le par un mot de passe que
vous contrôlez. Réservez le fichier d'identifiants à l'utilisateur racine et limitez les interfaces
du panneau et de Wings aux adresses IP de confiance.

:::

## Étapes suivantes

- [Documentation de Pterodactyl](https://pterodactyl.io/)
- [Guide d'installation de Pterodactyl Panel](https://pterodactyl.io/panel/1.0/getting_started.html)
