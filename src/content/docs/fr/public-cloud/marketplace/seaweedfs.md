---
title: SeaweedFS
---

SeaweedFS est un système open source distribué de stockage de fichiers et d'objets, conçu pour des
milliards de fichiers et un accès rapide. Un seul binaire `weed` exécute les composants maître,
volume, filer et S3, et la passerelle S3 expose une API compatible S3 pour les charges de travail
d'applications.

## Logiciels inclus

| Composant | Version   |
| --------- | --------- |
| SeaweedFS | 4.39      |
| Ubuntu    | 24.04 LTS |

## Démarrage

### 1. Se connecter à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration du premier démarrage

Au premier démarrage, un script de configuration génère les identifiants de l'API compatible S3 et
lance le service tout-en-un `weed mini`. Suivez la progression :

```bash
sudo journalctl -u seaweedfs-first-boot.service -f
```

Le message de connexion (MOTD) confirme que SeaweedFS est prêt. Vous pouvez également vérifier
directement le service :

```bash
systemctl status seaweedfs
```

### 3. Récupérer les identifiants de l'API compatible S3

Les identifiants et les points de terminaison générés sont stockés dans un fichier réservé à
l'utilisateur racine :

```bash
sudo cat /etc/seaweedfs/credentials.txt
```

| Champ       | Valeur                                            |
| ----------- | ------------------------------------------------- |
| Clé d'accès | Générée de manière sécurisée au premier démarrage |
| Clé secrète | Générée de manière sécurisée au premier démarrage |

### 4. Accéder à SeaweedFS

L'image démarre les points de terminaison suivants :

| Composant         | Point de terminaison        |
| ----------------- | --------------------------- |
| API compatible S3 | `http://<your-vm-ip>:8333`  |
| Interface Filer   | `http://<your-vm-ip>:8888`  |
| Interface Master  | `http://<your-vm-ip>:9333`  |
| Volume            | `http://<your-vm-ip>:9340`  |
| WebDAV            | `http://<your-vm-ip>:7333`  |
| Interface Admin   | `http://<your-vm-ip>:23646` |

## Gérer SeaweedFS

```bash
# Check service status
systemctl status seaweedfs

# Restart
sudo systemctl restart seaweedfs

# View logs
sudo journalctl -u seaweedfs -f
```

| Chemin                           | Fonction                                      |
| -------------------------------- | --------------------------------------------- |
| `/etc/seaweedfs/seaweedfs.env`   | Identifiants de l'API compatible S3           |
| `/var/lib/seaweedfs/`            | Données persistantes de SeaweedFS             |
| `/etc/seaweedfs/credentials.txt` | Identifiants et points de terminaison générés |

## Sécurité

SeaweedFS utilise les ports 8333, 8888, 9333, 9340, 7333 et 23646 pour ses points de terminaison S3,
filer, maître, volume, WebDAV et administrateur. UFW est activé et n'autorise par défaut que SSH
(port 22). Tous les ports SeaweedFS restent bloqués jusqu'à ce que vous autorisiez des sources de
confiance.

**Pour autoriser l'API compatible S3 et l'interface Filer depuis une adresse IP précise :**

```bash
sudo ufw allow from <trusted-ip> to any port 8333
sudo ufw allow from <trusted-ip> to any port 8888
```

**Pour accéder à ces points de terminaison sans ouvrir le pare-feu, utilisez un tunnel SSH :**

```bash
# Run this on your local machine
ssh -L 8333:localhost:8333 -L 8888:localhost:8888 ubuntu@<your-vm-ip>

# Then use these local endpoints
http://localhost:8333
http://localhost:8888
```

**Pour une utilisation en production**, gardez SeaweedFS sur un réseau privé ou placez les points de
terminaison HTTP requis derrière un proxy inverse afin de les servir en HTTPS avec un certificat TLS
de confiance.

:::caution

Traitez les identifiants de l'API compatible S3 comme des secrets. N'ouvrez que les points de
terminaison requis par vos charges de travail et limitez-les aux réseaux d'applications et
d'administrateurs de confiance.

:::

## Étapes suivantes

- [Documentation de SeaweedFS](https://github.com/seaweedfs/seaweedfs/wiki)
- [Guide d'installation de SeaweedFS](https://github.com/seaweedfs/seaweedfs/wiki/Getting-Started)
