---
title: Forgejo
---

Forgejo est une forge Git auto-hébergée, maintenue comme un fork communautaire de Gitea. Elle
regroupe l'hébergement de dépôts, les pull requests, le suivi des tickets, les paquets et les
actions CI dans un seul binaire Go qui tourne bien sur du matériel modeste. Cette image fournit la
ligne LTS de Forgejo, publiée chaque mois d'avril et prise en charge environ 15 mois.

## Logiciels inclus

| Composant  | Version         |
| ---------- | --------------- |
| Forgejo    | 15.0.3 (LTS)    |
| PostgreSQL | 18              |
| Docker     | Dernière stable |
| Ubuntu     | 24.04 LTS       |

Forgejo s'exécute avec PostgreSQL sous forme de pile Docker Compose. L'interface web est servie sur
le port 3000 et Git via SSH sur le port 2222, ce qui laisse le démon SSH de la VM sur le port 22.

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Variables d'environnement

Vous pouvez définir ces variables au moment du déploiement depuis la Place de marché. Laissez un
champ de mot de passe vide pour qu'une valeur aléatoire sûre soit générée automatiquement.

| Variable                 | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| `FORGEJO_ADMIN_PASSWORD` | Mot de passe du compte initial `zadmin`                            |
| `FORGEJO_DB_PASSWORD`    | Mot de passe de l'utilisateur PostgreSQL `forgejo`                 |
| `FORGEJO_DOMAIN`         | Nom d'hôte public utilisé dans les URL de clonage, par défaut l'IP |

## Démarrage

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script génère le mot de passe de la base de données, démarre Forgejo et
PostgreSQL avec Docker Compose, puis crée le compte administrateur. Comptez 1 à 2 minutes. Suivez la
progression:

```bash
journalctl -u forgejo-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Forgejo est prêt et affiche les identifiants
d'administration.

### 3. Récupérez les identifiants d'administration

Les identifiants sont aussi écrits dans un fichier réservé à root:

```bash
sudo cat /etc/forgejo/credentials.txt
```

### 4. Accédez à l'interface web

Ouvrez un navigateur à l'adresse:

```text
http://<your-vm-ip>:3000
```

Connectez-vous en tant que `zadmin` avec le mot de passe généré. L'installateur web est verrouillé,
l'instance est donc configurée dès son démarrage.

:::note

`admin` est un nom d'utilisateur réservé dans Forgejo, le compte administrateur s'appelle donc
`zadmin`.

:::

### 5. Clonez via SSH

Ajoutez votre clé publique dans **Paramètres → Clés SSH / GPG**, puis clonez sur le port 2222:

```bash
git clone ssh://git@<your-vm-ip>:2222/<owner>/<repo>.git
```

## Gérer Forgejo

Forgejo et PostgreSQL s'exécutent sous forme de pile Docker Compose dans `/opt/forgejo`.

```bash
# Vérifier l'état
cd /opt/forgejo && docker compose ps

# Redémarrer
cd /opt/forgejo && docker compose restart

# Consulter les journaux
cd /opt/forgejo && docker compose logs -f server
```

Les données des dépôts se trouvent dans `/opt/forgejo/data/forgejo` et la base de données dans
`/opt/forgejo/data/postgres`. La configuration est générée dans
`/opt/forgejo/data/forgejo/gitea/conf/app.ini`, et la plupart des réglages peuvent être remplacés
par des variables d'environnement `FORGEJO__section__KEY` dans le fichier compose.

## Sécurité

Les ports 3000 (HTTP) et 2222 (Git via SSH) sont ouverts sur l'interface réseau de la VM. UFW est
activé et autorise ces ports ainsi que SSH (port 22).

Chaque VM génère ses propres `SECRET_KEY` et `INTERNAL_TOKEN` au premier démarrage de Forgejo, si
bien qu'aucun déploiement ne partage ses secrets de chiffrement avec un autre.

:::caution

Ne copiez pas `app.ini` d'une VM à l'autre et ne changez pas `SECRET_KEY` après usage. Les secrets
de double authentification et les identifiants stockés deviendraient impossibles à déchiffrer.

:::

**Pour restreindre l'accès à une adresse IP précise:**

```bash
sudo ufw delete allow 3000/tcp
sudo ufw allow from <trusted-ip> to any port 3000
```

**En production**, pointez un enregistrement DNS vers la VM et placez Forgejo derrière un reverse
proxy TLS (Caddy, nginx ou Traefik), puis définissez `FORGEJO_DOMAIN` pour que les URL de clonage
correspondent.

## Prochaines étapes

- [Documentation Forgejo](https://forgejo.org/docs/latest/)
- [Guide d'administration Forgejo](https://forgejo.org/docs/latest/admin/)
- [Forgejo Actions](https://forgejo.org/docs/latest/user/actions/)
