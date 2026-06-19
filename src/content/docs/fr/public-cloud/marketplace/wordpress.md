---
title: WordPress
---

WordPress est le système de gestion de contenu libre le plus populaire au monde et propulse plus de
40 % des sites Web. Cette image fournit une pile LAMP complète (Apache, MariaDB et PHP) avec
WordPress préinstallé et prêt à configurer.

## Logiciels inclus

| Composant | Version        |
| --------- | -------------- |
| WordPress | 6.x (dernière) |
| Apache    | 2.4.x          |
| MariaDB   | 10.x           |
| PHP       | 8.3            |
| Ubuntu    | 24.04 LTS      |

## Variables d'environnement

Définissez ces valeurs lors du déploiement de WordPress depuis la marketplace. `SITE_URL` et
`ADMIN_EMAIL` doivent contenir les valeurs réelles de votre déploiement. Vous pouvez laisser
`ADMIN_USER` et `ADMIN_PASSWORD` vides pour générer automatiquement des valeurs aléatoires
sécurisées.

| Variable         | Description                           |
| ---------------- | ------------------------------------- |
| `SITE_URL`       | URL publique du site                  |
| `ADMIN_USER`     | Nom d'utilisateur de l'administrateur |
| `ADMIN_PASSWORD` | Mot de passe de l'administrateur      |
| `ADMIN_EMAIL`    | Adresse courriel de l'administrateur  |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il:

- crée la base de données WordPress et un utilisateur de base de données dédié avec un mot de passe
  généré aléatoirement;
- écrit `wp-config.php` avec les identifiants de base de données et des clés secrètes uniques.

Cela prend moins de 30 secondes. Suivez la progression:

```bash
journalctl -u wordpress-first-boot.service -f
```

### 3. Terminez l'assistant de configuration WordPress

Ouvrez un navigateur et accédez à:

```text
http://<your-vm-ip>
```

L'assistant de configuration WordPress vous guidera pour:

1. choisir votre langue;
2. définir le titre de votre site;
3. créer le nom d'utilisateur et le mot de passe d'administration WordPress;
4. entrer votre adresse courriel d'administration.

:::caution

Choisissez un mot de passe administrateur robuste. Ce compte contrôle tout votre site WordPress.

:::

### 4. Connectez-vous au tableau de bord WordPress

Après avoir terminé l'assistant, connectez-vous à:

```text
http://<your-vm-ip>/wp-admin
```

## Gérer WordPress

**Redémarrer Apache:**

```bash
sudo systemctl restart apache2
```

**Redémarrer MariaDB:**

```bash
sudo systemctl restart mariadb
```

Les **fichiers WordPress** se trouvent dans `/var/www/wordpress/`.

**Configuration PHP**: `/etc/php/8.3/apache2/php.ini`

**Hôte virtuel Apache**: `/etc/apache2/sites-available/wordpress.conf`

## Configurer HTTPS

WordPress est servi sur le port 80 (HTTP) par défaut. Pour activer HTTPS:

1. Faites pointer un nom de domaine vers l'adresse IP de votre VM
2. Installez Certbot: `sudo apt install certbot python3-certbot-apache`
3. Exécutez: `sudo certbot --apache -d yourdomain.com`

Certbot configurera automatiquement Apache pour HTTPS et mettra en place le renouvellement du
certificat.

## Sécurité

Le port 80 est ouvert par défaut. UFW est activé.

Après avoir configuré HTTPS, limitez le trafic HTTP:

```bash
sudo ufw allow 443/tcp
sudo ufw delete allow 80/tcp
```

:::caution

Changez immédiatement le mot de passe d'administration WordPress après la configuration. Installez
une extension de sécurité comme Wordfence pour surveiller les menaces et limiter les tentatives de
connexion.

:::

## Prochaines étapes

- [Documentation WordPress](https://wordpress.org/documentation/)
- [Répertoire des thèmes WordPress](https://wordpress.org/themes/)
- [Répertoire des extensions WordPress](https://wordpress.org/plugins/)
