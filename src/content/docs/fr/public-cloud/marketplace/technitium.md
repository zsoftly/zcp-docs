---
title: Technitium DNS Server
---

Technitium DNS Server est un serveur DNS open source avec une console d'administration web. Il peut
fonctionner comme serveur DNS autoritaire, résolveur récursif, résolveur avec transfert et
plateforme de gestion DNS depuis une instance ZCP.

## Logiciels inclus

| Composant             | Version   |
| --------------------- | --------- |
| Technitium DNS Server | 15.4.0    |
| Ubuntu                | 24.04 LTS |

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 1       | 2          |
| RAM       | 1 Go    | 2 Go       |
| Stockage  | 10 Go   | 20 Go      |

## Variables d'environnement

Vous pouvez définir ces valeurs lors du déploiement depuis la marketplace. Laissez le mot de passe
admin vide pour générer un mot de passe aléatoire sécurisé.

| Variable                                 | Description                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| `DNS_SERVER_ADMIN_PASSWORD`              | Mot de passe admin pour l'utilisateur web `admin`                        |
| `DNS_SERVER_DOMAIN`                      | Domaine principal utilisé par le serveur DNS                             |
| `DNS_SERVER_WEB_SERVICE_LOCAL_ADDRESSES` | Adresses d'écoute de l'interface admin. Par défaut: `0.0.0.0,[::]`       |
| `DNS_SERVER_RECURSION`                   | Politique de récursion. Par défaut: `AllowOnlyForPrivateNetworks`        |
| `DNS_SERVER_RECURSION_NETWORK_ACL`       | ACL utilisée si la récursion vaut `UseSpecifiedNetworkACL`               |
| `DNS_SERVER_FORWARDERS`                  | Résolveurs amont séparés par des virgules, par exemple `1.1.1.1,9.9.9.9` |
| `DNS_SERVER_FORWARDER_PROTOCOL`          | Protocole de transfert: `Udp`, `Tcp`, `Tls`, `Https` ou `HttpsJson`      |

## Démarrage

### 1. Se connecter à la VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Attendre la configuration au premier démarrage

Au premier démarrage, le service de configuration prépare Technitium, démarre `dns.service` et écrit
les identifiants dans un fichier lisible uniquement par root. Suivez la progression:

```bash
sudo journalctl -u technitium-first-boot.service -f
```

### 3. Récupérer les identifiants

```bash
sudo cat /etc/dns/credentials.txt
```

Le fichier contient l'URL de l'interface admin, le nom d'utilisateur, le mot de passe, le domaine du
serveur DNS, le mode de récursion et les paramètres de transfert.

### 4. Accéder à l'interface admin

Ouvrez:

```text
http://<your-vm-ip>:5380/
```

Connectez-vous avec l'utilisateur `admin` et le mot de passe dans `/etc/dns/credentials.txt`.

### 5. Tester DNS

Depuis la VM:

```bash
dig @127.0.0.1 example.com
```

Depuis un autre hôte de confiance:

```bash
dig @<your-vm-ip> example.com
```

## Gérer Technitium

```bash
# Vérifier l'état du service
systemctl status dns.service

# Redémarrer
sudo systemctl restart dns.service

# Voir les journaux
sudo journalctl -u dns.service -f
```

Chemins courants:

| Chemin                                                   | Rôle                                      |
| -------------------------------------------------------- | ----------------------------------------- |
| `/opt/technitium/dns/`                                   | Fichiers applicatifs Technitium           |
| `/etc/dns/`                                              | Configuration et identifiants ZMI         |
| `/etc/default/technitium-dns`                            | Environnement généré au premier démarrage |
| `/etc/systemd/system/dns.service.d/zmi-environment.conf` | Drop-in systemd d'environnement           |

## Ports

Ouverts par défaut:

| Port | Protocole | Rôle                   |
| ---- | --------- | ---------------------- |
| 22   | TCP       | SSH                    |
| 53   | TCP/UDP   | DNS                    |
| 5380 | TCP       | Console admin web HTTP |

Ports optionnels:

| Port  | Protocole | Rôle                                 |
| ----- | --------- | ------------------------------------ |
| 53443 | TCP       | Console admin web HTTPS              |
| 853   | TCP       | DNS-over-TLS                         |
| 853   | UDP       | DNS-over-QUIC                        |
| 443   | TCP/UDP   | DNS-over-HTTPS et HTTP/3             |
| 80    | TCP       | DNS-over-HTTP, proxy inverse ou ACME |
| 67    | UDP       | Service DHCP                         |

N'ouvrez les ports optionnels que lorsque la fonctionnalité correspondante est activée.

## Sécurité

Évitez d'exécuter un résolveur récursif public ouvert. Gardez la politique de récursion par défaut
`AllowOnlyForPrivateNetworks` ou configurez une ACL de récursion de confiance. Limitez la console
admin aux administrateurs approuvés.

## Prochaines étapes

- [Technitium DNS Server](https://technitium.com/dns/)
- [Technitium DNS Server GitHub](https://github.com/TechnitiumSoftware/DnsServer)
- [Documentation API Technitium](https://github.com/TechnitiumSoftware/DnsServer/blob/master/APIDOCS.md)
