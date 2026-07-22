---
title: Nginx Proxy Manager
---

Nginx Proxy Manager est un proxy inverse auto-hébergé doté d'une interface web épurée pour acheminer
le trafic vers vos services et émettre des certificats TLS Let's Encrypt gratuits. Il enveloppe
Nginx afin que vous puissiez gérer les hôtes proxy, les redirections et SSL sans modifier
manuellement les fichiers de configuration.

## Logiciels inclus

| Composant           | Version   |
| ------------------- | --------- |
| Nginx Proxy Manager | 2.15.1    |
| Ubuntu              | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable             | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `NPM_ADMIN_EMAIL`    | Adresse courriel de l'administrateur Nginx Proxy Manager |
| `NPM_ADMIN_PASSWORD` | Mot de passe de l'administrateur Nginx Proxy Manager     |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Nginx Proxy Manager démarre automatiquement sous forme de pile Docker Compose. Cette opération prend
généralement moins d'une minute. Suivez la progression avec :

```bash
sudo journalctl -u nginx-proxy-manager-first-boot.service -f
```

Vérifiez ensuite le conteneur :

```bash
cd /opt/nginx-proxy-manager && docker compose ps
```

### 3. Accéder à l'interface d'administration

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>:81
```

Connectez-vous avec les identifiants par défaut :

| Champ            | Valeur              |
| ---------------- | ------------------- |
| Adresse courriel | `admin@example.com` |
| Mot de passe     | `changeme`          |

Vous serez invité à modifier les informations du compte après la première connexion.

## Gérer Nginx Proxy Manager

Nginx Proxy Manager fonctionne comme une pile Docker Compose dans `/opt/nginx-proxy-manager`.

```bash
# Check status
cd /opt/nginx-proxy-manager && docker compose ps

# Restart
cd /opt/nginx-proxy-manager && docker compose restart

# View logs
cd /opt/nginx-proxy-manager && docker compose logs -f
```

| Chemin                                        | Fonction                  |
| --------------------------------------------- | ------------------------- |
| `/opt/nginx-proxy-manager/docker-compose.yml` | Pile Compose              |
| `/var/lib/nginx-proxy-manager/data/`          | Données de l'application  |
| `/var/lib/nginx-proxy-manager/letsencrypt/`   | Certificats Let's Encrypt |

## Sécurité

Les ports 80, 81 et 443 sont ouverts sur l'interface réseau de la VM. UFW est activé et autorise le
trafic proxy HTTP (port 80), l'interface d'administration (port 81), le trafic proxy HTTPS
(port 443) et SSH (port 22).

**Pour limiter l'interface d'administration à une adresse IP précise :**

```bash
sudo ufw delete allow 81/tcp
sudo ufw allow from <trusted-ip> to any port 81
```

**Pour accéder à l'interface d'administration sans laisser le port 81 ouvert, utilisez un tunnel SSH
:**

```bash
# Run this on your local machine
ssh -L 8181:localhost:81 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8181
```

Gardez les ports 80 et 443 accessibles pour les hôtes proxy publics et la validation HTTP-01 de
Let's Encrypt. Pour une utilisation en production, limitez l'interface d'administration à un réseau
de confiance ou publiez-la par un point de terminaison TLS protégé.

:::caution

Modifiez immédiatement l'adresse courriel et le mot de passe par défaut après la première connexion.
Le port 81 donne le contrôle administratif de tous les hôtes proxy et certificats de la VM.

:::

## Étapes suivantes

- [Documentation de Nginx Proxy Manager](https://nginxproxymanager.com/guide/)
- [Guide d'installation de Nginx Proxy Manager](https://nginxproxymanager.com/setup/)
