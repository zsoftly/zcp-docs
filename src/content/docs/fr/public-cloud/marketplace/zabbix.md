---
title: Zabbix
---

Zabbix est une plateforme de supervision open source de niveau entreprise pour les réseaux,
serveurs, services cloud et applications. Elle collecte des métriques via des agents, SNMP, IPMI et
des contrôles sans agent, puis fournit alertes, visualisation et tableaux de bord depuis un frontend
web unique. Ce guide installe le serveur Zabbix, le frontend web et l'agent avec une base MySQL sur
Apache.

:::note[Bientôt disponible]

Une image Zabbix préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** neuve depuis la marketplace et suivez les étapes ci-dessous pour installer Zabbix vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 30 Go   | 60 Go      |

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

## Installer Zabbix

Installez d'abord le serveur de base de données MySQL et Apache:

```bash
sudo apt install -y mysql-server apache2
```

Ajoutez le dépôt officiel Zabbix. Zabbix 7.4 est la version stable actuelle. Installez le deb
`zabbix-release` pour Ubuntu 24.04 (`noble`):

```bash
wget https://repo.zabbix.com/zabbix/7.4/release/ubuntu/pool/main/z/zabbix-release/zabbix-release_latest_7.4+ubuntu24.04_all.deb
sudo dpkg -i zabbix-release_latest_7.4+ubuntu24.04_all.deb
sudo apt update
```

Installez les paquets du serveur, du frontend et de l'agent Zabbix:

```bash
sudo apt install -y zabbix-server-mysql zabbix-frontend-php \
  zabbix-apache-conf zabbix-sql-scripts zabbix-agent2
```

## Configurer Zabbix

1. Créez la base de données et l'utilisateur Zabbix dans MySQL:

   ```bash
   sudo mysql -uroot -e "CREATE DATABASE zabbix CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;"
   sudo mysql -uroot -e "CREATE USER 'zabbix'@'localhost' IDENTIFIED BY 'ChangeThisPassword';"
   sudo mysql -uroot -e "GRANT ALL PRIVILEGES ON zabbix.* TO 'zabbix'@'localhost';"
   sudo mysql -uroot -e "SET GLOBAL log_bin_trust_function_creators = 1;"
   ```

2. Importez le schéma et les données initiales (le mot de passe `zabbix` vous sera demandé):

   ```bash
   sudo zcat /usr/share/zabbix-sql-scripts/mysql/server.sql.gz \
     | mysql --default-character-set=utf8mb4 -uzabbix -p zabbix
   ```

3. Désactivez de nouveau l'option de création de fonctions:

   ```bash
   sudo mysql -uroot -e "SET GLOBAL log_bin_trust_function_creators = 0;"
   ```

4. Définissez le mot de passe de la base dans `/etc/zabbix/zabbix_server.conf` en décommentant et en
   modifiant la ligne `DBPassword=` pour qu'elle corresponde au mot de passe ci-dessus.
5. Démarrez et activez tous les services:

   ```bash
   sudo systemctl restart zabbix-server zabbix-agent2 apache2
   sudo systemctl enable zabbix-server zabbix-agent2 apache2
   ```

6. Ouvrez `http://<your-vm-ip>/zabbix` dans votre navigateur et complétez l'assistant de
   configuration web (connexion à la base, détails du serveur, fuseau horaire).
7. Connectez-vous avec les identifiants par défaut **Admin** / **zabbix**, puis changez
   immédiatement le mot de passe Admin sous **Users → Users**.
8. Pour la production, configurez Apache avec votre domaine et un certificat TLS afin que le
   frontend soit servi en HTTPS sur le port 443.

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que le SSH (port 22) depuis l'extérieur. Ouvrez les ports dont
Zabbix a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 10051/tcp
```

Les ports 80/443 servent le frontend web. Le port 10051 est le port du serveur Zabbix utilisé par
les agents actifs et les proxies qui remontent leurs données.

## Étapes suivantes

- [Documentation Zabbix](https://www.zabbix.com/documentation/current/)
- [Guide d'installation de Zabbix](https://www.zabbix.com/download)
