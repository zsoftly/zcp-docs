---
title: Nginx Proxy Manager
---

Nginx Proxy Manager est un reverse proxy auto-hébergé doté d'une interface web claire pour router le
trafic vers vos services et émettre des certificats TLS Let's Encrypt gratuits. Il encapsule Nginx
afin que vous puissiez gérer les hôtes proxy, les redirections et le SSL sans éditer de fichiers de
configuration à la main.

:::note[Bientôt disponible]

Une image Nginx Proxy Manager préconfigurée arrive bientôt. Pour l'instant, déployez une instance
**Ubuntu 24.04 LTS** neuve depuis la marketplace et suivez les étapes ci-dessous pour installer
Nginx Proxy Manager vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 10 Go   | 20 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Nginx Proxy Manager** et cliquez
   sur **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Dans
   les deux cas, vous obtenez une VM Ubuntu 24.04 propre.
2. Choisissez un plan qui répond aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour:

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Nginx Proxy Manager

Nginx Proxy Manager s'exécute dans Docker, installez donc d'abord Docker Engine et le plugin Compose
à l'aide du script officiel:

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
```

Déconnectez-vous puis reconnectez-vous pour que la nouvelle appartenance au groupe prenne effet,
puis créez un répertoire de projet et un fichier `docker-compose.yml`:

```bash
mkdir -p ~/npm && cd ~/npm
```

```bash
cat > docker-compose.yml <<'EOF'
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
EOF
```

Démarrez la pile:

```bash
docker compose up -d
```

## Configurer Nginx Proxy Manager

1. Ouvrez l'interface d'administration dans votre navigateur à l'adresse `http://<your-vm-ip>:81`.
2. Connectez-vous avec les identifiants par défaut:

```text
Email:    admin@example.com
Password: changeme
```

3. Vous êtes invité à définir immédiatement votre nom réel, votre e-mail et un nouveau mot de passe.
   Faites-le avant toute autre chose, car le compte par défaut est publiquement connu.
4. Allez dans **Hosts → Proxy Hosts → Add Proxy Host**, saisissez le domaine qui pointe vers cette
   VM et l'adresse interne du service que vous souhaitez publier (par exemple
   `http://127.0.0.1:3000`).
5. Dans l'onglet **SSL**, choisissez **Request a new SSL Certificate** pour que Let's Encrypt émette
   automatiquement un certificat. Les ports 80 et 443 doivent être accessibles depuis Internet pour
   que la validation réussisse.

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que le SSH (port 22) depuis l'extérieur. Ouvrez les ports dont
Nginx Proxy Manager a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le
portail:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 81/tcp
sudo ufw allow 443/tcp
```

Le port 81 est l'interface d'administration, tandis que les ports 80 et 443 acheminent le trafic
HTTP et HTTPS proxifié. Une fois la configuration terminée, envisagez de restreindre le port 81 à
une plage d'adresses IP de confiance.

## Étapes suivantes

- [Documentation Nginx Proxy Manager](https://nginxproxymanager.com/guide/)
- [Guide d'installation de Nginx Proxy Manager](https://nginxproxymanager.com/setup/)
