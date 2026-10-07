---
title: Mise à jour de la plateforme du T3 2026
description:
  Une mise à jour du T3 2026 sur les travaux de la plateforme infonuagique ZSoftly, dont la
  vérification du déploiement reste incomplète pour les sauvegardes et la facturation de Kubernetes.
---

Cette mise à jour couvre les travaux sur les calendriers et la facturation des sauvegardes et sur la
facturation de Kubernetes. La vérification de leur déploiement est incomplète. Confirmez la
disponibilité régionale et la facturation avant de compter sur ces fonctionnalités. Les éléments
livrés plus tôt dans le trimestre sont listés dans
[Aussi livré au T3 2026](#aussi-livré-au-t3-2026).

## Sommaire

| Domaine          | Changement                                                                                                       | Impact sur la facturation                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Sauvegardes      | Les changements de calendrier et de facturation selon le stockage sont en vérification de déploiement.           | Confirmer avant l'utilisation.              |
| Kubernetes       | Les changements de facturation selon les ressources sont en vérification de déploiement.                         | Les frais actuels s'appliquent encore.      |
| Kubernetes       | Tailles de processeur et de mémoire distinctes pour le plan de contrôle et les nœuds de travail.                 | Indirect. La taille des nœuds fixe le coût. |
| Boutique         | Recherche de produits, catégories, présentation en cartes, cycle de facturation et quantité par produit.         | Non                                         |
| Place de marché  | Courriel de déploiement avec les identifiants de l'application et les valeurs fournies lors de la configuration. | Non                                         |
| Comptes et accès | Alerte de crédit d'infrastructure faible, gestion des mots de passe des VM, limitation de fréquence renforcée.   | Non                                         |

## Calendriers de sauvegarde

### Ce qui change

Les changements aux calendriers de sauvegarde sont en vérification de déploiement. Confirmez la
disponibilité des calendriers et de la facturation selon le stockage dans votre région avant de
compter sur ces fonctionnalités.

Le déploiement vise à prendre en charge des paramètres de calendrier comme :

- **Fuseau horaire.** Le calendrier s'exécute selon le fuseau horaire que vous lui donnez, et non
  selon un fuseau par défaut de la plateforme.
- **Politique de rétention.** Chaque calendrier conserve les sauvegardes pendant la période que vous
  définissez. Le nettoyage de rétention supprime les sauvegardes expirées.

Les journaux d'activité prévus couvrent la création et les mises à jour des calendriers, les
exécutions, les échecs et le nettoyage de rétention.

### Facturation des sauvegardes

Le modèle de facturation des sauvegardes selon le stockage est aussi en vérification de déploiement.
Confirmez le modèle de facturation et la disponibilité régionale avec le soutien avant de compter
sur ces changements.

Le modèle prévu est le suivant :

- La plateforme facture chaque sauvegarde selon le stockage qu'elle occupe.
- Chaque sauvegarde possède son propre abonnement. Cet abonnement prend fin à la suppression de la
  sauvegarde, que vous la supprimiez vous-même ou que le nettoyage de rétention s'en charge.
- Un calendrier en pause ne crée aucune nouvelle sauvegarde. Les sauvegardes déjà prises continuent
  d'être facturées tant qu'elles ne sont pas supprimées.

:::caution

Selon ce modèle, conserver plus de données de sauvegarde plus longtemps augmente les frais de
stockage. Confirmez le modèle de facturation applicable avec le soutien pendant la vérification du
déploiement.

:::

## Facturation de Kubernetes

### Ce qui change

La facturation selon les ressources pour Kubernetes géré reste en vérification de déploiement. Les
prix publiés comprennent toujours des frais pour le plan de contrôle Kubernetes géré. Ne supposez
donc pas que les clusters actuels sont facturés seulement pour leurs ressources provisionnées.

Le modèle de facturation selon les ressources prévu comprend :

- Machines virtuelles du plan de contrôle
- Machines virtuelles de travail
- Volumes de stockage bloc
- Réseaux
- Adresses IP publiques
- Équilibreurs de charge

ZSoftly publiera le comportement final de facturation et les changements aux abonnements lorsque le
déploiement sera terminé.

### Taille des nœuds

Les configurations de cluster acceptent des tailles de processeur et de mémoire différentes pour les
nœuds du plan de contrôle et les nœuds de travail. Dimensionnez le plan de contrôle pour le serveur
d'API et etcd, et les nœuds de travail pour les charges de travail que vous y exécutez. Consultez
[Créer un cluster Kubernetes](/fr/public-cloud/kubernetes/create-cluster).

## Ressources existantes

Ne supposez pas que les sauvegardes existantes ou les clusters Kubernetes ont migré. Communiquez
avec le soutien pour vérifier la disponibilité et la facturation de vos ressources.

## Autres changements

- **Alerte de crédit d'infrastructure faible.** La plateforme vous avertit quand le crédit
  d'infrastructure de votre compte devient faible, avant que vos services soient touchés.
- **Gestion des mots de passe des VM.** Le portail change la façon dont vous gérez les mots de passe
  des instances.
- **Limitation de fréquence.** Des limites plus strictes sur les demandes de billets, de
  rétroaction, de connexion et de réinitialisation de mot de passe.
- **Jetons d'API.** Des paramètres d'expiration des jetons d'API ont été ajoutés.
- **Intégration de pilotes de stockage.** L'intégration de pilotes de stockage Kubernetes CSI n'est
  pas incluse dans cette version.
- **Courriel de déploiement de la place de marché.** Chaque déploiement réussi d'une application de
  la place de marché vous envoie un courriel contenant les identifiants de l'application. Si
  l'application accepte des valeurs de configuration, le courriel liste aussi les valeurs que vous
  avez fournies. Consultez [Place de marché](/fr/public-cloud/marketplace).

:::caution

Supprimer le courriel ne révoque pas ses identifiants. Gardez le courriel privé et changez les
identifiants ou secrets lorsque l'application le permet. Ne le transférez pas.

:::

## Boutique

La boutique ajoute la recherche et la navigation :

- Cherchez un produit par son nom.
- Parcourez les catégories avec leur nombre de produits.
- Ouvrez un produit pour voir les informations du fournisseur, les cycles de facturation, la
  quantité, les prix dynamiques et les conditions du contrat avant l'achat.

## Automatisation avec le CLI

Le CLI prend en charge la configuration personnalisée de VM, les listes de règles d'équilibrage de
charge et les clés d'accès S3 compatibles du stockage objet. Consultez
[CLI v0.0.30](#suivi-doctobre).

## Clés d'accès au stockage objet

Chaque espace de stockage objet prend en charge une ou deux clés d'accès actives. Copiez le nouveau
secret dans les cinq minutes suivant la création de la clé. Masquer un secret ne le révoque pas.
Après avoir mis à jour vos consommateurs, révoquez l'ancienne clé. La révocation la désactive dans
le stockage objet et la marque comme révoquée dans le plan de contrôle. Vous ne pouvez pas révoquer
la dernière clé active.

## Suivi d'octobre

[CLI v0.0.30](/fr/changelog/#cli-v0.0.30), publié le 3 octobre, ajoute trois changements confirmés
au CLI :

- Créez une VM personnalisée en omettant `--plan` et en fournissant `--cpu`, `--memory` et `--disk`.
- Listez les identifiants des règles d'équilibrage de charge avec
  `zcp loadbalancer list-rule <load-balancer-slug>`.
- Gérez les clés d'accès S3 compatibles du stockage objet avec `zcp object-storage keys`. Consultez
  [Clés d'accès au stockage objet](#clés-daccès-au-stockage-objet).

## Aussi livré au T3 2026

Ces changements sont déjà en service. Chacun renvoie à son entrée du journal des modifications.

| Date               | Changement                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| 19 juillet 2026    | [CLI v0.0.26](/fr/changelog/#cli-v0.0.26) : correctifs de redirection de ports et de clés SSH.       |
| 16 août 2026       | [Calcul Intel à Montréal (YUL)](/fr/changelog/#intel-compute-yul).                                   |
| 1er septembre 2026 | [Facturation postpayée](/fr/changelog/#postpaid-billing) à l'inscription.                            |
| 6 septembre 2026   | [Kubernetes 1.37](/fr/changelog/#kubernetes-1.37) pour les nouveaux clusters gérés.                  |
| 6 septembre 2026   | [Résolution DNS du stockage objet depuis les VPC](/fr/changelog/#object-storage-vpc-dns-resolution). |
| 7 septembre 2026   | [Jusqu'à 8 sous-réseaux par VPC](/fr/changelog/#vpc-subnet-limit).                                   |
| 7 septembre 2026   | [CLI v0.0.28](/fr/changelog/#cli-v0.0.28) et [v0.0.29](/fr/changelog/#cli-v0.0.29).                  |
| 7 septembre 2026   | [Fournisseur Terraform / OpenTofu v0.2.0](/fr/changelog/#terraform-v0.2.0).                          |

## À faire

1. Confirmez la disponibilité des calendriers de sauvegarde et de leur facturation dans votre région
   avant de compter sur ces fonctionnalités.
2. Confirmez la facturation Kubernetes actuelle de votre cluster avec le soutien avant de modifier
   vos charges de travail.

## Documentation liée

- [Sauvegardes](/fr/public-cloud/backups-snapshots/backups)
- [Facturation](/fr/public-cloud/billing)
- [Créer un cluster Kubernetes](/fr/public-cloud/kubernetes/create-cluster)
- [Vue d'ensemble du cluster](/fr/public-cloud/kubernetes/cluster-overview)
- [Place de marché](/fr/public-cloud/marketplace)
- [Journal des modifications](/fr/changelog)
