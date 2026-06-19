---
title: Ollama
---

Ollama est un environnement d'exécution local pour grands modèles de langage (LLM) qui télécharge,
exécute et sert des modèles ouverts tels que Llama, Qwen, Gemma et DeepSeek sur votre propre
matériel. Il expose une API REST simple et une interface en ligne de commande, ce qui vous permet
d'effectuer de l'inférence en privé sans envoyer vos données à un fournisseur tiers.

:::note[Bientôt disponible]

Une image Ollama préconstruite arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** neuve depuis la place de marché et suivez les étapes ci-dessous pour installer Ollama
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 4       | 8          |
| RAM       | 8 Go    | 16 Go      |
| Stockage  | 20 Go   | 50 Go      |

Ollama fonctionne sur CPU par défaut. Un GPU est optionnel mais fortement recommandé pour les
modèles plus volumineux et une inférence plus rapide. Les fichiers de modèles sont volumineux,
dimensionnez donc le stockage en fonction des modèles que vous prévoyez de télécharger.

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

## Installer Ollama

Exécutez le script d'installation officiel. Il installe le binaire `ollama`, crée un utilisateur
système `ollama` dédié et configure un service systemd qui démarre automatiquement:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Confirmez que le service est en cours d'exécution et vérifiez la version:

```bash
systemctl status ollama --no-pager
ollama --version
```

Téléchargez un modèle et exécutez une invite rapide:

```bash
ollama pull llama3.2
ollama run llama3.2 "Hello, what can you do?"
```

L'API écoute sur `127.0.0.1:11434` par défaut. Testez-la localement:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

## Configurer Ollama

Par défaut, Ollama ne se lie qu'à localhost. Pour accepter les connexions d'autres hôtes, définissez
`OLLAMA_HOST` dans le service systemd:

```bash
sudo systemctl edit ollama
```

Ajoutez la surcharge suivante, puis enregistrez:

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

Rechargez et redémarrez:

```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

Ollama n'a aucune authentification intégrée. Si vous exposez le port 11434, placez-le derrière un
proxy inverse qui applique TLS et l'authentification, ou restreignez l'accès aux adresses IP de
confiance uniquement.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que SSH (port 22) en externe. Ouvrez le port dont Ollama a besoin
et ajoutez-le aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 11434/tcp
```

## Étapes suivantes

- [Documentation Ollama](https://docs.ollama.com/)
- [Guide d'installation Ollama](https://docs.ollama.com/linux)
