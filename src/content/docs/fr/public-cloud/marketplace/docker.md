---
title: Docker
---

Docker est une plateforme libre pour créer, distribuer et exécuter des applications dans des
conteneurs. Cette image fournit un environnement Ubuntu 24.04 propre avec Docker CE et Docker
Compose préinstallés, prêt pour déployer toute charge de travail conteneurisée.

## Logiciels inclus

| Composant             | Version         |
| --------------------- | --------------- |
| Docker CE             | Dernière stable |
| Plugin Docker Compose | Dernière stable |
| Ubuntu                | 24.04 LTS       |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Vérifiez que Docker est en cours d'exécution

Aucune configuration de premier démarrage n'est requise. Docker démarre immédiatement après le
démarrage de la VM.

```bash
docker version
docker compose version
```

L'utilisateur `ubuntu` est déjà ajouté au groupe `docker`; vous pouvez donc exécuter les commandes
Docker sans `sudo`.

### 3. Exécutez votre premier conteneur

```bash
docker run --rm hello-world
```

### 4. Déployez avec Docker Compose

Créez un fichier `docker-compose.yml` et démarrez votre pile:

```bash
docker compose up -d
```

## Gérer Docker

```bash
# Lister les conteneurs en cours
docker ps

# Consulter les journaux d'un conteneur
docker logs <container-name> -f

# Arrêter un conteneur
docker stop <container-name>

# Télécharger la dernière image
docker pull <image-name>
```

```bash
# Vérifier l'état du service Docker
systemctl status docker

# Redémarrer Docker
sudo systemctl restart docker
```

Les fichiers journaux Docker sont limités à 10 Mo par fichier, avec un maximum de trois fichiers en
rotation, afin d'éviter l'épuisement de l'espace disque.

## Sécurité

Aucun port d'application n'est ouvert par défaut. UFW est activé et n'autorise que SSH (port 22).

Lorsque vous publiez des ports de conteneur avec `-p` ou `ports:` dans Compose, Docker gère ses
propres règles iptables. Ces règles contournent UFW; un port publié (par exemple `-p 80:80`) est
donc accessible depuis l'extérieur, quelle que soit votre configuration UFW.

**Pour limiter un port publié à une adresse IP précise**, liez-le explicitement:

```bash
docker run -p <trusted-ip>:80:80 <image>
```

Ou dans `docker-compose.yml`:

```yaml
ports:
  - '<trusted-ip>:80:80'
```

## Prochaines étapes

- [Documentation Docker](https://docs.docker.com/)
- [Référence Docker Compose](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
