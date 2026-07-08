---
title: Supabase
---

Supabase est une alternative open source à Firebase basée sur PostgreSQL. Elle regroupe une base
Postgres, l'authentification, des API REST et GraphQL instantanées, les abonnements en temps réel,
le stockage et un tableau de bord Studio dans une pile auto-hébergeable. Studio et les API sont
servis par la passerelle Kong sur le port 8000.

## Logiciels inclus

| Composant      | Version            |
| -------------- | ------------------ |
| Supabase       | Pile auto-hébergée |
| PostgreSQL     | 17                 |
| Docker         | Dernière stable    |
| Docker Compose | Dernière stable    |
| Ubuntu         | 24.04 LTS          |

La pile inclut Studio, la passerelle API Kong, Auth (GoTrue), PostgREST, Realtime, Storage et
postgres-meta, le tout sur PostgreSQL 17.

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 30 Go   | 80 Go      |

## Variables d'environnement

Vous pouvez les définir au déploiement de Supabase depuis la Marketplace. Laissez un champ de mot de
passe vide pour générer automatiquement une valeur aléatoire sécurisée.

| Variable             | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| `SITE_URL`           | URL publique de l'instance Supabase et du tableau de bord Studio |
| `POSTGRES_PASSWORD`  | Mot de passe de la base PostgreSQL                               |
| `DASHBOARD_PASSWORD` | Mot de passe de connexion au tableau de bord Studio              |

## Démarrage

### 1. Se connecter à la machine virtuelle

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, un script génère le mot de passe de base de données, le secret JWT, les clés
API et les identifiants Studio, puis télécharge les images de conteneurs et démarre la pile. Le
téléchargement est volumineux. Cela prend environ 15 à 20 minutes. Suivez la progression:

```bash
journalctl -u supabase-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Supabase est prêt.

### 3. Récupérer les identifiants du tableau de bord et les clés API

Le nom d'utilisateur et le mot de passe Studio, ainsi que les clés API `anon` et `service_role`,
sont écrits dans un fichier réservé à root:

```bash
sudo cat /root/.credentials/supabase.txt
```

### 4. Accéder au tableau de bord Studio

Ouvrez un navigateur et allez à:

```text
http://<your-vm-ip>:8000
```

Connectez-vous avec le nom d'utilisateur `supabase` et le mot de passe généré. Les API REST et Auth
sont servies par la même passerelle à `http://<your-vm-ip>:8000/rest/v1/` et
`http://<your-vm-ip>:8000/auth/v1/`.

## Gérer Supabase

Supabase s'exécute comme pile Docker Compose dans `/data/supabase`.

```bash
# Vérifier l'état
cd /data/supabase && docker compose ps

# Redémarrer
cd /data/supabase && docker compose restart

# Voir les journaux
cd /data/supabase && docker compose logs -f
```

Configuration d'environnement: `/data/supabase/.env`. Les données de base de données et de stockage
sont stockées sous `/data/supabase/volumes`.

## Sécurité

Les ports 8000, 80 et 443 sont ouverts sur l'interface réseau de la machine virtuelle. UFW est
activé et autorise ces ports ainsi que SSH (port 22). L'accès PostgreSQL direct (5432) n'est pas
exposé.

Changez le mot de passe du tableau de bord Studio après la première connexion. **En production**,
définissez `SUPABASE_PUBLIC_URL`, `API_EXTERNAL_URL` et `SITE_URL` dans `/data/supabase/.env` avec
votre domaine, redémarrez la pile, puis placez Supabase derrière un proxy inverse comme nginx avec
un certificat TLS afin que Studio et les API soient servis en HTTPS au lieu d'exposer directement le
port 8000.

## Prochaines étapes

- [Documentation Supabase](https://supabase.com/docs)
- [Guide d'auto-hébergement](https://supabase.com/docs/guides/self-hosting/docker)
