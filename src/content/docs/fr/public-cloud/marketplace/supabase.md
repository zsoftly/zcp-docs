---
title: Supabase
---

Supabase est une alternative open source à Firebase, construite sur PostgreSQL. Elle regroupe une
base de données Postgres, l'authentification, des API REST et GraphQL instantanées, les abonnements
en temps réel, le stockage et un tableau de bord d'administration Studio dans une seule pile
auto-hébergeable. Le Studio et les API sont servis via la passerelle Kong sur le port 8000.

:::note[Bientôt disponible]

Une image Supabase préconfigurée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Supabase
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 30 Go   | 80 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Supabase** et cliquez sur
   **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Dans les
   deux cas, vous obtenez une VM Ubuntu 24.04 propre.
2. Choisissez un plan qui répond aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH :

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Supabase

Supabase s'auto-héberge sous forme de pile Docker Compose. Installez donc d'abord Docker Engine et
le plugin Compose.

Configurez le dépôt APT officiel de Docker pour Ubuntu 24.04 LTS (`noble`) :

```bash
sudo apt install -y ca-certificates curl git
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

Installez Docker Engine et le plugin Compose :

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Clonez le dépôt Supabase et copiez le répertoire `docker` dans un dossier de projet :

```bash
git clone --depth 1 https://github.com/supabase/supabase
mkdir supabase-project
cp -rf supabase/docker/* supabase-project
cp supabase/docker/.env.example supabase-project/.env
cd supabase-project
```

## Configurer Supabase

N'exécutez jamais la pile avec les valeurs d'exemple par défaut. Ouvrez `.env` et définissez des
valeurs fortes et uniques pour au moins ces variables avant de démarrer quoi que ce soit :

- `POSTGRES_PASSWORD` : le mot de passe de la base de données Postgres
- `JWT_SECRET` : secret utilisé pour signer les jetons d'API
- `ANON_KEY` : clé d'API publique (anonyme)
- `SERVICE_ROLE_KEY` : clé d'API privilégiée (service-role)
- `DASHBOARD_USERNAME` : nom d'utilisateur de connexion au Studio
- `DASHBOARD_PASSWORD` : mot de passe de connexion au Studio

Le dépôt fournit des scripts d'aide pour générer des secrets et des clés d'API cohérents :

```bash
sh utils/generate-keys.sh
sh utils/add-new-auth-keys.sh
```

Téléchargez les images et démarrez la pile :

```bash
sudo docker compose pull
sudo docker compose up -d --wait
```

Une fois les conteneurs sains, le tableau de bord Studio et les API sont servis via Kong sur le port
8000 :

- Tableau de bord Studio : `http://<your-vm-ip>:8000` (connectez-vous avec `DASHBOARD_USERNAME` /
  `DASHBOARD_PASSWORD`)
- API REST : `http://<your-vm-ip>:8000/rest/v1/`
- API Auth : `http://<your-vm-ip>:8000/auth/v1/`

Pour une configuration de production, placez Supabase derrière un reverse proxy tel que nginx avec
un certificat TLS, puis servez le Studio et les API en HTTPS au lieu d'exposer directement le
port 8000.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le ou les ports dont
Supabase a besoin et ajoutez-les aux règles réseau/de sécurité de l'instance dans le portail :

```bash
sudo ufw allow 8000/tcp
```

## Étapes suivantes

- [Documentation Supabase](https://supabase.com/docs)
- [Guide d'auto-hébergement Supabase](https://supabase.com/docs/guides/self-hosting/docker)
