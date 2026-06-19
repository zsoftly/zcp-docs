---
title: Nginx
---

Nginx est un serveur web, reverse proxy et répartiteur de charge à hautes performances qui propulse
une grande part des sites les plus fréquentés d'Internet. Il sert du contenu statique efficacement,
proxifie les requêtes vers des backends applicatifs et termine le TLS avec une faible empreinte
mémoire.

:::note[Bientôt disponible]

Une image Nginx préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** neuve depuis la marketplace et suivez les étapes ci-dessous pour installer Nginx vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 10 Go   | 20 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Nginx** et cliquez sur **Deploy**
   ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Dans les deux cas, vous
   obtenez une VM Ubuntu 24.04 propre.
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

## Installer Nginx

Installez la dernière version stable de Nginx depuis le dépôt apt officiel nginx.org. Ajoutez
d'abord les prérequis et la clé de signature:

```bash
sudo apt install -y curl gnupg2 ca-certificates lsb-release ubuntu-keyring
```

```bash
curl https://nginx.org/keys/nginx_signing.key | gpg --dearmor \
  | sudo tee /usr/share/keyrings/nginx-archive-keyring.gpg >/dev/null
```

Ajoutez le dépôt stable pour votre version d'Ubuntu:

```bash
echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
https://nginx.org/packages/ubuntu $(lsb_release -cs) nginx" \
  | sudo tee /etc/apt/sources.list.d/nginx.list
```

Installez et démarrez Nginx:

```bash
sudo apt update && sudo apt install -y nginx
sudo systemctl enable --now nginx
```

Vérifiez qu'il répond:

```bash
curl -I http://localhost
```

## Configurer Nginx

La configuration principale se trouve dans `/etc/nginx/nginx.conf`, et les fichiers de configuration
de sites vont dans `/etc/nginx/conf.d/`. Créez un reverse proxy simple qui transmet vers un backend
sur le port 3000:

```bash
sudo tee /etc/nginx/conf.d/app.conf >/dev/null <<'EOF'
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
```

Testez la configuration et rechargez:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

Pour le HTTPS, installez Certbot et demandez un certificat Let's Encrypt:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d example.com
```

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que le SSH (port 22) depuis l'extérieur. Ouvrez les ports dont
Nginx a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Étapes suivantes

- [Documentation Nginx](https://nginx.org/en/docs/)
- [Guide d'installation de Nginx](https://nginx.org/en/linux_packages.html)
