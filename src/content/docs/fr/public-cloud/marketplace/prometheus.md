---
title: Prometheus
---

Prometheus est une boîte à outils open source de surveillance et d'alerte système. Il collecte les
métriques de cibles configurées à intervalles réguliers, les stocke dans une base de données de
séries temporelles et évalue des règles pour déclencher des alertes. Il expose une interface de
requêtes et un navigateur d'expressions intégré sur le port 9090, et fonctionne bien avec Grafana
pour les tableaux de bord.

## Logiciels inclus

| Composant  | Version   |
| ---------- | --------- |
| Prometheus | 3.4.1     |
| Ubuntu     | 24.04 LTS |

L'image inclut seulement le serveur Prometheus. Ajoutez les exporters (comme `node_exporter`) comme
cibles de collecte, et exécutez Alertmanager séparément, en tant que composant distinct, pour gérer
le routage des alertes.

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 50 Go      |

Les besoins de stockage augmentent avec le nombre de séries et la période de rétention.

## Démarrage

### 1. Se connecter à la machine virtuelle

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, un script lance le service. Cela prend moins d'une minute. Suivez la
progression:

```bash
journalctl -u prometheus-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Prometheus est prêt.

### 3. Accéder à l'interface Prometheus

Ouvrez un navigateur et allez au navigateur d'expressions et à l'interface intégrée:

```text
http://<your-vm-ip>:9090
```

### 4. Ajouter des cibles de collecte

Modifiez la configuration de collecte, validez-la, puis rechargez sans redémarrage:

```bash
sudo nano /etc/prometheus/prometheus.yml
promtool check config /etc/prometheus/prometheus.yml
sudo systemctl reload prometheus
```

## Gérer Prometheus

Prometheus s'exécute comme service systemd avec un utilisateur dédié `prometheus`.

```bash
# Vérifier l'état
systemctl status prometheus

# Redémarrer
sudo systemctl restart prometheus

# Recharger la configuration sans redémarrer
sudo systemctl reload prometheus

# Voir les journaux
sudo journalctl -u prometheus -f
```

| Chemin                           | Rôle                                  |
| -------------------------------- | ------------------------------------- |
| `/etc/prometheus/prometheus.yml` | Configuration principale              |
| `/var/lib/prometheus/`           | Base de données de séries temporelles |

## Sécurité

Le port 9090 est ouvert sur l'interface réseau de la machine virtuelle, et Prometheus n'a **pas
d'authentification intégrée**. UFW est activé et autorise SSH (port 22) et Prometheus (port 9090).

**Pour limiter l'interface à une adresse IP précise:**

```bash
sudo ufw delete allow 9090/tcp
sudo ufw allow from <trusted-ip> to any port 9090
```

**Pour accéder à l'interface sans ouvrir le pare-feu, utilisez un tunnel SSH:**

```bash
# Exécuter cette commande sur votre machine locale
ssh -L 9090:localhost:9090 ubuntu@<your-vm-ip>
```

**En production**, placez Prometheus derrière un proxy inverse comme Nginx ou Caddy pour ajouter TLS
et un contrôle d'accès sur le port 443, puis limitez l'accès direct au port 9090.

## Prochaines étapes

- [Documentation Prometheus](https://prometheus.io/docs/introduction/overview/)
- [Référence de configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/)
