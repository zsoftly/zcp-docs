---
title: Valkey 9.0
---

Valkey est un magasin de données en mémoire libre et haute performance, compatible avec Redis. Il
est couramment utilisé pour la mise en cache, le stockage de sessions, les classements en temps
réel, la messagerie pub/sub et les files de tâches.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| Valkey    | 9.0.x     |
| Ubuntu    | 24.04 LTS |

## Variables d'environnement

Vous pouvez définir ces valeurs lors du déploiement de Valkey depuis la marketplace. Laissez un
champ vide pour générer automatiquement une valeur aléatoire sécurisée.

| Variable          | Description                                    |
| ----------------- | ---------------------------------------------- |
| `VALKEY_PASSWORD` | Mot de passe requis pour se connecter à Valkey |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il génère un mot de
passe aléatoire et configure Valkey pour exiger l'authentification à chaque connexion. Cela prend
moins de 30 secondes.

Suivez la progression:

```bash
journalctl -u valkey-first-boot.service -f
```

### 3. Récupérez les identifiants

```bash
sudo cat /etc/valkey/credentials.txt
```

Ce fichier contient le mot de passe et les instructions de connexion. Il est lisible uniquement par
`root`.

### 4. Connectez-vous à Valkey

```bash
VALKEY_PASS=$(sudo awk '/^Valkey password:/{print $NF}' /etc/valkey/credentials.txt)
valkey-cli -a "$VALKEY_PASS"
```

Confirmez la connexion:

```
127.0.0.1:6379> PING
PONG
```

## Gérer Valkey

```bash
# Vérifier l'état du service
systemctl status valkey

# Redémarrer
sudo systemctl restart valkey

# Consulter les journaux
sudo journalctl -u valkey -f
```

Fichiers de configuration:

| Fichier                      | Rôle                                   |
| ---------------------------- | -------------------------------------- |
| `/etc/valkey/valkey.conf`    | Configuration principale               |
| `/etc/valkey/99-memory.conf` | Limite mémoire et politique d'éviction |

**Pour définir une limite mémoire**, modifiez `/etc/valkey/99-memory.conf`:

```
maxmemory 512mb
maxmemory-policy noeviction
```

Redémarrez ensuite Valkey. La politique par défaut est `noeviction`, ce qui retourne une erreur
lorsque la mémoire est pleine au lieu d'évincer silencieusement des données.

## Sécurité

Le port 6379 n'est **pas** ouvert vers l'extérieur par défaut. UFW est activé et n'autorise que SSH
(port 22).

**Pour autoriser l'accès depuis une adresse IP précise:**

```bash
sudo ufw allow from <trusted-ip> to any port 6379
```

**Pour vous connecter sans ouvrir le pare-feu (recommandé), utilisez un tunnel SSH:**

```bash
# Exécutez ceci sur votre poste local
ssh -L 6379:localhost:6379 ubuntu@<your-vm-ip>

# Connectez-vous ensuite localement
valkey-cli -a "<password>"
```

:::caution

Évitez d'exposer le port 6379 à `0.0.0.0`. Valkey est un magasin en mémoire. Un accès non autorisé
expose toutes les données en cache. Limitez l'accès à des adresses IP connues ou utilisez un tunnel
SSH.

:::

## Prochaines étapes

- [Documentation Valkey](https://valkey.io/docs/)
- [Référence de configuration Valkey](https://valkey.io/topics/config/)
- [Référence des commandes Valkey](https://valkey.io/commands/)
