---
title: Qdrant
---

Qdrant est une base de données vectorielle et un moteur de recherche par similarité open source
conçus pour stocker et interroger des plongements de grande dimension. Il alimente la recherche
sémantique, les recommandations et les charges de travail de génération augmentée par récupération
(RAG), et expose une API REST, une API gRPC et un tableau de bord web intégré.

## Logiciels inclus

| Composant | Version       |
| --------- | ------------- |
| Qdrant    | 1.18.2        |
| Docker    | Latest stable |
| Ubuntu    | 24.04 LTS     |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration génère la clé d'API et lance Qdrant avec Docker
Compose. Suivez la progression :

```bash
sudo journalctl -u qdrant-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Qdrant est prêt. Vous pouvez également vérifier
directement le conteneur :

```bash
cd /opt/qdrant && docker compose ps
```

### 3. Récupérer la clé d'API

Les informations de connexion et la clé d'API générées sont stockées dans un fichier réservé à
l'utilisateur racine :

```bash
sudo cat /etc/qdrant/credentials.txt
```

| Champ     | Valeur                                            |
| --------- | ------------------------------------------------- |
| Clé d'API | Générée de manière sécurisée au premier démarrage |

### 4. Accéder à Qdrant

L'API REST et le tableau de bord sont accessibles à :

```text
http://<your-vm-ip>:6333
http://<your-vm-ip>:6333/dashboard
```

L'API gRPC est accessible à `<your-vm-ip>:6334`. Vérifiez localement l'API REST avec la clé d'API du
fichier d'identifiants :

```bash
curl -H "api-key: <your-api-key>" http://127.0.0.1:6333/healthz
```

## Gérer Qdrant

Qdrant fonctionne comme une pile Docker Compose dans `/opt/qdrant`.

```bash
# Check status
cd /opt/qdrant && docker compose ps

# Restart
cd /opt/qdrant && docker compose restart

# View logs
cd /opt/qdrant && docker compose logs -f
```

| Chemin                           | Fonction                               |
| -------------------------------- | -------------------------------------- |
| `/opt/qdrant/docker-compose.yml` | Configuration Docker Compose           |
| `/opt/qdrant/.env`               | Environnement de la clé d'API Qdrant   |
| `/var/lib/qdrant/storage/`       | Collections et données persistantes    |
| `/etc/qdrant/credentials.txt`    | Clé d'API et informations de connexion |

## Sécurité

L'API REST et le tableau de bord utilisent le port 6333, et l'API gRPC utilise le port 6334. UFW est
activé et autorise par défaut SSH (port 22) ainsi que les ports 6333 et 6334. Qdrant exige la clé
d'API générée pour l'accès.

**Pour limiter l'accès à l'API à une adresse IP précise :**

```bash
sudo ufw delete allow 6333/tcp
sudo ufw delete allow 6334/tcp
sudo ufw allow from <trusted-ip> to any port 6333
sudo ufw allow from <trusted-ip> to any port 6334
```

**Pour accéder au tableau de bord sans laisser le port 6333 ouvert, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 6333:localhost:6333 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:6333/dashboard
```

**Pour une utilisation en production**, placez Qdrant derrière un proxy inverse afin de servir l'API
REST et le tableau de bord en HTTPS avec un certificat TLS de confiance. Gardez l'API gRPC sur un
réseau privé de confiance ou configurez un proxy compatible TLS pour celle-ci.

:::caution

Traitez la clé d'API comme un secret. Limitez les deux ports de Qdrant aux réseaux d'applications et
d'administrateurs de confiance au lieu de les exposer largement à Internet.

:::

## Étapes suivantes

- [Documentation de Qdrant](https://qdrant.tech/documentation/)
- [Guide d'installation de Qdrant](https://qdrant.tech/documentation/guides/installation/)
