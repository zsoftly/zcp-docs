---
title: SeaweedFS
---

SeaweedFS est un système open source de stockage de fichiers et d'objets distribué, conçu pour des
milliards de fichiers et un accès rapide. Un seul binaire `weed` exécute les composants master,
volume, filer et S3, et la passerelle S3 expose une API compatible S3 pour les charges de travail
applicatives.

:::note[Bientôt disponible]

Une image SeaweedFS préconfigurée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer SeaweedFS
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 4          |
| RAM       | 1 Go    | 4 Go       |
| Stockage  | 20 Go   | 200 Go     |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **SeaweedFS** et cliquez sur
   **Deploy**, ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Dans les
   deux cas, vous obtenez une VM Ubuntu 24.04 propre.
2. Choisissez un plan qui répond aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH :

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer SeaweedFS

SeaweedFS est distribué sous la forme d'un binaire statique unique sur sa page de versions GitHub.
Téléchargez la dernière version `linux_amd64`, extrayez l'exécutable `weed` et installez-le dans
votre `PATH` :

```bash
curl -fsSL https://github.com/seaweedfs/seaweedfs/releases/latest/download/linux_amd64.tar.gz \
  -o /tmp/seaweedfs.tar.gz
sudo tar -xzf /tmp/seaweedfs.tar.gz -C /usr/local/bin weed
sudo chmod +x /usr/local/bin/weed
weed version
```

Créez un utilisateur dédié et un répertoire de données :

```bash
sudo useradd --system --home /var/lib/seaweedfs --shell /usr/sbin/nologin seaweedfs
sudo mkdir -p /var/lib/seaweedfs
sudo chown -R seaweedfs:seaweedfs /var/lib/seaweedfs
```

## Configurer SeaweedFS

`weed server` exécute les composants master, volume et filer dans un seul processus. L'ajout de
`-s3` démarre également la passerelle S3. Exécutez-le en tant que service systemd afin qu'il démarre
au démarrage du système. Créez le fichier d'unité :

```bash
sudo tee /etc/systemd/system/seaweedfs.service > /dev/null <<'EOF'
[Unit]
Description=SeaweedFS
After=network.target

[Service]
Type=simple
User=seaweedfs
Group=seaweedfs
ExecStart=/usr/local/bin/weed server -dir=/var/lib/seaweedfs -filer -s3
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

Activez et démarrez le service :

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now seaweedfs
sudo systemctl status seaweedfs
```

Les composants écoutent sur ces ports par défaut :

| Composant     | Port |
| ------------- | ---- |
| Master        | 9333 |
| Volume        | 8080 |
| Filer         | 8888 |
| Passerelle S3 | 8333 |

Pointez n'importe quel client S3 vers `http://<your-vm-ip>:8333`. Consultez le tableau de bord
master à l'adresse `http://<your-vm-ip>:9333` et le filer à l'adresse `http://<your-vm-ip>:8888`.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le ou les ports dont
SeaweedFS a besoin et ajoutez-les aux règles réseau/de sécurité de l'instance dans le portail :

```bash
sudo ufw allow 9333/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 8888/tcp
sudo ufw allow 8333/tcp
```

## Étapes suivantes

- [Documentation SeaweedFS](https://github.com/seaweedfs/seaweedfs/wiki)
- [Guide d'installation SeaweedFS](https://github.com/seaweedfs/seaweedfs/wiki/Getting-Started)
