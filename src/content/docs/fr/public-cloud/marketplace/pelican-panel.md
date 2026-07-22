---
title: Pelican Panel
---

Pelican est un panneau moderne et open source de gestion de serveurs de jeu, et le successeur
spirituel de Pterodactyl. Il fournit une interface web rapide pour déployer et gérer des serveurs de
jeu, avec une isolation par serveur assurée par le démon Wings. Pelican utilise PHP et Laravel et
propose un programme d'installation web guidé.

## Logiciels inclus

| Composant     | Version      |
| ------------- | ------------ |
| Pelican Panel | 1.0.0_beta35 |
| Pelican Wings | 1.0.0_beta26 |
| PHP           | 8.5          |
| Ubuntu        | 24.04 LTS    |

Wings et Docker sont installés, mais Wings ne démarre pas tant que vous n'avez pas créé un nœud dans
le panneau et enregistré sa configuration générée sur la VM.

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Pelican configure MariaDB, écrit son fichier d'environnement, génère la clé d'application Laravel,
démarre Nginx et PHP-FPM, puis prépare Wings. Suivez la progression avec :

```bash
sudo journalctl -u pelican-first-boot.service -f
```

Vérifiez ensuite les services du panneau :

```bash
systemctl status nginx php8.5-fpm mariadb
```

### 3. Accéder au programme d'installation

Le programme d'installation est accessible par un tunnel SSH, car HTTP n'est pas ouvert au public
par défaut. Depuis votre machine locale, exécutez :

```bash
ssh -L 8080:127.0.0.1:80 ubuntu@<your-vm-ip>
```

Ouvrez ensuite :

```text
http://127.0.0.1:8080/installer
```

Terminez l'installation et créez votre premier compte administrateur. L'image ne crée pas
d'identifiants de connexion partagés par défaut.

### 4. Activer les tâches planifiées et le processus de file d'attente

Une fois l'installation terminée, activez le planificateur et le processus de file d'attente de
Pelican :

```bash
CRON="* * * * * php /var/www/pelican/artisan schedule:run >> /dev/null 2>&1"
sudo crontab -u www-data -l 2>/dev/null | grep -qF "$CRON" \
  || ( sudo crontab -u www-data -l 2>/dev/null; echo "$CRON" ) | sudo crontab -u www-data -
sudo systemctl enable --now pelican-queue
```

### 5. Configurer Wings

Créez un nœud dans l'interface d'administration Pelican et enregistrez sa configuration Wings
générée sous :

```text
/etc/pelican/config.yml
```

Démarrez ensuite Wings :

```bash
sudo systemctl start wings
systemctl status wings
```

## Gérer Pelican Panel

```bash
# Check Panel services and the queue worker
systemctl status nginx php8.5-fpm mariadb pelican-queue

# Restart the web services
sudo systemctl restart nginx php8.5-fpm

# View first-boot logs
sudo journalctl -u pelican-first-boot.service -f

# View Wings logs after configuring a node
sudo journalctl -u wings.service -f
```

| Chemin                               | Fonction                                     |
| ------------------------------------ | -------------------------------------------- |
| `/var/www/pelican/`                  | Application Pelican                          |
| `/var/www/pelican/.env`              | Configuration d'environnement du panneau     |
| `/etc/pelican-panel/credentials.txt` | Informations MariaDB générées et notes Wings |
| `/etc/pelican/config.yml`            | Configuration du nœud Wings                  |

## Sécurité

Pelican écoute derrière Nginx sur le port 80, mais UFW n'autorise par défaut que SSH (port 22). Les
ports 80, 443, 2022 et 8080 restent fermés jusqu'à ce que vous décidiez comment exposer le panneau,
Wings et les allocations des serveurs de jeu.

Utilisez le tunnel SSH des étapes de démarrage pour terminer l'installation. Pour autoriser l'accès
au panneau depuis une adresse IP de confiance après la configuration :

```bash
sudo ufw allow from <trusted-ip> to any port 80
```

**Pour une utilisation en production**, faites pointer le DNS vers la VM, placez le panneau derrière
un proxy inverse avec un certificat TLS de confiance et remplacez l'URL de l'application dans
`/var/www/pelican/.env` par l'URL HTTPS publique. N'ouvrez les ports de Wings et des allocations de
jeu qu'après avoir configuré le nœud.

:::caution

Le programme d'installation web crée un état d'administrateur sensible. Terminez-le par le tunnel
SSH avant d'ouvrir l'accès HTTP ou HTTPS.

:::

## Étapes suivantes

- [Documentation de Pelican](https://pelican.dev/docs/)
- [Guide d'installation de Pelican Panel](https://pelican.dev/docs/panel/getting-started)
- [Installation de Pelican Wings](https://pelican.dev/docs/wings/install/)
