---
title: Authentik
---

Authentik est un fournisseur d'identité libre qui centralise l'authentification de vos applications.
Il prend en charge le SSO via OAuth 2.0, OpenID Connect, SAML, LDAP et le proxy/forward-auth, avec
des flux, des politiques et un portail utilisateur en libre-service flexibles. Ce guide déploie
Authentik avec sa pile Docker Compose officielle.

:::note[Bientôt disponible]

Une image Authentik préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu
24.04 LTS** neuve depuis la marketplace et suivez les étapes ci-dessous pour installer Authentik
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Authentik** et cliquez sur
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

## Installer Authentik

Authentik fournit une pile Docker Compose officielle. Installez donc d'abord Docker Engine et le
plugin Compose.

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

Créez un répertoire pour le déploiement et téléchargez le fichier Compose officiel:

```bash
sudo mkdir -p /opt/authentik && cd /opt/authentik
sudo wget -O docker-compose.yml https://docs.goauthentik.io/compose.yml
```

Générez un mot de passe PostgreSQL et une clé secrète dans un fichier `.env`:

```bash
echo "PG_PASS=$(openssl rand -base64 36 | tr -d '\n')" | sudo tee -a .env
echo "AUTHENTIK_SECRET_KEY=$(openssl rand -base64 60 | tr -d '\n')" | sudo tee -a .env
```

## Configurer Authentik

Téléchargez les images et démarrez la pile:

```bash
sudo docker compose pull
sudo docker compose up -d
```

Authentik sert HTTP sur le port 9000 et HTTPS sur le port 9443 par défaut. Terminez la configuration
de premier démarrage en accédant au flux initial-setup, qui crée le compte `akadmin` par défaut et
définit son mot de passe:

```text
http://<your-vm-ip>:9000/if/flow/initial-setup/
```

Pour un déploiement de production, faites pointer un enregistrement DNS vers la VM et placez
Authentik derrière TLS. Vous pouvez utiliser le HTTPS intégré sur le port 9443, ou le placer
derrière un reverse proxy (Caddy, nginx ou Traefik) qui termine TLS et redirige vers le port 9000.

## Ouvrir le pare-feu

L'instance n'autorise que SSH (port 22) en externe par défaut. Ouvrez les ports qu'Authentik sert et
ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 9000/tcp
sudo ufw allow 9443/tcp
```

## Étapes suivantes

- [Documentation Authentik](https://docs.goauthentik.io/)
- [Guide d'installation d'Authentik](https://docs.goauthentik.io/install-config/install/docker-compose/)
