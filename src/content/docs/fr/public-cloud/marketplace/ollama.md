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

Ollama fonctionne sur **CPU et RAM**. Un GPU est optionnel et accélère l'inférence. Deux éléments
déterminent le forfait dont vous avez besoin :

- **RAM** : elle doit contenir le modèle que vous exécutez (environ la taille du fichier du modèle
  plus une marge pour le contexte). Un modèle qui ne tient pas en RAM ne s'exécutera pas.
- **Stockage** : il doit contenir les fichiers de modèles que vous téléchargez, plus le système
  d'exploitation et l'espace de travail. Ajoutez la taille de chaque modèle supplémentaire que vous
  conservez, car ils s'accumulent vite.

Dimensionnez l'instance pour le plus grand modèle que vous prévoyez d'exécuter. Les valeurs
ci-dessous utilisent la quantification Q4, celle par défaut d'Ollama.

| Taille du modèle | Exemple       | Fichier du modèle (approx.) | RAM minimale | Disque suggéré |
| ---------------- | ------------- | --------------------------- | ------------ | -------------- |
| 1-3B             | Llama 3.2 3B  | 2-3 Go                      | 8 Go         | 20 Go          |
| 7-8B             | Llama 3.1 8B  | 5 Go                        | 8 Go         | 30 Go          |
| 13-14B           | Llama 2 13B   | 9 Go                        | 16 Go        | 40 Go          |
| 32-34B           | Qwen 2.5 32B  | 20 Go                       | 32 Go        | 60 Go          |
| 70B              | Llama 3.3 70B | 40 Go                       | 64 Go        | 100 Go         |

## Forfaits recommandés par région

Les noms de forfaits et les tiers de stockage diffèrent selon la région. Les forfaits à usage
général ci-dessous couvrent la RAM dont chaque modèle a besoin, et leur disque système contient les
fichiers de modèles. Consultez [Types d'instances](/fr/public-cloud/compute/instance-types/) et la
[page des tarifs](https://zcp.zsoftly.ca/pricing) pour les spécifications et prix à jour.

| Taille du modèle | YOW-1 (Ottawa)                     | YUL-1 (Montréal)                   |
| ---------------- | ---------------------------------- | ---------------------------------- |
| 1-8B             | `ci1.l` (4 vCPU, 8 Go, 120 Go)     | `ca2.l` (4 vCPU, 8 Go, 120 Go)     |
| 13-14B           | `ci1.xl` (4 vCPU, 16 Go, 160 Go)   | `ca2.xl` (4 vCPU, 16 Go, 160 Go)   |
| 32-34B           | `ci1.2xl` (8 vCPU, 32 Go, 200 Go)  | `ca2.2xl` (8 vCPU, 32 Go, 200 Go)  |
| 70B              | `ci1.4xl` (16 vCPU, 64 Go, 320 Go) | `ca2.4xl` (16 vCPU, 64 Go, 320 Go) |

Ajustez ensuite :

- **Même RAM, coût réduit** : la famille à mémoire optimisée offre la même RAM avec moins de vCPU,
  pratique pour un usage occasionnel. Utilisez `cim1.*` dans YOW-1 ou `cam2.*` dans YUL-1 (par
  exemple `cim1.xl` ou `cam2.xl` pour 64 Go).
- **Réponses plus rapides** : ajoutez des vCPU avec la famille à processeur optimisé (`cac1.*` dans
  YOW-1, `cac2.*` dans YUL-1), ou choisissez un forfait avec GPU pour les modèles de 13B et plus.
- **Plusieurs grands modèles sur une instance** : attachez un
  [volume de stockage en mode bloc](/fr/public-cloud/compute/settings/block-storage/) au lieu de
  passer à un forfait plus grand.

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
