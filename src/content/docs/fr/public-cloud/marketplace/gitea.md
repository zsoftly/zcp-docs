---
title: Gitea
---

Gitea est un service Git léger et auto-hébergé, écrit en Go. Son binaire serveur comprend
l'hébergement de dépôts, la revue de code, le suivi des tickets et Gitea Actions pour le CI/CD côté
serveur. Le serveur s'exécute sans peine sur une petite VM. L'exécution des flux de travail
nécessite un `act_runner` (Gitea Runner) distinct, que vous devez installer et enregistrer.
L'interface web fonctionne sur le port 3000 et Git via SSH sur le port 22.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| Gitea     | 1.27.0    |
| Ubuntu    | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable               | Description                            |
| ---------------------- | -------------------------------------- |
| `GITEA_DOMAIN`         | Domaine public de Gitea                |
| `GITEA_ADMIN_USER`     | Nom d'utilisateur administrateur Gitea |
| `GITEA_ADMIN_PASSWORD` | Mot de passe administrateur Gitea      |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration génère les secrets de l'application, configure
Gitea avec SQLite, démarre le service et crée le compte administrateur. Suivez la progression :

```bash
journalctl -u gitea-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Gitea est prêt.

### 3. Vérifier que Gitea fonctionne

```bash
systemctl status gitea
curl -fsS http://127.0.0.1:3000/api/healthz
```

### 4. Accéder à l'interface Gitea

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>:3000
```

Récupérez les identifiants générés :

```bash
sudo cat /etc/gitea/credentials.txt
```

| Champ             | Valeur                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| Nom d'utilisateur | `zadmin` par défaut, ou la valeur `GITEA_ADMIN_USER` définie. Voir `/etc/gitea/credentials.txt` |
| Mot de passe      | Dans `/etc/gitea/credentials.txt`                                                               |

Git via SSH utilise le service SSH de la VM sur le port 22.

## Gérer Gitea

```bash
# Check service status
systemctl status gitea

# Restart
sudo systemctl restart gitea

# View logs
sudo journalctl -u gitea -f
```

| Chemin                 | Fonction                                         |
| ---------------------- | ------------------------------------------------ |
| `/etc/gitea/app.ini`   | Configuration principale                         |
| `/var/lib/gitea/data/` | Dépôts, base de données SQLite et téléversements |
| `/var/lib/gitea/log/`  | Fichiers journaux de Gitea                       |

## Sécurité

Le port 3000 est accessible sur l'interface réseau de la VM. UFW est activé et autorise par défaut
SSH (port 22) et Gitea (port 3000).

**Pour limiter l'interface à une adresse IP précise :**

```bash
sudo ufw delete allow 3000/tcp
sudo ufw allow from <trusted-ip> to any port 3000
```

**Pour accéder à l'interface sans exposer le port 3000, utilisez un tunnel SSH :**

Fermez d'abord le port public sur la VM, puisqu'il est ouvert par défaut :

```bash
sudo ufw delete allow 3000/tcp
```

```bash
# Run this on your local machine
ssh -L 3000:localhost:3000 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:3000
```

**Pour une utilisation en production**, placez Gitea derrière un proxy inverse afin de le servir sur
le port 443 avec un certificat TLS. Limitez l'accès SSH sur le port 22 aux utilisateurs et aux
réseaux autorisés.

:::caution

Gardez `/etc/gitea/credentials.txt` confidentiel et modifiez le mot de passe administrateur initial
après votre première connexion.

:::

## Étapes suivantes

- [Documentation de Gitea](https://docs.gitea.com/)
- [Guide d'installation de Gitea](https://docs.gitea.com/installation/install-from-binary)
