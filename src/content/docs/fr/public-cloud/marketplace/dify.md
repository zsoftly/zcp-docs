---
title: Dify
---

Dify est une plateforme open source pour creer des applications LLM et des agents IA. Elle combine
un constructeur visuel de workflows, des pipelines de génération augmentée par récupération (RAG),
la gestion des prompts et un cadre d'agents pour concevoir, tester et déployer des applications d'IA
générative depuis une seule interface.

## Logiciels inclus

| Composant      | Version         |
| -------------- | --------------- |
| Dify           | 1.15.0          |
| Docker         | Dernière stable |
| Docker Compose | Dernière stable |
| Ubuntu         | 24.04 LTS       |

Dify s'exécute comme pile Docker Compose multi-conteneurs (API, worker, web, PostgreSQL, Redis,
stockage vectoriel Weaviate et nginx).

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 40 Go   | 80 Go      |

Les besoins en RAM et en stockage augmentent avec l'utilisation.

## Démarrage

### 1. Se connecter à la machine virtuelle

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, un script génère les secrets internes de base de données et Redis, écrit le
fichier d'environnement, puis démarre la pile avec Docker Compose. Cela prend quelques minutes, le
temps que les conteneurs deviennent sains. Suivez la progression:

```bash
journalctl -u dify-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Dify est prêt et affiche les identifiants internes.

### 3. Terminer la configuration administrateur

Ouvrez un navigateur et terminez la configuration administrateur unique:

```text
http://<your-vm-ip>/install
```

Creez le compte administrateur (adresse courriel et mot de passe de votre choix), puis
connectez-vous a `http://<your-vm-ip>/`.

### 4. Ajouter un fournisseur de modèle

Depuis **Settings → Model Provider**, ajoutez un fournisseur LLM (comme OpenAI, Anthropic ou un
point de terminaison Ollama auto-hébergé) avant de creer des applications.

### 5. Consulter les identifiants génères

Les mots de passe internes de PostgreSQL et Redis sont écrits dans un fichier réservé à root:

```bash
sudo cat /etc/dify/credentials.txt
```

## Gérer Dify

Dify s'exécute comme pile Docker Compose dans `/opt/dify/docker`.

```bash
# Vérifier l'état
cd /opt/dify/docker && docker compose ps

# Redémarrer
cd /opt/dify/docker && docker compose restart

# Voir les journaux
cd /opt/dify/docker && docker compose logs -f
```

Configuration d'environnement: `/opt/dify/docker/.env`. Les données persistantes sont stockées sous
`/opt/dify/docker/volumes`.

## Sécurité

Les ports 80 et 443 sont ouverts sur l'interface réseau de la machine virtuelle. UFW est activé et
autorise SSH (port 22), HTTP (80) et HTTPS (443).

Dify sert HTTP en clair par défaut. **En production**, placez Dify derrière votre propre proxy
inverse avec TLS, ou configurez HTTPS et l'URL publique dans `/opt/dify/docker/.env`. Appliquez les
changements `.env` avec:

```bash
cd /opt/dify/docker && docker compose down && docker compose up -d
```

## Prochaines étapes

- [Documentation Dify](https://docs.dify.ai/)
- [Guide d'auto-hébergément Dify](https://docs.dify.ai/en/getting-started/install-self-hosted/docker-compose)
