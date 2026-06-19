---
title: HAProxy
---

HAProxy est un répartiteur de charge et proxy rapide et fiable pour les applications TCP et HTTP. Il
distribue le trafic entre des serveurs backend, effectue des contrôles de santé et termine le TLS,
ce qui en fait une porte d'entrée courante pour les services web à haute disponibilité.

:::note[Bientôt disponible]

Une image HAProxy préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu 24.04
LTS** neuve depuis la marketplace et suivez les étapes ci-dessous pour installer HAProxy vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 10 Go   | 20 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **HAProxy** et cliquez sur
   **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Dans les
   deux cas, vous obtenez une VM Ubuntu 24.04 propre.
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

## Installer HAProxy

Ubuntu 24.04 fournit une version LTS de HAProxy dans ses dépôts par défaut:

```bash
sudo apt install -y haproxy
```

Pour installer une version plus récente, utilisez plutôt le dépôt de paquets officiel HAProxy (PPA).
Pour la série stable actuelle:

```bash
sudo apt install -y software-properties-common
sudo add-apt-repository -y ppa:vbernat/haproxy-3.0
sudo apt update && sudo apt install -y haproxy
```

Activez et démarrez le service:

```bash
sudo systemctl enable --now haproxy
```

Vérifiez la version installée:

```bash
haproxy -v
```

## Configurer HAProxy

La configuration se trouve dans `/etc/haproxy/haproxy.cfg`. L'exemple ci-dessous termine le HTTP sur
le port 80 et répartit les requêtes entre deux serveurs web backend:

```bash
sudo tee /etc/haproxy/haproxy.cfg >/dev/null <<'EOF'
global
    log /dev/log local0
    maxconn 4096
    user haproxy
    group haproxy
    daemon

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    timeout connect 5s
    timeout client  50s
    timeout server  50s

frontend http_in
    bind *:80
    default_backend web_servers

backend web_servers
    balance roundrobin
    option httpchk GET /
    server web1 10.0.0.11:8080 check
    server web2 10.0.0.12:8080 check
EOF
```

Validez la configuration avant de recharger:

```bash
haproxy -c -f /etc/haproxy/haproxy.cfg
sudo systemctl reload haproxy
```

Les ports sur lesquels HAProxy écoute dépendent entièrement des directives `bind` de vos sections
`frontend`, ouvrez donc les ports correspondants à l'étape suivante.

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que le SSH (port 22) depuis l'extérieur. Ouvrez les ports dont
HAProxy a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Étapes suivantes

- [Documentation HAProxy](https://www.haproxy.org/#docs)
- [Manuel de configuration HAProxy](https://docs.haproxy.org/)
