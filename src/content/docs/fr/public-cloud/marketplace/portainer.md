---
title: Portainer
---

Portainer est une interface de gestion légère pour les environnements Docker et Kubernetes. Elle
vous permet de déployer des conteneurs, de gérer les images, les volumes et les réseaux, et de
surveiller vos piles depuis une seule console web. L'interface s'exécute sur le port 9443 en HTTPS
(port 9000 pour le HTTP simple).

:::note[Bientôt disponible]

Une image Portainer préinstallée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Portainer
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Portainer** et cliquez sur
   **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Les deux
   vous donnent une VM Ubuntu 24.04 propre.
2. Choisissez un plan répondant aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour:

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Portainer

Portainer s'exécute en tant que conteneur Docker. Installez donc d'abord Docker Engine à l'aide du
script d'installation officiel:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Vérifiez que Docker fonctionne:

```bash
docker version
```

Créez un volume pour les données persistantes de Portainer:

```bash
docker volume create portainer_data
```

Exécutez le conteneur du serveur Portainer CE:

```bash
sudo docker run -d \
  -p 8000:8000 \
  -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:lts
```

Vérifiez que le conteneur est en cours d'exécution:

```bash
docker ps
```

## Configurer Portainer

Portainer sert l'interface sur le port 9443 en HTTPS avec un certificat auto-signé. Ouvrez
`https://<your-vm-ip>:9443` dans un navigateur dans les quelques minutes suivant le démarrage du
conteneur. Pour des raisons de sécurité, Portainer verrouille la configuration initiale si aucun
compte administrateur n'est créé peu après le premier démarrage.

Au premier chargement, créez votre compte administrateur en définissant un nom d'utilisateur et un
mot de passe fort. Portainer se connecte ensuite à l'environnement Docker local via le socket monté,
de sorte que vos conteneurs, images et volumes apparaissent immédiatement. Le certificat auto-signé
déclenche un avertissement du navigateur. Pour un déploiement de production, placez Portainer
derrière un reverse proxy tel que nginx avec un certificat TLS de confiance.

## Ouvrir le pare-feu

L'instance n'autorise que le SSH (port 22) en externe par défaut. Ouvrez le ou les ports dont
Portainer a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 9443/tcp
```

## Étapes suivantes

- [Documentation Portainer](https://docs.portainer.io/)
- [Guide d'installation Portainer](https://docs.portainer.io/start/install-ce/server/docker/linux)
