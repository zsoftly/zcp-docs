---
title: Ghost
---

Ghost est une plateforme de publication open source pour blogues, infolettres et sites avec
abonnements. Elle associe un éditeur rapide et l'envoi de courriels intégré à une interface publique
rapide, pilotée par des thèmes.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| Ghost     | 5.97.0    |
| Node.js   | 20.x      |
| MySQL     | 8.0       |
| nginx     | Dernière  |
| Ubuntu    | 24.04 LTS |

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 20 Go   | 40 Go      |

:::caution

Ghost exige un nom de domaine. Il ne fonctionne pas avec une simple adresse IP. Fournissez
`GHOST_URL` au déploiement (voir ci-dessous) et pointez le DNS de ce domaine vers la VM.

:::

## Variables d'environnement

Vous pouvez les définir au déploiement de Ghost depuis le Marketplace. Laissez `GHOST_DB_PASSWORD`
vide pour générer automatiquement une valeur aléatoire sécurisée.

| Variable            | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `GHOST_URL`         | URL complète du site, par exemple `https://blog.example.com` |
| `GHOST_ADMIN_EMAIL` | Adresse courriel du compte administrateur Ghost              |
| `GHOST_DB_PASSWORD` | Mot de passe de l'utilisateur MySQL `ghost`                  |

Si `GHOST_URL` n'est pas définie, la VM sert une page temporaire et laisse Ghost non configuré
jusqu'à ce que vous fournissiez un domaine.

## Démarrage

### 1. Se connecter à la VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, un script crée la base MySQL, configure Ghost pour votre `GHOST_URL`, écrit
l'hôte virtuel nginx et démarre le site comme service systemd. Cela prend 1 à 2 minutes. Suivez la
progression:

```bash
journalctl -u ghost-first-boot.service -f
```

Le message de connexion (MOTD) confirme quand Ghost est prêt.

### 3. Terminer la configuration administrateur

Ouvrez l'administration dans un navigateur et créez le premier compte administrateur:

```text
https://your-domain.com/ghost
```

Les identifiants de base de données générés sont écrits dans un fichier réservé à root:

```bash
sudo cat /etc/ghost/credentials.txt
```

### 4. Activer HTTPS

TLS n'est pas configuré automatiquement, car le DNS de votre domaine doit d'abord pointer vers la
VM. Une fois la résolution DNS active, provisionnez un certificat Let's Encrypt gratuit:

```bash
cd /var/www/ghost
ghost setup ssl
```

## Gérer Ghost

Ghost s'exécute comme service systemd par site nommé `ghost_<hostname>` (par exemple
`ghost_blog-example-com`). Gérez-le depuis le répertoire d'installation:

```bash
# Afficher l'instance en cours et son nom de service
cd /var/www/ghost && ghost ls

# Redémarrer, arrêter et démarrer
ghost restart
ghost stop
ghost start
```

Répertoire d'installation: `/var/www/ghost`. Le contenu (thèmes, images et données) se trouve sous
`/var/www/ghost/content`.

## Sécurité

Les ports 80 et 443 sont ouverts sur l'interface réseau de la VM. UFW est activé et autorise SSH
(port 22), HTTP (80) et HTTPS (443).

**En production**, terminez l'étape Let's Encrypt ci-dessus afin que le site soit servi en HTTPS, et
limitez l'accès SSH aux plages IP connues.

## Prochaines étapes

- [Documentation Ghost](https://ghost.org/docs/)
- [Configurer Ghost](https://ghost.org/docs/config/)
