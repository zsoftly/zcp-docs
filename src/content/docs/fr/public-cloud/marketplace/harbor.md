---
title: Harbor
---

Harbor est un registre de conteneurs open source qui stocke, signe et analyse les images de
conteneurs et les artefacts OCI. Il ajoute le contrôle d'accès basé sur les rôles, l'analyse des
vulnérabilités et la réplication d'images à l'API de registre standard. L'interface web fonctionne
sur les ports 80 et 443.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| Harbor    | 2.15.0    |
| Ubuntu    | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable                | Description                        |
| ----------------------- | ---------------------------------- |
| `HARBOR_HOSTNAME`       | Nom d'hôte public de Harbor        |
| `HARBOR_ADMIN_PASSWORD` | Mot de passe administrateur Harbor |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Harbor génère des identifiants uniques, prépare sa pile Docker Compose et démarre automatiquement.
Cette opération peut prendre plusieurs minutes. Suivez la progression avec :

```bash
sudo journalctl -u harbor-first-boot.service -f
```

Vérifiez ensuite la pile :

```bash
cd /opt/harbor/harbor && docker compose ps
```

### 3. Accéder à l'interface Harbor

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>
```

Consultez les informations de connexion générées :

```bash
sudo cat /root/.credentials/harbor.txt
```

| Champ             | Valeur                               |
| ----------------- | ------------------------------------ |
| Nom d'utilisateur | `admin`                              |
| Mot de passe      | Dans `/root/.credentials/harbor.txt` |

## Gérer Harbor

Harbor fonctionne comme une pile Docker Compose dans `/opt/harbor/harbor`.

```bash
# Check status
cd /opt/harbor/harbor && docker compose ps

# Restart
cd /opt/harbor/harbor && docker compose restart

# View logs
cd /opt/harbor/harbor && docker compose logs -f
```

| Chemin                          | Fonction                                      |
| ------------------------------- | --------------------------------------------- |
| `/opt/harbor/harbor/harbor.yml` | Configuration principale de Harbor            |
| `/data/harbor/`                 | Données du registre et de l'application       |
| `/root/.credentials/harbor.txt` | Informations de connexion et de base générées |

Si vous attachez un disque de données vierge supplémentaire avant le premier démarrage, l'image le
formate et le monte sur `/data`. Sans disque supplémentaire, `/data/harbor` utilise le système de
fichiers racine.

## Sécurité

Harbor écoute par défaut sur le port 80. UFW est activé et autorise HTTP (port 80), HTTPS (port 443)
et SSH (port 22). Le port 443 est réservé à Harbor HTTPS et ne fournit aucun service TLS tant que
vous ne l'avez pas activé.

**Pour limiter Harbor à une adresse IP précise :**

```bash
sudo ufw delete allow 80/tcp
sudo ufw delete allow 443/tcp
sudo ufw allow from <trusted-ip> to any port 80
sudo ufw allow from <trusted-ip> to any port 443
```

**Pour accéder à l'interface sans laisser le port 80 ouvert, utilisez un tunnel SSH :**

Fermez d'abord le port public sur la VM, puisqu'il est ouvert par défaut :

```bash
sudo ufw delete allow 80/tcp
sudo ufw delete allow 443/tcp
```

```bash
# Run this on your local machine
ssh -L 8080:localhost:80 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8080
```

**Pour une utilisation en production**, configurez Harbor avec un nom DNS et un certificat TLS de
confiance, ou placez-le derrière un proxy inverse qui termine TLS avant que les clients ne poussent
des images ou des artefacts.

:::caution

Traitez `/root/.credentials/harbor.txt` comme un fichier sensible. Limitez l'accès au registre aux
utilisateurs et aux réseaux autorisés, et utilisez TLS avant de transmettre les identifiants du
registre sur le réseau.

:::

## Étapes suivantes

- [Documentation de Harbor](https://goharbor.io/docs/)
- [Guide d'installation de Harbor](https://goharbor.io/docs/latest/install-config/)
