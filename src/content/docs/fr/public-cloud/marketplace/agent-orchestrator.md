---
title: Agent Orchestrator
---

Agent Orchestrator intègre le flux d'ingénierie [ai-craft](https://github.com/zsoftly/ai-craft) de
ZSoftly, avec Claude Code et Codex préinstallés. Plutôt qu'une seule IA qui écrit du code sans
contrôle, un orchestrateur planifie et délègue, un agent d'implémentation écrit le code, et deux
agents de révision le vérifient en parallèle sous des angles différents avant que vous n'acceptiez
le résultat. Il n'y a aucun environnement de bureau ni interface web — tout se passe via SSH.

## Logiciels inclus

| Composant   | Version                           |
| ----------- | --------------------------------- |
| ai-craft    | 2.2.0 (commit épinglé `d17d6946`) |
| Claude Code | 2.1.309                           |
| Codex       | 0.166.0                           |
| Ubuntu      | 26.04.1 LTS                       |

## Prérequis

| Ressource | Minimum | Recommandé (2 tâches d'agent en parallèle)          |
| --------- | ------- | --------------------------------------------------- |
| vCPU      | 2       | 4                                                   |
| RAM       | 4 Go    | 8 Go                                                |
| Stockage  | 20 Go   | 40 Go+ pour les dépôts et worktrees plus volumineux |

Agent Orchestrator n'a ni planificateur de tâches intégré ni bac à sable. Chaque tâche d'agent
supplémentaire en parallèle nécessite à peu près son propre budget vCPU/RAM en plus de ces chiffres.

## Variables d'environnement

Si des champs de variables de déploiement sont disponibles dans votre parcours de lancement,
utilisez-les à cet endroit. Sinon, fournissez les mêmes valeurs via un user data qui écrit
`/etc/zmi/deploy.env`, ou configurez-les après le premier démarrage. Toutes sont facultatives.

| Variable                       | Description                                                        |
| ------------------------------ | ------------------------------------------------------------------ |
| `GITHUB_TOKEN`                 | Configure `git`/`gh` pour l'utilisateur `ubuntu` sans interaction. |
| `ANTHROPIC_API_KEY`            | Permet à Claude Code de s'authentifier sans connexion interactive. |
| `OPENAI_API_KEY`               | Permet à Codex de s'authentifier sans connexion interactive.       |
| `AGENT_ORCHESTRATOR_MAX_TASKS` | Nombre de créneaux `agent-task` simultanés. Par défaut `4`.        |

## Démarrage

### 1. Se connecter à la VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Démarrer une session persistante

Les sessions des CLI d'agent ne survivent pas d'elles-mêmes à une déconnexion SSH. Exécutez-les dans
`tmux` pour pouvoir vous reconnecter sans perdre votre place:

```bash
tmux new -s work
```

### 3. Authentifier Claude Code et Codex

Chaque CLI utilise votre propre compte. Rien n'est préauthentifié dans l'image.

```bash
claude   # connexion interactive
codex    # connexion interactive
```

Pour éviter la connexion interactive, fournissez `ANTHROPIC_API_KEY` et/ou `OPENAI_API_KEY` au
déploiement — le premier démarrage les rend disponibles à chaque nouveau shell pour l'utilisateur
`ubuntu`.

### 4. Connecter l'accès GitHub

```bash
gh auth login
```

Ou fournissez `GITHUB_TOKEN` au déploiement pour que cela soit configuré automatiquement.

### 5. Exécuter des tâches en parallèle dans des worktrees séparés

```bash
cd ~/workspace
git clone <your-repo-url>
cd <your-repo>
git worktree add ../<your-repo>-task-a -b task-a
cd ../<your-repo>-task-a
agent-task claude
```

`agent-task` limite le nombre de CLI d'agent pouvant s'exécuter en même temps (voir Limites de
tâches ci-dessous). Consultez `~/workspace/README.md` sur la VM pour le modèle complet de worktree.

### 6. Exécuter le flux de l'orchestrateur

```bash
/zs-orchestrate add rate limiting to the login endpoint
```

Codex utilise les mêmes agents, avec une mécanique légèrement différente — voir le
[guide de workflow d'ai-craft](https://github.com/zsoftly/ai-craft/blob/main/docs/workflow.md#running-it-in-codex)
pour savoir comment les lancer de ce côté.

## Limites de tâches

`agent-task` est une limite de concurrence, pas un bac à sable:

```bash
agent-task claude ...
agent-task codex ...
```

Il refuse de démarrer une nouvelle tâche une fois que `AGENT_ORCHESTRATOR_MAX_TASKS` (par défaut
`4`) sont déjà en cours d'exécution, jusqu'à ce que l'une d'elles se termine. Exécuter
`claude`/`codex` directement au lieu de passer par `agent-task` fonctionne toujours — ce n'est
simplement pas limité. Il s'agit d'une VM autogérée que vous possédez, pas d'un bac à sable
multi-locataire, donc cette limite est un contrôle d'usage, pas une frontière de sécurité.

Pour modifier la limite après le déploiement, modifiez directement
`/etc/agent-orchestrator/limits.conf`; aucun redémarrage n'est nécessaire.

## Persistance de session et récupération après redémarrage

`tmux` maintient une session active à travers les déconnexions SSH, mais un redémarrage de la VM met
quand même fin à tous les processus en cours, y compris `tmux`. Après un redémarrage:

- Reconnectez-vous en SSH et démarrez une nouvelle session `tmux`.
- Claude Code et Codex conservent chacun leur propre historique de conversation sur disque, vous
  pouvez donc reprendre une conversation précédente via la fonction de reprise propre à chaque CLI
  plutôt que de recommencer.
- Vos dépôts et worktrees Git sous `~/workspace` ne sont pas affectés — ils résident sur le disque
  normal de la VM, pas en mémoire.

## Identifiants

Aucun identifiant n'est jamais intégré dans cette image. `GITHUB_TOKEN`, `ANTHROPIC_API_KEY` et
`OPENAI_API_KEY` sont entièrement fournis par le client, soit au déploiement, soit de façon
interactive par la suite.

> L'ensemble d'agents d'ai-craft inclut `zs-cmp-deploy-agent`, un assistant de déploiement interne à
> ZSoftly. Il est installé avec le reste des agents; il est inerte sans le contexte de déploiement
> propre à ZSoftly, mais vous le verrez listé aux côtés des agents destinés aux clients.

## Sécurité

UFW n'autorise que SSH (`22/tcp`) en entrée. Tout le trafic sortant est autorisé, ce qui est
nécessaire pour l'accès aux API GitHub, Anthropic et OpenAI.

## Prochaines étapes

- [Dépôt ai-craft](https://github.com/zsoftly/ai-craft)
- [Guide de workflow d'ai-craft](https://github.com/zsoftly/ai-craft/blob/main/docs/workflow.md)
- [Documentation Claude Code](https://docs.claude.com/en/docs/claude-code)
- [Documentation Codex](https://developers.openai.com/codex)
