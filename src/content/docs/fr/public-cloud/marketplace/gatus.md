---
title: Gatus
---

Gatus est un tableau de santé et une page d'état automatisés conçus pour les développeurs, avec
alertes intégrées et gestion des incidents. Il surveille les points de terminaison HTTP, TCP, DNS,
ICMP et autres selon les conditions que vous définissez, puis publie les résultats sur une page
d'état épurée servie sur le port 8080. Toute sa configuration réside dans un seul fichier
`config.yaml`.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| Gatus     | 5.36.0    |
| Ubuntu    | 24.04 LTS |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration lance la pile Docker Compose de Gatus. Cette
opération prend moins d'une minute. Suivez la progression :

```bash
journalctl -u gatus-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Gatus est prêt.

### 3. Vérifier que Gatus fonctionne

```bash
cd /opt/gatus
docker compose ps
curl -fsS http://127.0.0.1:8080/ > /dev/null
```

### 4. Accéder au tableau de bord Gatus

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>:8080
```

La configuration incluse surveille `https://example.com` toutes les 30 secondes et enregistre les
résultats dans SQLite.

## Gérer Gatus

```bash
# Check container status
cd /opt/gatus && docker compose ps

# Restart
cd /opt/gatus && docker compose restart

# View logs
cd /opt/gatus && docker compose logs -f
```

| Chemin                          | Fonction                         |
| ------------------------------- | -------------------------------- |
| `/opt/gatus/config.yaml`        | Moniteurs, conditions et alertes |
| `/opt/gatus/docker-compose.yml` | Configuration Docker Compose     |
| `/var/lib/gatus/gatus.db`       | Données SQLite persistantes      |

Après avoir modifié `/opt/gatus/config.yaml`, redémarrez Gatus pour appliquer les changements.

## Sécurité

Le port 8080 est accessible sur l'interface réseau de la VM. UFW est activé et autorise par défaut
SSH (port 22) et Gatus (port 8080).

**Pour limiter le tableau de bord à une adresse IP précise :**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

**Pour accéder à Gatus sans exposer le port 8080, utilisez un tunnel SSH :**

Fermez d'abord le port public sur la VM, puisqu'il est ouvert par défaut :

```bash
sudo ufw delete allow 8080/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:8080 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
```

**Pour une utilisation en production**, placez Gatus derrière un proxy inverse afin de le servir sur
le port 443 avec un certificat TLS, puis limitez l'accès direct au port 8080.

:::caution

La page d'état peut révéler les noms des services, les points de terminaison et les détails des
incidents. Limitez-la au public prévu.

:::

## Étapes suivantes

- [Documentation de Gatus](https://github.com/TwiN/gatus)
- [Guide de configuration de Gatus](https://github.com/TwiN/gatus#configuration)
