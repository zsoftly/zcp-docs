---
title: Créer un cluster Kubernetes
sidebar_position: 1
---

Kubernetes géré sur ZSoftly Public Cloud vous donne un cluster Kubernetes standard et en amont, sans
avoir à exploiter vous-même le plan de contrôle. Provisionnez-le depuis le portail, mettez-le à
l'échelle à la demande, et connectez-vous avec les outils `kubectl` et Helm que votre équipe utilise
déjà. Aucune distribution dérivée, aucun opérateur propriétaire : ce que vous créez ici fonctionne
partout.

## Versions prises en charge

ZCP prend en charge Kubernetes **1.34**, **1.35** et **1.36** (actuelle : **1.36.1**). Mettez à
niveau un cluster en cours d'exécution vers une version plus récente, directement depuis la
[Vue d'ensemble du cluster](/fr/public-cloud/kubernetes/cluster-overview). Faites correspondre votre
client `kubectl` à la version mineure du cluster. Voir
[Accès kubectl](/fr/public-cloud/kubernetes/kubectl-access).

| Élément        | Prise en charge                                   |
| -------------- | ------------------------------------------------- |
| Kubernetes     | 1.34, 1.35, 1.36 (actuelle 1.36.1)                |
| Distribution   | Kubernetes standard en amont, sans fork           |
| Mises à niveau | En place, vers toute version mineure plus récente |

## Ce que vous obtenez

- **Plan de contrôle géré** — ZSoftly exploite et maintient le plan de contrôle. Vous vous
  concentrez sur vos applications.
- **Haute disponibilité (facultative)** — ajoutez des noeuds de contrôle pour un plan de contrôle
  redondant.
- **Mise à l'échelle automatique** — définissez un nombre minimal et maximal de noeuds de travail.
  Le cluster s'adapte à la demande.
- **Plans de noeuds** — choisissez un plan fixe (CPU, mémoire et stockage définis) ou un plan
  personnalisé (votre propre dimensionnement et nombre de noeuds).
- **Volumes persistants** — stockage bloc provisionné dynamiquement via le pilote CSI du cluster.
- **Répartiteurs de charge** — exposez un `Service` de type `LoadBalancer` et accédez-y sur une
  adresse publique.
- **Outils standard** — fonctionne avec `kubectl`, Helm et le tableau de bord Kubernetes.
  Téléchargez un `kubeconfig` depuis le portail.
- **Mises à niveau de version en place** et **accès SSH** facultatif aux noeuds.

## Créer un cluster

- Dans le menu de gauche, cliquez sur **Kubernetes**.
- Cliquez sur **Créer un cluster** ou sur l'icône **+**.

![Page Kubernetes avec le bouton Créer un cluster (+)](../../../../../assets/kubernetes/create-cluster-create-a-cluster.webp)

### Étapes

1. **Emplacement** : sélectionnez le centre de données.
2. **Projet** : assignez le cluster à un projet.
3. **Réseau** : sélectionnez un réseau privé existant ou créez-en un nouveau.
4. **Capacité du cluster** :
   - Sélectionnez un **plan de noeud** prédéfini (CPU, mémoire et stockage fixes)
   - Ou utilisez un **plan personnalisé** (CPU, mémoire, stockage et nombre de noeuds)
5. **Paramètres avancés** (facultatif) :
   - Activez la **haute disponibilité** pour la redondance
   - Ajoutez des **noeuds de contrôle** pour une stabilité accrue
   - Ajoutez une **clé SSH** pour l'accès aux noeuds
6. **Nom du cluster** : fournissez un nom unique.
7. **Créer** :
   - Cycles de facturation : Hourly, Monthly, Quarterly, Semiannually, Yearly, Bi-annually,
     Tri-annually
   - Règles de facturation : Date to Date, Fixed Calendar Month, Unfixed Calendar Month, Fixed
     Prorata, Unfixed Prorata
   - Cliquez sur **Créer un cluster**

![Formulaire de création de cluster Kubernetes : emplacement, projet, réseau, capacité, paramètres avancés, nom et facturation](../../../../../assets/kubernetes/create-cluster-steps.webp)

## Après la création

- [Connexion avec kubectl](/fr/public-cloud/kubernetes/kubectl-access) — téléchargez votre
  `kubeconfig` et exécutez vos premières commandes.
- [Vue d'ensemble du cluster](/fr/public-cloud/kubernetes/cluster-overview) — mettez à l'échelle,
  mettez à niveau et gérez le cluster.
- [Accès au tableau de bord](/fr/public-cloud/kubernetes/dashboard-access) — utilisez le tableau de
  bord Web.
