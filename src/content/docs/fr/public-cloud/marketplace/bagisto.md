---
title: Bagisto
---

Bagisto est une plateforme d'e-commerce open source bâtie sur le framework PHP Laravel et Vue.js.
Elle fournit une vitrine complète, une administration multicanal ainsi que la gestion des stocks et
des commandes dès l'installation. La configuration Docker officielle regroupe toutes les dépendances
et constitue donc le moyen le plus rapide de la mettre en service.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| Bagisto   | 2.4.8     |
| PHP       | 8.3       |
| Ubuntu    | 24.04 LTS |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration règle MySQL et Redis, crée l'environnement Bagisto,
exécute les migrations et l'amorçage de la base de données, génère le mot de passe administrateur et
démarre le processus de file d'attente. Cette opération peut prendre quelques minutes. Suivez la
progression :

```bash
journalctl -u bagisto-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Bagisto est prêt.

### 3. Vérifier que Bagisto fonctionne

```bash
systemctl status nginx php8.3-fpm mysql redis-server bagisto-queue.service
curl -fsS http://127.0.0.1/ > /dev/null
```

### 4. Accéder à la vitrine et à l'interface d'administration

Ouvrez la vitrine :

```text
http://<your-vm-ip>
```

Ouvrez le panneau d'administration :

```text
http://<your-vm-ip>/admin
```

Récupérez les identifiants générés :

```bash
sudo cat /root/.credentials/bagisto.txt
```

| Champ            | Valeur                                                                 |
| ---------------- | ---------------------------------------------------------------------- |
| Adresse courriel | Générée au premier démarrage et stockée dans le fichier d'identifiants |
| Mot de passe     | Dans `/root/.credentials/bagisto.txt`                                  |

## Gérer Bagisto

```bash
# Check service status
systemctl status nginx php8.3-fpm mysql redis-server bagisto-queue.service

# Restart the web and queue services
sudo systemctl restart nginx php8.3-fpm bagisto-queue.service

# View queue-worker logs
sudo journalctl -u bagisto-queue.service -f
```

| Chemin                                    | Fonction                       |
| ----------------------------------------- | ------------------------------ |
| `/var/www/bagisto/.env`                   | Configuration de l'application |
| `/etc/nginx/sites-available/bagisto.conf` | Hôte virtuel Nginx             |
| `/var/www/bagisto/storage/`               | Stockage de l'application      |

## Sécurité

Le port 80 est accessible sur l'interface réseau de la VM. UFW est activé et autorise par défaut SSH
(port 22) et le HTTP de Bagisto (port 80).

**Pour limiter la vitrine à une adresse IP précise :**

```bash
sudo ufw delete allow 80/tcp
sudo ufw allow from <trusted-ip> to any port 80
```

**Pour accéder à Bagisto sans exposer le port 80, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
```

**Pour une utilisation en production**, placez Bagisto derrière un proxy inverse afin de le servir
sur le port 443 avec un certificat TLS, et remplacez l'URL de l'application dans
`/var/www/bagisto/.env` par celle de votre domaine.

:::caution

Le fichier d'identifiants contient également les mots de passe de la base de données, du compte
racine MySQL et de Redis. Réservez-le aux administrateurs et limitez l'accès au panneau
d'administration.

:::

## Étapes suivantes

- [Documentation de Bagisto](https://devdocs.bagisto.com/)
- [Guide d'installation de Bagisto](https://github.com/bagisto/bagisto-docker)
