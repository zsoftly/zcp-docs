---
title: OPNsense
---

OPNsense est une plateforme open source de pare-feu et de routage basée sur FreeBSD. L'image
marketplace ZCP est un système OPNsense préinstallé, pas un installateur live, destiné aux usages de
pare-feu, routage, VPN et sécurité réseau.

## Logiciels inclus

| Composant | Version |
| --------- | ------- |
| OPNsense  | 26.7.1  |
| FreeBSD   | 15.1    |

## Prérequis

| Ressource | Minimum | Recommandé |
| --------- | ------- | ---------- |
| vCPU      | 2       | 4          |
| RAM       | 2 Go    | 4 Go       |
| Stockage  | 4 Go    | 8 Go       |

## Modèle de déploiement

OPNsense est différent de la plupart des images marketplace ZCP:

- Il n'utilise pas cloud-init.
- Il ne fournit pas d'accès SSH par défaut.
- Il se gère d'abord via la console CloudStack.
- Son interface web est disponible seulement après configuration de l'interface LAN.

Au premier démarrage, OPNsense utilise son adresse LAN par défaut:

```text
192.168.1.1/24
```

Cette adresse peut ne pas correspondre à l'IP assignée par CloudStack. Reconfigurez l'interface LAN
depuis la console avant d'attendre que l'interface web soit joignable.

## Démarrage

### 1. Ouvrir la console de la VM

Dans l'interface CloudStack, ouvrez la VM et sélectionnez **View Console**.

### 2. Se connecter avec les valeurs par défaut

| Interface | Nom d'utilisateur | Mot de passe |
| --------- | ----------------- | ------------ |
| Console   | `root`            | `opnsense`   |
| Web GUI   | `root`            | `opnsense`   |

Changez ce mot de passe immédiatement après la première connexion.

### 3. Configurer l'interface LAN

Depuis le menu console, sélectionnez:

```text
2) Set interface IP address
```

Configurez l'interface LAN en DHCP ou avec une adresse statique joignable sur le réseau sélectionné.
Après configuration, OPNsense redémarre les services nécessaires de pare-feu, DNS et interface web.

### 4. Ouvrir l'interface web

Ouvrez:

```text
https://<lan-or-forwarded-ip>/
```

Acceptez l'avertissement du certificat auto-signé et connectez-vous avec `root` / `opnsense`, puis
changez le mot de passe.

## Accès NAT et port-forward

Si vous accédez à l'interface web via une adresse NAT ou port-forwardée, OPNsense peut refuser la
connexion avec une erreur de referer HTTP parce que l'URL du navigateur ne correspond pas à une
adresse reconnue par l'appliance.

Pour un test uniquement, vous pouvez désactiver cette vérification depuis le shell console:

```sh
cp /conf/config.xml /conf/config.xml.bak
sed -i '' 's#</webgui>#<nohttpreferercheck>1</nohttpreferercheck></webgui>#' /conf/config.xml
configctl webgui restart
```

Le réglage doit se trouver dans la section `<webgui>`.

## Ports

OPNsense est le pare-feu, donc la configuration client détermine les services joignables. Au départ,
le service important est:

| Port | Protocole | Rôle                     |
| ---- | --------- | ------------------------ |
| 443  | TCP       | Interface web sur le LAN |

Les règles WAN, ports VPN, politiques pare-feu et redirections de ports sont configurés par le
client après la première connexion.

## Sécurité

Changez immédiatement le mot de passe par défaut. Évitez d'exposer l'interface web de gestion à
Internet. En production, limitez l'accès d'administration à un réseau privé, un VPN ou une plage
d'IP administratives de confiance.

CloudStack peut afficher un mot de passe généré pour ce modèle, mais OPNsense ne le consomme pas
parce que l'image n'a ni cloud-init ni agent invité de mot de passe. Utilisez les valeurs par défaut
du fournisseur jusqu'à leur changement manuel.

## Prochaines étapes

- [Installation et configuration OPNsense](https://docs.opnsense.org/setup.html)
- [Téléchargement OPNsense](https://opnsense.org/download)
