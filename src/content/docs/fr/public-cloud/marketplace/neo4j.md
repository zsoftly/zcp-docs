---
title: Neo4j
---

Neo4j est une base de données orientée graphe native qui stocke les données sous forme de nœuds et
de relations plutôt que de lignes et de tables. Elle utilise le langage de requête Cypher pour
parcourir efficacement des données fortement connectées, ce qui en fait un excellent choix pour les
moteurs de recommandation, la détection de fraude, les graphes de connaissances et l'analyse de
réseaux. Le navigateur HTTP s'exécute sur le port 7474 et le protocole Bolt sur le port 7687.

:::note[Bientôt disponible]

Une image Neo4j préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer Neo4j vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Neo4j**, puis cliquez sur
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

## Installer Neo4j

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

Reconnectez-vous en SSH, créez un répertoire de projet et ajoutez un fichier `compose.yaml` :

```bash
mkdir ~/neo4j && cd ~/neo4j
```

```yaml
services:
  neo4j:
    image: neo4j:5
    restart: unless-stopped
    environment:
      - NEO4J_AUTH=neo4j/${NEO4J_PASSWORD}
    ports:
      - '7474:7474'
      - '7687:7687'
    volumes:
      - neo4j-data:/data
volumes:
  neo4j-data:
```

Créez un fichier `.env` dans le même répertoire avec un mot de passe robuste :

```bash
cat > .env <<'EOF'
NEO4J_PASSWORD=change-me-to-a-strong-password
EOF
```

Démarrez la pile :

```bash
docker compose up -d
```

## Configurer Neo4j

Ouvrez `http://<your-vm-ip>:7474` dans un navigateur pour accéder au navigateur Neo4j.
Connectez-vous avec le nom d'utilisateur `neo4j` et le mot de passe défini dans `.env`. Vous pouvez
ensuite exécuter des requêtes Cypher, inspecter le graphe et gérer les utilisateurs. Les
applications se connectent via Bolt à `bolt://<your-vm-ip>:7687`. Pour un déploiement en production,
placez Neo4j derrière un proxy inverse tel que nginx avec un certificat TLS et exposez le navigateur
et le point d'accès Bolt via des connexions chiffrées plutôt que d'exposer les ports directement.

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que SSH (port 22) depuis l'extérieur. Ouvrez le ou les ports dont
Neo4j a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 7474/tcp
sudo ufw allow 7687/tcp
```

## Étapes suivantes

- [Documentation Neo4j](https://neo4j.com/docs/)
- [Guide d'installation Neo4j](https://neo4j.com/docs/operations-manual/current/docker/docker-compose-standalone/)
