---
title: Keycloak
---

Keycloak est une plateforme libre de gestion des identités et des accès. Elle fournit
l'authentification unique (SSO), la fédération d'utilisateurs, la connexion via les réseaux sociaux
et le courtage d'identité, ainsi qu'une autorisation fine grâce à des protocoles standards comme
OpenID Connect, OAuth 2.0 et SAML. Ce guide exécute le conteneur Keycloak officiel, avec des notes
pour un démarrage rapide en développement et pour une mise en production.

:::note[Bientôt disponible]

Une image Keycloak préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu
24.04 LTS** neuve depuis la marketplace et suivez les étapes ci-dessous pour installer Keycloak
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Keycloak** et cliquez sur
   **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Les deux
   vous donnent une VM Ubuntu 24.04 propre.
2. Choisissez un forfait conforme aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour:

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Keycloak

Keycloak est distribué sous forme d'image Docker officielle depuis `quay.io`. Installez donc d'abord
Docker Engine.

Configurez le dépôt APT officiel de Docker pour Ubuntu 24.04 LTS (`noble`):

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

Installez Docker Engine et le plugin Compose:

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Pour essayer Keycloak rapidement, démarrez-le en mode développement. Cela amorce un utilisateur
administrateur initial et sert la console sur le port 8080:

```bash
sudo docker run -d --name keycloak --restart unless-stopped \
  -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD='<choose-a-strong-password>' \
  quay.io/keycloak/keycloak:latest start-dev
```

Ouvrez `http://<your-vm-ip>:8080` et connectez-vous à la console d'administration avec les
identifiants ci-dessus.

## Configurer Keycloak

Le mode développement utilise une base de données en mémoire et des valeurs par défaut non
sécurisées. Il ne convient donc pas à la production. Pour un déploiement de production, exécutez
Keycloak avec la commande `start`, une base de données externe, HTTPS sur le port 8443 et un nom
d'hôte explicite.

L'exemple ci-dessous utilise Docker Compose avec PostgreSQL. Créez `docker-compose.yml`:

```yaml
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_DB: keycloak
      POSTGRES_USER: keycloak
      POSTGRES_PASSWORD: <db-password>
    volumes:
      - postgres_data:/var/lib/postgresql/data

  keycloak:
    image: quay.io/keycloak/keycloak:latest
    restart: unless-stopped
    command: start
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: <admin-password>
      KC_DB: postgres
      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
      KC_DB_USERNAME: keycloak
      KC_DB_PASSWORD: <db-password>
      KC_HOSTNAME: auth.example.com
      KC_PROXY_HEADERS: xforwarded
      KC_HTTP_ENABLED: 'true'
    ports:
      - '8080:8080'
    depends_on:
      - postgres

volumes:
  postgres_data:
```

Démarrez la pile:

```bash
sudo docker compose up -d
```

Faites pointer `auth.example.com` vers la VM et placez Keycloak derrière un reverse proxy (Caddy,
nginx ou Traefik) qui termine TLS sur 443 et redirige vers le port 8080 de l'hôte.

## Ouvrir le pare-feu

L'instance n'autorise que SSH (port 22) en externe par défaut. Ouvrez le port que Keycloak sert et
ajoutez-le aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 8080/tcp
```

Si vous placez Keycloak derrière un reverse proxy, ouvrez plutôt le port 443 et gardez le 8080 en
interne.

## Étapes suivantes

- [Documentation Keycloak](https://www.keycloak.org/documentation)
- [Guide d'installation de Keycloak](https://www.keycloak.org/getting-started/getting-started-docker)
