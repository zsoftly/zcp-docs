---
title: Medusa
---

Medusa est une plateforme de commerce headless open source bâtie sur Node.js. Elle fournit un
backend modulaire doté d'un tableau de bord d'administration intégré et d'API REST/Store qui
alimentent des vitrines personnalisées. Vous êtes propriétaire des données et du code, et vous
l'étendez avec des modules TypeScript.

:::note[Bientôt disponible]

Une image Medusa préconfigurée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Medusa
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
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

## Installer Medusa

Medusa nécessite **Node.js v20+ (LTS)** et un serveur **PostgreSQL** en cours d'exécution. Redis est
facultatif mais recommandé pour la gestion des événements en production.

Installez Node.js 20 LTS depuis NodeSource :

```bash
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
  | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
  | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt-get update && sudo apt-get install -y nodejs
node -v
```

Installez PostgreSQL et Redis :

```bash
sudo apt install -y postgresql postgresql-contrib redis-server
sudo systemctl enable --now postgresql redis-server
```

Créez un rôle de base de données pour Medusa (remplacez le mot de passe) :

```bash
sudo -u postgres psql -c "CREATE USER medusa WITH PASSWORD 'change-me' CREATEDB;"
```

Générez une nouvelle application Medusa. L'installateur crée le projet, exécute les migrations et
vous demande une adresse e-mail et un mot de passe d'administrateur :

```bash
npx create-medusa-app@latest my-medusa-store \
  --db-url "postgres://medusa:change-me@localhost:5432/medusa-store"
```

À l'invite, refusez la vitrine Next.js Starter Storefront sauf si vous la voulez sur la même VM
(elle nécessite un second processus et Node v24 LTS ou inférieur).

## Configurer Medusa

L'installateur écrit la configuration dans `my-medusa-store/.env`. Confirmez les URL de la base de
données et de Redis :

```bash
cd my-medusa-store
grep -E "DATABASE_URL|REDIS_URL|STORE_CORS|ADMIN_CORS" .env
```

Définissez `REDIS_URL=redis://localhost:6379` et mettez à jour les valeurs CORS avec vos domaines de
vitrine et d'administration pour la production.

Démarrez le serveur (administration et API sur le port 9000) :

```bash
npm run dev
```

Le tableau de bord d'administration est servi à l'adresse `http://<your-vm-ip>:9000/app` et les API
Store/Admin à `http://<your-vm-ip>:9000`. Pour la production, compilez l'application
(`npm run build`), exécutez-la avec un gestionnaire de processus tel que PM2 et placez-la derrière
nginx avec TLS.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le ou les ports dont Medusa
a besoin et ajoutez-les aux règles réseau/de sécurité de l'instance dans le portail :

```bash
sudo ufw allow 9000/tcp
```

## Étapes suivantes

- [Documentation Medusa](https://docs.medusajs.com/)
- [Guide d'installation Medusa](https://docs.medusajs.com/learn/installation)
