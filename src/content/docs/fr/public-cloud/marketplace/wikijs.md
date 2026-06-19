---
title: Wiki.js
---

Wiki.js est une plateforme de wiki et de documentation moderne et libre. Elle propose un éditeur
Markdown riche, un contrôle d'accès fin, une recherche en texte intégral et des intégrations
d'authentification, le tout reposant sur une base de données relationnelle. C'est un excellent choix
pour les bases de connaissances internes, la documentation de produit et les wikis d'équipe.
L'interface web s'exécute sur le port 3000.

:::note[Bientôt disponible]

Une image Wiki.js préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer Wiki.js vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Wiki.js**, puis cliquez sur
   **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Les deux
   vous donnent une VM Ubuntu 24.04 vierge.
2. Choisissez un forfait qui répond aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH :

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Wiki.js

Installez Docker Engine et le plugin Docker Compose depuis le dépôt officiel de Docker :

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Ajoutez l'utilisateur `ubuntu` au groupe `docker` afin de pouvoir exécuter Docker sans `sudo`, puis
reconnectez-vous :

```bash
sudo usermod -aG docker ubuntu
exit
```

Reconnectez-vous en SSH, créez un répertoire de projet et ajoutez un fichier `compose.yaml`. Wiki.js
n'inclut pas de base de données. Cette pile l'associe donc à PostgreSQL 14 :

```bash
mkdir ~/wikijs && cd ~/wikijs
```

```yaml
services:
  db:
    image: postgres:14
    restart: unless-stopped
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASS}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - db-data:/var/lib/postgresql/data

  wiki:
    image: ghcr.io/requarks/wiki:2.5
    restart: unless-stopped
    depends_on:
      - db
    environment:
      - DB_TYPE=postgres
      - DB_HOST=db
      - DB_PORT=5432
      - DB_USER=${DB_USER}
      - DB_PASS=${DB_PASS}
      - DB_NAME=${DB_NAME}
    ports:
      - '3000:3000'

volumes:
  db-data:
```

Créez un fichier `.env` dans le même répertoire avec les identifiants de base de données partagés
par les deux services :

```bash
cat > .env <<'EOF'
DB_USER=wikijs
DB_PASS=change-me-to-a-strong-password
DB_NAME=wiki
EOF
```

Démarrez la pile :

```bash
docker compose up -d
```

## Configurer Wiki.js

Ouvrez `http://<your-vm-ip>:3000` dans un navigateur. Le premier démarrage affiche un assistant de
configuration où vous créez le compte administrateur et définissez l'URL du site. Vous pouvez
ensuite configurer l'authentification, le stockage et le contenu. Pour un déploiement en production,
placez Wiki.js derrière un proxy inverse tel que nginx avec un certificat TLS et exposez l'interface
via HTTPS plutôt que d'exposer le port 3000 directement.

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que SSH (port 22) depuis l'extérieur. Ouvrez le ou les ports dont
Wiki.js a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 3000/tcp
```

## Étapes suivantes

- [Documentation Wiki.js](https://docs.requarks.io/)
- [Guide d'installation Wiki.js](https://docs.requarks.io/install/docker)
