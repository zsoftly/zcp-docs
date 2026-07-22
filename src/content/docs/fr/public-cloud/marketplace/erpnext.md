---
title: ERPNext
---

ERPNext est une suite ERP libre et open source bâtie sur le framework Frappe. Elle couvre la
comptabilité, les stocks, la fabrication, le CRM, les ressources humaines, les projets et plus
encore dans une seule application web. Le moyen le plus simple de l'exécuter consiste à utiliser les
images officielles `frappe_docker` avec Docker Compose.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| ERPNext   | 16.28.0   |
| MariaDB   | 11.8      |
| Redis     | 6.2       |
| Ubuntu    | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable         | Description                         |
| ---------------- | ----------------------------------- |
| `SITE_NAME`      | Nom du site ERPNext                 |
| `ADMIN_PASSWORD` | Mot de passe administrateur ERPNext |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration génère des mots de passe uniques pour ERPNext et
MariaDB, démarre la pile Docker Compose et crée le site initial. Cette opération peut prendre
plusieurs minutes. Suivez la progression :

```bash
journalctl -u erpnext-first-boot.service -f
```

Le message de connexion (MOTD) confirme qu'ERPNext est prêt.

### 3. Vérifier qu'ERPNext fonctionne

```bash
cd /opt/erpnext
docker compose ps
curl -fsS http://127.0.0.1:8080/login > /dev/null
```

### 4. Accéder à l'interface ERPNext

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>:8080
```

Récupérez les identifiants générés :

```bash
sudo cat /etc/erpnext/credentials.txt
```

| Champ             | Valeur                              |
| ----------------- | ----------------------------------- |
| Nom d'utilisateur | `Administrator`                     |
| Mot de passe      | Dans `/etc/erpnext/credentials.txt` |

Terminez l'assistant de configuration après vous être connecté.

## Gérer ERPNext

```bash
# Check container status
cd /opt/erpnext && docker compose ps

# Restart
cd /opt/erpnext && docker compose restart

# View logs
cd /opt/erpnext && docker compose logs -f
```

| Chemin                            | Fonction                                   |
| --------------------------------- | ------------------------------------------ |
| `/opt/erpnext/docker-compose.yml` | Configuration Docker Compose               |
| `/opt/erpnext/.env`               | Version, ports et mots de passe de la pile |
| `/etc/erpnext/credentials.txt`    | Identifiants de connexion générés          |

Les données de la base, du site, des journaux et de Redis persistent dans les volumes Docker
`db-data`, `sites`, `logs` et `redis-queue-data`.

## Sécurité

Le port 8080 est accessible sur l'interface réseau de la VM. UFW est activé et autorise par défaut
SSH (port 22) et ERPNext (port 8080).

**Pour limiter l'interface à une adresse IP précise :**

```bash
sudo ufw delete allow 8080/tcp
sudo ufw allow from <trusted-ip> to any port 8080
```

**Pour accéder à ERPNext sans exposer le port 8080, utilisez un tunnel SSH :**

Fermez d'abord le port public sur la VM, puisqu'il est ouvert par défaut :

```bash
sudo ufw delete allow 8080/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:8080 ubuntu@<your-vm-ip>

# Then open in your browser
http://localhost:8080
```

**Pour une utilisation en production**, placez ERPNext derrière un proxy inverse afin de le servir
sur le port 443 avec un certificat TLS, puis limitez l'accès direct au port 8080.

:::caution

Le fichier d'identifiants contient les mots de passe de l'administrateur ERPNext et du compte racine
MariaDB. Réservez-le aux administrateurs.

:::

## Étapes suivantes

- [Documentation d'ERPNext](https://docs.frappe.io/erpnext)
- [Guide d'installation de frappe_docker](https://github.com/frappe/frappe_docker/blob/main/docs/getting-started.md)
