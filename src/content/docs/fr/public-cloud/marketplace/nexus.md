---
title: Nexus
---

Sonatype Nexus Repository est un gestionnaire de dépôts d'artefacts et de paquets pour stocker et
relayer des binaires tels que les composants Maven, npm, NuGet, Docker et PyPI. Il offre à vos
chaînes de build une source unique et fiable pour les dépendances et les artefacts de version.
L'interface web s'exécute sur le port 8081.

:::note[Bientôt disponible]

Une image Nexus préinstallée arrive bientôt. Pour l'instant, déployez une nouvelle instance **Ubuntu
24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Nexus vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 40 Go   | 100 Go     |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Nexus** et cliquez sur **Deploy**
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

## Installer Nexus

Le bundle Nexus Repository actuel embarque sa propre JVM, mais l'installation d'un OpenJDK 21 pris
en charge est recommandée pour l'outillage et le dépannage:

```bash
sudo apt install -y openjdk-21-jre
java -version
```

Créez un utilisateur système `nexus` dédié:

```bash
sudo useradd -r -m -U -d /opt/nexus -s /bin/bash nexus
```

Téléchargez et extrayez la dernière archive Nexus Repository dans `/opt`:

```bash
cd /tmp
curl -L -O https://download.sonatype.com/nexus/3/latest-unix.tar.gz
sudo tar -xzf latest-unix.tar.gz -C /opt
```

L'archive extrait deux répertoires: un répertoire d'application versionné `nexus-<version>` et un
répertoire de données `sonatype-work`. Créez des liens symboliques stables et définissez les droits:

```bash
sudo ln -s /opt/nexus-* /opt/nexus-app
sudo chown -R nexus:nexus /opt/nexus-* /opt/sonatype-work
```

Indiquez à Nexus de s'exécuter sous l'utilisateur `nexus`:

```bash
echo 'run_as_user="nexus"' | sudo tee /opt/nexus-app/bin/nexus.rc
```

Créez un service systemd dans `/etc/systemd/system/nexus.service`:

```bash
sudo tee /etc/systemd/system/nexus.service > /dev/null <<'EOF'
[Unit]
Description=Sonatype Nexus Repository
After=network.target

[Service]
Type=forking
LimitNOFILE=65536
ExecStart=/opt/nexus-app/bin/nexus start
ExecStop=/opt/nexus-app/bin/nexus stop
User=nexus
Group=nexus
Restart=on-abort
TimeoutSec=600

[Install]
WantedBy=multi-user.target
EOF
```

Activez et démarrez le service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now nexus
sudo systemctl status nexus
```

## Configurer Nexus

Nexus écoute sur le port 8081. Le premier démarrage prend une minute ou deux pour s'initialiser.
Ouvrez `http://<your-vm-ip>:8081` dans un navigateur et cliquez sur **Sign in**. Le nom
d'utilisateur administrateur initial est `admin` et le mot de passe généré est écrit dans un fichier
du répertoire de données:

```bash
sudo cat /opt/sonatype-work/nexus3/admin.password
```

Collez cette valeur, puis suivez l'assistant de configuration pour définir un nouveau mot de passe
administrateur et choisir votre politique d'accès anonyme. Pour un déploiement de production, placez
Nexus derrière un reverse proxy tel que nginx avec un certificat TLS et servez l'interface en HTTPS
au lieu d'exposer directement le port 8081.

## Ouvrir le pare-feu

L'instance n'autorise que le SSH (port 22) en externe par défaut. Ouvrez le ou les ports dont Nexus
a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 8081/tcp
```

## Étapes suivantes

- [Documentation Nexus](https://help.sonatype.com/en/sonatype-nexus-repository.html)
- [Guide d'installation Nexus](https://help.sonatype.com/en/installation.html)
