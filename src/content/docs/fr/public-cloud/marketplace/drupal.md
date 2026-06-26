---
title: Drupal
---

Drupal est un système de gestion de contenu libre pour créer aussi bien des sites simples que des
applications complexes riches en contenu. Son modèle d'entités, sa taxonomie et son écosystème de
modules permettent aux équipes de définir des types de contenu personnalisés, des flux éditoriaux et
des sites multilingues sans écrire la tuyauterie elles-mêmes.

:::note[Bientôt disponible]

Une image Drupal préconstruite arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** neuve depuis la place de marché et suivez les étapes ci-dessous pour installer Drupal
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

Drupal 11 fonctionne sur une pile LAMP (Linux, Apache, MySQL/MariaDB, PHP 8.3+). Les besoins en
stockage augmentent avec les téléversements de médias et le nombre de modules installés.

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps** et passez à l'onglet **Marketplace**. Il s'ouvre
   sur **Featured** par défaut, sélectionnez donc **Marketplace** à côté. Choisissez votre région
   (YOW-1 ou YUL-1), recherchez **Ubuntu 24.04 LTS** et cliquez sur **Deploy**. Vous pouvez aussi
   créer l'instance depuis **Instances → Create**. Dans les deux cas, vous obtenez une VM Ubuntu
   24.04 propre.

   ![L'onglet Marketplace du portail ZSoftly Cloud, avec le sélecteur de région, la liste des catégories, la barre de recherche et les boutons Deploy](../../../../../assets/marketplace/deploy-marketplace-tab.webp)

   ![Recherche d'une application dans le Marketplace, la barre de recherche filtrant le catalogue jusqu'à une carte Deploy correspondante](../../../../../assets/marketplace/deploy-marketplace-search.webp)

2. Choisissez un plan qui répond aux prérequis ci-dessus.

3. Lorsque l'instance est **Running**, connectez-vous en SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour:

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer la pile LAMP

Installez Apache, MariaDB, PHP 8.3 et les extensions PHP dont Drupal a besoin:

```bash
sudo apt install -y apache2 mariadb-server \
  php php-cli php-mysql php-gd php-xml php-mbstring php-curl php-zip php-intl php-apcu \
  libapache2-mod-php composer git unzip
```

Sécurisez la base de données et répondez aux invites (définissez un mot de passe root, supprimez les
utilisateurs anonymes et interdisez la connexion root à distance):

```bash
sudo mysql_secure_installation
```

Créez une base de données et un utilisateur dédié pour Drupal:

```bash
sudo mysql <<'SQL'
CREATE DATABASE drupal CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'drupal'@'localhost' IDENTIFIED BY 'change-this-password';
GRANT ALL PRIVILEGES ON drupal.* TO 'drupal'@'localhost';
FLUSH PRIVILEGES;
SQL
```

## Installer Drupal

Créez le projet avec Composer et confiez la propriété du répertoire racine à Apache:

```bash
cd /var/www
sudo composer create-project drupal/recommended-project drupal
sudo chown -R www-data:www-data /var/www/drupal
```

Pointez Apache vers le répertoire racine `web/` et activez la réécriture d'URL:

```bash
sudo tee /etc/apache2/sites-available/drupal.conf >/dev/null <<'EOF'
<VirtualHost *:80>
    DocumentRoot /var/www/drupal/web
    <Directory /var/www/drupal/web>
        AllowOverride All
        Require all granted
    </Directory>
    ErrorLog ${APACHE_LOG_DIR}/drupal-error.log
    CustomLog ${APACHE_LOG_DIR}/drupal-access.log combined
</VirtualHost>
EOF
sudo a2ensite drupal
sudo a2dissite 000-default
sudo a2enmod rewrite
sudo systemctl reload apache2
```

## Terminer l'installateur Web

Ouvrez le site dans un navigateur et suivez l'assistant de configuration:

```text
http://<your-vm-ip>/
```

Choisissez le profil **Standard**, puis saisissez le nom de la base de données, l'utilisateur et le
mot de passe créés ci-dessus. L'installateur écrit `web/sites/default/settings.php` et crée le
compte administrateur. Pour la production, placez l'instance derrière votre propre domaine et
activez HTTPS (par exemple avec Certbot et le greffon Apache).

## Ouvrir le pare-feu

L'instance n'autorise par défaut que SSH (port 22) en externe. Ouvrez HTTP et HTTPS, et ajoutez les
mêmes ports aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Étapes suivantes

- [Documentation Drupal](https://www.drupal.org/docs)
- [Installer Drupal](https://www.drupal.org/docs/getting-started/installing-drupal)
