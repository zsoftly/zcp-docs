---
title: WG-Easy
---

WG-Easy est la façon la plus simple d'exécuter un VPN WireGuard accompagné d'une interface
d'administration web. Il vous permet de créer et gérer des clients VPN, de consulter les
statistiques de connexion et de télécharger ou scanner les configurations clientes depuis un
navigateur, le tout reposant sur le protocole WireGuard, rapide et moderne. L'interface web
s'exécute sur le port 51821/tcp et le VPN lui-même sur le port 51820/udp.

:::note[Bientôt disponible]

Une image WG-Easy préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer WG-Easy vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 1          |
| RAM       | 512 Mo  | 1 Go       |
| Stockage  | 10 Go   | 20 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **WG-Easy**, puis cliquez sur
   **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Les deux
   vous donnent une VM Ubuntu 24.04 vierge.
2. Choisissez un forfait qui répond aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH :

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer WG-Easy

Installez Docker Engine et le plugin Docker Compose depuis le dépôt officiel de Docker :

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Ajoutez l'utilisateur `ubuntu` au groupe `docker` afin de pouvoir exécuter Docker sans `sudo`, puis
reconnectez-vous :

```bash
sudo usermod -aG docker ubuntu
exit
```

Reconnectez-vous en SSH, créez un répertoire de projet et ajoutez un fichier `compose.yaml`. WG-Easy
a besoin de capacités réseau élevées et du transfert IP pour router le trafic VPN :

```bash
mkdir ~/wg-easy && cd ~/wg-easy
```

```yaml
services:
  wg-easy:
    image: ghcr.io/wg-easy/wg-easy:15
    restart: unless-stopped
    environment:
      - INIT_ENABLED=1
      - INIT_HOST=${WIREGUARD_HOST}
      - INIT_PORT=51820
      - INIT_USERNAME=admin
      - INIT_PASSWORD=${WIREGUARD_PASSWORD}
      - INIT_DNS=1.1.1.1,8.8.8.8
      - PORT=51821
    ports:
      - '51820:51820/udp'
      - '51821:51821/tcp'
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
      - NET_RAW
    sysctls:
      - net.ipv4.ip_forward=1
      - net.ipv4.conf.all.src_valid_mark=1
    volumes:
      - wg-easy-data:/etc/wireguard

volumes:
  wg-easy-data:
```

Créez un fichier `.env` dans le même répertoire. Définissez `WIREGUARD_HOST` sur l'IP publique ou le
nom DNS de l'instance auquel les clients se connecteront :

```bash
cat > .env <<'EOF'
WIREGUARD_HOST=<your-vm-ip>
WIREGUARD_PASSWORD=change-me-to-a-strong-password
EOF
```

Démarrez la pile :

```bash
docker compose up -d
```

## Configurer WG-Easy

Ouvrez `http://<your-vm-ip>:51821` dans un navigateur et connectez-vous avec le nom d'utilisateur
`admin` et le mot de passe du fichier `.env`. Depuis le tableau de bord, vous pouvez ajouter des
clients, puis télécharger ou scanner la configuration WireGuard de chaque client. `INIT_HOST` doit
être l'adresse publique que les clients peuvent atteindre, sinon les configurations clientes
générées pointeront vers le mauvais point d'accès. Pour un déploiement en production, placez
l'interface web derrière un proxy inverse tel que nginx avec un certificat TLS et exposez-la via
HTTPS plutôt que d'exposer le port 51821 directement. Le port VPN 51820/udp reste exposé.

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que SSH (port 22) depuis l'extérieur. Ouvrez le ou les ports dont
WG-Easy a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 51820/udp
sudo ufw allow 51821/tcp
```

## Étapes suivantes

- [Documentation WG-Easy](https://wg-easy.github.io/wg-easy/)
- [Guide d'installation WG-Easy](https://wg-easy.github.io/wg-easy/v15.2/getting-started/)
