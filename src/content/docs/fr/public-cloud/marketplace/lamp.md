---
title: Pile LAMP
---

La pile LAMP (Linux, Apache, MariaDB et PHP) est la combinaison classique pour héberger des
applications Web et des sites dynamiques. Cette image fournit les quatre composants préinstallés et
configurés pour fonctionner ensemble, prêts pour le déploiement de votre application.

## Logiciels inclus

| Composant      | Version                                                |
| -------------- | ------------------------------------------------------ |
| Apache         | 2.4.x                                                  |
| MariaDB        | Dernière stable                                        |
| PHP            | 8.3                                                    |
| Extensions PHP | cli, mysql, curl, gd, mbstring, xml, zip, bcmath, intl |
| Ubuntu         | 24.04 LTS                                              |

## Variables d'environnement

Vous pouvez définir ces valeurs lors du déploiement de LAMP depuis la marketplace. Laissez un champ
vide pour générer automatiquement une valeur aléatoire sécurisée.

| Variable              | Description                                         |
| --------------------- | --------------------------------------------------- |
| `MYSQL_ROOT_PASSWORD` | Mot de passe root de la base de données             |
| `MYSQL_DATABASE`      | Nom de la base de données applicative à créer       |
| `MYSQL_USER`          | Nom d'utilisateur de la base de données applicative |
| `MYSQL_PASSWORD`      | Mot de passe de l'utilisateur applicatif            |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Vérifiez que les services sont en cours d'exécution

Aucune configuration de premier démarrage n'est requise. Tous les services démarrent immédiatement.

```bash
systemctl status apache2
systemctl status mariadb
php --version
```

### 3. Accédez à la page Web par défaut

Ouvrez un navigateur et accédez à:

```text
http://<your-vm-ip>
```

### 4. Déployez votre application

Placez les fichiers de votre application dans la racine Web:

```bash
sudo cp -r my-app/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
```

### 5. Configurez une base de données

Sur une nouvelle installation, aucun mot de passe n'est requis. L'authentification utilise le socket
système. Connectez-vous comme `root`:

```bash
sudo mariadb
```

Créez une base de données et un utilisateur pour votre application:

```sql
CREATE DATABASE myapp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'myapp'@'localhost' IDENTIFIED BY '<strong-password>';
GRANT ALL PRIVILEGES ON myapp.* TO 'myapp'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Gérer la pile LAMP

```bash
# Redémarrer Apache
sudo systemctl restart apache2

# Redémarrer MariaDB
sudo systemctl restart mariadb

# Consulter les journaux Apache
sudo tail -f /var/log/apache2/error.log

# Consulter les journaux MariaDB
sudo journalctl -u mariadb -f
```

Répertoires et fichiers importants:

| Chemin                          | Rôle                          |
| ------------------------------- | ----------------------------- |
| `/var/www/html/`                | Racine Web par défaut         |
| `/etc/apache2/sites-available/` | Hôtes virtuels Apache         |
| `/etc/php/8.3/apache2/php.ini`  | Configuration PHP pour Apache |
| `/etc/mysql/mariadb.conf.d/`    | Configuration MariaDB         |

**Pour créer un hôte virtuel** pour un domaine, ajoutez un fichier de configuration dans
`/etc/apache2/sites-available/` et activez-le:

```bash
sudo a2ensite myapp.conf
sudo systemctl reload apache2
```

## Sécurité

Le port 80 est ouvert par défaut. UFW est activé.

Après avoir configuré HTTPS, limitez le trafic HTTP:

```bash
sudo ufw allow 443/tcp
sudo ufw delete allow 80/tcp
```

:::caution

Définissez un mot de passe `root` MariaDB robuste et limitez les utilisateurs de base de données à
`localhost`, sauf si l'accès distant est requis.

:::

## Prochaines étapes

- [Documentation Apache](https://httpd.apache.org/docs/)
- [Documentation MariaDB](https://mariadb.com/kb/en/)
- [Documentation PHP](https://www.php.net/docs.php)
