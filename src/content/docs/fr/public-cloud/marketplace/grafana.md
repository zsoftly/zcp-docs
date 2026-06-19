---
title: Grafana
---

Grafana est une plateforme libre d'observabilité pour visualiser des métriques, des journaux et des
traces. Elle se connecte à des sources de données comme InfluxDB, Prometheus, Elasticsearch et
MySQL, puis les présente dans des tableaux de bord interactifs avec alertes. Elle est largement
utilisée pour la surveillance d'infrastructure, le suivi de performance applicative et
l'intelligence d'affaires.

## Logiciels inclus

| Composant   | Version         |
| ----------- | --------------- |
| Grafana OSS | Dernière stable |
| Ubuntu      | 24.04 LTS       |

## Variables d'environnement

Vous pouvez définir ces valeurs lors du déploiement de Grafana depuis la marketplace. Laissez un
champ vide pour générer automatiquement une valeur aléatoire sécurisée.

| Variable                     | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `GF_SECURITY_ADMIN_USER`     | Nom d'utilisateur administrateur de Grafana |
| `GF_SECURITY_ADMIN_PASSWORD` | Mot de passe administrateur de Grafana      |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Vérifiez que Grafana est en cours d'exécution

Aucune configuration de premier démarrage n'est requise. Grafana démarre immédiatement après le
démarrage de la VM.

```bash
systemctl status grafana-server
```

### 3. Accédez à l'interface Grafana

Ouvrez un navigateur et accédez à:

```text
http://<your-vm-ip>:3000
```

Connectez-vous avec les identifiants par défaut:

| Champ             | Valeur  |
| ----------------- | ------- |
| Nom d'utilisateur | `admin` |
| Mot de passe      | `admin` |

Vous serez invité à définir un nouveau mot de passe à la première connexion.

### 4. Ajoutez une source de données

Une fois connecté:

1. Allez à **Connections** → **Data sources**
2. Cliquez sur **Add data source**
3. Sélectionnez votre type de source de données (InfluxDB, Prometheus, MySQL, etc.)
4. Entrez les détails de connexion et cliquez sur **Save & test**

## Gérer Grafana

```bash
# Vérifier l'état du service
systemctl status grafana-server

# Redémarrer
sudo systemctl restart grafana-server

# Consulter les journaux
sudo journalctl -u grafana-server -f
```

| Chemin                     | Rôle                                         |
| -------------------------- | -------------------------------------------- |
| `/etc/grafana/grafana.ini` | Configuration principale                     |
| `/var/lib/grafana/`        | Tableaux de bord, plugins et base de données |

## Sécurité

Le port 3000 est accessible sur l'interface réseau de la VM. UFW est activé et n'autorise que SSH
(port 22) par défaut.

**Pour autoriser l'accès depuis un navigateur à partir d'une adresse IP précise:**

```bash
sudo ufw allow from <trusted-ip> to any port 3000
```

**Pour accéder à l'interface sans ouvrir le pare-feu, utilisez un tunnel SSH:**

```bash
# Exécutez ceci sur votre poste local
ssh -L 3000:localhost:3000 ubuntu@<your-vm-ip>

# Ouvrez ensuite dans le navigateur
http://localhost:3000
```

**Pour un usage en production**, placez Grafana derrière un proxy inverse comme Nginx ou Caddy afin
de le servir sur le port 443 avec un certificat TLS.

:::caution

Changez immédiatement le mot de passe `admin` par défaut après la première connexion. Grafana a
accès à toutes les sources de données connectées. Traitez-le comme un outil interne sensible et
limitez l'accès à des adresses IP connues.

:::

## Prochaines étapes

- [Documentation Grafana](https://grafana.com/docs/grafana/latest/)
- [Bonnes pratiques pour les tableaux de bord](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/)
- [Alertes Grafana](https://grafana.com/docs/grafana/latest/alerting/)
