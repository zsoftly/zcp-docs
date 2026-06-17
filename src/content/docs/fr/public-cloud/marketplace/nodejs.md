---
title: Node.js 24
---

Cette image fournit un environnement Ubuntu 24.04 propre avec Node.js 24 LTS et PM2 préinstallés.
Elle est conçue pour déployer des applications Node.js qui doivent s'exécuter de façon persistante
comme processus gérés.

## Logiciels inclus

| Composant | Version             |
| --------- | ------------------- |
| Node.js   | 24.x (LTS)          |
| npm       | Inclus avec Node.js |
| PM2       | Dernière stable     |
| Ubuntu    | 24.04 LTS           |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Vérifiez l'installation

Aucune configuration de premier démarrage n'est requise. Node.js et PM2 sont prêts immédiatement.

```bash
node --version
npm --version
pm2 --version
```

### 3. Déployez votre application

Téléversez les fichiers de votre application sur la VM, puis démarrez l'application avec PM2:

```bash
# Démarrer votre application
pm2 start app.js --name my-app

# Enregistrer la liste des processus pour la conserver après les redémarrages
pm2 save
pm2 startup
```

Exécutez la commande affichée par `pm2 startup` pour enregistrer PM2 auprès de systemd.

## Gérer votre application avec PM2

```bash
# Lister les processus en cours
pm2 list

# Consulter les journaux
pm2 logs my-app

# Redémarrer
pm2 restart my-app

# Arrêter
pm2 stop my-app

# Supprimer de PM2
pm2 delete my-app
```

## Sécurité

Aucun port d'application n'est ouvert par défaut. UFW est activé et n'autorise que SSH (port 22).

**Pour autoriser le trafic sur le port de votre application:**

```bash
sudo ufw allow <your-app-port>/tcp
```

**Pour une application Web**, envisagez de la placer derrière Nginx ou Caddy comme proxy inverse
afin de servir HTTPS sur le port 443 et d'acheminer les requêtes vers votre application Node.js à
l'interne.

## Prochaines étapes

- [Documentation Node.js](https://nodejs.org/docs/latest/api/)
- [Documentation PM2](https://pm2.keymetrics.io/docs/)
- [Documentation npm](https://docs.npmjs.com/)
