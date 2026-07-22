---
title: NocoDB
---

NocoDB est une plateforme de base de données open source sans code et une solution de remplacement
d'Airtable. Elle transforme toute base de données en feuille de calcul intelligente avec des vues en
grille, galerie, kanban et formulaire, ainsi que des API REST et GraphQL. Vous pouvez l'exécuter
avec une seule commande Docker.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| NocoDB    | 2026.07.0 |
| Ubuntu    | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable            | Description                                 |
| ------------------- | ------------------------------------------- |
| `NC_ADMIN_EMAIL`    | Adresse courriel de l'administrateur NocoDB |
| `NC_ADMIN_PASSWORD` | Mot de passe de l'administrateur NocoDB     |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

NocoDB démarre automatiquement depuis son image Docker préinstallée et conserve les données sous
`/var/lib/nocodb`. Suivez la progression avec :

```bash
sudo journalctl -u nocodb-first-boot.service -f
```

Vérifiez ensuite le conteneur :

```bash
cd /opt/nocodb && docker compose ps
```

### 3. Créer le premier compte de superadministrateur

NocoDB est lié à localhost, car le premier écran de configuration n'est pas authentifié. Depuis
votre machine locale, ouvrez un tunnel SSH :

```bash
ssh -L 8080:127.0.0.1:8080 ubuntu@<your-vm-ip>
```

Ouvrez ensuite :

```text
http://127.0.0.1:8080
```

Créez le premier compte de superadministrateur dans le navigateur. L'image ne crée pas
d'identifiants de connexion partagés par défaut.

## Gérer NocoDB

NocoDB fonctionne comme un service Docker Compose dans `/opt/nocodb`.

```bash
# Check status
cd /opt/nocodb && docker compose ps

# Restart
cd /opt/nocodb && docker compose restart

# View logs
cd /opt/nocodb && docker compose logs -f
```

| Chemin                           | Fonction                                     |
| -------------------------------- | -------------------------------------------- |
| `/opt/nocodb/docker-compose.yml` | Pile Compose                                 |
| `/var/lib/nocodb/`               | Données SQLite persistantes de l'application |
| `/etc/nocodb/info.txt`           | Notes du premier démarrage                   |

## Sécurité

NocoDB écoute sur `127.0.0.1:8080`, pas sur l'interface réseau publique de la VM. UFW est activé et
n'autorise que SSH (port 22). Cela protège le premier écran non authentifié de configuration du
superadministrateur.

Utilisez le tunnel SSH des étapes de démarrage pour terminer la configuration. Pour autoriser
l'accès depuis une adresse IP de confiance après la configuration, remplacez d'abord le mappage de
port dans `/opt/nocodb/docker-compose.yml`, de `127.0.0.1:8080:8080` à `8080:8080`, redémarrez la
pile et ajoutez une règle UFW limitée :

```bash
cd /opt/nocodb && docker compose up -d
sudo ufw allow from <trusted-ip> to any port 8080
```

**Pour une utilisation en production**, gardez NocoDB derrière un proxy inverse avec un certificat
TLS de confiance au lieu d'exposer directement le port 8080.

:::caution

N'exposez pas le port 8080 avant d'avoir créé le premier compte de superadministrateur. L'écran de
configuration initial ne nécessite aucune authentification.

:::

## Étapes suivantes

- [Documentation de NocoDB](https://docs.nocodb.com/)
- [Guide d'installation de NocoDB](https://nocodb.com/docs/self-hosting/installation/quickstart)
