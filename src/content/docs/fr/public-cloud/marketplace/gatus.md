---
title: Gatus
---

Gatus est un tableau de bord de santé et une page de statut automatisés, orientés développeurs, avec
alertes intégrées et prise en charge des incidents. Il surveille des points de terminaison HTTP,
TCP, DNS, ICMP et autres selon des conditions que vous définissez, et publie les résultats sur une
page de statut épurée servie sur le port 8080. Il se configure entièrement via un unique fichier
`config.yaml`.

:::note[Bientôt disponible]

Une image Gatus préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer Gatus vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 1          |
| RAM       | 256 Mo  | 512 Mo     |
| Stockage  | 5 Go    | 10 Go      |

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

## Installer Gatus

Gatus est distribué sous forme d'image Docker officielle. Installez d'abord Docker à l'aide du
script d'installation officiel :

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Ajoutez l'utilisateur `ubuntu` au groupe `docker`, puis réappliquez votre appartenance au groupe :

```bash
sudo usermod -aG docker ubuntu
newgrp docker
```

Créez un fichier de configuration. La configuration minimale ci-dessous surveille un site web et
expose le tableau de bord sur le port 8080 :

```bash
mkdir -p ~/gatus
cat > ~/gatus/config.yaml <<'EOF'
web:
  port: 8080

endpoints:
  - name: example-website
    url: https://example.com
    interval: 30s
    conditions:
      - "[STATUS] == 200"
      - "[RESPONSE_TIME] < 300"
EOF
```

Démarrez le conteneur Gatus en montant le fichier de configuration et en liant le port 8080 :

```bash
docker run -d \
  --restart=unless-stopped \
  -p 8080:8080 \
  --mount type=bind,source="$HOME/gatus/config.yaml",target=/config/config.yaml \
  --name gatus \
  ghcr.io/twin/gatus:stable
```

Vérifiez que le conteneur est en cours d'exécution :

```bash
docker ps
```

## Configurer Gatus

1. Ouvrez `http://<your-vm-ip>:8080` dans un navigateur pour voir la page de statut.
2. Modifiez `~/gatus/config.yaml` pour ajouter des points de terminaison, des conditions, des
   fournisseurs d'alertes (Slack, e-mail, PagerDuty, webhooks et plus encore) et des paramètres de
   groupe. Consultez la référence de configuration pour toutes les clés disponibles.
3. Appliquez les modifications en redémarrant le conteneur :

```bash
docker restart gatus
```

En production, placez Gatus derrière un reverse proxy tel que Nginx ou Caddy pour le servir sur le
port 443 avec un certificat TLS, et restreignez l'accès direct au port 8080.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le port dont Gatus a besoin
et ajoutez-le aux règles réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 8080/tcp
```

## Étapes suivantes

- [Documentation Gatus](https://github.com/TwiN/gatus)
- [Guide de configuration Gatus](https://github.com/TwiN/gatus#configuration)
