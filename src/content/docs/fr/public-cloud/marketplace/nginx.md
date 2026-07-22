---
title: Nginx
---

Nginx est un serveur web, un proxy inverse et un répartiteur de charge haute performance qui
alimente une grande partie des sites les plus fréquentés sur Internet. Il sert efficacement le
contenu statique, relaie les requêtes vers les backends d'applications et termine TLS avec une
faible empreinte mémoire.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| Nginx     | 1.30.3    |
| Ubuntu    | 24.04 LTS |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Vérifier que Nginx fonctionne

Il n'y a aucune configuration au premier démarrage. Nginx démarre immédiatement après le démarrage
de la VM.

```bash
systemctl status nginx
```

### 3. Accéder au site par défaut

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>
```

Vous pouvez également vérifier la réponse depuis la VM :

```bash
curl -I http://localhost
```

## Gérer Nginx

```bash
# Check service status
systemctl status nginx

# Validate the configuration
sudo nginx -t

# Restart
sudo systemctl restart nginx

# View logs
sudo journalctl -u nginx -f
```

| Chemin                   | Fonction                            |
| ------------------------ | ----------------------------------- |
| `/etc/nginx/nginx.conf`  | Configuration principale            |
| `/etc/nginx/conf.d/`     | Configuration des serveurs et proxy |
| `/usr/share/nginx/html/` | Racine web par défaut               |

## Sécurité

Les ports 80 et 443 sont ouverts sur l'interface réseau de la VM. UFW est activé et autorise HTTP
(port 80), HTTPS (port 443) et SSH (port 22). Nginx sert HTTP sur le port 80 par défaut. Le port 443
n'a aucun écouteur TLS tant que vous n'avez pas configuré un certificat et un bloc serveur HTTPS.

**Pour limiter HTTP et HTTPS à une adresse IP précise :**

```bash
sudo ufw delete allow 80/tcp
sudo ufw delete allow 443/tcp
sudo ufw allow from <trusted-ip> to any port 80
sudo ufw allow from <trusted-ip> to any port 443
```

**Pour accéder au site par défaut sans laisser le port 80 ouvert, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8080
```

**Pour une utilisation en production**, configurez Nginx avec un certificat TLS de confiance et
servez les sites publics sur le port 443. Nginx n'ajoute aucune authentification aux services
relayés, protégez donc chaque application en amont séparément.

## Étapes suivantes

- [Documentation de Nginx](https://nginx.org/en/docs/)
- [Guide d'installation de Nginx](https://nginx.org/en/linux_packages.html)
