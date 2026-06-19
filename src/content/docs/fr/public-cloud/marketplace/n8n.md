---
title: n8n
---

n8n est une plateforme libre d'automatisation de flux de travail qui permet de connecter des
applications, des API et des services au moyen d'un éditeur visuel à base de noeuds. Elle prend en
charge des centaines d'intégrations et peut exécuter de la logique JavaScript personnalisée dans les
flux de travail.

## Logiciels inclus

| Composant      | Version         |
| -------------- | --------------- |
| n8n            | 1.121.0         |
| Docker         | Dernière stable |
| Docker Compose | Dernière stable |
| Ubuntu         | 24.04 LTS       |

## Variables d'environnement

Vous pouvez définir cette valeur lors du déploiement de n8n depuis la marketplace.

| Variable   | Description                     |
| ---------- | ------------------------------- |
| `N8N_HOST` | Hôte ou domaine public pour n8n |

## Bien démarrer

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script de configuration s'exécute automatiquement. Il:

- génère une clé de chiffrement aléatoire pour protéger les identifiants stockés dans n8n;
- écrit la configuration d'environnement dans `/opt/n8n/.env`;
- démarre n8n avec Docker Compose.

Cela prend moins de 60 secondes. Suivez la progression:

```bash
journalctl -u n8n-first-boot.service -f
```

### 3. Accédez à l'interface n8n

Ouvrez un navigateur et accédez à:

```text
http://<your-vm-ip>:5678
```

Lors de la première visite, n8n vous demandera de créer un compte propriétaire avec l'adresse
courriel et le mot de passe de votre choix. Ce compte est stocké localement sur la VM.

## Facultatif : définir une URL de webhook personnalisée

Si n8n doit être accessible par un nom de domaine, fournissez l'URL au déploiement avec les userdata
cloud-init. Les webhooks pourront ainsi utiliser votre domaine plutôt que l'adresse IP de la VM.

Ajoutez ceci aux userdata de votre VM au moment du déploiement:

```yaml
#cloud-config
write_files:
  - path: /run/n8n-webhook-url
    content: 'https://n8n.example.com'
    permissions: '0600'
    owner: root:root
```

Si aucune URL n'est fournie, n8n utilise `http://<vm-ip>:5678` par défaut.

## Gérer n8n

n8n s'exécute comme un service Docker Compose dans `/opt/n8n`.

```bash
# Vérifier l'état
cd /opt/n8n && docker compose ps

# Redémarrer
cd /opt/n8n && docker compose restart

# Consulter les journaux
cd /opt/n8n && docker compose logs -f

# Arrêter
cd /opt/n8n && docker compose down

# Démarrer
cd /opt/n8n && docker compose up -d
```

Les données de flux de travail sont conservées dans `/opt/n8n/data`.

Configuration d'environnement: `/opt/n8n/.env`

## Sécurité

Le port 5678 est accessible sur l'interface réseau de la VM. UFW est activé et n'autorise que SSH
(port 22) par défaut.

**Pour autoriser l'accès depuis un navigateur à partir d'une adresse IP précise:**

```bash
sudo ufw allow from <trusted-ip> to any port 5678
```

**Pour accéder à l'interface sans ouvrir le pare-feu, utilisez un tunnel SSH:**

```bash
# Exécutez ceci sur votre poste local
ssh -L 5678:localhost:5678 ubuntu@<your-vm-ip>

# Ouvrez ensuite dans le navigateur
http://localhost:5678
```

**Pour un usage en production**, placez n8n derrière un proxy inverse avec HTTPS et un nom de
domaine, puis définissez `N8N_SECURE_COOKIE=true` dans `/opt/n8n/.env`.

## Prochaines étapes

- [Documentation n8n](https://docs.n8n.io/)
- [Modèles de flux de travail n8n](https://n8n.io/workflows/)
- [Guide d'auto-hébergement](https://docs.n8n.io/hosting/)
