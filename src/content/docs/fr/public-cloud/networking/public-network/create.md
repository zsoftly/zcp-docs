---
title: Créer un réseau public
sidebar_position: 1
---

Un **réseau public** fournit un accès exposé à Internet aux ressources cloud. Il permet aux VM et
aux services de communiquer avec des systèmes externes sur Internet.

### Créer un réseau public

- Dans le menu de gauche, cliquez sur **Réseaux** → onglet **Réseau public**.
- Cliquez sur l'icône **+**. La page porte le titre **Create Isolated Network**.

![Page Réseaux sur l'onglet Réseau public avec le bouton d'ajout (+)](../../../../../../assets/networking/pub-net-add.webp)

### Choose Project

Dans **Choose Project**, sélectionnez le projet du réseau.

![Create Isolated Network : Choose Project](../../../../../../assets/networking/pub-net-project.webp)

### Select Location

Dans **Select Location**, choisissez l'emplacement du centre de données du réseau.

![Create Isolated Network : Select Location](../../../../../../assets/networking/pub-net-location.webp)

### Network Details

Saisissez un **Network Name**.

![Create Isolated Network : Network Details et Network Name](../../../../../../assets/networking/pub-net-name.webp)

### Choose Network Plan

Sélectionnez **Choose Network Plan**.

### Network Configuration

Examinez les valeurs visibles **Gateway** et **Netmask**. Si l'assistant refuse une entrée, notez le
champ et le message d'erreur exacts. N'essayez pas de remplacer la passerelle ou le masque de réseau
par des valeurs devinées. Si le message n'est pas clair ou si le portail refuse toujours la valeur,
ouvrez [Support](/fr/troubleshooting#ouvrir-un-billet-de-soutien) avec le projet, l'emplacement, le
message exact et les détails non sensibles de la ressource.

![Create Isolated Network : configuration de la passerelle et du masque réseau](../../../../../../assets/networking/pub-net-config.webp)

### Créer

- **Billing Cycle** : **Hourly**, **Monthly** ou **Yearly**.
- Passez en revue le **Price Summary** et cliquez sur **Create Network**.

![Create Isolated Network : cycle de facturation et sommaire du prix](../../../../../../assets/networking/pub-net-billing.webp)

Voir aussi : [Vue d'ensemble du réseau](/fr/public-cloud/networking/public-network/overview),
[IP publiques](/fr/public-cloud/networking/public-network/public-ips)
