---
title: MongoDB 8.0
---

MongoDB est une base de données NoSQL généraliste orientée documents qui stocke les données sous
forme de documents flexibles semblables à JSON. Elle convient bien aux applications qui exigent des
requêtes riches, une mise à l'échelle horizontale ou des schémas qui évoluent dans le temps.

## Logiciels inclus

| Composant         | Version   |
| ----------------- | --------- |
| MongoDB Community | 8.0.x     |
| Ubuntu            | 24.04 LTS |

## Variables d'environnement

Vous pouvez définir ces valeurs lors du déploiement de MongoDB depuis la marketplace. Laissez un
champ vide pour générer automatiquement une valeur aléatoire sécurisée.

| Variable                     | Description                       |
| ---------------------------- | --------------------------------- |
| `MONGO_INITDB_ROOT_USERNAME` | Nom d'utilisateur root de MongoDB |
| `MONGO_INITDB_ROOT_PASSWORD` | Mot de passe root de MongoDB      |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il crée un
superutilisateur `admin` avec un mot de passe généré aléatoirement et active l'authentification.
Cela prend moins de 60 secondes.

Suivez la progression:

```bash
journalctl -u mongodb-first-boot.service -f
```

Attendez que le service se termine, puis déconnectez-vous et reconnectez-vous. Le MOTD affiché à la
connexion indique `MONGODB 8.0.x — READY` lorsque la configuration est terminée.

### 3. Récupérez les identifiants

```bash
sudo cat /etc/mongodb/credentials.txt
```

Ce fichier contient le nom d'utilisateur administrateur, le mot de passe et les instructions de
connexion. Il est lisible uniquement par `root`.

### 4. Connectez-vous à MongoDB

```bash
MONGO_PASS=$(sudo awk '/^Password:/{print $NF}' /etc/mongodb/credentials.txt)
mongosh -u admin -p "$MONGO_PASS" --authenticationDatabase admin
```

Sortie attendue:

```
test>
```

## Gérer MongoDB

```bash
# Vérifier l'état du service
systemctl status mongod

# Redémarrer
sudo systemctl restart mongod

# Consulter les journaux
sudo journalctl -u mongod -f
```

Fichier de configuration: `/etc/mongod.conf`

## Sécurité

Le port 27017 n'est **pas** ouvert vers l'extérieur par défaut. UFW est activé et n'autorise que SSH
(port 22).

**Pour autoriser l'accès depuis une adresse IP précise:**

```bash
sudo ufw allow from <trusted-ip> to any port 27017
```

**Pour vous connecter sans ouvrir le pare-feu (recommandé), utilisez un tunnel SSH:**

```bash
# Exécutez ceci sur votre poste local
ssh -L 27017:localhost:27017 ubuntu@<your-vm-ip>

# Connectez-vous ensuite localement
mongosh -u admin -p "<password>" --authenticationDatabase admin
```

:::caution

Évitez d'exposer le port 27017 à `0.0.0.0`. Limitez l'accès à des adresses IP connues ou utilisez un
tunnel SSH.

:::

## Prochaines étapes

- [Documentation MongoDB](https://www.mongodb.com/docs/)
- [Référence mongosh](https://www.mongodb.com/docs/mongodb-shell/)
- [Liste de vérification de sécurité](https://www.mongodb.com/docs/manual/administration/security-checklist/)
