---
title: Jenkins
---

Jenkins est un serveur d'automatisation open source pour compiler, tester et déployer des logiciels.
Son modèle pipeline-as-code et son grand écosystème de plugins permettent de connecter l'intégration
continue et la livraison continue à presque n'importe quelle chaîne d'outils. L'interface web
s'exécute sur le port 8080.

## Logiciels inclus

| Composant | Version       |
| --------- | ------------- |
| Jenkins   | 2.555.3 (LTS) |
| OpenJDK   | 21 (JRE)      |
| Ubuntu    | 24.04 LTS     |

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 50 Go      |

## Variables d'environnement

Vous pouvez les définir au déploiement de Jenkins depuis la Marketplace. Laissez un champ de mot de
passe vide pour générer automatiquement une valeur aléatoire sécurisée.

| Variable                 | Description                                        |
| ------------------------ | -------------------------------------------------- |
| `JENKINS_ADMIN_USER`     | Nom d'utilisateur du compte administrateur initial |
| `JENKINS_ADMIN_PASSWORD` | Mot de passe du compte administrateur initial      |

## Démarrage

### 1. Se connecter à la machine virtuelle

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, un script lance Jenkins. Jenkins génère ensuite un mot de passe administrateur
initial unique pour cette instance. Le premier démarrage peut prendre quelques minutes. Suivez la
progression:

```bash
journalctl -u jenkins-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Jenkins est prêt.

### 3. Récupérer le mot de passe administrateur initial

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### 4. Terminer l'assistant de configuration

Ouvrez un navigateur et allez à:

```text
http://<your-vm-ip>:8080
```

Collez le mot de passe administrateur initial, installez les plugins suggérés, puis créez votre
premier compte administrateur.

## Gérer Jenkins

Jenkins s'exécute comme service systemd.

```bash
# Vérifier l'état
systemctl status jenkins

# Redémarrer
sudo systemctl restart jenkins

# Voir les journaux
sudo journalctl -u jenkins -f
```

Répertoire Jenkins home (tâches, plugins et configuration): `/var/lib/jenkins`.

## Sécurité

Le port 8080 est ouvert sur l'interface réseau de la machine virtuelle. UFW est activé et autorise
SSH (port 22) et Jenkins (port 8080). Aucun port d'agent de build (50000) n'est ouvert par défaut.

**Pour limiter l'interface à une adresse IP précise:**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

**Pour accéder à l'interface sans ouvrir le pare-feu, utilisez un tunnel SSH:**

```bash
# Exécuter cette commande sur votre machine locale
ssh -L 8080:localhost:8080 ubuntu@<your-vm-ip>
```

**En production**, placez Jenkins derrière un proxy inverse comme nginx avec un certificat TLS, et
servez l'interface en HTTPS au lieu d'exposer directement le port 8080.

## Prochaines étapes

- [Documentation Jenkins](https://www.jenkins.io/doc/)
- [Gérer les plugins](https://www.jenkins.io/doc/book/managing/plugins/)
- [Référence Pipeline](https://www.jenkins.io/doc/book/pipeline/)
