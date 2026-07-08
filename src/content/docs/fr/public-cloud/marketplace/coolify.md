---
title: Coolify
---

Coolify est une plateforme PaaS (Platform as a Service) open source auto-hébergée qui constitue une
alternative à Heroku, Netlify et Vercel. Elle permet de déployer des applications, des bases de
données et des services sur votre propre infrastructure à l'aide de flux Git et d'un tableau de bord
web, tout en conservant un contrôle total sur vos données.

## Logiciels inclus

| Composant      | Version         |
| -------------- | --------------- |
| Coolify        | 4.1.2           |
| Docker         | Dernière stable |
| Docker Compose | Dernière stable |
| Ubuntu         | 24.04 LTS       |

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 30 Go   | 60 Go      |

Coolify héberge également les applications, les bases de données et les services que vous déployez.
Il est donc important de dimensionner correctement l'instance en fonction des charges de travail
prévues.

## Démarrage

### 1. Se connecter à la machine virtuelle

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Lors du premier démarrage, un script génère les secrets de l'application et démarre l'ensemble de la
pile Coolify avec Docker Compose. Cette opération prend environ 1 à 2 minutes. Vous pouvez suivre la
progression avec la commande suivante:

```bash
journalctl -u coolify-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Coolify est prêt.

### 3. Créer le compte administrateur

Ouvrez le tableau de bord dans votre navigateur:

```text
http://<your-vm-ip>:8000
```

Le premier compte créé devient l'administrateur racine. Définissez immédiatement une adresse
courriel et un mot de passe forts, car l'inscription se ferme après le premier utilisateur.

### 4. Configurer l'instance

1. Dans les **paramètres (Settings)**, définissez le domaine de l'instance afin que Coolify émette
   des certificats TLS Let's Encrypt et serve le tableau de bord en HTTPS. Coolify inclut un proxy
   inverse intégré qui gère le routage et les certificats pour le tableau de bord et vos
   applications déployées. Le DNS doit pointer vers la machine virtuelle avant l'émission des
   certificats.
2. Connectez une source Git (GitHub, GitLab ou dépôt générique) pour commencer à déployer des
   applications.

## Gérer Coolify

Coolify s'exécute comme pile Docker Compose dans `/data/coolify/source`.

```bash
# Vérifier l'état
cd /data/coolify/source && docker compose ps

# Redémarrer
cd /data/coolify/source && docker compose restart

# Voir les journaux
cd /data/coolify/source && docker compose logs -f
```

Un résumé des URL et des chemins est écrit dans `/data/coolify/info.txt`.

## Sécurité

Les ports 8000 (tableau de bord), 6001 (temps réel), 6002 (terminal), 80 et 443 sont ouverts sur
l'interface réseau de la machine virtuelle. UFW est activé et autorise ces ports ainsi que SSH (port
22). Les ports 80 et 443 servent vos applications déployées et TLS.

Lorsque vous configurez un domaine personnalisé avec Let's Encrypt, accédez au tableau de bord en
HTTPS sur le port 443. Vous pouvez ensuite fermer les ports 8000, 6001 et 6002 si l'accès direct
n'est plus nécessaire:

```bash
sudo ufw delete allow 8000/tcp
sudo ufw delete allow 6001/tcp
sudo ufw delete allow 6002/tcp
```

Terminez rapidement la configuration administrateur après le premier démarrage afin que personne
d'autre ne puisse réclamer le compte racine.

## Prochaines étapes

- [Documentation Coolify](https://coolify.io/docs)
- [Démarrer avec Coolify](https://coolify.io/docs/get-started/introduction)
