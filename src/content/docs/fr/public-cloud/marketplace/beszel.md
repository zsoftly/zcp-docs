---
title: Beszel
---

Beszel est une plateforme légère de surveillance de serveurs avec historique des données,
statistiques Docker et alertes configurables. Elle comporte deux parties, un **hub** qui fournit le
tableau de bord web sur le port 8090 et un **agent** qui s'exécute sur chaque machine surveillée et
transmet les métriques système au hub. Ce guide installe le hub sur cette VM et ajoute un agent pour
surveiller la même machine.

## Logiciels inclus

| Composant    | Version   |
| ------------ | --------- |
| Beszel Hub   | 0.18.7    |
| Beszel Agent | 0.18.7    |
| Ubuntu       | 24.04 LTS |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration lance le hub Beszel. Cette opération prend moins
d'une minute. Suivez la progression :

```bash
journalctl -u beszel-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Beszel est prêt.

### 3. Vérifier que Beszel fonctionne

```bash
cd /opt/beszel
docker compose ps
curl -fsS http://127.0.0.1:8090/ > /dev/null
```

### 4. Créer le premier administrateur

Beszel est lié à localhost afin de protéger son assistant non authentifié de création du premier
administrateur. Depuis votre machine locale, démarrez un tunnel SSH :

```bash
ssh -L 8090:127.0.0.1:8090 ubuntu@<your-vm-ip>
```

Ouvrez ensuite `http://127.0.0.1:8090` et créez le premier compte administrateur. L'image ne crée
pas de mot de passe administrateur partagé par défaut.

### 5. Ajouter l'agent local

L'image de l'agent est incluse, mais l'agent ne démarre pas par défaut. Dans l'interface Beszel,
ajoutez cette VM comme système et copiez le jeton et la clé publique générés. Ajoutez ces valeurs à
`/opt/beszel/docker-compose.yml`, puis démarrez le profil de l'agent.

```bash
cd /opt/beszel
docker compose --profile agent up -d beszel-agent
```

## Gérer Beszel

```bash
# Check container status
cd /opt/beszel && docker compose ps

# Restart
cd /opt/beszel && docker compose restart

# View logs
cd /opt/beszel && docker compose logs -f
```

| Chemin                           | Fonction                     |
| -------------------------------- | ---------------------------- |
| `/opt/beszel/docker-compose.yml` | Configuration Docker Compose |
| `/var/lib/beszel/`               | Données du hub               |
| `/var/lib/beszel-agent/`         | Données de l'agent local     |

## Sécurité

Le port 8090 est lié à localhost. UFW est activé et n'autorise par défaut que SSH (port 22).
Utilisez le tunnel SSH ci-dessus pour créer le premier administrateur en toute sécurité.

Pour rendre le hub accessible depuis un réseau de confiance après la configuration, remplacez sa
liaison de port Docker Compose `127.0.0.1:8090:8090` par `8090:8090`, puis autorisez une adresse IP
de confiance :

```bash
sudo ufw allow from <trusted-ip> to any port 8090
```

**Pour une utilisation en production**, gardez Beszel lié à localhost et placez-le derrière un proxy
inverse afin de le servir sur le port 443 avec un certificat TLS.

:::caution

L'assistant de création du premier administrateur n'est pas authentifié tant que vous n'avez pas
créé le premier compte. Terminez la configuration par le tunnel SSH avant d'exposer le hub.

:::

## Étapes suivantes

- [Documentation de Beszel](https://beszel.dev/guide/getting-started)
- [Guide d'installation du hub Beszel](https://beszel.dev/guide/hub-installation)
