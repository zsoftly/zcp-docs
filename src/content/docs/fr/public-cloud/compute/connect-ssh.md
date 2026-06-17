---
title: Se connecter avec SSH
sidebar_position: 3
---

Gérez votre instance à partir d'un terminal avec SSH pour un accès distant sécurisé.

## Prérequis

Avant de vous connecter, assurez-vous d'avoir :

- **Adresse IP** : disponible sur la fiche de l'instance ou dans la vue d'ensemble.
- **Nom d'utilisateur par défaut** : selon le système d'exploitation (`root`, `ubuntu`, `ec2-user`).
- **Méthode d'authentification** : clé SSH, recommandée, ou mot de passe par défaut, indiqué dans la
  vue d'ensemble de l'instance.

:::note

Captures d'écran à venir.

:::

## Connexion

Ouvrez un terminal, par exemple Command Prompt/PowerShell sur Windows ou le terminal intégré sur
macOS/Linux.

**Avec une clé SSH :**

```bash
ssh -i /path/to/your/private/key username@ip_address
```

**Avec un mot de passe :**

```bash
ssh username@ip_address
```

Exemple :

```bash
ssh root@192.168.1.1
```

:::note

Captures d'écran à venir.

:::

## Voir aussi

- [Se connecter avec RDP](/fr/public-cloud/compute/connect-rdp)
- [Accès à la console](/fr/public-cloud/compute/console-access)
- [Clés SSH](/fr/public-cloud/compute/settings/ssh-keys)
