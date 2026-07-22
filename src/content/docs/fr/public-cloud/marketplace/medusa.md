---
title: Medusa
---

Medusa est une plateforme de commerce headless open source bâtie sur Node.js. Elle fournit un
backend modulaire avec un tableau de bord d'administration intégré ainsi que des API REST/Store qui
alimentent des vitrines personnalisées. Vous restez propriétaire des données et du code, et vous
l'étendez avec des modules TypeScript.

## Logiciels inclus

| Composant  | Version   |
| ---------- | --------- |
| Medusa     | 2.17.2    |
| Node.js    | 22        |
| PostgreSQL | 17 Alpine |
| Redis      | 7 Alpine  |
| Ubuntu     | 24.04 LTS |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Medusa génère les secrets, démarre PostgreSQL et Redis, exécute les migrations de la base de
données, crée l'utilisateur administrateur et démarre le service Medusa. Cette opération prend
environ trois à cinq minutes. Suivez la progression avec :

```bash
sudo journalctl -u medusa-first-boot.service -f
```

Vérifiez ensuite le service :

```bash
systemctl status medusa.service
```

### 3. Accéder au tableau de bord d'administration Medusa

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>/app
```

Consultez les informations de connexion générées :

```bash
sudo cat /root/.credentials/medusa.txt
```

| Champ            | Valeur                                 |
| ---------------- | -------------------------------------- |
| Adresse courriel | `admin@example.com`, sauf remplacement |
| Mot de passe     | Dans `/root/.credentials/medusa.txt`   |

L'API Storefront est accessible à `http://<your-vm-ip>`.

## Gérer Medusa

```bash
# Check service status
systemctl status medusa.service

# Restart Medusa
sudo systemctl restart medusa.service

# View Medusa logs
sudo journalctl -u medusa.service -f

# Check the PostgreSQL, Redis, and Nginx containers
cd /opt/medusa && docker compose ps
```

| Chemin                               | Fonction                                         |
| ------------------------------------ | ------------------------------------------------ |
| `/opt/medusa/store/medusa-config.ts` | Configuration de l'application Medusa            |
| `/opt/medusa/store/.env`             | Environnement et secrets générés                 |
| `/opt/medusa/docker-compose.yml`     | Pile PostgreSQL, Redis et Nginx                  |
| `/opt/medusa/volumes/db/`            | Données PostgreSQL                               |
| `/opt/medusa/volumes/redis/`         | Données Redis                                    |
| `/root/.credentials/medusa.txt`      | Identifiants d'administration et de base générés |

## Sécurité

Medusa est exposé par Nginx sur le port 80. Son port d'application 9000 n'est autorisé que depuis
les réseaux de pont Docker. UFW est activé et autorise HTTP (port 80) et SSH (port 22).

**Pour limiter l'interface et les API à une adresse IP précise :**

```bash
sudo ufw delete allow 80/tcp
sudo ufw allow from <trusted-ip> to any port 80
```

**Pour accéder à Medusa sans laisser le port 80 ouvert, utilisez un tunnel SSH :**

Fermez d'abord le port public sur la VM, puisqu'il est ouvert par défaut :

```bash
sudo ufw delete allow 80/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8080/app
```

**Pour une utilisation en production**, placez Medusa derrière un proxy inverse avec un certificat
TLS de confiance et mettez à jour le nom d'hôte public afin que les paramètres CORS de
l'administration et de l'API utilisent la bonne origine.

:::caution

Traitez `/root/.credentials/medusa.txt` comme un fichier sensible. Modifiez le mot de passe
administrateur initial et limitez le tableau de bord d'administration aux utilisateurs de confiance.

:::

## Étapes suivantes

- [Documentation de Medusa](https://docs.medusajs.com/)
- [Guide d'installation de Medusa](https://docs.medusajs.com/learn/installation)
