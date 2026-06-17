---
title: OpenClaw
---

OpenClaw est un outil basé sur Node.js pour créer et exécuter des flux de travail et des
intégrations automatisés. Cette image fournit Node.js 24 avec le paquet OpenClaw préinstallé
globalement, prêt à configurer avec vos clés API et vos canaux.

## Logiciels inclus

| Composant | Version         |
| --------- | --------------- |
| OpenClaw  | Dernière stable |
| Node.js   | 24.x            |
| Ubuntu    | 24.04 LTS       |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Vérifiez l'installation

Aucune configuration de premier démarrage n'est requise. OpenClaw et Node.js sont prêts
immédiatement.

```bash
openclaw --version
node --version
```

### 3. Configurer OpenClaw

OpenClaw nécessite vos clés API et la configuration de vos canaux avant de pouvoir s'exécuter.
Consultez la documentation OpenClaw pour le format de configuration et les identifiants requis par
vos intégrations.

```bash
openclaw --help
```

### 4. Démarrer OpenClaw

```bash
openclaw start
```

OpenClaw écoute sur le port **18789** par défaut.

## Gérer OpenClaw

Pour exécuter OpenClaw de façon persistante et le conserver après les redémarrages, gérez-le avec
PM2 (non inclus, à installer avec npm):

```bash
sudo npm install -g pm2
pm2 start openclaw --name openclaw -- start
pm2 save
pm2 startup
```

Exécutez la commande affichée par `pm2 startup` pour enregistrer PM2 auprès de systemd.

## Sécurité

Le port 18789 n'est **pas** ouvert vers l'extérieur par défaut. UFW est activé et n'autorise que SSH
(port 22).

**Pour autoriser l'accès depuis une adresse IP précise:**

```bash
sudo ufw allow from <trusted-ip> to any port 18789
```

**Pour accéder à OpenClaw sans ouvrir le pare-feu, utilisez un tunnel SSH:**

```bash
# Exécutez ceci sur votre poste local
ssh -L 18789:localhost:18789 ubuntu@<your-vm-ip>
```

## Prochaines étapes

- [OpenClaw sur GitHub](https://github.com/openclaw/openclaw)
- [Documentation Node.js](https://nodejs.org/docs/latest/api/)
