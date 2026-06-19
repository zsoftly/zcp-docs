---
title: Dify
---

Dify est une plateforme libre pour créer des applications LLM et des agents d'IA. Elle combine un
constructeur de flux de travail visuel, des pipelines de génération augmentée par récupération
(RAG), la gestion des invites et un cadre d'agents, afin que les équipes puissent concevoir, tester
et déployer des applications d'IA générative depuis une seule interface.

:::note[Bientôt disponible]

Une image Dify préconstruite arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** neuve depuis la place de marché et suivez les étapes ci-dessous pour installer Dify vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 40 Go   | 80 Go      |

Dify fonctionne comme une pile Docker Compose multi-conteneurs (API, worker, web, base de données,
magasin de vecteurs et nginx), de sorte que les besoins en RAM et en stockage augmentent avec
l'utilisation.

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

## Installer Dify

Dify est fourni sous forme de pile Docker Compose, installez donc d'abord Docker Engine et le plugin
Compose.

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

Autorisez l'utilisateur `ubuntu` à exécuter Docker sans sudo, puis rouvrez votre session SSH:

```bash
sudo usermod -aG docker ubuntu
```

Clonez la dernière version de Dify, copiez le fichier d'environnement et démarrez la pile:

```bash
sudo apt install -y git jq
git clone --branch "$(curl -s https://api.github.com/repos/langgenius/dify/releases/latest | jq -r .tag_name)" https://github.com/langgenius/dify.git
cd dify/docker
cp .env.example .env
docker compose up -d
```

Confirmez que tous les conteneurs sont actifs:

```bash
docker compose ps
```

## Configurer Dify

Le conteneur nginx de la pile publie les ports 80 et 443. Ouvrez un navigateur et effectuez la
configuration initiale de l'administrateur:

```text
http://<your-vm-ip>/install
```

Créez le compte administrateur, puis connectez-vous à `http://<your-vm-ip>/`. Depuis **Settings →
Model Provider**, ajoutez un fournisseur de LLM (tel qu'OpenAI, Anthropic ou un point de terminaison
Ollama auto-hébergé) avant de créer des applications.

Pour la production, modifiez `dify/docker/.env` afin de définir une URL publique et d'activer HTTPS.
Dify peut terminer TLS via son nginx intégré (définissez `NGINX_HTTPS_ENABLED=true` et montez les
certificats), ou vous pouvez l'exécuter derrière votre propre proxy inverse. Appliquez les
modifications avec:

```bash
cd ~/dify/docker
docker compose down && docker compose up -d
```

## Ouvrir le pare-feu

L'instance n'autorise par défaut que SSH (port 22) en externe. Ouvrez les ports dont Dify a besoin
et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Étapes suivantes

- [Documentation Dify](https://docs.dify.ai/)
- [Guide d'installation Dify](https://docs.dify.ai/en/getting-started/install-self-hosted/docker-compose)
