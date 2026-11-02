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

### Choisir un projet

Dans **Choose Project**, sélectionnez le projet du réseau.

![Create Isolated Network : Choose Project](../../../../../../assets/networking/pub-net-project.webp)

### Sélectionner un emplacement

Dans **Select Location**, choisissez l'emplacement du centre de données du réseau.

![Create Isolated Network : Select Location](../../../../../../assets/networking/pub-net-location.webp)

### Détails du réseau

Saisissez un **Network Name**.

![Create Isolated Network : Network Details et Network Name](../../../../../../assets/networking/pub-net-name.webp)

### Choisir un plan réseau

Dans **Choose Network Plan**, sélectionnez un plan réseau.

### Configuration réseau

ZSoftly n’a pas vérifié si **Gateway** et **Netmask** sont obligatoires. Si le portail remplit un
champ avec une valeur pour le réseau sélectionné, laissez cette valeur inchangée. Si l’un des champs
est vide ou semble afficher un texte d’espace réservé, ne saisissez ni ne déduisez une valeur. Notez
le champ et tout message affiché, puis ouvrez
[Support](/fr/troubleshooting#ouvrir-un-billet-de-soutien) avec le projet, l’emplacement, tout
message affiché et les détails non sensibles de la ressource.

![Create Isolated Network : configuration de la passerelle et du masque réseau](../../../../../../assets/networking/pub-net-config.webp)

### Créer

- **Billing Cycle** : **Hourly**, **Monthly** ou **Yearly**.
- Passez en revue le **Price Summary** et cliquez sur **Create Network**.

![Create Isolated Network : cycle de facturation et sommaire du prix](../../../../../../assets/networking/pub-net-billing.webp)

Voir aussi : [Vue d'ensemble du réseau](/fr/public-cloud/networking/public-network/overview),
[IP publiques](/fr/public-cloud/networking/public-network/public-ips)
