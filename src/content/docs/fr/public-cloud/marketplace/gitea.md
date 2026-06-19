---
title: Gitea
---

Gitea est un service Git léger et auto-hébergé écrit en Go. Il regroupe l'hébergement de dépôts, la
revue de code, le suivi des tickets et un exécuteur CI intégré dans un seul binaire qui tourne
confortablement sur une petite VM. L'interface web s'exécute sur le port 3000 et Git via SSH sur le
port 22.

:::note[Bientôt disponible]

Une image Gitea préconfigurée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Gitea
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Gitea** et cliquez sur **Deploy**
   ou créez une instance **Ubuntu 24.04 LTS** depuis **Instances → Create**. Dans les deux cas, vous
   obtenez une VM Ubuntu 24.04 propre.
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

## Installer Gitea

Installez d'abord Git et quelques dépendances :

```bash
sudo apt install -y git git-lfs
```

Téléchargez le dernier binaire Gitea et installez-le dans `/usr/local/bin`. Consultez
[dl.gitea.com](https://dl.gitea.com/gitea/) pour la version actuelle et remplacez `1.26.2`
ci-dessous si une version plus récente est disponible :

```bash
wget -O gitea https://dl.gitea.com/gitea/1.26.2/gitea-1.26.2-linux-amd64
sudo cp gitea /usr/local/bin/gitea
sudo chmod 755 /usr/local/bin/gitea
```

Créez un utilisateur système `git` dédié sous lequel Gitea s'exécute :

```bash
sudo adduser --system --shell /bin/bash --gecos 'Git Version Control' \
  --group --disabled-password --home /home/git git
```

Créez les répertoires de données et de configuration :

```bash
sudo mkdir -p /var/lib/gitea/{custom,data,log}
sudo chown -R git:git /var/lib/gitea/
sudo chmod -R 750 /var/lib/gitea/
sudo mkdir /etc/gitea
sudo chown root:git /etc/gitea
sudo chmod 770 /etc/gitea
```

Installez le service systemd fourni avec Gitea, puis activez-le et démarrez-le :

```bash
sudo wget -O /etc/systemd/system/gitea.service \
  https://raw.githubusercontent.com/go-gitea/gitea/release/v1.26/contrib/systemd/gitea.service
sudo systemctl daemon-reload
sudo systemctl enable --now gitea
sudo systemctl status gitea
```

## Configurer Gitea

Gitea écoute sur le port 3000. Ouvrez `http://<your-vm-ip>:3000` dans un navigateur pour exécuter
l'assistant d'installation initial. Acceptez la base de données SQLite par défaut pour une petite
instance, ou orientez Gitea vers PostgreSQL/MySQL pour des déploiements plus importants.

Avant de terminer, définissez l'**Application URL** sur l'adresse de votre serveur et créez le
premier compte administrateur en bas du formulaire. Le premier utilisateur enregistré devient
l'administrateur. L'assistant écrit ses paramètres dans `/etc/gitea/app.ini`. Renforcez donc les
permissions des fichiers ensuite :

```bash
sudo chmod 750 /etc/gitea
sudo chmod 640 /etc/gitea/app.ini
```

Pour une configuration de production, placez Gitea derrière un reverse proxy tel que nginx avec un
certificat TLS, puis servez l'interface en HTTPS au lieu d'exposer directement le port 3000.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le ou les ports dont Gitea
a besoin et ajoutez-les aux règles réseau/de sécurité de l'instance dans le portail :

```bash
sudo ufw allow 3000/tcp
```

Git via SSH utilise le port 22 existant. Pour exécuter plutôt le serveur SSH intégré de Gitea sur un
port distinct, ouvrez également ce port (par exemple `sudo ufw allow 2222/tcp`).

## Étapes suivantes

- [Documentation Gitea](https://docs.gitea.com/)
- [Guide d'installation Gitea](https://docs.gitea.com/installation/install-from-binary)
