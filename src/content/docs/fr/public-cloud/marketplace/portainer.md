---
title: Portainer
---

Portainer est une interface de gestion légère pour les environnements Docker et Kubernetes. Elle
permet de déployer des conteneurs, gérer les images, volumes et réseaux, et surveiller vos piles
depuis une console web unique. L'interface s'exécute sur le port 9443 en HTTPS.

## Logiciels inclus

| Composant    | Version         |
| ------------ | --------------- |
| Portainer CE | 2.27.9          |
| Docker       | Dernière stable |
| Ubuntu       | 24.04 LTS       |

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 20 Go   | 40 Go      |

## Variables d'environnement

Vous pouvez définir cette variable au déploiement de Portainer depuis le Marketplace. Laissez-la
vide pour créer le compte administrateur dans l'interface au premier accès.

| Variable                   | Description                                   |
| -------------------------- | --------------------------------------------- |
| `PORTAINER_ADMIN_PASSWORD` | Mot de passe du compte administrateur initial |

## Démarrage

### 1. Se connecter à la VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, un script lance le conteneur Portainer avec Docker Compose. Cela prend moins
d'une minute. Suivez la progression:

```bash
journalctl -u portainer-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Portainer est prêt.

### 3. Créer le compte administrateur

Ouvrez un navigateur et allez à:

```text
https://<your-vm-ip>:9443
```

Au premier chargement, créez votre compte administrateur en définissant un nom d'utilisateur et un
mot de passe fort. Portainer se connecte à l'environnement Docker local via le socket monté. Vos
conteneurs, images et volumes apparaissent donc immédiatement.

:::caution

Portainer verrouille la configuration initiale si aucun compte administrateur n'est créé peu après
le démarrage du conteneur. Si la fenêtre de configuration expire, redémarrez Portainer et rechargez
la page:

```bash
cd /opt/portainer && docker compose restart
```

L'interface utilise un certificat autosigné. Votre navigateur affiche donc un avertissement de
sécurité. Acceptez l'exception pour continuer.

:::

## Gérer Portainer

Portainer s'exécute comme pile Docker Compose dans `/opt/portainer`.

```bash
# Vérifier l'état
cd /opt/portainer && docker compose ps

# Redémarrer
cd /opt/portainer && docker compose restart

# Voir les journaux
cd /opt/portainer && docker compose logs -f
```

Les données persistantes de Portainer sont stockées dans `/var/lib/portainer`. Un résumé des URL et
chemins est écrit dans `/etc/portainer/info.txt`.

## Sécurité

Le port 9443 est ouvert sur l'interface réseau de la VM. UFW est activé et autorise SSH (port 22) et
Portainer (port 9443). Les ports 8000, 9000 et l'API Docker ne sont pas ouverts par défaut.

Portainer monte le socket Docker de l'hôte, ce qui lui donne le contrôle complet du démon Docker de
la VM. Limitez l'accès au port 9443:

```bash
sudo ufw delete allow 9443/tcp
sudo ufw allow from <trusted-ip> to any port 9443
```

**En production**, placez Portainer derrière un proxy inverse comme nginx avec un certificat TLS de
confiance.

## Prochaines étapes

- [Documentation Portainer](https://docs.portainer.io/)
- [Gérer les environnements Docker](https://docs.portainer.io/user/docker)
