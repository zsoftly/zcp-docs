---
title: Keycloak
---

Keycloak est une plateforme open source de gestion des identités et des accès. Elle fournit le SSO,
la fédération d'utilisateurs, la connexion sociale ou par courtier d'identité, et des autorisations
fines avec des protocoles standard comme OpenID Connect, OAuth 2.0 et SAML.

## Logiciels inclus

| Composant  | Version         |
| ---------- | --------------- |
| Keycloak   | 26.0.7          |
| PostgreSQL | 16              |
| Docker     | Dernière stable |
| Ubuntu     | 24.04 LTS       |

Keycloak s'exécute en mode production (`start`) avec une base PostgreSQL, sous forme de pile Docker
Compose.

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Variables d'environnement

Vous pouvez les définir au déploiement de Keycloak depuis le Marketplace. Laissez un champ de mot de
passe vide pour générer automatiquement une valeur aléatoire sécurisée.

| Variable                  | Description                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `KEYCLOAK_ADMIN`          | Nom d'utilisateur du compte administrateur initial. Par défaut: `admin`                    |
| `KEYCLOAK_ADMIN_PASSWORD` | Mot de passe du compte administrateur initial                                              |
| `KC_HOSTNAME`             | Nom d'hôte public ou IP depuis lequel Keycloak est servi. Par défaut: l'IP privée de la VM |

## Démarrage

### 1. Se connecter à la VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, un script génère les mots de passe administrateur et base de données, écrit le
fichier d'environnement, puis démarre la pile avec Docker Compose. Cela prend 1 à 2 minutes. Suivez
la progression:

```bash
journalctl -u keycloak-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Keycloak est prêt et affiche les identifiants
administrateur.

### 3. Récupérer les identifiants administrateur

Les identifiants sont aussi écrits dans un fichier réservé à root:

```bash
sudo cat /etc/keycloak/credentials.txt
```

### 4. Accéder à la console d'administration

Ouvrez un navigateur et allez à:

```text
http://<your-vm-ip>:8080
```

Connectez-vous avec l'utilisateur `admin` et le mot de passe généré.

| Champ             | Valeur                                 |
| ----------------- | -------------------------------------- |
| Nom d'utilisateur | `admin`                                |
| Mot de passe      | Depuis `/etc/keycloak/credentials.txt` |

## Gérer Keycloak

Keycloak s'exécute comme pile Docker Compose dans `/opt/keycloak`.

```bash
# Vérifier l'état
cd /opt/keycloak && docker compose ps

# Redémarrer
cd /opt/keycloak && docker compose restart

# Voir les journaux
cd /opt/keycloak && docker compose logs -f
```

Configuration d'environnement: `/opt/keycloak/.env`. Les données PostgreSQL sont stockées sous
`/opt/keycloak/data/postgres` et ne sont pas exposées hors du réseau Docker.

## Sécurité

Le port 8080 est ouvert sur l'interface réseau de la VM. UFW est activé et autorise SSH (port 22) et
Keycloak (port 8080). Keycloak sert HTTP en clair sur 8080.

:::caution

`KC_HOSTNAME` prend par défaut l'IP privée de la VM. Si vous associez ensuite une IP publique, un
nom DNS ou un proxy inverse, définissez `KC_HOSTNAME` au déploiement (ou modifiez
`/opt/keycloak/.env` et exécutez `cd /opt/keycloak && docker compose up -d`), sinon les
vérifications de nom d'hôte en mode production peuvent rejeter les requêtes provenant de la nouvelle
adresse.

:::

**En production**, placez Keycloak derrière un proxy inverse (Caddy, nginx ou Traefik) qui termine
TLS sur le port 443 et relaie vers le port 8080, puis définissez `KC_PROXY_HEADERS=xforwarded` dans
`/opt/keycloak/.env`. Limitez l'accès direct au port 8080:

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

## Prochaines étapes

- [Documentation Keycloak](https://www.keycloak.org/documentation)
- [Configurer le nom d'hôte](https://www.keycloak.org/server/hostname)
- [Configuration avec proxy inverse](https://www.keycloak.org/server/reverseproxy)
