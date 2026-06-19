---
title: Prometheus
---

Prometheus est une boîte à outils libre de surveillance des systèmes et d'alerte. Il collecte des
métriques auprès de cibles configurées à intervalles réguliers, les stocke dans une base de données
de séries temporelles et évalue des règles pour déclencher des alertes. Il expose une interface de
requête et un navigateur d'expressions intégré sur le port 9090, et s'associe bien à Grafana pour
les tableaux de bord.

:::note[Bientôt disponible]

Une image Prometheus préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu
24.04 LTS** vierge depuis la marketplace et suivez les étapes ci-dessous pour installer Prometheus
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 50 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps** et passez à l'onglet **Marketplace**. Il s'ouvre
   sur **Featured** par défaut, sélectionnez donc **Marketplace** à côté. Choisissez votre région
   (YOW-1 ou YUL-1), recherchez **Ubuntu 24.04 LTS** et cliquez sur **Deploy**. Vous pouvez aussi
   créer l'instance depuis **Instances → Create**. Dans les deux cas, vous obtenez une VM Ubuntu
   24.04 propre.

   ![L'onglet Marketplace du portail ZSoftly Cloud, avec le sélecteur de région, la liste des catégories, la barre de recherche et les boutons Deploy](../../../../../assets/marketplace/deploy-marketplace-tab.webp)

   ![Recherche d'une application dans le Marketplace, la barre de recherche filtrant le catalogue jusqu'à une carte Deploy correspondante](../../../../../assets/marketplace/deploy-marketplace-search.webp)

2. Choisissez un plan qui répond aux prérequis ci-dessus.

3. Lorsque l'instance est **Running**, connectez-vous en SSH :

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Prometheus

Installez Prometheus depuis la version binaire officielle et exécutez-le comme service systemd.
C'est la méthode de production courante, qui vous donne un contrôle total sur la version.

Créez un utilisateur système dédié et non privilégié, ainsi que les répertoires de configuration et
de données :

```bash
sudo useradd --no-create-home --shell /bin/false prometheus
sudo mkdir -p /etc/prometheus /var/lib/prometheus
```

Téléchargez la dernière version depuis prometheus.io et extrayez-la. Consultez la
[page des versions](https://prometheus.io/download/) pour connaître la version actuelle et mettez-la
à jour ci-dessous :

```bash
PROM_VERSION=3.4.1
cd /tmp
curl -fsSLO https://github.com/prometheus/prometheus/releases/download/v${PROM_VERSION}/prometheus-${PROM_VERSION}.linux-amd64.tar.gz
tar -xzf prometheus-${PROM_VERSION}.linux-amd64.tar.gz
cd prometheus-${PROM_VERSION}.linux-amd64
```

Installez les binaires et les fichiers de support, puis attribuez la propriété à l'utilisateur
`prometheus` :

```bash
sudo cp prometheus promtool /usr/local/bin/
sudo cp -r consoles console_libraries /etc/prometheus/
sudo cp prometheus.yml /etc/prometheus/prometheus.yml
sudo chown -R prometheus:prometheus /usr/local/bin/prometheus /usr/local/bin/promtool /etc/prometheus /var/lib/prometheus
```

Écrivez une configuration de collecte minimale. Par défaut, elle collecte les métriques de
Prometheus lui-même sur le port 9090. Ajoutez vos propres cibles sous `scrape_configs` :

```bash
sudo tee /etc/prometheus/prometheus.yml > /dev/null <<'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ["localhost:9090"]
EOF
sudo chown prometheus:prometheus /etc/prometheus/prometheus.yml
```

Créez l'unité de service systemd :

```bash
sudo tee /etc/systemd/system/prometheus.service > /dev/null <<'EOF'
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus/ \
  --web.console.templates=/etc/prometheus/consoles \
  --web.console.libraries=/etc/prometheus/console_libraries \
  --web.listen-address=0.0.0.0:9090
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

Rechargez systemd, puis activez et démarrez le service :

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now prometheus
sudo systemctl status prometheus
```

## Configurer Prometheus

1. Ouvrez `http://<your-vm-ip>:9090` dans un navigateur pour accéder au navigateur d'expressions
   Prometheus et à l'interface intégrée.
2. Ajoutez des cibles de collecte en modifiant `/etc/prometheus/prometheus.yml` (par exemple, un
   `node_exporter` exécuté sur un hôte), puis validez et rechargez :

```bash
promtool check config /etc/prometheus/prometheus.yml
sudo systemctl reload prometheus
```

3. Prometheus ne dispose d'aucune authentification propre. En production, placez-le derrière un
   reverse proxy tel que Nginx ou Caddy pour ajouter le TLS et le contrôle d'accès sur le port 443,
   et restreignez l'accès direct au port 9090.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le port dont Prometheus a
besoin et ajoutez-le aux règles réseau/sécurité de l'instance dans le portail :

```bash
sudo ufw allow 9090/tcp
```

## Étapes suivantes

- [Documentation Prometheus](https://prometheus.io/docs/introduction/overview/)
- [Guide d'installation Prometheus](https://prometheus.io/docs/prometheus/latest/installation/)
