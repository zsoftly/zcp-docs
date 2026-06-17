---
title: MySQL 8.4
---

MySQL est l'une des bases de données relationnelles libres les plus déployées au monde. Cette image
fournit MySQL 8.4 LTS, une version à support à long terme destinée aux charges de travail de
production.

## Logiciels inclus

| Composant    | Version     |
| ------------ | ----------- |
| MySQL Server | 8.4.x (LTS) |
| Ubuntu       | 24.04 LTS   |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il génère un mot de
passe `root` aléatoire et l'enregistre dans `/etc/mysql/mysql-root-password.txt`. Cela prend moins
de 30 secondes.

Suivez la progression:

```bash
journalctl -u mysql-first-boot.service -f
```

### 3. Récupérez les identifiants

```bash
sudo cat /etc/mysql/mysql-root-password.txt
```

Ce fichier contient le mot de passe `root`. Il est lisible uniquement par `root`.

### 4. Connectez-vous à MySQL

```bash
ROOT_PASS=$(sudo cat /etc/mysql/mysql-root-password.txt)
mysql -u root -p"$ROOT_PASS"
```

## Gérer MySQL

```bash
# Vérifier l'état du service
systemctl status mysql

# Redémarrer
sudo systemctl restart mysql

# Consulter les journaux
sudo journalctl -u mysql -f
```

Répertoire de configuration: `/etc/mysql/mysql.conf.d/`

Pour autoriser les connexions distantes, modifiez `/etc/mysql/mysql.conf.d/mysqld.cnf` et changez
`bind-address` de `127.0.0.1` à `0.0.0.0`, puis redémarrez MySQL. Ouvrez le pare-feu seulement pour
des adresses IP précises (voir [Sécurité](#sécurité)).

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
mysql -u root -p"<root-password>"
```

:::caution

Évitez d'exposer le port 3306 à `0.0.0.0`. Limitez l'accès à des adresses IP connues ou utilisez un
tunnel SSH.

:::

## Prochaines étapes

- [Documentation MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/)
- [Guide de sécurité MySQL](https://dev.mysql.com/doc/refman/8.4/en/security.html)
