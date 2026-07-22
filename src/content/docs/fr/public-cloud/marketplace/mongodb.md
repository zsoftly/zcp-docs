---
title: MongoDB 8.0
---

MongoDB est une base de données NoSQL polyvalente orientée documents qui stocke les données sous
forme de documents flexibles semblables à JSON. Elle convient bien aux applications qui ont besoin
de requêtes riches, d'une mise à l'échelle horizontale ou de schémas qui évoluent au fil du temps.

## Logiciels inclus

| Composant         | Version   |
| ----------------- | --------- |
| MongoDB Community | 8.0.x     |
| Ubuntu            | 24.04 LTS |

## Variables d'environnement

Vous pouvez les définir facultativement lors du déploiement de MongoDB depuis la marketplace.
Laissez un champ vide pour qu'une valeur aléatoire sécurisée soit générée automatiquement.

| Variable                     | Description                                  |
| ---------------------------- | -------------------------------------------- |
| `MONGO_INITDB_ROOT_USERNAME` | Nom d'utilisateur racine MongoDB             |
| `MONGO_INITDB_ROOT_PASSWORD` | Mot de passe de l'utilisateur racine MongoDB |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il crée le
superutilisateur défini par `MONGO_INITDB_ROOT_USERNAME`, dont la valeur par défaut est `admin`,
avec le mot de passe configuré ou généré, puis active l'authentification. Cette opération prend
moins de 60 secondes.

Suivez la progression :

```bash
journalctl -u mongodb-first-boot.service -f
```

Attendez que le service se termine, puis déconnectez-vous et reconnectez-vous. À la connexion, le
MOTD indique la version de MongoDB avec l'état `READY` lorsque la configuration est terminée.

### 3. Récupérer les identifiants

```bash
sudo cat /etc/mongodb/credentials.txt
```

Ce fichier contient le nom d'utilisateur administrateur, le mot de passe et les instructions de
connexion. Seul l'utilisateur racine peut le lire. La commande suivante lit le nom d'utilisateur
configuré dans le fichier. `mongosh` demande ensuite le mot de passe afin qu'il n'apparaisse pas
dans la liste des processus.

### 4. Se connecter à MongoDB

```bash
MONGO_USER=$(sudo awk '/^Username:/{print $NF}' /etc/mongodb/credentials.txt)
mongosh -u "$MONGO_USER" --authenticationDatabase admin
```

Sortie attendue :

```text
test>
```

## Gérer MongoDB

```bash
# Check service status
systemctl status mongod

# Restart
sudo systemctl restart mongod

# View logs
sudo journalctl -u mongod -f
```

Fichier de configuration : `/etc/mongod.conf`

## Sécurité

Le port 27017 n'est **pas** ouvert vers l'extérieur par défaut. UFW est activé et n'autorise que SSH
(port 22).

**Pour autoriser l'accès depuis une adresse IP précise :**

```bash
sudo ufw allow from <trusted-ip> to any port 27017
```

**Pour vous connecter sans ouvrir le pare-feu, ce qui est recommandé, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 27017:localhost:27017 ubuntu@<your-vm-ip>

# Then connect locally using the username from /etc/mongodb/credentials.txt
mongosh -u <username> --authenticationDatabase admin
```

:::caution

Évitez d'exposer le port 27017 à `0.0.0.0`. Limitez l'accès aux adresses IP connues ou utilisez un
tunnel SSH.

:::

## Étapes suivantes

- [Documentation de MongoDB](https://www.mongodb.com/docs/)
- [Référence de mongosh](https://www.mongodb.com/docs/mongodb-shell/)
- [Liste de vérification de sécurité](https://www.mongodb.com/docs/manual/administration/security-checklist/)
