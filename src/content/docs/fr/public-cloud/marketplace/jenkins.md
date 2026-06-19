---
title: Jenkins
---

Jenkins est un serveur d'automatisation open source pour la construction, les tests et le
déploiement de logiciels. Son modèle de pipeline-as-code et son vaste écosystème de plugins vous
permettent de mettre en place l'intégration continue et la livraison continue pour presque n'importe
quelle chaîne d'outils. L'interface web s'exécute sur le port 8080.

:::note[Bientôt disponible]

Une image Jenkins préconfigurée arrive bientôt. Pour l'instant, déployez une nouvelle instance
**Ubuntu 24.04 LTS** depuis la marketplace et suivez les étapes ci-dessous pour installer Jenkins
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 50 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Jenkins** et cliquez sur
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

## Installer Jenkins

Jenkins s'exécute sur la JVM. Installez d'abord un OpenJDK pris en charge (17 ou 21) :

```bash
sudo apt install -y fontconfig openjdk-21-jre
java -version
```

Ajoutez la clé de signature et la liste de sources du dépôt apt Jenkins LTS :

```bash
sudo wget -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" \
  | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
```

Installez Jenkins :

```bash
sudo apt update
sudo apt install -y jenkins
```

Le paquet installe un service systemd qui démarre au démarrage du système. Vérifiez qu'il est en
cours d'exécution :

```bash
sudo systemctl enable --now jenkins
sudo systemctl status jenkins
```

## Configurer Jenkins

Jenkins écoute sur le port 8080. Ouvrez `http://<your-vm-ip>:8080` dans un navigateur pour démarrer
l'assistant de configuration. L'assistant demande d'abord le mot de passe de déverrouillage généré
automatiquement. Affichez-le depuis le serveur :

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

Collez la valeur, installez les plugins suggérés et créez votre premier compte administrateur. Pour
une configuration de production, placez Jenkins derrière un reverse proxy tel que nginx avec un
certificat TLS, puis servez l'interface en HTTPS au lieu d'exposer directement le port 8080.

## Ouvrir le pare-feu

L'instance n'autorise par défaut que le SSH (port 22) en externe. Ouvrez le ou les ports dont
Jenkins a besoin et ajoutez-les aux règles réseau/de sécurité de l'instance dans le portail :

```bash
sudo ufw allow 8080/tcp
```

## Étapes suivantes

- [Documentation Jenkins](https://www.jenkins.io/doc/)
- [Guide d'installation Jenkins](https://www.jenkins.io/doc/book/installing/linux/)
