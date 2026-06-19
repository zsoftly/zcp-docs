---
title: ERPNext
---

ERPNext est une suite ERP libre et open source construite sur le framework Frappe. Elle couvre la
comptabilité, l'inventaire, la fabrication, le CRM, les RH, les projets et bien plus dans une seule
application web. La façon la plus simple de l'exécuter est avec les images officielles
`frappe_docker` via Docker Compose.

:::note[Bientôt disponible]

Une image ERPNext préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer ERPNext vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 40 Go   | 80 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps** et passez à l'onglet **Marketplace**. Il s'ouvre
   sur **Featured** par défaut, sélectionnez donc **Marketplace** à côté. Choisissez votre région
   (YOW-1 ou YUL-1), recherchez **Ubuntu 24.04 LTS** et cliquez sur **Deploy**. Vous pouvez aussi
   créer l'instance depuis **Instances → Create**. Dans les deux cas, vous obtenez une VM Ubuntu
   24.04 propre.

   ![L'onglet Marketplace du portail ZSoftly Cloud, avec le sélecteur de région, la liste des catégories, la barre de recherche et les boutons Deploy](../../../../../assets/marketplace/deploy-marketplace-tab.webp)

   ![Recherche d'une application dans le Marketplace, la barre de recherche filtrant le catalogue jusqu'à une carte Deploy correspondante](../../../../../assets/marketplace/deploy-marketplace-search.webp)

2. Choisissez un plan qui répond aux prérequis ci-dessus.

3. Lorsque l'instance est **Running**, connectez-vous en SSH :

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer ERPNext

Installez Docker et le plugin Compose :

```bash
sudo apt install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker ubuntu
```

Déconnectez-vous puis reconnectez-vous (ou exécutez `newgrp docker`) pour que le changement de
groupe prenne effet.

Clonez `frappe_docker` et démarrez la pile :

```bash
git clone https://github.com/frappe/frappe_docker
cd frappe_docker
docker compose -f pwd.yml up -d
```

La pile `pwd.yml` télécharge les images ERPNext et exécute une tâche `create-site` qui construit le
site par défaut. Cela prend quelques minutes. Suivez la progression avec :

```bash
docker compose -f pwd.yml logs -f create-site
```

:::caution[Attention]

`pwd.yml` est le démarrage rapide officiel pour l'évaluation. Pour un déploiement en production avec
votre propre base de données, des applications personnalisées et un proxy inverse, suivez la
[configuration de production](https://github.com/frappe/frappe_docker/blob/main/docs/setup_production.md)
en utilisant `compose.yaml` et les fichiers de surcharge. L'interface en ligne de commande `bench`
est l'alternative sans Docker. Voir le
[guide d'installation de bench](https://docs.frappe.io/framework/user/en/installation).

:::

## Configurer ERPNext

Une fois la tâche `create-site` terminée, ouvrez `http://<your-vm-ip>:8080` et connectez-vous :

- Nom d'utilisateur : `Administrator`
- Mot de passe : `admin`

Changez immédiatement le mot de passe de l'administrateur, puis complétez l'assistant de
configuration (entreprise, devise, exercice fiscal). En production, placez ERPNext derrière un proxy
inverse (Traefik ou Nginx) avec un certificat TLS et un vrai nom de domaine plutôt que de servir le
port 8080 directement.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) depuis l'extérieur. Ouvrez le ou les ports
dont ERPNext a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 8080/tcp
```

Si vous placez ERPNext derrière un proxy inverse en HTTPS, ouvrez `80` et `443` à la place et gardez
`8080` interne.

## Étapes suivantes

- [Documentation ERPNext](https://docs.frappe.io/erpnext)
- [Guide d'installation de frappe_docker](https://github.com/frappe/frappe_docker/blob/main/docs/getting-started.md)
