---
title: IceWarp
---

IceWarp est une plateforme de collaboration professionnelle pour l'e-mail, WebClient, TeamChat, la
visioconférence, le partage de fichiers et la collaboration documentaire. L'image ZCP exécute
IceWarp Server avec ses services de base de données et de cache sur Ubuntu 24.04.

## Logiciels inclus

| Composant             | Version         |
| --------------------- | --------------- |
| IceWarp Server        | 14.3.0.9        |
| Conteneur IceWarp     | 14.3.0.9        |
| MariaDB               | 10.6            |
| Redis                 | 7 Alpine        |
| Docker                | Dernière stable |
| Docker Compose plugin | Dernière stable |
| Ubuntu                | 24.04 LTS       |

L'image exécute le conteneur épinglé `icewarptechnology/icewarp-server:14.3.0.9`.

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 4 Go    | 8 Go       |
| Stockage  | 80 Go   | 200 Go+    |

IceWarp est stateful. Les boîtes aux lettres, calendriers, fichiers téléversés, données MariaDB,
données Redis, journaux, caches, configuration et état de collaboration peuvent grandir avec le
temps.

## Variables d'environnement

Définissez ces valeurs lors du déploiement depuis la marketplace pour configurer le premier
démarrage. Laissez les champs de mot de passe vides pour générer des valeurs aléatoires sécurisées
lorsque c'est pris en charge.

| Variable                       | Description                                                            |
| ------------------------------ | ---------------------------------------------------------------------- |
| `ICEWARP_PUBLIC_HOSTNAME`      | Nom d'hôte public pour WebClient/Admin, par exemple `mail.example.com` |
| `ICEWARP_DOMAIN`               | Domaine mail principal, par exemple `example.com`                      |
| `ICEWARP_ADMIN_USER`           | Nom d'utilisateur admin initial. Par défaut: `admin`                   |
| `ICEWARP_ADMIN_PASS`           | Mot de passe admin initial                                             |
| `ICEWARP_ADMIN_PASSWORD`       | Alias compatible pour `ICEWARP_ADMIN_PASS`                             |
| `ICEWARP_LICENSE`              | Clé de licence IceWarp, ou vide pour utiliser le flux d'essai          |
| `ICEWARP_GENERATE_LETSENCRYPT` | `0` ou `1`; activez seulement après pointage DNS vers la VM            |
| `ICEWARP_USE_HTTPS`            | `0` ou `1`; active le comportement HTTPS                               |
| `MARIADB_ROOT_PASSWORD`        | Mot de passe root MariaDB interne                                      |

## Démarrage

### 1. Se connecter à la VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, IceWarp lit `/etc/zmi/deploy.env`, démarre la pile Docker Compose, configure
le domaine et le compte administrateur, puis écrit les identifiants dans un fichier lisible
uniquement par root. Suivez la progression:

```bash
sudo journalctl -u icewarp-first-boot.service -f
```

### 3. Récupérer les identifiants

```bash
sudo cat /etc/icewarp/credentials.txt
```

### 4. Ouvrir IceWarp

Ouvrez WebClient ou l'interface d'administration:

```text
http://<your-vm-ip>/
http://<your-vm-ip>/admin/
```

Si `ICEWARP_USE_HTTPS=1`, utilisez `https://`.

## Gérer IceWarp

IceWarp s'exécute comme pile Docker Compose dans `/opt/icewarp`.

```bash
# Vérifier l'état
cd /opt/icewarp && sudo docker compose ps

# Redémarrer
cd /opt/icewarp && sudo docker compose restart

# Voir les journaux
cd /opt/icewarp && sudo docker compose logs -f
```

Chemins importants:

| Chemin                            | Rôle                            |
| --------------------------------- | ------------------------------- |
| `/opt/icewarp/docker-compose.yml` | Pile Compose                    |
| `/opt/icewarp/.env`               | Secrets d'exécution root-only   |
| `/etc/icewarp/credentials.txt`    | Identifiants générés root-only  |
| `/etc/icewarp/info.txt`           | Notes de configuration          |
| `/data/icewarp`                   | Données persistantes préférées  |
| `/var/lib/icewarp`                | Données persistantes de secours |

## Ports

Le pare-feu de la VM autorise les ports IceWarp courants. N'exposez que les ports nécessaires au
niveau réseau ZCP ou port-forward.

| Port        | Protocole | Rôle                    |
| ----------- | --------- | ----------------------- |
| 22          | TCP       | SSH                     |
| 80          | TCP       | HTTP WebClient/Admin    |
| 443         | TCP       | HTTPS WebClient/Admin   |
| 25          | TCP       | SMTP                    |
| 465         | TCP       | SMTPS                   |
| 587         | TCP       | Soumission SMTP         |
| 110         | TCP       | POP3                    |
| 995         | TCP       | POP3S                   |
| 143         | TCP       | IMAP                    |
| 993         | TCP       | IMAPS                   |
| 5222, 5223  | TCP       | Accès client XMPP       |
| 5269        | TCP       | Fédération serveur XMPP |
| 5060        | TCP/UDP   | SIP                     |
| 5061        | UDP       | SIP TLS                 |
| 10000-10010 | UDP       | Plage media/RTP         |

## DNS et licence

Une utilisation mail et collaboration en production nécessite une préparation DNS:

- Enregistrement `A` ou `AAAA` pour le nom d'hôte public
- Enregistrement `MX` pour le domaine mail
- Enregistrements SPF, DKIM et DMARC
- PTR/rDNS pour l'adresse IP d'envoi
- Certificat TLS après pointage DNS vers la VM

Le port 25 peut être restreint par le fournisseur cloud ou la politique réseau amont. Si l'envoi de
mail est bloqué, utilisez un relais approuvé ou demandez l'exception nécessaire au fournisseur.

IceWarp nécessite une licence valide ou une activation d'essai réussie. Si l'activation d'essai
n'est pas disponible, fournissez une valeur `ICEWARP_LICENSE` valide pendant le déploiement et
réessayez sur une nouvelle VM.

## Sécurité

Changez les identifiants générés après la première connexion et ne les réutilisez pas entre VMs.
Pour la production, servez IceWarp via un nom DNS avec TLS et n'exposez que les ports web et mail
nécessaires.

## Prochaines étapes

- [Site IceWarp](https://www.icewarp.com/)
- [Guide d'installation Linux IceWarp](https://support.icewarp.com/hc/en-us/articles/12868451777937-IceWarp-Installation-Guide-for-Linux)
- [Aide licence IceWarp](https://support.icewarp.com/hc/en-us/categories/203155547-LICENSING)
