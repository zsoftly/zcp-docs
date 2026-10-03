---
title: Mise à jour de la plateforme du T3 2026
description:
  La version du T3 2026 de la plateforme infonuagique ZSoftly, qui couvre les calendriers et la
  facturation des sauvegardes, la facturation de Kubernetes, la boutique et les courriels de
  déploiement de la place de marché.
draft: true
---

La version qui clôt le T3 2026 change la façon dont vous planifiez et payez vos sauvegardes, la
façon dont vous payez les clusters Kubernetes gérés et la façon dont vous trouvez et achetez des
produits dans la boutique. Elle ajoute aussi un courriel de déploiement pour les applications de la
place de marché et plusieurs changements mineurs. Les éléments livrés plus tôt dans le trimestre
sont listés dans la section [Aussi livré au T3 2026](#aussi-livré-au-t3-2026).

Deux de ces changements touchent la facturation de ressources que vous utilisez déjà. Lisez
[Facturation des sauvegardes](#facturation-des-sauvegardes),
[Facturation de Kubernetes](#facturation-de-kubernetes) et
[Comportement de la migration](#comportement-de-la-migration) avant la date d'entrée en vigueur.

## Date d'entrée en vigueur

| Élément                   | Valeur                                                                       |
| ------------------------- | ---------------------------------------------------------------------------- |
| Entrée en vigueur         | D'ici le 30 septembre 2026                                                   |
| Régions                   | YUL-1 et YOW-1                                                               |
| Interruption de service   | Aucune prévue                                                                |
| Action requise            | Aucune pour la migration. Révisez la rétention et la taille de vos clusters. |
| Impact sur la facturation | Oui. La facturation des sauvegardes et celle de Kubernetes changent.         |

## Sommaire

| Domaine          | Changement                                                                                                                   | Impact sur la facturation                   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Sauvegardes      | Créez, modifiez, mettez en pause, reprenez et lancez un calendrier. Fuseau horaire et rétention propres à chaque calendrier. | Oui. Facturation selon le stockage.         |
| Sauvegardes      | Journaux d'activité pour les exécutions, les échecs et le nettoyage de rétention.                                            | Non                                         |
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

Les journaux d'activité enregistrent chaque exécution du calendrier. Utilisez-les pour confirmer une
sauvegarde réussie, examiner un échec et suivre le nettoyage de rétention.

### Facturation des sauvegardes

La facturation des sauvegardes ne porte plus sur le calendrier, mais sur le stockage que vos
sauvegardes utilisent.

- La plateforme facture chaque sauvegarde selon le stockage qu'elle occupe.
- Chaque sauvegarde possède son propre abonnement. Cet abonnement prend fin à la suppression de la
  sauvegarde, que vous la supprimiez vous-même ou que le nettoyage de rétention s'en charge.
- Un calendrier en pause ne crée aucune nouvelle sauvegarde. Les sauvegardes déjà prises continuent
  d'être facturées tant qu'elles ne sont pas supprimées.

Votre total suit le nombre de sauvegardes que vous conservez et la taille des instances qui les
produisent. La rétention devient le réglage qui contrôle le coût des sauvegardes.

:::caution

La rétention et le coût sont liés. Une longue période de rétention sur une grande instance occupe
plus de stockage et coûte plus cher. Révisez la rétention de chaque calendrier avant la date
d'entrée en vigueur.

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

Le cluster Kubernetes lui-même n'est plus facturé séparément. La plateforme facture chaque ressource
au même tarif que la ressource équivalente ailleurs sur la plateforme et l'affiche comme sa propre
entrée sous **Billing → Abonnements**.

### Taille des nœuds

Les configurations de cluster acceptent des tailles de processeur et de mémoire différentes pour les
nœuds du plan de contrôle et les nœuds de travail. Dimensionnez le plan de contrôle pour le serveur
d'API et etcd, et les nœuds de travail pour les charges de travail que vous y exécutez. Consultez
[Créer un cluster Kubernetes](/fr/public-cloud/kubernetes/create-cluster).

## Comportement de la migration

Les calendriers de sauvegarde et les clusters Kubernetes existants passent aux nouveaux modèles de
facturation. Vous n'avez rien à recréer.

| Ressource                       | Ce qui se produit                                                                                                                                                                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Calendriers de sauvegarde       | Le calendrier continue de s'exécuter. La facturation passe au stockage utilisé par les sauvegardes. Chaque sauvegarde reçoit son propre abonnement.                                                                                                 |
| Sauvegardes existantes          | La plateforme les conserve. Chacune est facturée selon son stockage jusqu'à sa suppression par vous ou par le nettoyage de rétention.                                                                                                               |
| Clusters Kubernetes existants   | Le cluster continue de fonctionner. Les frais de cluster cessent. La plateforme facture individuellement les VM du plan de contrôle, les VM de travail, les volumes, les réseaux, les IP et les équilibreurs de charge que le cluster utilise déjà. |
| Charges de travail en exécution | Aucun redémarrage, aucune replanification, aucune interruption prévue.                                                                                                                                                                              |

:::caution

Ce changement modifie la façon dont la plateforme calcule les frais, pas la façon dont elle les
présente. Votre facture peut augmenter ou diminuer après la date d'entrée en vigueur selon votre
stockage de sauvegarde, vos réglages de rétention et les ressources de vos clusters. Comparez
**Billing → Summary** avant et après le changement.

:::

## Autres changements

- **Alerte de crédit d'infrastructure faible.** La plateforme vous avertit quand le crédit
  d'infrastructure de votre compte devient faible, avant que vos services soient touchés.
- **Gestion des mots de passe des VM.** Le portail change la façon dont vous gérez les mots de passe
  des instances.
- **Limitation de fréquence.** Des limites plus strictes sur les demandes de connexion et de
  réinitialisation de mot de passe. La plateforme freine les tentatives répétées sur une courte
  période.
- **Courriel de déploiement de la place de marché.** Chaque déploiement réussi d'une application de
  la place de marché vous envoie un courriel contenant les identifiants de l'application. Si
  l'application accepte des valeurs de configuration, le courriel liste aussi les valeurs que vous
  avez fournies. Consultez [Place de marché](/fr/public-cloud/marketplace).

:::caution

Le courriel de déploiement contient des identifiants valides, et ils le restent tant que le message
demeure dans une boîte de réception. Changez-les dès votre première connexion, puis supprimez le
message. Ne le transférez pas.

:::

## Boutique

La boutique ajoute la recherche et la navigation :

- Cherchez un produit par son nom.
- Parcourez les catégories.
- Ouvrez un produit pour voir ses détails, choisir un cycle de facturation offert et une quantité,
  et voir le prix total avant de confirmer l'achat.

## Changements d'API

<!-- TODO: Remplacer cette section par les changements d'API confirmés avant la publication.
     Couvrir : les points de terminaison et champs des calendriers de sauvegarde (fuseau horaire,
     rétention, pause, reprise, exécution immédiate), les changements de charge utile des clusters
     Kubernetes pour la taille des nœuds par rôle, les changements de réponse pour les abonnements
     et la facturation, et tout comportement déprécié ou incompatible avec sa date de retrait.
     Ensuite, mettre draft: false. -->

Nous confirmons les changements d'API de cette version. Nous mettrons cette section à jour avant la
date d'entrée en vigueur.

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

1. Révisez la période de rétention de chaque calendrier de sauvegarde. La rétention détermine
   maintenant le coût des sauvegardes.
2. Supprimez les sauvegardes dont vous n'avez plus besoin. Supprimer une sauvegarde met fin à son
   abonnement.
3. Révisez la taille et le nombre de vos nœuds du plan de contrôle, de vos nœuds de travail, de vos
   volumes, de vos IP publiques et de vos équilibreurs de charge Kubernetes.
4. Notez vos dépenses mensuelles actuelles dans **Billing → Summary** pour les comparer après la
   date d'entrée en vigueur.

## Documentation liée

- [Sauvegardes](/fr/public-cloud/backups-snapshots/backups)
- [Facturation](/fr/public-cloud/billing)
- [Créer un cluster Kubernetes](/fr/public-cloud/kubernetes/create-cluster)
- [Vue d'ensemble du cluster](/fr/public-cloud/kubernetes/cluster-overview)
- [Place de marché](/fr/public-cloud/marketplace)
- [Journal des modifications](/fr/changelog)
