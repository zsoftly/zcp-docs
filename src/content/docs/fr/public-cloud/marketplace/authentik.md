---
title: Authentik
---

Authentik est un fournisseur d'identité open source qui centralise l'authentification de vos
applications. Il prend en charge le SSO avec OAuth 2.0, OpenID Connect, SAML, LDAP et
proxy/forward-auth, avec des flux, des politiques et un portail utilisateur en libre-service.

## Logiciels inclus

| Composant  | Version         |
| ---------- | --------------- |
| Authentik  | 2025.6.3        |
| PostgreSQL | 16              |
| Redis      | Alpine          |
| Docker     | Dernière stable |
| Ubuntu     | 24.04 LTS       |

Authentik exécute ses conteneurs serveur et worker avec PostgreSQL et Redis, sous forme de pile
Docker Compose.

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Variables d'environnement

Vous pouvez les définir au déploiement d'Authentik depuis la Marketplace. Laissez un champ de mot de
passe vide pour générer automatiquement une valeur aléatoire sécurisée.

| Variable                       | Description                                               |
| ------------------------------ | --------------------------------------------------------- |
| `AUTHENTIK_HOSTNAME`           | Nom d'hôte public ou IP depuis lequel Authentik est servi |
| `AUTHENTIK_BOOTSTRAP_EMAIL`    | Adresse courriel du compte initial `akadmin`              |
| `AUTHENTIK_BOOTSTRAP_PASSWORD` | Mot de passe du compte initial `akadmin`                  |

## Démarrage

### 1. Se connecter à la machine virtuelle

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, un script génère les valeurs d'administration, de base de données et de clé
secrete, écrit le fichier d'environnement, puis démarre la pile avec Docker Compose. Cela prend 1 a
2 minutes. Suivez la progression:

```bash
journalctl -u authentik-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Authentik est prêt et affiche les identifiants
administrateur.

### 3. Recuperer les identifiants administrateur

Les identifiants sont aussi écrits dans un fichier réservé à root:

```bash
sudo cat /etc/authentik/credentials.txt
```

### 4. Acceder a l'interface d'administration

Ouvrez un navigateur et allez a:

```text
http://<your-vm-ip>:9000
```

Connectez-vous avec l'adresse courriel `akadmin` et le mot de passe génère. HTTPS est aussi
disponible sur le port 9443 avec un certificat autosigné.

## Gérer Authentik

Authentik s'exécute comme pile Docker Compose dans `/opt/authentik`.

```bash
# Vérifier l'état
cd /opt/authentik && docker compose ps

# Redémarrer
cd /opt/authentik && docker compose restart

# Voir les journaux
cd /opt/authentik && docker compose logs -f
```

Configuration d'environnement: `/opt/authentik/.env`. Les données de base de données, médias et
certificats sont stockées sous `/opt/authentik`.

## Sécurité

Les ports 9000 (HTTP) et 9443 (HTTPS) sont ouverts sur l'interface réseau de la machine virtuelle.
UFW est activé et autorise ces ports ainsi que SSH (port 22). Authentik sert un certificat autosigné
par defaut sur 9443.

**Pour limiter l'accès à une adresse IP précise:**

```bash
sudo ufw delete allow 9000/tcp
sudo ufw delete allow 9443/tcp
sudo ufw allow from <trusted-ip> to any port 9000
sudo ufw allow from <trusted-ip> to any port 9443
```

**En production**, pointez un enregistrement DNS vers la machine virtuelle et placez Authentik
derriere TLS, soit avec le HTTPS intégré sur 9443 et votre propre certificat, soit avec un proxy
inverse (Caddy, nginx ou Traefik) qui termine TLS et relaie vers le port 9000.

## Prochaines étapes

- [Documentation Authentik](https://docs.goauthentik.io/)
- [Reference de configuration](https://docs.goauthentik.io/docs/install-config/configuration/)
