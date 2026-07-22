---
title: Apache Tomcat
---

Apache Tomcat est un conteneur de servlets open source qui exécute des applications web Java. Il
implémente les spécifications Jakarta Servlet, JSP et WebSocket et sert des fichiers WAR via HTTP,
ce qui en fait un choix courant pour héberger des backends Java.

## Logiciels inclus

| Composant     | Version   |
| ------------- | --------- |
| Apache Tomcat | 11.0.24   |
| OpenJDK       | 21 (JRE)  |
| Ubuntu        | 24.04 LTS |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration crée l'administrateur de Manager et de Host
Manager, démarre Tomcat et écrit les identifiants sur le disque. Cette opération prend environ une
minute. Suivez la progression :

```bash
journalctl -u tomcat-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Tomcat est prêt.

### 3. Vérifier qu'Apache Tomcat fonctionne

```bash
systemctl status tomcat
curl -I http://localhost:8080
```

### 4. Accéder à Apache Tomcat

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>:8080
```

Récupérez les identifiants de Manager :

```bash
sudo cat /root/.credentials/tomcat.txt
```

| Champ             | Valeur                               |
| ----------------- | ------------------------------------ |
| Nom d'utilisateur | `admin`                              |
| Mot de passe      | Dans `/root/.credentials/tomcat.txt` |

Les applications Manager et Host Manager n'acceptent que les connexions depuis localhost. Utilisez
le tunnel SSH indiqué dans le fichier d'identifiants pour y accéder.

## Gérer Apache Tomcat

```bash
# Check service status
systemctl status tomcat

# Restart
sudo systemctl restart tomcat

# View logs
sudo journalctl -u tomcat -f
```

| Chemin                              | Fonction                              |
| ----------------------------------- | ------------------------------------- |
| `/opt/tomcat/conf/tomcat-users.xml` | Utilisateurs et rôles de Manager      |
| `/opt/tomcat/webapps/`              | Applications et fichiers WAR déployés |
| `/opt/tomcat/logs/`                 | Journaux Tomcat                       |

## Sécurité

Le port 8080 est accessible sur l'interface réseau de la VM. UFW est activé et autorise par défaut
SSH (port 22) et Tomcat (port 8080). Les applications Manager et Host Manager restent limitées à
localhost par Tomcat.

**Pour limiter Tomcat à une adresse IP précise :**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

**Pour accéder à Tomcat sans exposer le port 8080, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 8080:localhost:8080 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
http://localhost:8080/manager/html
```

**Pour une utilisation en production**, placez Tomcat derrière un proxy inverse tel que Nginx ou
HAProxy afin de le servir sur le port 443 avec un certificat TLS.

## Étapes suivantes

- [Documentation d'Apache Tomcat](https://tomcat.apache.org/tomcat-11.0-doc/index.html)
- [Guide d'installation d'Apache Tomcat](https://tomcat.apache.org/tomcat-11.0-doc/setup.html)
