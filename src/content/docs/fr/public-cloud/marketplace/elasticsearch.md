---
title: Elasticsearch 8
---

Elasticsearch est un moteur distribué de recherche et d'analyse RESTful basé sur Apache Lucene. Il
est utilisé pour la recherche plein texte, l'agrégation de journaux, la surveillance applicative et
l'analyse de données en temps réel.

## Logiciels inclus

| Composant     | Version   |
| ------------- | --------- |
| Elasticsearch | 8.x       |
| Ubuntu        | 24.04 LTS |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il:

- efface les données préexistantes afin que le cluster s'initialise proprement;
- définit le nom du cluster selon le nom d'hôte de la VM;
- démarre Elasticsearch et attend qu'il soit prêt;
- réinitialise le mot de passe du superutilisateur `elastic` avec une valeur générée aléatoirement;
- enregistre le mot de passe dans `/etc/elasticsearch/elastic-password.txt`.

Elasticsearch 8 prend de 60 à 90 secondes pour démarrer avant que la réinitialisation du mot de
passe puisse s'exécuter. La durée totale du premier démarrage est d'environ 2 à 3 minutes.

Suivez la progression:

```bash
journalctl -u elasticsearch-first-boot.service -f
```

### 3. Récupérez les identifiants

```bash
sudo cat /etc/elasticsearch/elastic-password.txt
```

Ce fichier contient le mot de passe du superutilisateur `elastic`. Il est lisible uniquement par
`root`.

### 4. Connectez-vous à Elasticsearch

Elasticsearch 8 utilise HTTPS avec un certificat autosigné par défaut. Utilisez `-k` pour ignorer la
vérification du certificat lors des connexions locales, ou utilisez le certificat CA situé à
`/etc/elasticsearch/certs/http_ca.crt`.

```bash
ES_PASS=$(sudo cat /etc/elasticsearch/elastic-password.txt)
curl -k -u elastic:"$ES_PASS" https://localhost:9200
```

Sortie attendue:

```json
{
  "name" : "your-vm-hostname",
  "cluster_name" : "your-vm-hostname",
  "version" : { ... },
  "tagline" : "You Know, for Search"
}
```

## Gérer Elasticsearch

```bash
# Vérifier l'état du service
systemctl status elasticsearch

# Redémarrer
sudo systemctl restart elasticsearch

# Consulter les journaux
sudo journalctl -u elasticsearch -f
```

Répertoire de configuration: `/etc/elasticsearch/`

Fichiers importants:

- `elasticsearch.yml`: paramètres du cluster, du réseau et du noeud
- `jvm.options.d/`: paramètres du tas JVM et du ramasse-miettes

**Pour ajuster la taille du tas**, créez un fichier dans `/etc/elasticsearch/jvm.options.d/`:

```
-Xms2g
-Xmx2g
```

Définissez le tas à au plus la moitié de la RAM disponible de la VM. Redémarrez Elasticsearch après
les changements.

## Sécurité

Les ports 9200 (API REST) et 9300 (transport entre noeuds) ne sont **pas** ouverts vers l'extérieur
par défaut. UFW est activé et n'autorise que SSH (port 22).

**Pour autoriser l'accès à l'API REST depuis une adresse IP précise:**

```bash
sudo ufw allow from <trusted-ip> to any port 9200
```

**Pour vous connecter sans ouvrir le pare-feu (recommandé), utilisez un tunnel SSH:**

```bash
# Exécutez ceci sur votre poste local
ssh -L 9200:localhost:9200 ubuntu@<your-vm-ip>

# Interrogez ensuite localement
curl -k -u elastic:"<password>" https://localhost:9200
```

:::caution

Elasticsearch 8 active la sécurité par défaut. L'utilisateur `elastic` dispose d'un accès complet au
cluster. Créez des utilisateurs à portée de rôle pour chaque application.

:::

## Prochaines étapes

- [Documentation Elasticsearch](https://www.elastic.co/docs/current/elasticsearch)
- [Guide de gestion des index](https://www.elastic.co/docs/current/elasticsearch/index-modules)
- [Vue d'ensemble de la sécurité](https://www.elastic.co/docs/current/elasticsearch/elasticsearch-security)
