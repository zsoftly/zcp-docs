---
title: Herdr
description:
  Déployez et exploitez l'image Herdr sur ZCP, authentifiez des comptes Claude Code et Codex gérés
  par le client, et restaurez les sessions nommées après une coupure SSH ou un redémarrage.
---

Herdr est un gestionnaire d'espaces de travail en terminal pour exécuter des sessions Claude Code et
Codex nommées via SSH. Cette image inclut Herdr avec les agents en ligne de commande Claude Code et
Codex. L'image ne contient aucun identifiant client d'IA.

## Logiciels inclus

| Composant   | Version     |
| ----------- | ----------- |
| Herdr       | 0.9.5       |
| Claude Code | 2.1.309     |
| Codex       | 0.166.0     |
| Ubuntu      | 26.04.1 LTS |

## Prérequis

| Ressource | Minimum |
| --------- | ------- |
| vCPU      | 2       |
| Mémoire   | 4 Gio   |
| Stockage  | 40 Gio  |

## Accès et sécurité

SSH est le moyen d'accès externe prévu. Le pare-feu local autorise le SSH entrant et refuse les
autres flux entrants par défaut. Chaque utilisateur SSH conserve l'état des sessions Herdr, les
références de reprise d'agent et les identifiants de compte dans son propre répertoire personnel sur
le disque persistant de la VM.

L'image ne contient aucun identifiant Claude ou Codex. Authentifiez-vous uniquement avec des comptes
que vous contrôlez.

:::caution

Ne prenez pas d'instantané d'une VM après la connexion d'un compte en vue d'en faire une image. Des
identifiants intégrés exposeraient vos comptes à toute personne déployant depuis cette image.

:::

## Première connexion

Connectez-vous à la VM déployée via SSH en tant que `ubuntu`. Vérifiez que le premier démarrage est
terminé et que la CLI Herdr est disponible :

```bash
sudo systemctl status herdr-first-boot.service --no-pager
herdr --version
```

Démarrez Herdr dans votre session SSH :

```bash
herdr
```

Utilisez une session nommée lorsque vous voulez un espace de travail séparé :

```bash
herdr session attach project-a
```

## Comptes Claude et Codex gérés par le client

Initialisez et authentifiez chaque agent avec votre utilisateur SSH d'abord :

```bash
claude
codex
```

Terminez les flux d'authentification en privé. Une fois que chaque client a créé son répertoire de
configuration, installez l'intégration Herdr pour cet utilisateur :

```bash
herdr integration install claude
herdr integration install codex
```

L'intégration Claude requiert `~/.claude` et l'intégration Codex requiert `~/.codex`. N'exécutez
aucune des deux commandes en tant que root. L'image ne précharge jamais ces répertoires, hooks,
jetons d'accès, clés API ou sessions.

## Récupération après déconnexion SSH et redémarrage

Pour une déconnexion SSH ordinaire, le serveur Herdr maintient les panneaux et leurs processus en
cours d'exécution. Reconnectez-vous et attachez la même session nommée :

```bash
herdr session attach project-a
```

Un redémarrage de la VM arrête le serveur et chaque processus exécuté dans ses panneaux. La
restauration n'est pas automatique au démarrage. Reconnectez-vous en SSH et exécutez
`herdr session attach <name>` pour reconstruire l'espace de travail sauvegardé, les onglets, les
panneaux, les répertoires courants, la disposition et le focus. Claude Code et Codex reprennent les
conversations précédentes grâce à la restauration de session authentifiée propre à chaque agent.

:::note

Ne vous attendez pas à ce qu'une commande shell en cours, un serveur de développement ou un
processus de test survive à un redémarrage de la VM. Les processus arbitraires dans les panneaux
Herdr ne sont pas persistants entre les redémarrages.

:::

## Mise à niveau de l'image

Les mises à jour de l'image Herdr sont publiées sous forme de nouveau modèle immuable. N'utilisez
pas de mises à jour en application non supervisées sur une VM du marketplace, car elles
déplaceraient la version installée de Herdr hors du cycle de vie de l'image.

Avant qu'un opérateur n'effectue la mise à niveau, arrêtez la VM source ou prenez un instantané hors
ligne cohérent. L'état de session réside dans le répertoire personnel de chaque utilisateur SSH.
Préservez-le en sauvegardant `/home` ou le disque de données. Conservez la VM source et la
sauvegarde jusqu'à ce que la VM de remplacement passe votre validation.

## Références

- [Guide d'installation Herdr](https://herdr.dev/tui/docs/install/)
- [État et restauration de session Herdr](https://herdr.dev/tui/docs/session-state/)
