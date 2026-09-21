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

:::note

Docker Engine 29 stocke les images dans le magasin d'images containerd lors d'une installation
neuve. Les images que vous téléchargez ou construisez y sont conservées plutôt que dans l'ancien
pilote de stockage, ce qui modifie la sortie de certaines commandes `docker image` et active les
images multiplateformes par défaut.

:::

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

UFW n'est pas activé par défaut dans l'image Marketplace actuelle.

Le [pare-feu ZCP](/fr/public-cloud/compute/settings/firewall/) et les règles de
[redirection de ports](/fr/public-cloud/compute/settings/port-forwarding/) restent une composante du
contrôle de l'exposition. Avant d'exposer des ports d'application, activez et configurez UFW ou un
autre pare-feu hôte. Pour utiliser UFW, autorisez SSH avant de l'activer :

```bash
sudo ufw allow 22/tcp
sudo ufw enable
sudo ufw status
```

Lorsque vous publiez des ports de conteneur avec `-p` ou `ports:` dans Compose, Docker gère ses
propres règles iptables. Ces règles peuvent contourner UFW, alors ne vous fiez pas uniquement à UFW
pour limiter un port publié.

**Pour rendre un port publié accessible uniquement sur la VM**, liez-le à l'interface de bouclage :

```bash
docker run -p 127.0.0.1:80:80 <image>
```

Ou dans `docker-compose.yml`:

```yaml
ports:
  - '127.0.0.1:80:80'
```

## Prochaines étapes

- [Documentation Docker](https://docs.docker.com/)
- [Référence Docker Compose](https://docs.docker.com/compose/)
- [Docker Hub](https://hub.docker.com/)
