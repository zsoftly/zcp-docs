---
title: Nexus
---

Sonatype Nexus Repository est un gestionnaire de dépôts d'artefacts et de paquets destiné au
stockage et au relais de binaires tels que les composants Maven, npm, NuGet, Docker et PyPI. Il
fournit à vos pipelines de build une source unique et fiable pour les dépendances et les artefacts
de version. L'interface web fonctionne sur le port 8081.

## Logiciels inclus

| Composant        | Version   |
| ---------------- | --------- |
| Nexus Repository | 3.94.0    |
| Ubuntu           | 24.04 LTS |

## Variables d'environnement

Définissez-les facultativement lors du déploiement depuis la marketplace. Laissez un champ vide pour
qu'une valeur sécurisée soit générée.

| Variable               | Description                       |
| ---------------------- | --------------------------------- |
| `NEXUS_ADMIN_PASSWORD` | Mot de passe administrateur Nexus |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Nexus démarre depuis son image Docker préinstallée et génère un mot de passe administrateur initial
unique. L'initialisation peut prendre plusieurs minutes. Suivez la progression avec :

```bash
sudo journalctl -u nexus-first-boot.service -f
```

Vérifiez ensuite le conteneur :

```bash
cd /opt/nexus && docker compose ps
```

### 3. Accéder à l'interface Nexus

Ouvrez un navigateur et accédez à :

```text
http://<your-vm-ip>:8081
```

Consultez les informations de connexion générées :

```bash
sudo cat /etc/nexus/credentials.txt
```

| Champ             | Valeur                            |
| ----------------- | --------------------------------- |
| Nom d'utilisateur | `admin`                           |
| Mot de passe      | Dans `/etc/nexus/credentials.txt` |

Terminez l'assistant de configuration, modifiez le mot de passe administrateur et choisissez votre
politique d'accès anonyme.

## Gérer Nexus

Nexus fonctionne comme une pile Docker Compose dans `/opt/nexus`.

```bash
# Check status
cd /opt/nexus && docker compose ps

# Restart
cd /opt/nexus && docker compose restart

# View logs
cd /opt/nexus && docker compose logs -f
```

| Chemin                          | Fonction                              |
| ------------------------------- | ------------------------------------- |
| `/opt/nexus/docker-compose.yml` | Pile Compose                          |
| `/var/lib/nexus/`               | Données persistantes des dépôts       |
| `/var/lib/nexus/admin.password` | Mot de passe initial généré par Nexus |
| `/etc/nexus/credentials.txt`    | Informations de première connexion    |

## Sécurité

Le port 8081 est ouvert sur l'interface réseau de la VM. UFW est activé et autorise Nexus
(port 8081) et SSH (port 22).

**Pour limiter l'interface et l'API des dépôts à une adresse IP précise :**

```bash
sudo ufw delete allow 8081/tcp
sudo ufw allow from <trusted-ip> to any port 8081
```

**Pour accéder à Nexus sans laisser le port 8081 ouvert, utilisez un tunnel SSH :**

Fermez d'abord le port public sur la VM, puisqu'il est ouvert par défaut :

```bash
sudo ufw delete allow 8081/tcp
```

```bash
# Run this on your local machine
ssh -L 8081:localhost:8081 ubuntu@<your-vm-ip>

# Then open in a browser
http://localhost:8081
```

**Pour une utilisation en production**, placez Nexus derrière un proxy inverse avec un certificat
TLS de confiance et limitez l'accès direct aux réseaux d'administrateurs et de CI/CD.

:::caution

Terminez l'assistant de configuration et modifiez le mot de passe administrateur initial généré
avant d'utiliser Nexus. Réservez `/etc/nexus/credentials.txt` aux administrateurs de confiance.

:::

## Étapes suivantes

- [Documentation de Nexus](https://help.sonatype.com/en/sonatype-nexus-repository.html)
- [Guide d'installation de Nexus](https://help.sonatype.com/en/installation.html)
