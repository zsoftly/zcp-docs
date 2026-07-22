---
title: WG-Easy
---

WG-Easy est le moyen le plus simple d'exécuter un VPN WireGuard avec une interface d'administration
web. Il vous permet de créer et de gérer des clients VPN, de consulter les statistiques de
connexion, ainsi que de télécharger ou de scanner les configurations clientes depuis un navigateur,
le tout reposant sur le protocole WireGuard rapide et moderne. L'interface web fonctionne sur le
port 51821/tcp et le VPN lui-même sur le port 51820/udp.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| WG-Easy   | 15        |
| Ubuntu    | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable             | Description                           |
| -------------------- | ------------------------------------- |
| `WIREGUARD_HOST`     | Hôte public WireGuard                 |
| `WIREGUARD_PASSWORD` | Mot de passe administrateur WireGuard |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration génère un certificat TLS autosigné, recharge Nginx
et lance WG-Easy avec Docker Compose. Suivez la progression :

```bash
sudo journalctl -u wg-easy-first-boot.service -f
```

Le message de connexion (MOTD) confirme que WG-Easy est prêt. Vous pouvez également vérifier le
conteneur et Nginx :

```bash
cd /data/wg-easy && docker compose ps
systemctl status nginx
```

### 3. Accéder à l'interface WG-Easy

Ouvrez un navigateur et accédez à :

```text
https://<your-vm-ip>:51821
```

Le certificat autosigné déclenche un avertissement du navigateur. Acceptez l'exception pour
continuer.

### 4. Terminer l'assistant de configuration

Lors de la première visite, créez votre compte administrateur et définissez le point de terminaison
WireGuard sur l'adresse IP publique ou le domaine que les clients VPN peuvent joindre. L'image ne
crée pas d'identifiants partagés par défaut.

## Gérer WG-Easy

WG-Easy fonctionne comme une pile Docker Compose dans `/data/wg-easy`, et Nginx termine TLS.

```bash
# Check status
cd /data/wg-easy && docker compose ps
systemctl status nginx

# Restart
cd /data/wg-easy && docker compose restart
sudo systemctl restart nginx

# View application logs
cd /data/wg-easy && docker compose logs -f

# View Nginx logs
sudo journalctl -u nginx -f
```

| Chemin                             | Fonction                           |
| ---------------------------------- | ---------------------------------- |
| `/data/wg-easy/docker-compose.yml` | Configuration Docker Compose       |
| `/data/wg-easy/wireguard/`         | Configuration et données WireGuard |
| `/data/wg-easy/ssl/cert.pem`       | Certificat TLS autosigné           |
| `/data/wg-easy/ssl/key.pem`        | Clé privée TLS                     |
| `/data/wg-easy/info.txt`           | Informations d'accès et de gestion |

## Sécurité

Le VPN WireGuard utilise le port 51820/udp et l'interface web relayée par Nginx utilise le port
51821/tcp. UFW est activé et autorise par défaut SSH (port 22) ainsi que les deux ports WG-Easy. Le
port web non chiffré du conteneur est lié à `127.0.0.1:51822` et n'est pas exposé à l'extérieur.

**Pour limiter l'interface web à une adresse IP précise :**

```bash
sudo ufw delete allow 51821/tcp
sudo ufw allow from <trusted-ip> to any port 51821
```

**Pour accéder à l'interface web par un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 51821:localhost:51821 ubuntu@<your-vm-ip>

# Then open in your browser
https://localhost:51821
```

Gardez le port 51820/udp ouvert afin que les clients VPN puissent se connecter. Nginx agit déjà
comme proxy inverse TLS pour l'interface. **Pour une utilisation en production**, remplacez
`/data/wg-easy/ssl/cert.pem` et `/data/wg-easy/ssl/key.pem` par un certificat et une clé de
confiance.

:::caution

Terminez immédiatement l'assistant de configuration et limitez l'interface web aux adresses IP
d'administrateurs de confiance. Traitez les configurations clientes WireGuard téléchargées comme des
identifiants.

:::

## Étapes suivantes

- [Documentation de WG-Easy](https://wg-easy.github.io/wg-easy/)
- [Guide d'installation de WG-Easy](https://wg-easy.github.io/wg-easy/v15.2/getting-started/)
