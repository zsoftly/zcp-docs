---
title: Réseautage
description:
  Connectez les charges de travail ZCP avec des réseaux publics, des VPC, des adresses IP et un
  accès VPN.
---

Le réseautage connecte vos charges de travail ZCP à Internet, entre elles et à des réseaux externes.
Utilisez un réseau public pour les ressources exposées à Internet. Utilisez un VPC lorsqu’une charge
de travail a besoin de son propre réseau privé, de sous-réseaux, de règles d’accès et d’une
connectivité VPN.

## Choisir un modèle réseau

- **Réseau public** : attribuez des adresses IP publiques et contrôlez le trafic sortant des
  ressources qui ont besoin d’un accès Internet.
- **VPC** : créez un réseau isolé avec des sous-réseaux, des ACL réseau, des adresses IP publiques
  et un accès VPN.

Commencez par [Créer un réseau public](/fr/public-cloud/networking/public-network/create) ou
[Créer un VPC](/fr/public-cloud/networking/vpc/create-vpc), selon la charge de travail.

## Planifier l’accès

Avant le déploiement, déterminez quelles ressources ont besoin d’un accès public, lesquelles doivent
rester privées et comment les utilisateurs ou systèmes externes vont se connecter. Configurez les
adresses, règles et accès VPN requis dans le portail.

## Étapes Suivantes

- [Vue d’ensemble du réseau public](/fr/public-cloud/networking/public-network/overview)
- [Gérer les adresses IP publiques](/fr/public-cloud/networking/public-network/public-ips)
- [Ajouter un sous-réseau VPC](/fr/public-cloud/networking/vpc/add-subnet)
- [Configurer une passerelle VPN](/fr/public-cloud/networking/vpc/site-vpn)
