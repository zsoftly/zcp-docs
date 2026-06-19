---
title: Ghost
---

Ghost est une plateforme de publication open source pour les blogs, les infolettres et les sites
d'adhésion. Elle associe un éditeur rapide et une distribution d'e-mails intégrée à une interface
épurée pilotée par des thèmes. L'outil officiel `ghost-cli` installe et gère un déploiement de
production sur Ubuntu.

:::note[Bientôt disponible]

Une image Ghost préconfigurée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Ghost
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps** et passez à l'onglet **Marketplace**. Il s'ouvre
   sur **Featured** par défaut, sélectionnez donc **Marketplace** à côté. Choisissez votre région
   (YOW-1 ou YUL-1), recherchez **Ubuntu 24.04 LTS** et cliquez sur **Deploy**. Vous pouvez aussi
   créer l'instance depuis **Instances → Create**. Dans les deux cas, vous obtenez une VM Ubuntu
   24.04 propre.

   ![L'onglet Marketplace du portail ZSoftly Cloud, avec le sélecteur de région, la liste des catégories, la barre de recherche et les boutons Deploy](../../../../../assets/marketplace/deploy-marketplace-tab.webp)

   ![Recherche d'une application dans le Marketplace, la barre de recherche filtrant le catalogue jusqu'à une carte Deploy correspondante](../../../../../assets/marketplace/deploy-marketplace-search.webp)

2. Choisissez un plan qui répond aux prérequis ci-dessus.

3. Lorsque l'instance est **Running**, connectez-vous en SSH :

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Ghost

Le guide officiel de Ghost vise **Ubuntu 24.04 LTS**. Une installation de production nécessite
**nginx**, **MySQL 8**, une version LTS de **Node.js** et un **nom de domaine** enregistré. Ghost
échoue lorsqu'il est installé sur une adresse IP nue.

Installez nginx et MySQL 8 :

```bash
sudo apt install -y nginx mysql-server
sudo ufw allow 'Nginx Full'
```

Installez une version LTS prise en charge de Node.js (Ghost prend en charge les lignes LTS actives,
cet exemple utilise la 22) :

```bash
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
  | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_22.x nodistro main" \
  | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt-get update && sudo apt-get install -y nodejs
```

Installez la CLI Ghost globalement :

```bash
sudo npm install ghost-cli@latest -g
```

Créez le répertoire d'installation (appartenant à l'utilisateur `ubuntu`) et lancez l'installateur
depuis l'intérieur de celui-ci :

```bash
sudo mkdir -p /var/www/ghost
sudo chown ubuntu:ubuntu /var/www/ghost
sudo chmod 775 /var/www/ghost
cd /var/www/ghost
ghost install
```

## Configurer Ghost

`ghost install` est interactif. Il demande l'URL de votre site (utilisez `https://your-domain.com`),
configure la base de données MySQL, met en place le service systemd et l'hôte virtuel nginx, et
propose de provisionner un certificat TLS Let's Encrypt gratuit. Acceptez-le pour un site de
production.

À l'invite de la connexion MySQL, fournissez le mot de passe root que vous avez défini ci-dessus.
Ghost crée sa propre base de données et son propre utilisateur. Après l'installation, terminez la
configuration de l'administration à l'adresse :

```text
https://your-domain.com/ghost
```

Gérez l'instance avec les commandes `ghost` depuis `/var/www/ghost` (`ghost ls`, `ghost stop`,
`ghost start`, `ghost restart`).

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le ou les ports dont Ghost
a besoin et ajoutez-les aux règles réseau/de sécurité de l'instance dans le portail :

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Étapes suivantes

- [Documentation Ghost](https://docs.ghost.org/)
- [Guide d'installation Ghost](https://docs.ghost.org/install/ubuntu)
