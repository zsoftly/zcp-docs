---
title: Se connecter avec SSH
sidebar_position: 3
---

Gérez votre instance à partir d'un terminal avec SSH pour un accès distant sécurisé.

## Prérequis

Avant de vous connecter, assurez-vous d'avoir :

- **Adresse IP** : disponible sur la fiche de l'instance ou dans la vue d'ensemble.
- **Nom d'utilisateur par défaut** : selon l'image du système d'exploitation — voir le tableau
  ci-dessous.
- **Méthode d'authentification** : clé SSH, recommandée, ou le **Provisioning Password** affiché
  dans l'onglet Overview de l'instance (voir ci-dessous).

### Nom d'utilisateur par défaut selon le SE

| Image du SE  | Nom d'utilisateur par défaut |
| ------------ | ---------------------------- |
| Ubuntu       | `ubuntu`                     |
| Debian       | `debian`                     |
| Rocky Linux  | `rocky`                      |
| AlmaLinux    | `almalinux`                  |
| CentOS       | `centos`                     |
| Oracle Linux | `opc`                        |
| Fedora       | `fedora`                     |

Si une image n'a pas d'utilisateur propre à la distribution, elle peut utiliser `root`. Le nom
d'utilisateur exact est affiché dans **Instance Overview**. Les instances Windows utilisent le
[RDP](/fr/public-cloud/compute/connect-rdp), pas le SSH.

### Où trouver le mot de passe

Si vous avez déployé sans clé SSH, ouvrez l'onglet **Overview** de l'instance et révélez le
**Provisioning Password** — cliquez sur l'icône en forme d'œil pour l'afficher, ou sur l'icône de
copie pour le copier. Utilisez-le avec le nom d'utilisateur par défaut ci-dessus.

![Vue d'ensemble de la machine virtuelle avec le champ Provisioning Password mis en évidence](../../../../../assets/compute/provisioning-password.webp)

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
