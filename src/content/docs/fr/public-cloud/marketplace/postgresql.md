---
title: PostgreSQL 17
---

PostgreSQL est une puissante base de données relationnelle-objet libre, reconnue pour sa fiabilité,
sa conformité aux standards et son extensibilité. Elle prend en charge les types de données avancés,
la recherche plein texte, JSON et un vaste éventail d'extensions.

## Logiciels inclus

| Composant  | Version   |
| ---------- | --------- |
| PostgreSQL | 17.x      |
| Ubuntu     | 24.04 LTS |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il génère un mot de
passe aléatoire pour le superutilisateur `postgres` et l'enregistre dans
`/etc/postgresql/postgres-password.txt`. Cela prend moins de 30 secondes.

Suivez la progression:

```bash
journalctl -u postgresql-first-boot.service -f
```

### 3. Récupérez les identifiants

```bash
sudo cat /etc/postgresql/postgres-password.txt
```

Ce fichier contient le mot de passe du superutilisateur `postgres`. Il est lisible uniquement par
`root`.

### 4. Connectez-vous à PostgreSQL

```bash
PG_PASS=$(sudo cat /etc/postgresql/postgres-password.txt)
psql -U postgres -h 127.0.0.1 -p 5432 -W
```

Entrez le mot de passe du fichier d'identifiants lorsqu'il est demandé.

Pour éviter l'invite de mot de passe, définissez la variable d'environnement `PGPASSWORD`:

```bash
PGPASSWORD="$PG_PASS" psql -U postgres -h 127.0.0.1
```

## Gérer PostgreSQL

```bash
# Vérifier l'état du service
systemctl status postgresql

# Redémarrer
sudo systemctl restart postgresql

# Consulter les journaux
sudo journalctl -u postgresql -f
```

Répertoire de configuration: `/etc/postgresql/17/main/`

Fichiers importants:

- `postgresql.conf`: paramètres du serveur
- `pg_hba.conf`: règles d'authentification des clients

Pour autoriser les connexions distantes, définissez `listen_addresses = '*'` dans `postgresql.conf`
et ajoutez une entrée dans `pg_hba.conf`. Redémarrez PostgreSQL et ouvrez le pare-feu seulement pour
des adresses IP précises (voir [Sécurité](#sécurité)).

## Sécurité

Le port 5432 n'est **pas** ouvert vers l'extérieur par défaut. UFW est activé et n'autorise que SSH
(port 22).

**Pour autoriser l'accès depuis une adresse IP précise:**

```bash
sudo ufw allow from <trusted-ip> to any port 5432
```

**Pour vous connecter sans ouvrir le pare-feu (recommandé), utilisez un tunnel SSH:**

```bash
# Exécutez ceci sur votre poste local
ssh -L 5432:localhost:5432 ubuntu@<your-vm-ip>

# Connectez-vous ensuite localement
psql -U postgres -h 127.0.0.1
```

:::caution

Évitez d'exposer le port 5432 à `0.0.0.0`. Limitez l'accès à des adresses IP connues ou utilisez un
tunnel SSH.

:::

## Prochaines étapes

- [Documentation PostgreSQL 17](https://www.postgresql.org/docs/17/)
- [Guide de sécurité PostgreSQL](https://www.postgresql.org/docs/current/security.html)
