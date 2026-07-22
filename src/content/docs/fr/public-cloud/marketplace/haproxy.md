---
title: HAProxy
---

HAProxy est un répartiteur de charge et un proxy rapide et fiable pour les applications TCP et HTTP.
Il distribue le trafic entre les serveurs backend, effectue des contrôles de santé et termine TLS,
ce qui en fait un point d'entrée courant pour les services web hautement disponibles.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| HAProxy   | 3.2       |
| Ubuntu    | 24.04 LTS |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Vérifier que HAProxy fonctionne

Il n'y a aucune configuration au premier démarrage. HAProxy démarre immédiatement après le démarrage
de la VM.

```bash
systemctl status haproxy
```

### 3. Tester le frontend HTTP

Ouvrez le frontend par défaut dans un navigateur :

```text
http://<your-vm-ip>
```

Il renvoie :

```text
HAProxy is running
```

La page locale de statistiques écoute sur `127.0.0.1:8404`. Vous pouvez la vérifier depuis la VM :

```bash
curl http://127.0.0.1:8404/
```

## Gérer HAProxy

```bash
# Check service status
systemctl status haproxy

# Validate the configuration
sudo haproxy -c -f /etc/haproxy/haproxy.cfg

# Restart
sudo systemctl restart haproxy

# View logs
sudo journalctl -u haproxy -f
```

| Chemin                     | Fonction                                     |
| -------------------------- | -------------------------------------------- |
| `/etc/haproxy/haproxy.cfg` | Configuration principale                     |
| `/run/haproxy/admin.sock`  | Socket local de statistiques administratives |

## Sécurité

Le port 80 est ouvert sur l'interface réseau de la VM. UFW est activé et autorise le HTTP de HAProxy
(port 80) et SSH (port 22). La page de statistiques sur le port 8404 est liée uniquement à
localhost. Le port 443 n'est pas ouvert par défaut, car l'image ne fournit pas de certificat TLS.

**Pour limiter le frontend HTTP à une adresse IP précise :**

```bash
sudo ufw delete allow 80/tcp
sudo ufw allow from <trusted-ip> to any port 80
```

**Pour accéder au frontend sans laisser le port 80 ouvert, utilisez un tunnel SSH :**

Fermez d'abord le port public sur la VM, puisqu'il est ouvert par défaut :

```bash
sudo ufw delete allow 80/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8080
```

**Pour une utilisation en production**, configurez la terminaison TLS dans HAProxy avec un
certificat de confiance ou placez-le derrière un proxy compatible TLS avant d'accepter du trafic
sensible.

:::caution

Le frontend par défaut est une page de vérification de disponibilité, pas une configuration de
répartiteur de charge destinée à la production. Remplacez-le par vos propres sections frontend et
backend avant de diriger le trafic de l'application vers la VM.

:::

## Étapes suivantes

- [Documentation de HAProxy](https://www.haproxy.org/#docs)
- [Manuel de configuration de HAProxy](https://docs.haproxy.org/)
