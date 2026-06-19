---
title: Artifactory
---

JFrog Artifactory est un gestionnaire universel de dépôts de binaires et d'artefacts. L'édition open
source stocke et relaie des paquets dans de nombreux formats, notamment Maven, Gradle, Debian et
binaires génériques, et agit comme source unique de vérité pour vos artefacts de build. L'interface
web s'exécute sur le port 8082.

:::note[Bientôt disponible]

Une image Artifactory préinstallée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer
Artifactory vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 40 Go   | 100 Go     |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Artifactory** et cliquez sur
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

## Installer Artifactory

La méthode prise en charge la plus simple est l'image Docker officielle. Installez d'abord Docker
Engine à l'aide du script d'installation officiel:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Vérifiez que Docker fonctionne:

```bash
docker version
```

Créez un répertoire hôte pour les données persistantes d'Artifactory et attribuez les droits
attendus par le conteneur (uid/gid `1030`):

```bash
sudo mkdir -p /opt/artifactory/var
sudo chown -R 1030:1030 /opt/artifactory/var
```

Exécutez le conteneur Artifactory OSS depuis le registre officiel JFrog:

```bash
sudo docker run -d \
  --name artifactory \
  --restart=always \
  -p 8081:8081 \
  -p 8082:8082 \
  -v /opt/artifactory/var:/var/opt/jfrog/artifactory \
  releases-docker.jfrog.io/jfrog/artifactory-oss:latest
```

Vérifiez que le conteneur est en cours d'exécution:

```bash
docker ps
```

## Configurer Artifactory

Artifactory prend une minute ou deux pour s'initialiser au premier démarrage. Le port 8082 sert
l'interface de la plateforme JFrog et les endpoints unifiés des dépôts, tandis que le port 8081 sert
l'API héritée. Ouvrez `http://<your-vm-ip>:8082/ui/` dans un navigateur et connectez-vous avec les
identifiants par défaut:

- Nom d'utilisateur: `admin`
- Mot de passe: `password`

Vous êtes invité à changer immédiatement le mot de passe administrateur et à définir l'URL de base.
Terminez l'assistant de configuration pour configurer vos dépôts. Pour un déploiement de production,
placez Artifactory derrière un reverse proxy tel que nginx avec un certificat TLS et servez
l'interface en HTTPS au lieu d'exposer directement le port 8082.

## Ouvrir le pare-feu

L'instance n'autorise que le SSH (port 22) en externe par défaut. Ouvrez le ou les ports dont
Artifactory a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 8082/tcp
```

## Étapes suivantes

- [Documentation Artifactory](https://jfrog.com/help/r/jfrog-artifactory-documentation)
- [Guide d'installation Artifactory](https://jfrog.com/help/r/jfrog-installation-setup-documentation/install-artifactory-single-node-with-docker)
