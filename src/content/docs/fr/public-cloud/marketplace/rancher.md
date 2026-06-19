---
title: Rancher
---

Rancher est une plateforme libre pour déployer et gérer des clusters Kubernetes à grande échelle.
Elle offre une console web unique pour provisionner, importer, superviser et exploiter des clusters
à travers les clouds, les centres de données et la périphérie, avec authentification centralisée,
RBAC et catalogues d'applications. Ce guide exécute le serveur Rancher mononœud officiel dans
Docker.

:::note[Bientôt disponible]

Une image Rancher préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** neuve depuis la marketplace et suivez les étapes ci-dessous pour installer Rancher vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 40 Go   | 80 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Rancher** et cliquez sur
   **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Les deux
   vous donnent une VM Ubuntu 24.04 propre.
2. Choisissez un forfait conforme aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour:

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Rancher

Rancher est distribué sous forme d'image Docker officielle. Installez donc d'abord Docker Engine.

Configurez le dépôt APT officiel de Docker pour Ubuntu 24.04 LTS (`noble`):

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

Installez Docker Engine:

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Exécutez le serveur Rancher en publiant l'interface web sur les ports 80 et 443 et en persistant les
données sur l'hôte:

```bash
sudo docker run -d --name rancher --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  -v /opt/rancher:/var/lib/rancher \
  --privileged \
  rancher/rancher:latest
```

## Configurer Rancher

Rancher génère un mot de passe d'amorçage à usage unique au premier démarrage. Attendez une minute
que le conteneur s'initialise, puis lisez-le dans les journaux:

```bash
sudo docker logs rancher 2>&1 | grep "Bootstrap Password:"
```

Ouvrez `https://<your-vm-ip>` dans un navigateur. Rancher présente un certificat auto-signé par
défaut. Votre navigateur affichera donc un avertissement lors de la première visite. Connectez-vous
avec le mot de passe d'amorçage, puis définissez un mot de passe administrateur permanent et
confirmez l'**URL du serveur** lorsqu'on vous le demande.

Pour un certificat de confiance, faites pointer un enregistrement DNS vers la VM et placez Rancher
derrière un reverse proxy qui termine TLS, ou fournissez votre propre certificat en suivant la
documentation Rancher.

## Ouvrir le pare-feu

L'instance n'autorise que SSH (port 22) en externe par défaut. Ouvrez les ports que Rancher sert et
ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Étapes suivantes

- [Documentation Rancher](https://ranchermanager.docs.rancher.com/)
- [Guide d'installation de Rancher](https://ranchermanager.docs.rancher.com/getting-started/installation-and-upgrade/other-installation-methods/rancher-on-a-single-node-with-docker)
