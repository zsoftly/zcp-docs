---
title: Introduction
sidebar_position: 1
description: Bienvenue dans la documentation de ZSoftly Cloud Platform (ZCP).
---

# ZSoftly Cloud Platform (ZCP)

**ZCP** (ZSoftly Cloud Platform) est une plateforme d'infrastructure infonuagique qui vous permet de
provisionner et de gérer des machines virtuelles, des réseaux privés, du stockage bloc, du stockage
objet et des grappes Kubernetes à partir d'un portail unique.

:::note

Dans cette documentation :

- **ZCP** : ZSoftly Cloud Platform, soit le portail de nuage public.
- **ZPCP** : ZSoftly Private Cloud Platform, soit le produit de nuage privé dédié ou sur site.
- **ZCP CLI** : l'outil en ligne de commande `zcp` pour gérer les ressources ZCP.

:::

## Fonctionnalités

- **Calcul** : lancez des VM avec CPU partagé, CPU dédié, haute fréquence ou GPU.
- **Réseautage** : créez des réseaux publics ou des VPC entièrement isolés avec sous-réseaux, ACL et
  passerelles VPN.
- **Stockage bloc** : attachez des volumes SSD NVMe à vos VM pour ajouter du stockage persistant.
- **Stockage objet** : utilisez un stockage objet compatible S3.
- **Kubernetes** : gérez des grappes Kubernetes avec haute disponibilité et autoscaling.
- **Équilibreur de charge** : répartissez le trafic entre des instances VM avec des options de
  persistance de session.
- **DNS** : gérez les domaines et les enregistrements DNS à partir du portail.

## Méthodes d'accès

| Méthode | Utilisation                                                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Portail | Interface Web à [cloud.zcp.zsoftly.ca](https://cloud.zcp.zsoftly.ca)                                                                |
| CLI     | [`zcp`](/fr/public-cloud/cli/installation) : outil CLI multiplateforme scriptable                                                   |
| API     | API REST : [Cloud Platform](https://api.zcp.zsoftly.ca/api/docs/nimbo) · [Stockage objet](https://api.zcp.zsoftly.ca/api/docs/ceph) |

## Commencer

1. [Créer votre compte](/fr/public-cloud/getting-started/account-signup) : inscrivez-vous, vérifiez
   votre courriel et configurez la facturation.
2. [Configurer votre profil](/fr/public-cloud/getting-started/profile-setup) : renseignements
   personnels, 2FA et rôles d'utilisateur.
3. [Démarrage rapide](/fr/public-cloud/getting-started/quickstart) : déployez votre première VM de
   bout en bout en moins de 10 minutes.
