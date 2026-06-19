---
title: Créer un VPC
sidebar_position: 1
---

## Créer un réseau VPC

Un réseau **Cloud privé virtuel (VPC)** fournit un environnement isolé et sécurisé pour les
ressources cloud. Il permet de contrôler le routage du trafic, l'adressage IP, les sous-réseaux et
la sécurité dans un réseau privé.

### Créer un VPC

- Dans le menu de gauche, cliquez sur **Réseaux** → onglet **VPC Réseau**.
- Cliquez sur l'icône **+** pour ouvrir la page de création.

![Page « Your Networks » sur l'onglet VPC Network, avec le bouton d'ajout (+)](../../../../../../assets/networking/networks-list.webp)

### Assigner à un projet et choisir un emplacement

- Sous **Choose Project**, sélectionnez le projet auquel appartient le VPC.
- Sous **Select Location**, choisissez la région du centre de données (par exemple `YUL-1` ou
  `YOW-1`). Un VPC et ses ressources résident dans une seule région.

![Formulaire de création de VPC : Choose Project et Select Location](../../../../../../assets/networking/create-vpc-project-location.webp)

### Configuration réseau et nom

- **Network Address** et **Network Size** : définissez l'adresse de base (par exemple `10.0.0.10`)
  et la taille du sous-réseau (par exemple `/24`, 256 adresses IP utilisables) qui définissent la
  plage d'IP du VPC.
- **Network Name** et **Network Description** : donnez au VPC un nom unique et identifiable.

![Formulaire de création de VPC : Network Address, Network Size, Network Name et Description](../../../../../../assets/networking/create-vpc-config.webp)

### Créer

- **Cycles de facturation pris en charge** : Hourly, Monthly, Quarterly, Semiannually, Yearly,
  Bi-annually, Tri-annually.
- **Règles de facturation prises en charge** : Date to Date, Fixed Calendar Month, Unfixed Calendar
  Month, Fixed Prorata, Unfixed Prorata.
- Choisissez un **Billing Cycle**, passez en revue le **Price Summary**, puis cliquez sur **Create
  VPC**. Une boîte de dialogue de confirmation affiche le détail du prix (sous-total, taxe et
  montant net) avant de confirmer.

![Boîte de dialogue de confirmation de création de VPC avec le détail du prix](../../../../../../assets/networking/create-vpc-confirm.webp)

Une fois créé, l'onglet **Details** du VPC affiche son ID, sa région, son domaine réseau et son
CIDR.

![Page de détails du VPC affichant l'ID, la région, le domaine réseau et le CIDR](../../../../../../assets/networking/vpc-details.webp)

:::note

Un VPC seul n'a aucun sous-réseau utilisable et ne peut pas encore héberger de VM. Ajoutez-y ensuite
au moins un réseau (sous-réseau).

:::

Voir aussi : [Ajouter un sous-réseau](/fr/public-cloud/networking/vpc/add-subnet),
[ACL réseau](/fr/public-cloud/networking/vpc/network-acls),
[Passerelle VPN](/fr/public-cloud/networking/vpc/site-vpn)
