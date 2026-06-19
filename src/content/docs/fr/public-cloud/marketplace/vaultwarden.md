---
title: Vaultwarden
---

Vaultwarden est un gestionnaire de mots de passe léger et auto-hébergé qui implémente l'API
Bitwarden. Il est entièrement compatible avec les applications clientes et extensions de navigateur
officielles de Bitwarden, ce qui vous permet de stocker et de synchroniser mots de passe, notes
sécurisées et autres secrets sur une infrastructure que vous contrôlez.

:::note[Bientôt disponible]

Une image Vaultwarden préconstruite arrive bientôt. Pour l'instant, déployez une instance **Ubuntu
24.04 LTS** neuve depuis la place de marché et suivez les étapes ci-dessous pour installer
Vaultwarden vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 10 Go   | 20 Go      |

Vaultwarden est léger en ressources. Un nom de domaine et un certificat TLS sont fortement
recommandés, car les clients Bitwarden exigent HTTPS pour se connecter.

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps** et passez à l'onglet **Marketplace**. Il s'ouvre
   sur **Featured** par défaut, sélectionnez donc **Marketplace** à côté. Choisissez votre région
   (YOW-1 ou YUL-1), recherchez **Ubuntu 24.04 LTS** et cliquez sur **Deploy**. Vous pouvez aussi
   créer l'instance depuis **Instances → Create**. Dans les deux cas, vous obtenez une VM Ubuntu
   24.04 propre.

   ![L'onglet Marketplace du portail ZSoftly Cloud, avec le sélecteur de région, la liste des catégories, la barre de recherche et les boutons Deploy](../../../../../assets/marketplace/deploy-marketplace-tab.webp)

   ![Recherche d'une application dans le Marketplace, la barre de recherche filtrant le catalogue jusqu'à une carte Deploy correspondante](../../../../../assets/marketplace/deploy-marketplace-search.webp)

2. Choisissez un plan qui répond aux prérequis ci-dessus.

3. Lorsque l'instance est **Running**, connectez-vous en SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour:

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Vaultwarden

Vaultwarden est distribué sous forme d'image Docker officielle, installez donc d'abord Docker Engine
et le plugin Compose.

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

Installez Docker Engine et le plugin Compose:

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Générez un `ADMIN_TOKEN` pour la page d'administration. La commande `hash` produit une chaîne PHC
Argon2. Copiez la valeur complète, y compris le préfixe `$argon2id$`:

```bash
docker run --rm -it vaultwarden/server /vaultwarden hash
```

Exécutez Vaultwarden en persistant les données sur l'hôte et en mappant le port interne 80 du
conteneur au port hôte 8080:

```bash
docker run -d --name vaultwarden --restart unless-stopped \
  -e ADMIN_TOKEN='<paste-the-argon2-hash-here>' \
  -e DOMAIN='https://vault.example.com' \
  -v /opt/vaultwarden/data:/data \
  -p 8080:80 \
  vaultwarden/server:latest
```

## Configurer Vaultwarden

:::caution

Les applications clientes Bitwarden refusent de se connecter en HTTP simple. N'exposez pas
Vaultwarden directement. Placez-le toujours derrière un proxy inverse (Caddy, nginx ou Traefik) qui
termine TLS et transfère vers le port hôte 8080.

:::

Un proxy inverse Caddy minimal vous offre HTTPS automatique. Faites pointer le DNS de votre domaine
vers la VM, puis:

```bash
sudo apt install -y caddy
echo 'vault.example.com {
  reverse_proxy 127.0.0.1:8080
}' | sudo tee /etc/caddy/Caddyfile
sudo systemctl restart caddy
```

Définissez `DOMAIN` dans la commande `docker run` ci-dessus avec votre véritable URL `https://` afin
que les icônes des éléments du coffre, les pièces jointes et WebAuthn fonctionnent correctement. Une
fois TLS actif, accédez à la page d'administration à `https://vault.example.com/admin` et
connectez-vous avec le mot de passe que vous avez haché dans `ADMIN_TOKEN`. Traitez ce jeton comme
un mot de passe root.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que SSH (port 22) en externe. Ouvrez le port HTTPS que votre proxy
inverse sert et ajoutez-le aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Étapes suivantes

- [Documentation Vaultwarden](https://github.com/dani-garcia/vaultwarden/wiki)
- [Guide d'installation Vaultwarden](https://github.com/dani-garcia/vaultwarden/wiki/Starting-with-Docker)
