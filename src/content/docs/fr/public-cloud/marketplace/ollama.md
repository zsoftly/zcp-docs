---
title: Ollama
---

Ollama est un environnement d'exécution local pour grands modèles de langage (LLM). Il télécharge,
exécute et sert des modèles ouverts comme Llama, Qwen, Gemma et DeepSeek sur votre propre matériel.
Il expose une API REST simple et une interface en ligne de commande, afin d'exécuter l'inférence en
privé sans envoyer de données à un fournisseur tiers.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| Ollama    | 0.9.2     |
| Ubuntu    | 24.04 LTS |

Aucun modèle n'est préchargé. Téléchargez les modèles nécessaires au premier démarrage (voir
[Démarrage](#démarrage)).

## Prérequis

Ollama fonctionne avec **CPU et RAM**. Un GPU est facultatif et accélère l'inférence. Deux éléments
déterminent le forfait nécessaire:

- La **RAM** doit contenir le modèle exécuté (environ la taille du fichier modèle plus une marge
  pour le contexte). Un modèle qui ne tient pas en RAM ne s'exécute pas.
- Le **stockage** doit contenir les fichiers de modèles téléchargés, ainsi que le système
  d'exploitation et l'espace de travail. Ajoutez la taille de chaque modèle supplémentaire conservé,
  car ils s'accumulent vite.

Dimensionnez l'instance pour le plus grand modèle prévu. Les valeurs ci-dessous utilisent la
quantification Q4, le réglage par défaut d'Ollama.

| Taille du modèle | Exemple       | Fichier modèle (approx.) | RAM minimale | Disque suggéré |
| ---------------- | ------------- | ------------------------ | ------------ | -------------- |
| 1-3B             | Llama 3.2 3B  | 2-3 Go                   | 8 Go         | 20 Go          |
| 7-8B             | Llama 3.1 8B  | 5 Go                     | 8 Go         | 30 Go          |
| 13-14B           | Llama 2 13B   | 9 Go                     | 16 Go        | 40 Go          |
| 32-34B           | Qwen 2.5 32B  | 20 Go                    | 32 Go        | 60 Go          |
| 70B              | Llama 3.3 70B | 40 Go                    | 64 Go        | 100 Go         |

## Forfaits recommandés par région

Les noms de forfaits et les niveaux de stockage varient selon la région. Les forfaits généraux
ci-dessous fournissent assez de RAM pour chaque modèle, et leur disque racine contient les fichiers
de modèles. Consultez [Types d'instances](/fr/public-cloud/compute/instance-types/) et la
[page de tarification](https://zcp.zsoftly.ca/pricing) pour les spécifications et prix actuels.

| Taille du modèle | YOW-1 (Ottawa)                     | YUL-1 (Montréal)                   |
| ---------------- | ---------------------------------- | ---------------------------------- |
| 1-8B             | `ci1.l` (4 vCPU, 8 Go, 120 Go)     | `ca2.l` (4 vCPU, 8 Go, 120 Go)     |
| 13-14B           | `ci1.xl` (4 vCPU, 16 Go, 160 Go)   | `ca2.xl` (4 vCPU, 16 Go, 160 Go)   |
| 32-34B           | `ci1.2xl` (8 vCPU, 32 Go, 200 Go)  | `ca2.2xl` (8 vCPU, 32 Go, 200 Go)  |
| 70B              | `ci1.4xl` (16 vCPU, 64 Go, 320 Go) | `ca2.4xl` (16 vCPU, 64 Go, 320 Go) |

Ajustez ensuite:

- **Même RAM, coût inférieur**: la famille axée mémoire fournit la même RAM avec moins de vCPU, ce
  qui convient aux usages occasionnels. Utilisez `cim1.*` dans YOW-1 ou `cam2.*` dans YUL-1 (par
  exemple `cim1.xl` ou `cam2.xl` pour 64 Go).
- **Réponses plus rapides**: ajoutez des vCPU avec la famille axée CPU (`cac1.*` dans YOW-1,
  `cac2.*` dans YUL-1), ou choisissez un forfait GPU pour les modèles 13B et plus.
- **Plusieurs grands modèles sur une instance**: attachez un
  [volume de stockage bloc](/fr/public-cloud/compute/settings/block-storage/) au lieu de passer à un
  forfait plus grand.

## Démarrage

### 1. Se connecter à la machine virtuelle

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, un script lance le service. Cela prend moins d'une minute. Suivez la
progression:

```bash
journalctl -u ollama-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Ollama est prêt.

### 3. Télécharger un modèle et exécuter un prompt

```bash
ollama pull llama3.2
ollama run llama3.2 "Hello, what can you do?"
```

### 4. Utiliser l'API

L'API écoute sur le port `11434`. Testez-la depuis la machine virtuelle:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

Depuis un autre hôte, remplacez `localhost` par l'IP de la machine virtuelle.

## Gérer Ollama

Ollama s'exécute comme service systemd.

```bash
# Vérifier l'état
systemctl status ollama

# Redémarrer
sudo systemctl restart ollama

# Voir les journaux
sudo journalctl -u ollama -f

# Lister, télécharger et supprimer des modèles
ollama list
ollama pull qwen2.5
ollama rm qwen2.5
```

Les modèles sont stockés dans `/usr/share/ollama/.ollama/models`. Un résumé des URL et commandes est
écrit dans `/etc/ollama/info.txt`.

## Sécurité

Le port 11434 est ouvert sur l'interface réseau de la machine virtuelle, et Ollama n'a **pas
d'authentification intégrée**. UFW est activé et autorise SSH (port 22) et l'API Ollama (port
11434).

**Pour limiter l'API à une adresse IP précise:**

```bash
sudo ufw delete allow 11434/tcp
sudo ufw allow from <trusted-ip> to any port 11434
```

**Pour accéder à l'API sans ouvrir le pare-feu, utilisez un tunnel SSH:**

```bash
# Exécuter cette commande sur votre machine locale
ssh -L 11434:localhost:11434 ubuntu@<your-vm-ip>
```

**En production**, placez Ollama derrière un proxy inverse qui impose TLS et l'authentification, ou
limitez l'accès aux seules adresses IP de confiance.

## Prochaines étapes

- [Documentation Ollama](https://docs.ollama.com/)
- [Référence de l'API Ollama](https://docs.ollama.com/api)
