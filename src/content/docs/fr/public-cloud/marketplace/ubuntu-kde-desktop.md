---
title: Ubuntu KDE
---

Ubuntu KDE fournit une image de bureau Ubuntu 24.04 avec KDE Plasma et XRDP préinstallés pour
l'accès bureau à distance. Vous pouvez vous connecter avec un client Remote Desktop Protocol
standard depuis Windows, macOS ou Linux.

## Logiciels inclus

| Composant         | Version                |
| ----------------- | ---------------------- |
| Ubuntu            | 24.04 LTS              |
| Bureau            | KDE Plasma             |
| Bureau à distance | XRDP avec backend Xorg |

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 30 Go      |

## Variables d'environnement

Si des champs de variables de déploiement sont disponibles dans votre parcours de lancement,
utilisez-les à cet endroit. Sinon, fournissez les mêmes valeurs via un user data qui écrit
`/etc/zmi/deploy.env`, ou configurez-les après le premier démarrage pour créer ou mettre à jour le
compte de bureau.

| Variable             | Description                                       |
| -------------------- | ------------------------------------------------- |
| `UBUNTUKDE_USERNAME` | Nom d'utilisateur du bureau. Par défaut: `ubuntu` |
| `UBUNTUKDE_PASSWORD` | Mot de passe du bureau. Généré si vide            |
| `DESKTOP_USERNAME`   | Alias générique de `UBUNTUKDE_USERNAME`           |
| `DESKTOP_PASSWORD`   | Alias générique de `UBUNTUKDE_PASSWORD`           |

## Démarrage

### 1. Se connecter à la VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, le service applique les métadonnées CloudStack, régénère les clés hôte SSH,
crée ou met à jour l'utilisateur de bureau, configure KDE Plasma comme session XRDP et démarre XRDP.

Suivez la progression:

```bash
sudo journalctl -u ubuntukde-first-boot.service -f
```

### 3. Récupérer les identifiants de bureau

```bash
sudo cat /etc/ubuntukde/credentials.env
```

Le fichier est lisible uniquement par root.

### 4. Se connecter en RDP

Ouvrez votre client RDP et connectez-vous à:

```text
<your-vm-ip>:3389
```

Utilisez le nom d'utilisateur et le mot de passe de bureau configurés.

## Gérer Ubuntu KDE

```bash
# Vérifier l'état XRDP
sudo systemctl status xrdp

# Redémarrer XRDP
sudo systemctl restart xrdp

# Voir les journaux
sudo journalctl -u xrdp
sudo journalctl -u xrdp-sesman
```

Fichiers importants:

| Fichier                                            | Rôle                                  |
| -------------------------------------------------- | ------------------------------------- |
| `/etc/zmi/deploy.env`                              | Variables de déploiement optionnelles |
| `/etc/ubuntukde/info.txt`                          | Notes de configuration                |
| `/etc/ubuntukde/credentials.env`                   | Identifiants du bureau                |
| `/usr/local/bin/ubuntukde-first-boot.sh`           | Script de premier démarrage           |
| `/etc/systemd/system/ubuntukde-first-boot.service` | Service de premier démarrage          |

## Ports

| Port | Protocole | Rôle |
| ---- | --------- | ---- |
| 22   | TCP       | SSH  |
| 3389 | TCP       | RDP  |

## Sécurité

N'exposez pas RDP largement à Internet. Limitez le port 3389 à des adresses IP de confiance,
utilisez un VPN ou un tunnel SSH lorsque c'est possible. Changez les identifiants générés après la
première connexion.

## Dépannage

Si le client RDP ne peut pas se connecter, vérifiez que la VM a une IP publique joignable et que
`3389/tcp` est autorisé par le pare-feu ZCP ou la politique de sécurité.

Si la connexion réussit mais que le bureau ne s'affiche pas, consultez les journaux XRDP:

```bash
sudo journalctl -u xrdp
sudo journalctl -u xrdp-sesman
cat ~/.xsession-errors
```

Si le mot de passe est inconnu, récupérez-le en root:

```bash
sudo cat /etc/ubuntukde/credentials.env
```
