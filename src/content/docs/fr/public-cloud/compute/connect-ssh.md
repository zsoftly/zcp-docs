---
title: Se connecter avec SSH
sidebar_position: 3
---

Gérez votre instance à partir d'un terminal avec SSH pour un accès distant sécurisé.

## Prérequis

Avant de vous connecter, assurez-vous d'avoir :

- **Adresse IP** : disponible sur la fiche de l'instance ou dans la vue d'ensemble.
- **Nom d'utilisateur par défaut** : selon l'image du système d'exploitation. Voir le tableau
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
| Oracle Linux | `cloud-user`                 |
| Fedora       | `fedora`                     |

Si une image n'a pas d'utilisateur propre à la distribution, elle peut utiliser `root`. Le nom
d'utilisateur exact est affiché dans **Instance Overview**. Les instances Windows utilisent le
[RDP](/fr/public-cloud/compute/connect-rdp), pas le SSH.

### Où trouver le mot de passe

Si vous avez déployé sans clé SSH, ouvrez l'onglet **Overview** de l'instance et révélez le
**Provisioning Password** : cliquez sur l'icône en forme d'œil pour l'afficher, ou sur l'icône de
copie pour le copier. Utilisez-le avec le nom d'utilisateur par défaut ci-dessus.

![Vue d'ensemble de la machine virtuelle avec le champ Provisioning Password mis en évidence](../../../../../assets/compute/provisioning-password.webp)

## Générer une paire de clés SSH

Une paire de clés SSH comprend une clé privée que vous gardez secrète et une clé publique que vous
ajoutez à votre compte ou à votre instance. Créez-en une dans votre terminal.

Sur macOS et Linux :

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

Appuyez sur Entrée pour accepter le chemin par défaut (`~/.ssh/id_ed25519`), puis définissez une
phrase secrète lorsque vous y êtes invité. Sur les anciens systèmes qui ne prennent pas en charge
Ed25519, utilisez RSA :

```bash
ssh-keygen -t rsa -b 4096 -C "you@example.com"
```

Sous Windows 10 et les versions ultérieures, la même commande `ssh-keygen` fonctionne dans
PowerShell. Les clés sont enregistrées dans `%USERPROFILE%\.ssh\`.

Affichez la clé publique pour la copier :

```bash
cat ~/.ssh/id_ed25519.pub
```

Ajoutez la clé publique à votre compte ou à votre instance sous
[Clés SSH](/fr/public-cloud/compute/settings/ssh-keys). Gardez la clé privée (`~/.ssh/id_ed25519`)
secrète et ne la partagez jamais.

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

![Connexion à une VM en SSH depuis un terminal](../../../../../assets/compute/connect-ssh-connecting.webp)

## Voir aussi

- [Se connecter avec RDP](/fr/public-cloud/compute/connect-rdp)
- [Accès à la console](/fr/public-cloud/compute/console-access)
- [Clés SSH](/fr/public-cloud/compute/settings/ssh-keys)
