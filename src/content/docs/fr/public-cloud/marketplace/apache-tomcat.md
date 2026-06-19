---
title: Apache Tomcat
---

Apache Tomcat est un conteneur de servlets open source qui exécute des applications web Java. Il
implémente les spécifications Jakarta Servlet, JSP et WebSocket et sert des fichiers WAR via HTTP,
ce qui en fait un choix standard pour héberger des backends Java.

:::note[Bientôt disponible]

Une image Apache Tomcat préconfigurée arrive bientôt. Pour l'instant, déployez une instance **Ubuntu
24.04 LTS** neuve depuis la marketplace et suivez les étapes ci-dessous pour installer Apache Tomcat
vous-même.

:::

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 10 Go   | 20 Go      |

## Déployer l'instance de base

1. Dans le portail ZSoftly Cloud, ouvrez **Apps**, sélectionnez **Apache Tomcat** et cliquez sur
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

## Installer Apache Tomcat

Tomcat 11 nécessite Java 17 ou une version ultérieure. Installez d'abord OpenJDK 21:

```bash
sudo apt install -y openjdk-21-jdk
```

Créez un utilisateur `tomcat` dédié et téléchargez Tomcat 11 depuis le miroir officiel:

```bash
sudo useradd -r -m -U -d /opt/tomcat -s /bin/false tomcat
```

```bash
cd /tmp
curl -fSLO https://dlcdn.apache.org/tomcat/tomcat-11/v11.0.22/bin/apache-tomcat-11.0.22.tar.gz
sudo tar -xzf apache-tomcat-11.0.22.tar.gz -C /opt/tomcat --strip-components=1
```

Définissez les droits de propriété et rendez les scripts exécutables:

```bash
sudo chown -R tomcat:tomcat /opt/tomcat
sudo chmod +x /opt/tomcat/bin/*.sh
```

Créez un service systemd pour que Tomcat démarre au boot:

```bash
sudo tee /etc/systemd/system/tomcat.service >/dev/null <<'EOF'
[Unit]
Description=Apache Tomcat 11
After=network.target

[Service]
Type=forking
User=tomcat
Group=tomcat
Environment="JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64"
Environment="CATALINA_HOME=/opt/tomcat"
Environment="CATALINA_BASE=/opt/tomcat"
Environment="CATALINA_PID=/opt/tomcat/temp/tomcat.pid"
ExecStart=/opt/tomcat/bin/startup.sh
ExecStop=/opt/tomcat/bin/shutdown.sh
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF
```

Rechargez systemd et démarrez Tomcat:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now tomcat
```

Tomcat écoute désormais sur le port 8080. Vérifiez-le:

```bash
curl -I http://localhost:8080
```

## Configurer Apache Tomcat

Pour utiliser les applications Manager et Host Manager, ajoutez un utilisateur admin dans
`/opt/tomcat/conf/tomcat-users.xml`, à l'intérieur de l'élément `<tomcat-users>`:

```xml
<role rolename="manager-gui"/>
<role rolename="admin-gui"/>
<user username="admin" password="ChangeMeNow" roles="manager-gui,admin-gui"/>
```

Par défaut, l'application Manager n'accepte que les connexions depuis localhost. Pour y accéder
depuis votre navigateur, commentez le `RemoteAddrValve` dans
`/opt/tomcat/webapps/manager/META-INF/context.xml` (et l'équivalent pour Host Manager). En
production, restreignez l'accès par IP ou par un reverse proxy plutôt que de supprimer la valve.
Redémarrez pour appliquer les changements:

```bash
sudo systemctl restart tomcat
```

## Ouvrir le pare-feu

Par défaut, l'instance n'autorise que le SSH (port 22) depuis l'extérieur. Ouvrez les ports dont
Apache Tomcat a besoin et ajoutez-les aux règles réseau/sécurité de l'instance dans le portail:

```bash
sudo ufw allow 8080/tcp
```

En production, exécutez Tomcat derrière un reverse proxy tel que Nginx ou HAProxy sur les ports
80/443 plutôt que d'exposer directement le port 8080.

## Étapes suivantes

- [Documentation Apache Tomcat](https://tomcat.apache.org/tomcat-11.0-doc/index.html)
- [Guide d'installation d'Apache Tomcat](https://tomcat.apache.org/tomcat-11.0-doc/setup.html)
