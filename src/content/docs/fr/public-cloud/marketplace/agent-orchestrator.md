---
title: Agent Orchestrator
---

Agent Orchestrator intègre la véritable application de bureau
[Agent Orchestrator](https://github.com/OrchestratorInc/agent-orchestrator), avec Claude Code et
Codex préinstallés. Elle planifie des tâches, les délègue à des agents dans des worktrees Git
isolés, et suit les approbations via sa propre interface graphique. Agent Orchestrator est une
application de bureau, pas un outil en ligne de commande; cette image fournit donc un bureau KDE
accessible par RDP.

## Logiciels inclus

| Composant          | Version     |
| ------------------ | ----------- |
| Agent Orchestrator | 0.15.3      |
| Claude Code        | 2.1.309     |
| Codex              | 0.166.0     |
| Ubuntu             | 26.04.1 LTS |

Cette image utilise XRDP, vous pouvez donc vous connecter avec un client Remote Desktop Protocol
standard depuis Windows, macOS ou Linux. L'accès SSH est également disponible.

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 40 Go   | 50 Go+     |

## Variables d'environnement

Si des champs de variables de déploiement sont disponibles dans votre parcours de lancement,
utilisez-les à cet endroit. Sinon, fournissez les mêmes valeurs via un user data qui écrit
`/etc/zmi/deploy.env`, ou configurez-les après le premier démarrage. Les deux sont facultatives.

| Variable                      | Description                                       |
| ----------------------------- | ------------------------------------------------- |
| `AGENT_ORCHESTRATOR_USERNAME` | Nom d'utilisateur du bureau. Par défaut `ubuntu`. |
| `AGENT_ORCHESTRATOR_PASSWORD` | Mot de passe du bureau. Généré si vide.           |

La connexion à GitHub, Claude Code et Codex est une étape manuelle que vous effectuez dans la
session de bureau; rien n'est préauthentifié ni intégré dans cette image. Chaque outil conserve son
propre état de connexion dans son propre fichier de configuration du répertoire personnel (`gh` sous
`~/.config/gh`, Claude Code et Codex dans leurs propres répertoires de configuration CLI), pas dans
le stockage propre d'Agent Orchestrator.

## Démarrage

### 1. Se connecter à la VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, le service de configuration applique les métadonnées de la plateforme,
régénère les clés d'hôte SSH, crée ou met à jour l'utilisateur du bureau, configure KDE Plasma comme
session XRDP, et démarre XRDP.

Suivre la progression:

```bash
sudo journalctl -u agent-orchestrator-first-boot.service -f
```

### 3. Récupérer les identifiants du bureau

```bash
sudo cat /etc/agent-orchestrator/credentials.env
```

Le fichier n'est lisible que par root.

### 4. Se connecter par RDP

Ouvrez votre client RDP et connectez-vous à:

```text
<your-vm-ip>:3389
```

Utilisez le nom d'utilisateur et le mot de passe du bureau configurés.

### 5. Ouvrir Agent Orchestrator

Double-cliquez sur l'icône **Orchestrator** sur le bureau — c'est le nom que l'application se donne
elle-même, distinct du nom "Agent Orchestrator" utilisé dans la fiche de la marketplace (la
recherche dans le menu des applications n'est pas fiable sur cette session de bureau à distance). Au
premier lancement, connectez-vous avec votre propre compte GitHub et associez vos propres
identifiants Claude Code et Codex via les paramètres de l'application — rien n'est préauthentifié.

Agent Orchestrator transmet par défaut des données d'utilisation et de fiabilité à Orchestrator.inc.
Ces données ne sont pas entièrement anonymes : elles incluent un identifiant d'installation et votre
nom d'utilisateur GitHub, ainsi que votre identifiant et votre adresse courriel AO Cloud si vous
vous connectez à AO Cloud. Elles n'incluent jamais de code, d'invites ni d'identifiants. Pour la
désactiver : Settings > General > Privacy > Share usage analytics.

### 6. Exécuter une tâche

Pointez l'application vers un dépôt Git (clonez-le d'abord dans un terminal, ou laissez
l'application le faire) et créez une tâche. Agent Orchestrator crée un worktree et une branche
isolés par tâche, assigne un agent, et renvoie les échecs de CI et les retours de révision à cet
agent jusqu'à ce que le travail soit prêt à être fusionné.

### 7. Exécuter des tâches en parallèle

Créez d'autres tâches de la même façon — chacune obtient son propre worktree, sa propre branche et
son propre agent, afin qu'elles n'interfèrent pas entre elles. Révisez et approuvez chacune depuis
l'interface de l'application à mesure qu'elle se termine.

## Persistance de session et récupération après redémarrage

Agent Orchestrator conserve l'état des tâches, les worktrees et l'historique des conversations sur
disque, et non en mémoire; un redémarrage de la VM ne fait donc pas perdre le travail en cours:

- Reconnectez-vous par RDP et rouvrez l'application; les tâches en cours et terminées sont toujours
  listées.
- Vos dépôts et worktrees Git ne sont pas affectés — ils résident sur le disque normal de la VM.

## Sécurité

N'exposez pas largement le RDP à l'internet public. Restreignez le port 3389 aux IP de confiance,
utilisez un VPN, ou un tunnel SSH lorsque c'est possible. UFW n'autorise que SSH (`22/tcp`) et RDP
(`3389/tcp`) en entrée; rien d'autre n'est jamais ouvert. Tout le trafic sortant est autorisé, ce
qui est nécessaire pour l'accès aux API GitHub, Anthropic et OpenAI.

## Dépannage

Si le client RDP ne peut pas se connecter, vérifiez que la VM dispose d'une IP publique accessible
et que `3389/tcp` est autorisé par le pare-feu ou la politique de sécurité ZCP.

Si la connexion réussit mais que le bureau n'apparaît pas, consultez les journaux de session XRDP:

```bash
sudo journalctl -u xrdp
sudo journalctl -u xrdp-sesman
cat ~/.xsession-errors
```

Si le mot de passe est inconnu, récupérez-le en tant que root:

```bash
sudo cat /etc/agent-orchestrator/credentials.env
```

Si le service de premier démarrage a échoué, relancez-le après avoir corrigé le problème signalé:

```bash
sudo systemctl reset-failed agent-orchestrator-first-boot
sudo systemctl start agent-orchestrator-first-boot
```

## Prochaines étapes

- [Dépôt Agent Orchestrator](https://github.com/OrchestratorInc/agent-orchestrator)
- [Documentation Claude Code](https://code.claude.com/docs/en/overview)
- [Documentation Codex](https://learn.chatgpt.com/docs)
