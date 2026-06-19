---
title: Bagisto
---

Bagisto est une plateforme d'e-commerce open source bâtie sur le framework PHP Laravel et Vue.js.
Elle propose une vitrine complète, une administration multicanal, la gestion des stocks et des
commandes prêtes à l'emploi. La configuration Docker officielle regroupe toutes les dépendances,
c'est donc le moyen le plus rapide de la mettre en place.

:::note[Bientôt disponible]

Une image Bagisto préconfigurée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Bagisto
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 25 Go   | 50 Go      |

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

## Installer Bagisto

La configuration Docker officielle est la méthode recommandée : elle fournit PHP-FPM, Nginx, MySQL
et Redis sous forme de conteneurs, vous n'installez donc ni PHP ni base de données sur l'hôte. Les
propres exigences de Bagisto visent PHP 8.2+ et MySQL 8.0 / MariaDB. Les images Docker les satisfont
automatiquement.

Installez Docker Engine et le plugin Compose :

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker ubuntu
```

Déconnectez-vous puis reconnectez-vous pour que le groupe `docker` s'applique, puis clonez le dépôt
Docker officiel et lancez la configuration :

```bash
git clone https://github.com/bagisto/bagisto-docker.git
cd bagisto-docker
sh setup.sh
```

`setup.sh` construit les images et démarre la pile. Si vous préférez l'exécuter manuellement :

```bash
docker compose build
docker compose up -d
```

## Configurer Bagisto

La pile Docker provisionne la base de données et installe Bagisto au premier démarrage.
L'application est servie sur le **port 80** par défaut. Modifiez `docker-compose.yml` pour changer
le port publié avant de démarrer la pile.

Une fois les conteneurs sains, ouvrez le panneau d'administration :

```text
http://<your-vm-ip>/admin/login
```

Connectez-vous avec les identifiants par défaut et changez-les immédiatement :

- E-mail : `admin@example.com`
- Mot de passe : `admin123`

Pour la production, pointez un domaine vers la VM et terminez le TLS avec nginx ou un proxy inverse
devant la pile. Les paramètres de l'application se trouvent dans le fichier `src/.env` à l'intérieur
du projet.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le ou les ports dont
Bagisto a besoin et ajoutez-les aux règles réseau/de sécurité de l'instance dans le portail :

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Étapes suivantes

- [Documentation Bagisto](https://devdocs.bagisto.com/)
- [Guide d'installation Bagisto](https://github.com/bagisto/bagisto-docker)
