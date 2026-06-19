---
title: Harbor
---

Harbor est un registre de conteneurs open source qui stocke, signe et analyse les images de
conteneurs et les artefacts OCI. Il ajoute le contrôle d'accès basé sur les rôles, l'analyse des
vulnérabilités et la réplication d'images par-dessus l'API de registre standard. L'interface web
s'exécute sur les ports 80 et 443.

:::note[Bientôt disponible]

Une image Harbor préinstallée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Harbor
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 40 Go   | 100 Go     |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Harbor** et cliquez sur **Deploy**
   ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Les deux vous donnent
   une VM Ubuntu 24.04 propre.
2. Choisissez un plan répondant aux prérequis ci-dessus et sélectionnez votre région (YOW-1 ou
   YUL-1).
3. Lorsque l'instance est **Running**, connectez-vous en SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Mettez le système à jour:

```bash
sudo apt update && sudo apt upgrade -y
```

## Installer Harbor

Harbor s'exécute comme un ensemble de conteneurs orchestrés par Docker Compose. Installez donc
d'abord Docker Engine (qui inclut le plugin Compose) à l'aide du script d'installation officiel:

```bash
curl -fsSL https://get.docker.com | sudo sh
```

Vérifiez que Docker et Compose sont disponibles:

```bash
docker version
docker compose version
```

Téléchargez le dernier installateur en ligne de Harbor depuis la page des versions officielles
(consultez [github.com/goharbor/harbor/releases](https://github.com/goharbor/harbor/releases) pour
la version actuelle et mettez l'URL à jour en conséquence):

```bash
cd /opt
sudo curl -L -O https://github.com/goharbor/harbor/releases/download/v2.14.0/harbor-online-installer-v2.14.0.tgz
sudo tar -xzf harbor-online-installer-v2.14.0.tgz
cd harbor
```

Copiez le modèle de configuration:

```bash
sudo cp harbor.yml.tmpl harbor.yml
```

## Configurer Harbor

Modifiez `harbor.yml` avant d'exécuter l'installateur:

```bash
sudo nano harbor.yml
```

Définissez au minimum ces valeurs:

- `hostname` : l'adresse IP publique ou le nom DNS de votre VM (les clients l'utilisent pour
  atteindre le registre).
- `harbor_admin_password` : changez-le par rapport à la valeur par défaut `Harbor12345`.
- TLS : pour un démarrage rapide, commentez tout le bloc `https:` afin de servir en HTTP sur le
  port 80. En production, gardez `https:` activé et pointez `certificate` et `private_key` vers un
  certificat TLS valide. Les clients de conteneurs exigent HTTPS, sauf si le registre est
  explicitement considéré comme non sécurisé (insecure).

Exécutez l'installateur:

```bash
sudo ./install.sh
```

L'installateur télécharge les images Harbor et démarre la pile avec Docker Compose. Une fois
terminé, ouvrez `http://<your-vm-ip>` (ou `https://` si TLS est activé) dans un navigateur et
connectez-vous:

- Nom d'utilisateur: `admin`
- Mot de passe: le `harbor_admin_password` que vous avez défini dans `harbor.yml`

Gérez la pile en cours d'exécution avec Docker Compose depuis le répertoire `/opt/harbor`:

```bash
sudo docker compose ps
sudo docker compose down
sudo docker compose up -d
```

## Ouvrir le pare-feu

L'instance n'autorise que le SSH (port 22) en externe par défaut. Ouvrez le ou les ports dont Harbor
a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Étapes suivantes

- [Documentation Harbor](https://goharbor.io/docs/)
- [Guide d'installation Harbor](https://goharbor.io/docs/latest/install-config/)
