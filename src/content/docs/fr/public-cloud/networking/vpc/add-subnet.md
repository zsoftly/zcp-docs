---
title: Ajouter un sous-réseau
sidebar_position: 3
---

## Ajouter un sous-réseau

L'onglet Réseau affiche tous les réseaux (sous-réseaux) créés dans le VPC. Ajoutez de nouveaux
sous-réseaux au besoin.

- Accédez à l'onglet **Réseau** dans votre VPC.
- Cliquez sur **Ajouter Réseau**.

### Champs du sous-réseau

- **Nom** : identifiant du sous-réseau.
- **Description** : résumé de l'objectif du sous-réseau.
- **Réseau** : bloc CIDR du sous-réseau (par exemple, `192.168.1.0/24`).
- **ACL** : sélectionnez une ACL prédéfinie ou créez-en une pour contrôler le trafic entrant et
  sortant.
- **Gateway** : passerelle réseau pour le routage du trafic.
- **Réseau Mask** : masque réseau du sous-réseau.

Cliquez sur **Soumettre** pour créer le sous-réseau.

![Boîte de dialogue d'ajout d'un réseau VPC avec les champs Nom, Description, liste ACL réseau et masque réseau](../../../../../../assets/networking/vpc-add-subnet.webp)

Le nouveau sous-réseau apparaît ensuite dans l'onglet **Réseau** avec son CIDR, son ACL et son état
d'allocation.

![Onglet Réseau du VPC listant le sous-réseau créé avec le CIDR, l'ACL et l'état Allocated](../../../../../../assets/networking/vpc-subnet-list.webp)

Voir aussi : [ACL réseau](/fr/public-cloud/networking/vpc/network-acls),
[Vue d'ensemble du VPC](/fr/public-cloud/networking/vpc/create-vpc)
