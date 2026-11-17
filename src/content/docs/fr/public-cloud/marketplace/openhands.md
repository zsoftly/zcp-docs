---
title: OpenHands Agent Canvas
description:
  Déployez et exploitez l'image OpenHands Agent Canvas sur ZCP, connectez des fournisseurs de
  modèles et des dépôts gérés par le client, et restaurez les données de l'espace de travail après
  un redémarrage.
---

OpenHands Agent Canvas est une interface auto-hébergée d'agent de codage. Cette image exécute
OpenHands Agent Canvas 1.38.0 sur Ubuntu 26.04.1 LTS. Nginx sert l'interface web en HTTPS sur le
port 443. Agent Canvas n'est publié que sur l'interface de bouclage. Le conteneur s'exécute sous un
utilisateur non privilégié. L'image ne contient aucun identifiant de fournisseur de modèles, de
dépôt ou de compte client.

## Prérequis

| Ressource | Minimum |
| --------- | ------- |
| vCPU      | 2       |
| Mémoire   | 4 Gio   |
| Stockage  | 40 Gio  |

## Première connexion

Le premier démarrage crée un mot de passe HTTPS propre à la VM, une clé API de session OpenHands et
un certificat TLS auto-signé. Connectez-vous en SSH et lisez les identifiants générés :

```bash
sudo cat /etc/openhands/credentials.txt
```

Avant d'accepter l'avertissement de certificat du navigateur, récupérez son empreinte SHA-256 via la
même connexion SSH de confiance :

```bash
sudo openssl x509 -in /etc/openhands/tls/fullchain.pem -noout -fingerprint -sha256
```

Ouvrez `https://<vm-public-ip>/canvas/`. Comparez l'empreinte du certificat affichée par le
navigateur avec la valeur obtenue via SSH, puis connectez-vous avec les identifiants HTTPS générés.

Lorsque Agent Canvas affiche **Add a backend**, saisissez :

| Champ     | Valeur                                                                  |
| --------- | ----------------------------------------------------------------------- |
| Host Name | Un libellé pratique pour cette VM                                       |
| Type      | Local                                                                   |
| Host      | `https://<vm-public-ip>`                                                |
| API Key   | La clé API de session issue de `credentials.txt`, pas une clé de modèle |

Sélectionnez **Next**. Choisissez une préférence de données d'utilisation si demandé, sélectionnez
l'agent OpenHands, puis continuez vers **Set up your LLM**. Ajoutez un fournisseur, un modèle et des
identifiants que vous possédez.

Avant de lancer une tâche, vérifiez que votre identifiant fournisseur donne accès au modèle choisi
et dispose d'un quota disponible. Pour les fournisseurs payants, vérifiez que la facturation ou le
crédit est disponible. L'image ne contient aucun crédit d'utilisation de modèle.

:::caution

Le certificat de démarrage expire après 30 jours. Avant une utilisation en production, remplacez
`/etc/openhands/tls/fullchain.pem` et `/etc/openhands/tls/privkey.pem` par un certificat et une clé
de confiance pour le nom DNS de la VM. Fixez leurs modes à `0644` et `0600`, puis exécutez
`sudo systemctl reload nginx`.

:::

## Connecter un dépôt

Ne placez pas d'identifiants de fournisseur de modèles ou de dépôt dans les données utilisateur
cloud-init, dans l'image ou dans les tickets de support.

Pour un dépôt GitHub, ouvrez **Settings** > **Secrets**. Enregistrez votre jeton d'accès personnel
GitHub sous un secret personnalisé nommé exactement `GITHUB_TOKEN`. Revenez à **Home**, choisissez
**GitHub**, cherchez et sélectionnez le dépôt ou saisissez son URL HTTPS, choisissez une branche,
puis lancez la tâche.

Cette image autonome utilise HTTPS et un jeton d'accès personnel pour l'accès aux dépôts GitHub.
Cette image ne fournit ni OAuth cloud ni un chemin documenté d'intégration par clé privée SSH.
OpenHands chiffre les secrets enregistrés avec la clé propre à la VM `OH_SECRET_KEY` et les stocke
dans ses données applicatives persistantes.

## Sécurité et isolation

L'interface web n'est disponible qu'en HTTPS sur le port 443 et requiert les identifiants HTTPS
générés. Le backend Agent Canvas requiert également sa clé API de session. Limitez le port 443 aux
réseaux sources de confiance dans l'ACL réseau ZCP lorsque c'est possible.

Les commandes de l'agent s'exécutent dans un conteneur non privilégié, sans réseau hôte, mode
privilégié ou socket Docker hôte. L'image ne prend pas en charge les conteneurs Docker imbriqués.
Les conversations partagent cette frontière de confiance du runtime, utilisez donc une VM séparée
pour les dépôts ou les invites non fiables.

## Persistance et récupération

Les données applicatives persistantes et `/var/lib/openhands/projects` survivent aux redémarrages
ordinaires du conteneur et de la VM. Ces données incluent les identifiants de dépôt chiffrés.
Traitez les instantanés de VM comme des données porteuses d'identifiants.

Après un redémarrage, inspectez le service et les journaux :

```bash
sudo systemctl status openhands-first-boot.service --no-pager
sudo docker compose -f /opt/openhands/docker-compose.yml ps
sudo docker compose -f /opt/openhands/docker-compose.yml logs --tail=120
sudo nginx -t
```

Vérifiez que l'interface Agent Canvas répond et que les conversations et projets existants sont
intacts.

Ne supprimez pas le volume persistant OpenHands, `/var/lib/openhands/projects`,
`/etc/openhands/runtime.env` ou `/etc/openhands/credentials.txt` pendant la récupération d'une VM.

## Mises à niveau

Validez d'abord la référence du conteneur cible sur un candidat séparé. Pour une VM existante,
arrêtez-la et prenez un instantané ZCP cohérent. Démarrez la VM, puis mettez à jour uniquement la
référence d'image dans `/opt/openhands/docker-compose.yml`. Récupérez et démarrez exactement cette
image :

```bash
sudo docker compose -f /opt/openhands/docker-compose.yml pull
sudo docker compose -f /opt/openhands/docker-compose.yml up -d --pull never
```

Conservez le volume persistant OpenHands, `/var/lib/openhands/projects`,
`/etc/openhands/runtime.env` et `/etc/openhands/credentials.txt` en place. Attendez que le service
soit sain, puis exécutez :

```bash
sudo /usr/local/bin/openhands-health.sh
```

Vérifiez les conversations et projets existants avant de reprendre le travail. En cas d'échec de la
mise à niveau, restaurez l'instantané arrêté. N'exécutez pas une image plus ancienne sur des données
écrites par une version plus récente.
