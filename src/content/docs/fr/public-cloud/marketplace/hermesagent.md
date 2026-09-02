---
title: HermesAgent
---

HermesAgent est un environnement d'agent IA auto-hébergé de Nous Research. Il peut conserver une
mémoire persistante, utiliser des outils, créer ou importer des compétences, exécuter des sessions
et se connecter à des fournisseurs de modèles externes depuis votre instance ZCP.

## Logiciels inclus

| Composant             | Version         |
| --------------------- | --------------- |
| HermesAgent           | 2026.8.3        |
| Docker                | Dernière stable |
| Docker Compose plugin | Dernière stable |
| Ubuntu                | 24.04 LTS       |

L'image exécute le conteneur épinglé `nousresearch/hermes-agent:v2026.8.3`.

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

HermesAgent utilise des fournisseurs de modèles externes par défaut. Si vous prévoyez d'exécuter des
modèles locaux sur la même VM, dimensionnez l'instance séparément pour ces charges.

## Variables d'environnement

Définissez ces valeurs lors du déploiement depuis la marketplace si vous voulez configurer les clés
de fournisseurs ou l'accès passerelle au premier démarrage. Les secrets sont lus depuis
`/etc/zmi/deploy.env` et copiés dans un fichier d'environnement d'exécution lisible uniquement par
root.

| Variable                  | Description                                      |
| ------------------------- | ------------------------------------------------ |
| `OPENROUTER_API_KEY`      | Clé API du fournisseur OpenRouter                |
| `FIREWORKS_API_KEY`       | Clé API du fournisseur Fireworks                 |
| `GOOGLE_API_KEY`          | Clé API Google/Gemini                            |
| `GEMINI_API_KEY`          | Alias de clé API Gemini                          |
| `VULTR_API_KEY`           | Clé API/inférence Vultr                          |
| `EXA_API_KEY`             | Clé de l'outil de recherche Exa                  |
| `FIRECRAWL_API_KEY`       | Clé de l'outil Firecrawl                         |
| `FAL_KEY`                 | Clé fal.ai                                       |
| `SLACK_BOT_TOKEN`         | Jeton d'intégration Slack bot                    |
| `SLACK_APP_TOKEN`         | Jeton Slack Socket Mode                          |
| `TELEGRAM_BOT_TOKEN`      | Jeton Telegram bot                               |
| `API_SERVER_KEY`          | Clé API de la passerelle si elle est activée     |
| `GATEWAY_ALLOW_ALL_USERS` | Autorise l'accès passerelle en QA ou test fiable |

## Démarrage

### 1. Se connecter à la VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, HermesAgent crée ses répertoires d'exécution, applique `/etc/zmi/deploy.env`
si le fichier existe, démarre la pile Docker Compose et écrit les notes de configuration. Suivez la
progression:

```bash
journalctl -u hermesagent-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand HermesAgent est prêt.

### 3. Récupérer les notes de configuration

```bash
cat /etc/hermesagent/info.txt
sudo cat /etc/hermesagent/credentials.txt
```

Le fichier d'identifiants est lisible uniquement par root, car il peut contenir des secrets générés
et des détails d'accès.

### 4. Ouvrir le tableau de bord avec un tunnel SSH

HermesAgent est volontairement limité à localhost par défaut. Exécutez ceci depuis votre poste:

```bash
ssh -L 9119:127.0.0.1:9119 ubuntu@<your-vm-ip>
```

Puis ouvrez:

```text
http://127.0.0.1:9119
```

## Gérer HermesAgent

HermesAgent s'exécute comme pile Docker Compose dans `/opt/hermesagent`.

```bash
# Vérifier l'état
cd /opt/hermesagent && sudo docker compose ps

# Redémarrer
cd /opt/hermesagent && sudo docker compose restart

# Voir les journaux
cd /opt/hermesagent && sudo docker compose logs -f
```

## Données persistantes

HermesAgent stocke ses données d'exécution séparément du système d'exploitation lorsque c'est
possible. Si un disque de données vierge est attaché avant le premier démarrage, l'image le formate,
le monte sur `/data` et stocke les données sous `/data/hermesagent`. Sans disque de données, elle
utilise `/var/lib/hermesagent`.

Les données qui peuvent grandir incluent la mémoire de l'agent, l'historique de session, les
compétences importées ou générées, les journaux, les sorties d'outils, les résultats en cache et les
fichiers d'état.

## Sécurité

UFW autorise uniquement SSH par défaut. Le tableau de bord écoute sur `127.0.0.1:9119` et doit être
consulté via un tunnel SSH. N'exposez pas directement le tableau de bord ou la passerelle à Internet
sauf derrière TLS et authentification.

Traitez `/opt/hermesagent/.env`, `/etc/hermesagent/credentials.txt` et le répertoire de données
comme sensibles.

## Prochaines étapes

- [Dépôt HermesAgent](https://github.com/nousresearch/hermes-agent)
- [Guide de déploiement HermesAgent de Vultr](https://docs.vultr.com/how-to-deploy-hermes-agent-open-source-self-hosted-ai-agent)
