---
title: Headplane
---

Headplane est une interface web complète pour [Headscale](https://headscale.net), l'implémentation
open source et auto-hébergée du serveur de contrôle Tailscale. Elle permet de gérer les nœuds, les
clés de pré-authentification, les ACL et le DNS depuis un navigateur plutôt que via la CLI
Headscale. Headplane ne remplace pas Headscale. Elle gère un serveur Headscale en cours d'exécution,
c'est pourquoi cette image fournit les deux ensemble.

:::tip[Headscale est le serveur, pas le client]

L'application Tailscale de la Place de marché ZCP installe le **client** Tailscale qui rejoint un
tailnet existant. Headscale est le **serveur de contrôle** auto-hébergé auquel un client se
connecte, et Headplane en est l'interface d'administration. Exécutez Headscale + Headplane ici, puis
pointez vos clients Tailscale vers l'URL de ce serveur.

:::

## Logiciels inclus

| Composant | Version         |
| --------- | --------------- |
| Headplane | 0.7.0           |
| Headscale | 0.29.2          |
| Docker    | Dernière stable |
| Ubuntu    | 24.04 LTS       |

Headplane ne peut pas fonctionner seule, car chacune de ses actions est un appel à l'API Headscale.
Cette image exécute le serveur de contrôle Headscale et l'interface Headplane ensemble, sous forme
de pile Docker Compose.

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 10 Go   | 20 Go      |

## Variables d'environnement

Vous pouvez définir ces variables au moment du déploiement depuis la Place de marché. Laissez-les
vides pour utiliser l'adresse de la machine virtuelle.

| Variable               | Description                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- |
| `HEADSCALE_SERVER_URL` | URL publique par laquelle vos appareils joignent Headscale, un domaine HTTPS |
| `HEADPLANE_BASE_URL`   | URL publique depuis laquelle l'interface Headplane est servie                |

Définissez-les lorsque vous placez la machine virtuelle derrière un nom DNS ou un reverse proxy TLS.
`HEADSCALE_SERVER_URL` doit être une adresse que vos appareils peuvent réellement joindre, sinon
l'enregistrement des nœuds échoue.

## Démarrage

### 1. Connectez-vous à votre VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendez la configuration au premier démarrage

Au premier démarrage, un script écrit l'adresse de la VM dans les configurations Headscale et
Headplane, génère un secret de session, démarre les deux services, crée un utilisateur Headscale
nommé `default` et génère une clé d'API. Comptez 1 à 2 minutes. Suivez la progression:

```bash
journalctl -u headplane-first-boot.service -f
```

Le message de connexion (MOTD) confirme que Headplane est prête et affiche la clé d'API.

### 3. Récupérez la clé d'API

La clé est aussi écrite dans un fichier réservé à root:

```bash
sudo cat /etc/headplane/credentials.txt
```

### 4. Connectez-vous à Headplane

Ouvrez un navigateur à l'adresse:

```text
http://<your-vm-ip>:3000/admin
```

Headplane s'authentifie auprès de Headscale avec une clé d'API. Collez la clé de l'étape précédente
dans le formulaire de connexion. La clé expire après 90 jours. Vous pouvez en générer une nouvelle à
tout moment:

```bash
docker exec headscale headscale apikeys create --expiration 90d
```

### 5. Rattachez un appareil

Pointez n'importe quel client Tailscale vers votre serveur Headscale:

```bash
tailscale up --login-server http://<your-vm-ip>:8080
```

Approuvez le nœud depuis l'interface Headplane, ou listez les nœuds en ligne de commande:

```bash
docker exec headscale headscale nodes list
```

## Gérer Headplane

Headscale et Headplane s'exécutent sous forme de pile Docker Compose dans `/opt/headplane`.

```bash
# Vérifier l'état
cd /opt/headplane && docker compose ps

# Redémarrer
cd /opt/headplane && docker compose restart

# Consulter les journaux
cd /opt/headplane && docker compose logs -f headscale
```

La configuration de Headscale se trouve dans `/opt/headplane/headscale/config/config.yaml` et sa
base de données sous `/opt/headplane/headscale/data`. Les politiques ACL sont stockées en base de
données, vous pouvez donc les modifier directement depuis l'interface Headplane.

## Sécurité

Les ports 3000 (interface Headplane) et 8080 (Headscale) sont ouverts sur l'interface réseau de la
VM. UFW est activé et autorise ces ports ainsi que SSH (port 22).

Vos appareils doivent joindre Headscale sur le port 8080, mais l'interface Headplane n'a pas besoin
d'être publique.

**Pour restreindre l'interface à une adresse IP précise:**

```bash
sudo ufw delete allow 3000/tcp
sudo ufw allow from <trusted-ip> to any port 3000
```

**En production**, pointez un enregistrement DNS vers la VM et terminez le TLS avec un reverse proxy
(Caddy, nginx ou Traefik). Définissez `HEADSCALE_SERVER_URL` et `HEADPLANE_BASE_URL` sur les URL
HTTPS, et passez `cookie_secure: true` dans `/opt/headplane/headplane/config.yaml`.

## Prochaines étapes

- [Documentation Headplane](https://headplane.net)
- [Documentation Headscale](https://headscale.net)
- [Politiques ACL Headscale](https://headscale.net/stable/ref/acls/)
