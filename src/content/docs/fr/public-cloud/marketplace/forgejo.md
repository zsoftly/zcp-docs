---
title: Forgejo
---

Forgejo est une forge Git auto-hébergée, maintenue comme un fork communautaire de Gitea. Elle
regroupe l'hébergement de dépôts, les pull requests, le suivi des tickets, les paquets et les
actions CI dans un seul binaire Go qui tourne bien sur du matériel modeste. L'interface web
s'exécute sur le port 3000 et Git via SSH sur le port 22.

:::note[Bientôt disponible]

Une image Forgejo préconfigurée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Forgejo
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Forgejo** et cliquez sur
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

## Installer Forgejo

Installez d'abord Git et quelques dépendances :

```bash
sudo apt install -y git git-lfs
```

Téléchargez le dernier binaire Forgejo et installez-le dans `/usr/local/bin`. Consultez la
[page de téléchargement Forgejo](https://forgejo.org/download/) pour la version actuelle et
remplacez `15.0.3` ci-dessous si une version plus récente est disponible :

```bash
wget -O forgejo \
  https://codeberg.org/forgejo/forgejo/releases/download/v15.0.3/forgejo-15.0.3-linux-amd64
sudo cp forgejo /usr/local/bin/forgejo
sudo chmod 755 /usr/local/bin/forgejo
```

Créez un utilisateur système `git` dédié sous lequel Forgejo s'exécute :

```bash
sudo adduser --system --shell /bin/bash --gecos 'Git Version Control' \
  --group --disabled-password --home /home/git git
```

Créez les répertoires de données et de configuration :

```bash
sudo mkdir -p /var/lib/forgejo
sudo chown git:git /var/lib/forgejo && sudo chmod 750 /var/lib/forgejo
sudo mkdir /etc/forgejo
sudo chown root:git /etc/forgejo && sudo chmod 770 /etc/forgejo
```

Installez le service systemd fourni avec Forgejo, puis activez-le et démarrez-le :

```bash
sudo wget -O /etc/systemd/system/forgejo.service \
  https://codeberg.org/forgejo/forgejo/raw/branch/forgejo/contrib/systemd/forgejo.service
sudo systemctl daemon-reload
sudo systemctl enable --now forgejo
sudo systemctl status forgejo
```

## Configurer Forgejo

Forgejo écoute sur le port 3000. Ouvrez `http://<your-vm-ip>:3000` dans un navigateur pour exécuter
l'assistant d'installation initial. Acceptez la base de données SQLite par défaut pour une petite
instance, ou orientez Forgejo vers PostgreSQL/MySQL pour des déploiements plus importants.

Avant de terminer, définissez l'**Application URL** sur l'adresse de votre serveur et créez le
premier compte administrateur en bas du formulaire. Le premier utilisateur enregistré devient
l'administrateur. L'assistant écrit ses paramètres dans `/etc/forgejo/app.ini`. Renforcez donc les
permissions des fichiers ensuite :

```bash
sudo chmod 750 /etc/forgejo
sudo chmod 640 /etc/forgejo/app.ini
```

Pour une configuration de production, placez Forgejo derrière un reverse proxy tel que nginx avec un
certificat TLS, puis servez l'interface en HTTPS au lieu d'exposer directement le port 3000.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le ou les ports dont
Forgejo a besoin et ajoutez-les aux règles réseau/de sécurité de l'instance dans le portail :

```bash
sudo ufw allow 3000/tcp
```

Git via SSH utilise le port 22 existant. Pour exécuter plutôt le serveur SSH intégré de Forgejo sur
un port distinct, ouvrez également ce port (par exemple `sudo ufw allow 2222/tcp`).

## Étapes suivantes

- [Documentation Forgejo](https://forgejo.org/docs/latest/)
- [Guide d'installation Forgejo](https://forgejo.org/docs/latest/admin/installation/binary/)
