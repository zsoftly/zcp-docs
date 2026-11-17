---
title: Orca
description:
  Déployez et exploitez l'image Orca sur ZCP, connectez des comptes Claude Code et Codex gérés par
  le client, et restaurez les sessions après un redémarrage.
---

Orca est un espace de travail de développement en navigateur qui s'exécute sur une VM Ubuntu privée.
Cette image inclut Orca avec les agents en ligne de commande Claude Code et Codex. L'image ne
contient aucun identifiant client d'IA.

## Logiciels inclus

| Composant   | Version     |
| ----------- | ----------- |
| Orca        | 1.4.246     |
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

Seul SSH doit être accessible depuis l'extérieur de la VM. Orca écoute sur le port `6768` sur
`0.0.0.0`, et le pare-feu local refuse les accès entrants à ce port. Accédez-y uniquement par un
tunnel SSH.

Ce runtime sans tête utilise Xvfb pour la partie navigateur. Aucun environnement de bureau n'est
requis.

L'image ne contient aucun identifiant Claude ou Codex. Authentifiez-vous uniquement avec des comptes
que vous contrôlez. Aucun droit d'accès, tarif ou accès à un compte n'est inclus.

Le premier démarrage télécharge le runtime Orca et les artefacts navigateur depuis l'amont. La
configuration des comptes et leur utilisation nécessitent également un accès réseau. Un DNS
fonctionnel et une sortie HTTPS sont requis.

:::caution

Ne prenez pas d'instantané d'une VM après la connexion d'un compte en vue d'en faire une image. Des
identifiants intégrés exposeraient vos comptes à toute personne déployant depuis cette image.

:::

## Première connexion

Attendez la fin du premier démarrage, puis vérifiez le service Orca sur la VM :

```bash
sudo orca-onboard status
```

Le service indique `active` après le démarrage. Lors des tests d'acceptation, Orca prenait de 20 à
30 secondes pour être prêt après le passage à l'état actif. Vérifiez que le point de terminaison
local répond :

```bash
curl -fsS --connect-timeout 2 --max-time 5 http://127.0.0.1:6768/ >/dev/null && echo ready
```

Depuis votre poste de travail, ouvrez un tunnel SSH sur le port local `6768`. Orca génère des URL
avec ce port, donc le port local doit correspondre :

```bash
ssh -t \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  -L 127.0.0.1:6768:127.0.0.1:6768 \
  ubuntu@<vm-public-ip>
```

Dans la session SSH interactive, démarrez l'appairage :

```bash
sudo orca-onboard pair
```

Copiez l'**URL du client web** privée affichée par l'assistant dans votre propre navigateur. Ne
collez pas cette URL dans une conversation, un ticket, un journal ou un document partagé. Terminez
l'appairage pendant que la commande est en cours d'exécution. Lorsque l'appairage se termine,
appuyez sur `Ctrl-C` pour restaurer le service Orca normal, puis attendez la disponibilité avant de
vous reconnecter via l'URL du navigateur.

Si le tunnel SSH se déconnecte, rouvrez-le et rechargez le navigateur. Le port `6768` reste protégé
par le pare-feu, rouvrez donc le tunnel SSH plutôt que d'ouvrir le port.

## Comptes Claude et Codex gérés par le client

Lancez la configuration des comptes dans une session SSH interactive une fois que le premier
démarrage est prêt :

```bash
sudo orca-onboard claude
sudo orca-onboard codex
```

Claude et Codex utilisent des comptes séparés et ne partagent pas d'identifiants préchargés. Codex
utilise l'autorisation par code appareil. Activez la connexion par code appareil dans les paramètres
de sécurité de votre ChatGPT, ou demandez à l'administrateur de votre espace de travail de
l'activer, avant de démarrer le flux Codex.

## Données persistantes et redémarrages

Sauvegardez l'intégralité du répertoire personnel Orca sur la VM :

```text
/var/lib/orca
```

Le profil se trouve dans `/var/lib/orca/.config/orca`. Le chemin des espaces de travail clonés est
`/var/lib/orca/workspaces`. Les worktrees gérés par le runtime peuvent se trouver sous
`/var/lib/orca/orca/workspaces`. Préservez les deux en sauvegardant l'intégralité du répertoire
personnel.

:::caution

Ce répertoire contient les identifiants d'appairage Orca, Claude et Codex. Chiffrez la sauvegarde,
restreignez son accès et ne la joignez jamais à des tickets de support, des journaux ou des
artefacts d'image.

:::

Un redémarrage de l'hôte arrête les processus en cours. Reconnectez-vous une fois la VM revenue, et
ne considérez pas un terminal ou un processus d'agent en cours d'exécution comme persistant. Lors
des tests d'acceptation, une conversation Claude préalablement authentifiée a été restaurée après un
redémarrage et a répondu à une invite de type conversation sans relance manuelle de Claude.

## Dépannage

Vérifiez le service sans pageur :

```bash
sudo orca-onboard status
sudo journalctl -u orca-first-boot.service -n 160 --no-pager
```

Si la vérification de disponibilité locale échoue, patientez brièvement et réessayez. Si l'appairage
ne produit pas d'URL utilisable, arrêtez la commande d'appairage avec `Ctrl-C`, attendez que le
service normal soit prêt, puis relancez l'appairage. N'exposez pas le port `6768` à l'internet
public pour contourner un problème de tunnel. Ne copiez pas d'URL d'appairage dans des journaux et
ne capturez pas une sortie de service étendue tant qu'une URL d'appairage est visible.

## Mise à niveau de l'image

Les mises à jour de l'image Orca sont publiées sous forme de nouveau modèle immuable. N'utilisez pas
de mises à jour en application non supervisées sur une VM du marketplace, car elles déplaceraient la
version installée d'Orca hors du cycle de vie de l'image.

Avant qu'un opérateur n'effectue la mise à niveau, arrêtez la VM source ou prenez un instantané hors
ligne cohérent. Sauvegardez l'intégralité du répertoire `/var/lib/orca`. Les copies de fichiers à
chaud ne sont pas sûres pour un état basé sur SQLite. Conservez la VM source et la sauvegarde
jusqu'à ce que la VM de remplacement passe votre validation.

Après qu'un opérateur a restauré la sauvegarde sur une VM de test, réauthentifiez-vous en privé.
Validez les espaces de travail, le profil, le service, le tunnel et l'accès au navigateur sur la VM
restaurée avant de retirer la VM source.
