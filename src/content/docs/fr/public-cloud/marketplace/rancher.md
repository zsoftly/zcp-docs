---
title: Rancher
---

Rancher est une plateforme open source destinée au déploiement et à la gestion de clusters
Kubernetes à grande échelle. Elle fournit une console web unique pour provisionner, importer,
surveiller et exploiter des clusters dans les nuages, les centres de données et la périphérie, avec
une authentification, un RBAC et des catalogues d'applications centralisés. Ce guide exécute le
serveur Rancher officiel à nœud unique dans Docker.

## Logiciels inclus

| Composant | Version       |
| --------- | ------------- |
| Rancher   | 2.14.3        |
| Docker    | Latest stable |
| Ubuntu    | 24.04 LTS     |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable             | Description                        |
| -------------------- | ---------------------------------- |
| `RANCHER_HOSTNAME`   | Nom d'hôte public de Rancher       |
| `BOOTSTRAP_PASSWORD` | Mot de passe d'amorçage de Rancher |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration prépare le stockage persistant, lance Rancher avec
Docker Compose, importe les images système K3s mises en cache et attend l'API et le tableau de bord.
Cette opération peut prendre plusieurs minutes. Suivez la progression :

```bash
sudo journalctl -u rancher-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Rancher est prêt. Vous pouvez également vérifier
directement le conteneur :

```bash
cd /opt/rancher && docker compose ps
```

### 3. Récupérer les identifiants d'amorçage

Le mot de passe d'amorçage et les informations de configuration générés sont stockés dans un fichier
réservé à l'utilisateur racine :

```bash
sudo cat /etc/rancher/credentials.txt
```

| Champ             | Valeur                                                                               |
| ----------------- | ------------------------------------------------------------------------------------ |
| Nom d'utilisateur | `admin`                                                                              |
| Mot de passe      | Valeur de `BOOTSTRAP_PASSWORD`, ou générée de manière sécurisée au premier démarrage |

### 4. Accéder à l'interface Rancher

Ouvrez un navigateur et accédez à votre URL Rancher. Si vous avez défini `RANCHER_HOSTNAME` lors du
déploiement, utilisez-le et vérifiez d'abord qu'un enregistrement DNS pour ce nom d'hôte se résout
vers la VM :

```text
https://<RANCHER_HOSTNAME>
```

Si vous n'avez pas défini `RANCHER_HOSTNAME`, accédez directement à la VM par son adresse IP :

```text
https://<your-vm-ip>
```

Rancher démarre avec un certificat autosigné, votre navigateur affiche donc un avertissement.
Acceptez l'exception, connectez-vous avec le mot de passe d'amorçage, puis définissez un mot de
passe administrateur permanent.

## Gérer Rancher

Rancher fonctionne comme une pile Docker Compose dans `/opt/rancher`.

```bash
# Check status
cd /opt/rancher && docker compose ps

# Restart
cd /opt/rancher && docker compose restart

# View logs
cd /opt/rancher && docker compose logs -f
```

| Chemin                            | Fonction                                       |
| --------------------------------- | ---------------------------------------------- |
| `/opt/rancher/docker-compose.yml` | Configuration Docker Compose                   |
| `/opt/rancher/.env`               | Mot de passe d'amorçage et URL du serveur      |
| `/data/rancher/`                  | Données persistantes de Rancher                |
| `/etc/rancher/credentials.txt`    | Identifiants d'amorçage et détails du stockage |

Si la VM dispose d'un disque de données vierge supplémentaire au premier démarrage, l'image le
formate en ext4, le monte sur `/data` et y stocke les données de Rancher. Sinon, `/data/rancher`
reste sur le système de fichiers racine.

## Sécurité

Rancher utilise le port 80 pour HTTP et le port 443 pour HTTPS. UFW est activé et autorise par
défaut SSH (port 22) ainsi que les ports 80 et 443.

**Pour limiter l'accès web à une adresse IP précise :**

```bash
sudo ufw delete allow 80/tcp
sudo ufw delete allow 443/tcp
sudo ufw allow from <trusted-ip> to any port 443
```

**Pour accéder à Rancher par un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 8443:localhost:443 ubuntu@<your-vm-ip>

# Then open in your browser
https://localhost:8443
```

**Pour une utilisation en production**, placez Rancher derrière un proxy inverse avec un certificat
TLS de confiance. L'installation Docker à nœud unique est destinée au développement et aux tests.
Rancher recommande une installation Kubernetes hautement disponible pour la production.

:::caution

Modifiez le mot de passe d'amorçage lors de votre première connexion. Rancher contrôle les clusters
Kubernetes connectés, limitez donc son interface aux réseaux d'administrateurs de confiance.

:::

## Étapes suivantes

- [Documentation de Rancher](https://ranchermanager.docs.rancher.com/)
- [Guide d'installation de Rancher](https://ranchermanager.docs.rancher.com/getting-started/installation-and-upgrade/other-installation-methods/rancher-on-a-single-node-with-docker)
