---
title: Vaultwarden
---

Vaultwarden est un gestionnaire de mots de passe léger et auto-hébergé qui implémente l'API
Bitwarden. Il est entièrement compatible avec les applications clientes et extensions de navigateur
Bitwarden officielles, ce qui permet de stocker et synchroniser mots de passe, notes sécurisées et
autres secrets sur une infrastructure que vous contrôlez.

## Logiciels inclus

| Composant      | Version         |
| -------------- | --------------- |
| Vaultwarden    | 1.36.0          |
| Docker         | Dernière stable |
| Docker Compose | Dernière stable |
| Ubuntu         | 24.04 LTS       |

Vaultwarden stocke ses données dans une base SQLite intégrée et sert le coffre web en HTTPS sur le
port 8000 avec un certificat autosigné généré au premier démarrage.

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 10 Go   | 20 Go      |

Vaultwarden consomme peu de ressources.

## Variables d'environnement

Vous pouvez les définir au déploiement de Vaultwarden depuis la Marketplace. Laissez `ADMIN_TOKEN`
vide pour générer automatiquement une valeur aléatoire sécurisée.

| Variable             | Description                                                                             |
| -------------------- | --------------------------------------------------------------------------------------- |
| `VAULTWARDEN_DOMAIN` | URL publique complète utilisée par les clients, par exemple `https://vault.example.com` |
| `ADMIN_TOKEN`        | Jeton du panneau `/admin`                                                               |

## Démarrage

### 1. Se connecter à la machine virtuelle

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, un script génère un certificat TLS autosigné et le jeton administrateur, puis
démarre le conteneur avec Docker Compose. Cela prend moins d'une minute. Suivez la progression:

```bash
journalctl -u vaultwarden-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Vaultwarden est prêt.

### 3. Récupérer le jeton administrateur

Le jeton administrateur sert à se connecter au panneau `/admin`. Il est écrit dans un fichier
réservé à root:

```bash
sudo cat /root/.credentials/vaultwarden.txt
```

### 4. Ouvrir le coffre web

Ouvrez un navigateur et allez à:

```text
https://<your-vm-ip>:8000
```

Le certificat autosigné déclenche un avertissement du navigateur. Acceptez l'exception pour
continuer. Le panneau d'administration se trouve à `https://<your-vm-ip>:8000/admin`.

:::note

L'inscription libre des utilisateurs est désactivée par défaut (`SIGNUPS_ALLOWED=false`). Pour
ajouter des utilisateurs, ouvrez le panneau d'administration et invitez-les sous **Users**, ou
activez l'inscription ouverte sous **General Settings**.

:::

## Gérer Vaultwarden

Vaultwarden s'exécute comme pile Docker Compose dans `/data/vaultwarden`.

```bash
# Vérifier l'état
cd /data/vaultwarden && docker compose ps

# Redémarrer
cd /data/vaultwarden && docker compose restart

# Voir les journaux
cd /data/vaultwarden && docker compose logs -f
```

Configuration d'environnement: `/data/vaultwarden/vaultwarden.env`. La base du coffre et le
certificat sont stockés sous `/data/vaultwarden/data`.

## Sécurité

Le port 8000 est ouvert sur l'interface réseau de la machine virtuelle. UFW est activé et autorise
SSH (port 22) et le coffre web Vaultwarden (port 8000). Les clients Bitwarden exigent HTTPS, que
l'image sert avec un certificat autosigné par défaut.

Traitez le jeton administrateur comme un mot de passe root.

**En production**, définissez `DOMAIN` avec l'URL publique complète utilisée par les clients, y
compris le schéma et le port ou chemin éventuel (par exemple `https://vault.example.com` ou
`https://<ip-publique>:8000`), dans `/data/vaultwarden/vaultwarden.env`, remplacez le certificat
autosigné par un certificat de confiance (ou placez Vaultwarden derrière un proxy inverse comme
Caddy qui termine TLS), puis redémarrez la pile:

```bash
cd /data/vaultwarden && docker compose restart
```

## Prochaines étapes

- [Documentation Vaultwarden](https://github.com/dani-garcia/vaultwarden/wiki)
- [Activer HTTPS](https://github.com/dani-garcia/vaultwarden/wiki/Enabling-HTTPS)
