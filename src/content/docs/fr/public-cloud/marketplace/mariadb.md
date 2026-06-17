---
title: MariaDB 11.4
---

MariaDB est un système libre de gestion de bases de données relationnelles et un remplacement direct
de MySQL. Il est largement utilisé pour les applications Web, les systèmes de gestion de contenu et
le stockage de données généraliste.

## Logiciels inclus

| Composant      | Version      |
| -------------- | ------------ |
| MariaDB Server | 11.4.x (LTS) |
| Ubuntu         | 24.04 LTS    |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il:

- définit un mot de passe `root` aléatoire;
- supprime les utilisateurs anonymes et la base de données de test;
- crée une base de données `app` et un utilisateur `app` avec un mot de passe aléatoire;
- écrit tous les identifiants dans `/etc/mariadb/credentials.txt`;
- configure `/root/.my.cnf` afin que `root` puisse se connecter sans saisir de mot de passe.

Cela prend moins de 30 secondes. Suivez la progression:

```bash
journalctl -u mariadb-first-boot.service -f
```

### 3. Récupérez les identifiants

```bash
sudo cat /etc/mariadb/credentials.txt
```

Ce fichier contient le mot de passe `root`, le nom de la base de données applicative, l'utilisateur
applicatif et son mot de passe. Il est lisible uniquement par `root`.

### 4. Connectez-vous à MariaDB

**Comme `root` (sans invite de mot de passe):**

```bash
sudo mariadb
```

**Comme utilisateur applicatif:**

```bash
APP_PASS=$(sudo awk '/^Application password:/{print $NF}' /etc/mariadb/credentials.txt)
mariadb -u app -p"$APP_PASS" app
```

## Gérer MariaDB

```bash
# Vérifier l'état du service
systemctl status mariadb

# Redémarrer
sudo systemctl restart mariadb

# Consulter les journaux
sudo journalctl -u mariadb -f
```

Répertoire de configuration: `/etc/mysql/mariadb.conf.d/`

Pour autoriser les connexions distantes, modifiez `/etc/mysql/mariadb.conf.d/50-server.cnf` et
changez `bind-address` de `127.0.0.1` à `0.0.0.0`, puis redémarrez MariaDB. Ouvrez le pare-feu
seulement pour des adresses IP précises (voir [Sécurité](#sécurité)).

## Sécurité

Le port 3306 n'est **pas** ouvert vers l'extérieur par défaut. UFW est activé et n'autorise que SSH
(port 22).

**Pour autoriser l'accès depuis une adresse IP précise:**

```bash
sudo ufw allow from <trusted-ip> to any port 3306
```

**Pour vous connecter sans ouvrir le pare-feu (recommandé), utilisez un tunnel SSH:**

```bash
# Exécutez ceci sur votre poste local
ssh -L 3306:localhost:3306 ubuntu@<your-vm-ip>

# Connectez-vous ensuite localement
mariadb -u app -p"<app-password>" app
```

:::caution

Évitez d'exposer le port 3306 à `0.0.0.0`. Limitez l'accès à des adresses IP connues ou utilisez un
tunnel SSH.

:::

## Prochaines étapes

- [Documentation MariaDB](https://mariadb.com/kb/en/)
- [Guide de renforcement de la sécurité MariaDB](https://mariadb.com/kb/en/securing-mariadb/)
