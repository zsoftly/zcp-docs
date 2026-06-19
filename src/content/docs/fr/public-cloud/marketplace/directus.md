---
title: Directus
---

Directus est un CMS headless et une plateforme de données open source qui enveloppe n'importe quelle
base de données SQL d'une API REST et GraphQL ainsi que d'une application d'administration no-code.
Vous le pointez vers une base de données et vous obtenez instantanément la gestion de contenu, le
stockage d'actifs et un contrôle d'accès granulaire. L'image Docker officielle est la méthode
recommandée pour l'héberger soi-même.

:::note[Bientôt disponible]

Une image Directus préconfigurée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Directus
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

## Installer Directus

L'image Docker officielle (`directus/directus`) embarque l'application et toutes les dépendances
d'exécution. L'exécuter aux côtés d'un conteneur PostgreSQL avec Docker Compose est la configuration
recommandée.

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

Déconnectez-vous puis reconnectez-vous pour que le groupe `docker` s'applique. Créez un répertoire
de projet et un fichier `compose.yml` :

```bash
mkdir ~/directus && cd ~/directus
```

```yaml
services:
  database:
    image: postgis/postgis:16-master
    volumes:
      - ./data/database:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: directus
      POSTGRES_PASSWORD: change-me
      POSTGRES_DB: directus
    healthcheck:
      test: ['CMD', 'pg_isready', '-U', 'directus']
      interval: 10s
      retries: 5

  directus:
    image: directus/directus:latest
    ports:
      - '8055:8055'
    volumes:
      - ./uploads:/directus/uploads
    depends_on:
      database:
        condition: service_healthy
    environment:
      SECRET: 'replace-with-a-long-random-string'
      DB_CLIENT: 'pg'
      DB_HOST: 'database'
      DB_PORT: '5432'
      DB_DATABASE: 'directus'
      DB_USER: 'directus'
      DB_PASSWORD: 'change-me'
      ADMIN_EMAIL: 'admin@example.com'
      ADMIN_PASSWORD: 'change-me-too'
      PUBLIC_URL: 'http://<your-vm-ip>:8055'
```

Démarrez la pile :

```bash
docker compose up -d
```

## Configurer Directus

Au premier démarrage, Directus exécute les migrations sur le conteneur PostgreSQL et crée le compte
administrateur à partir de `ADMIN_EMAIL` / `ADMIN_PASSWORD`. L'application écoute sur le **port
8055**.

Ouvrez l'application d'administration et connectez-vous :

```text
http://<your-vm-ip>:8055
```

Pour la production, épinglez l'image à une version précise (par exemple `directus/directus:11`),
définissez un `SECRET` unique et fort, définissez `PUBLIC_URL` sur votre domaine et placez Directus
derrière nginx avec TLS.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le ou les ports dont
Directus a besoin et ajoutez-les aux règles réseau/de sécurité de l'instance dans le portail :

```bash
sudo ufw allow 8055/tcp
```

## Étapes suivantes

- [Documentation Directus](https://directus.io/docs)
- [Guide d'installation Directus](https://directus.io/docs/self-hosted/docker-guide)
