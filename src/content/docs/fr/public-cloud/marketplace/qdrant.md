---
title: Qdrant
---

Qdrant est une base de données vectorielle libre et un moteur de recherche par similarité conçu pour
stocker et interroger des plongements (embeddings) en haute dimension. Il alimente la recherche
sémantique, les recommandations et les charges de travail de génération augmentée par récupération
(RAG), en exposant à la fois une API REST et une API gRPC ainsi qu'un tableau de bord web intégré.

:::note[Bientôt disponible]

Une image Qdrant préconstruite arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** neuve depuis la place de marché et suivez les étapes ci-dessous pour installer Qdrant
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 20 Go   | 50 Go      |

Le stockage et la RAM évoluent avec le nombre et la dimensionnalité des vecteurs que vous indexez.
Dimensionnez-les en fonction de la collection que vous prévoyez.

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

## Installer Qdrant

Qdrant est distribué sous forme d'image Docker officielle, installez donc d'abord Docker Engine et
le plugin Compose.

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

Téléchargez et exécutez Qdrant en mappant les ports REST (6333) et gRPC (6334) et en persistant les
données sur l'hôte:

```bash
docker pull qdrant/qdrant
docker run -d --name qdrant --restart unless-stopped \
  -p 6333:6333 -p 6334:6334 \
  -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
  qdrant/qdrant
```

Vérifiez qu'il répond:

```bash
curl http://localhost:6333/healthz
```

## Configurer Qdrant

Le tableau de bord web est disponible à:

```text
http://<your-vm-ip>:6333/dashboard
```

Qdrant est livré sans authentification. Avant de l'exposer, définissez une clé d'API afin que seuls
les clients autorisés puissent lire ou écrire dans vos collections. Redémarrez le conteneur avec la
clé définie:

```bash
docker rm -f qdrant
docker run -d --name qdrant --restart unless-stopped \
  -p 6333:6333 -p 6334:6334 \
  -e QDRANT__SERVICE__API_KEY="<generate-a-strong-key>" \
  -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
  qdrant/qdrant
```

Les clients envoient ensuite la clé dans l'en-tête `api-key`. Pour la production, placez Qdrant
derrière un proxy inverse avec TLS afin que le trafic et la clé d'API soient chiffrés en transit.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que SSH (port 22) en externe. Ouvrez les ports dont Qdrant a besoin
et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 6333/tcp
sudo ufw allow 6334/tcp
```

## Étapes suivantes

- [Documentation Qdrant](https://qdrant.tech/documentation/)
- [Guide d'installation Qdrant](https://qdrant.tech/documentation/guides/installation/)
