---
title: Mise à jour de la plateforme du T3 2026
description:
  La version du T3 2026 de la plateforme infonuagique ZSoftly, qui couvre les calendriers et la
  facturation des sauvegardes, la facturation de Kubernetes, la boutique et les courriels de
  déploiement de la place de marché.
---

Cette version couvre les calendriers et la facturation des sauvegardes, la facturation de
Kubernetes, les achats dans la boutique et les courriels de déploiement de la place de marché. Les
éléments livrés plus tôt dans le trimestre sont listés dans
[Aussi livré au T3 2026](#aussi-livré-au-t3-2026).

## Sommaire

| Domaine          | Changement                                                                                                                   | Impact sur la facturation                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Sauvegardes      | Créez, modifiez, mettez en pause, reprenez et lancez un calendrier. Fuseau horaire et rétention propres à chaque calendrier. | Oui. Facturation selon le stockage.         |
| Sauvegardes      | Journaux d'activité pour les changements, exécutions, échecs et nettoyage de rétention.                                      | Non                                         |
| Kubernetes       | La facturation ne porte plus sur le cluster mais sur les ressources provisionnées pour lui.                                  | Oui. Facturation selon les ressources.      |
| Kubernetes       | Tailles de processeur et de mémoire distinctes pour le plan de contrôle et les nœuds de travail.                             | Indirect. La taille des nœuds fixe le coût. |
| Boutique         | Recherche de produits, catégories, présentation en cartes, cycle de facturation et quantité par produit.                     | Non                                         |
| Place de marché  | Courriel de déploiement avec les identifiants de l'application et les valeurs fournies lors de la configuration.             | Non                                         |
| Comptes et accès | Alerte de crédit d'infrastructure faible, gestion des mots de passe des VM, limitation de fréquence renforcée.               | Non                                         |

## Calendriers de sauvegarde

### Ce qui change

Vous pouvez créer, modifier, mettre en pause, reprendre et lancer un calendrier de sauvegarde depuis
le portail. Chaque calendrier possède ses propres paramètres :

- **Fuseau horaire.** Le calendrier s'exécute selon le fuseau horaire que vous lui donnez, et non
  selon un fuseau par défaut de la plateforme.
- **Politique de rétention.** Chaque calendrier conserve les sauvegardes pendant la période que vous
  définissez. Le nettoyage de rétention supprime les sauvegardes expirées.

Les journaux d'activité enregistrent la création et les mises à jour des calendriers, les
exécutions, les échecs et le nettoyage de rétention.

### Facturation des sauvegardes

La facturation des sauvegardes ne porte plus sur le calendrier, mais sur le stockage que vos
sauvegardes utilisent.

- La plateforme facture chaque sauvegarde selon le stockage qu'elle occupe.
- Chaque sauvegarde possède son propre abonnement. Cet abonnement prend fin à la suppression de la
  sauvegarde, que vous la supprimiez vous-même ou que le nettoyage de rétention s'en charge.
- Un calendrier en pause ne crée aucune nouvelle sauvegarde. Les sauvegardes déjà prises continuent
  d'être facturées tant qu'elles ne sont pas supprimées.

Le coût des sauvegardes dépend de leur taille réellement stockée et de la période de rétention.

:::caution

La rétention et le coût sont liés. Une longue période de rétention sur une grande instance occupe
plus de stockage et coûte plus cher.

:::

## Facturation de Kubernetes

### Ce qui change

La plateforme facture chaque ressource infonuagique provisionnée pour un cluster Kubernetes géré, au
lieu d'une facturation unique par cluster :

- Machines virtuelles du plan de contrôle
- Machines virtuelles de travail
- Volumes de stockage bloc
- Réseaux
- Adresses IP publiques
- Équilibreurs de charge

Le cluster Kubernetes lui-même n'est plus facturé séparément. La plateforme affiche les ressources
sous **Billing → Abonnements**.

### Taille des nœuds

Les configurations de cluster acceptent des tailles de processeur et de mémoire différentes pour les
nœuds du plan de contrôle et les nœuds de travail. Dimensionnez le plan de contrôle pour le serveur
d'API et etcd, et les nœuds de travail pour les charges de travail que vous y exécutez. Consultez
[Créer un cluster Kubernetes](/fr/public-cloud/kubernetes/create-cluster).

## Ressources existantes

La facturation des sauvegardes existantes est en cours de migration. Les clusters Kubernetes
existants nécessitent une mise à jour de leur configuration de facturation. Consultez **Billing →
Abonnements** et communiquez avec le soutien pour confirmer la migration de vos ressources.

## Ensembles d'enregistrements DNS

La création d'un enregistrement DNS pris en charge ajoute sa valeur au nom et au type
correspondants. Les valeurs existantes restent. Les copies exactes ne créent pas de réponses en
double. La console retire une valeur sélectionnée sans supprimer les autres. Un `CNAME` ne peut
toujours pas partager un nom avec un autre type d'enregistrement.

Vous pouvez saisir une valeur `TXT` avec ou sans guillemets doubles. La plateforme la stocke et la
renvoie entre guillemets. L'assurance qualité en production a confirmé les mêmes réponses DNS et les
numéros de série SOA mis à jour depuis les deux serveurs de noms faisant autorité.

:::caution

La console DNS ZCP ne propose pas actuellement `CAA` comme type d'enregistrement. Communiquez avec
le soutien si vous devez publier un enregistrement CAA.

:::

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

1. Révisez la période de rétention de chaque calendrier de sauvegarde.
2. Supprimez les sauvegardes dont vous n'avez plus besoin. Supprimer une sauvegarde met fin à son
   abonnement.
3. Consultez **Billing → Abonnements** pour les ressources Kubernetes et communiquez avec le soutien
   pour confirmer la migration de la facturation.

## Documentation liée

- [Sauvegardes](/fr/public-cloud/backups-snapshots/backups)
- [Facturation](/fr/public-cloud/billing)
- [Créer un cluster Kubernetes](/fr/public-cloud/kubernetes/create-cluster)
- [Vue d'ensemble du cluster](/fr/public-cloud/kubernetes/cluster-overview)
- [Place de marché](/fr/public-cloud/marketplace)
- [Journal des modifications](/fr/changelog)
