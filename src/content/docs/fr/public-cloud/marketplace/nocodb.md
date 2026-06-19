---
title: NocoDB
---

NocoDB est une plateforme de base de données no-code open source et une alternative à Airtable. Elle
transforme n'importe quelle base de données en un tableur intelligent avec des vues grille, galerie,
kanban et formulaire, ainsi que des API REST et GraphQL. Vous pouvez l'exécuter avec une seule
commande Docker.

:::note[Bientôt disponible]

Une image NocoDB préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer NocoDB vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 10 Go   | 20 Go      |

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

## Installer NocoDB

Installez Docker :

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Exécutez NocoDB avec un volume de données persistant :

```bash
sudo docker run -d --name nocodb \
  --restart unless-stopped \
  -v "$(pwd)"/nocodb:/usr/app/data/ \
  -p 8080:8080 \
  nocodb/nocodb:latest
```

:::tip[Astuce]

Pour une pile de qualité production avec Postgres et Redis, le script d'installation rapide officiel
génère pour vous un déploiement Docker Compose complet :

```bash
sudo curl -fsSL https://install.nocodb.com/noco.sh | sudo bash -s -- --quick
```

:::

## Configurer NocoDB

Ouvrez `http://<your-vm-ip>:8080` dans un navigateur. À la première visite, NocoDB vous invite à
créer le compte super-administrateur (e-mail et mot de passe). La configuration à conteneur unique
ci-dessus stocke ses données dans SQLite sous le volume monté `./nocodb`.

En production, connectez une base de données externe avec la variable d'environnement `NC_DB` et
placez NocoDB derrière un proxy inverse (Nginx ou Caddy) avec un certificat TLS et un vrai nom de
domaine plutôt que de servir le port 8080 directement.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) depuis l'extérieur. Ouvrez le ou les ports
dont NocoDB a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 8080/tcp
```

Si vous placez NocoDB derrière un proxy inverse en HTTPS, ouvrez `80` et `443` à la place et gardez
`8080` interne.

## Étapes suivantes

- [Documentation NocoDB](https://docs.nocodb.com/)
- [Guide d'installation de NocoDB](https://nocodb.com/docs/self-hosting/installation/quickstart)
