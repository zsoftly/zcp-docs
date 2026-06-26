---
title: Instance de calcul
sidebar_position: 1
---

Une **instance de calcul** est un serveur virtuel dans le nuage, semblable à un ordinateur physique.
Elle possède son propre CPU, sa mémoire et son stockage, ce qui vous permet d'installer des
logiciels, d'exécuter des applications ou d'héberger des sites Web. Les instances de calcul sont un
composant fondamental de ZSoftly Public Cloud et vous permettent de lancer et de faire évoluer des
serveurs selon vos besoins.

## Créer une instance de calcul

- Dans le menu de gauche, cliquez sur l'onglet **Instances**.
- Pour créer une instance, cliquez sur l'icône **plus (+)** située à droite de la page.

![Démarrage d'une nouvelle instance de calcul depuis l'onglet Instances](../../../../../assets/compute/create-instance-creating-a-compute-instance.webp)

## Choisir un emplacement

Sélectionnez l'emplacement du centre de données où votre serveur sera hébergé physiquement.

![Choix d'un emplacement de centre de données](../../../../../assets/compute/create-instance-choose-a-location.webp)

## Choisir une image

Sélectionnez un système d'exploitation ou un modèle d'application. Importez un ISO personnalisé au
besoin.

**Images Windows prises en charge :**

| Image               | État       |
| ------------------- | ---------- |
| Windows Server 2025 | Disponible |
| Windows Server 2022 | Disponible |
| Windows 11 Pro      | Disponible |

Consultez les catalogues complets : [images de SE](https://zcp.zsoftly.ca/marketplace/os-images) et
[applications en un clic](https://zcp.zsoftly.ca/marketplace/apps).

![Choix d'une image de système d'exploitation](../../../../../assets/compute/create-instance-choose-an-image.webp)

## Choisir le type d'allocation CPU

- **CPU partagé** : option abordable avec ressources partagées entre utilisateurs. Idéal pour le
  développement, les tests et les charges de travail légères comme les petits sites Web.
- **CPU dédié** : ressources exclusives pour des performances constantes. Convient aux
  environnements de production, aux applications à fort trafic et aux bases de données.
- **High-Frequency Compute** : fréquences d'horloge élevées pour les tâches intensives, comme les
  simulations, la modélisation financière et les applications à faible latence.
- **Cloud GPU** : accélération GPU pour les tâches exigeantes comme l'apprentissage automatique,
  l'IA, le rendu vidéo et les simulations scientifiques.

![Choix du type d'allocation CPU](../../../../../assets/compute/create-instance-choose-the-type-of-cpu-allocation.webp)

## Choisir un plan

- **General Compute (GC)** : charges de travail équilibrées avec un mélange de CPU, mémoire,
  stockage et bande passante. Idéal pour les applications générales, les serveurs Web et les
  environnements de test.
- **Compute Optimized (CO)** : priorité à la performance CPU pour les tâches intensives, comme le
  traitement par lots, l'analytique et les charges de travail à traitement rapide.
- **Memory Optimized (RO)** : conçu pour les applications exigeant une grande capacité mémoire,
  comme les bases de données en mémoire, le traitement de mégadonnées et les systèmes de cache en
  temps réel.

Consultez [Types d'instances](/fr/public-cloud/compute/instance-types) pour les familles et niveaux
de stockage, ainsi que la [page de tarification](https://zcp.zsoftly.ca/pricing) pour les
caractéristiques et prix par taille.

![Choix d'un plan](../../../../../assets/compute/create-instance-choose-a-plan.webp)

## Assigner à un projet

Assignez le serveur à l'un de vos projets afin d'organiser les ressources.

![Attribution du serveur à un projet](../../../../../assets/compute/create-instance-assign-to-a-project.webp)

## Choisir un réseau

- **Réseau public** : réseau simple et préconfiguré pour la connectivité externe. Inclut la
  protection par pare-feu infonuagique, la redirection de ports et le VPN d'accès distant.
- **Réseau VPC** : Cloud privé virtuel (VPC) offrant un contrôle complet du routage du trafic et une
  sécurité renforcée. Prend en charge les passerelles VPN, les connexions VPN site à site et la
  ségrégation du trafic.

> **Note :** Par défaut, un VPC est créé avec un bloc CIDR aléatoire et un niveau de réseau.

Choisissez ensuite d'activer ou non l'IPv4 publique.

![Choix d'un réseau](../../../../../assets/compute/create-instance-choose-a-network.webp)

## Configurer les paramètres du serveur

- Ajoutez une clé SSH pour un accès sécurisé. Cliquez sur **Add Now**. Pour certaines images de SE,
  comme Arch Linux, une clé SSH est requise.
- Ajoutez un script de démarrage pour automatiser des actions pendant l'initialisation.

![Configuration des paramètres du serveur](../../../../../assets/compute/create-instance-configure-server-settings.webp)

## Paramètres avancés (facultatif)

- **Boot Mode** : sélectionnez Legacy ou Secure boot.
- **Boot Type** : choisissez UEFI ou BIOS.
- **Enable Dynamic Scaling** : permet la mise à l'échelle automatique des ressources.

![Paramètres avancés (facultatif)](../../../../../assets/compute/create-instance-advanced-settings-optional.webp)

## Nom d'hôte du serveur

Fournissez un **Server Name** unique et un **Server Hostname** valide.

![Définition du nom et du nom d'hôte du serveur](../../../../../assets/compute/create-instance-server-hostname.webp)

## Vérifier et déployer

- Choisissez le **Cycle de facturation** souhaité : horaire, mensuel, trimestriel, semestriel,
  annuel, biannuel ou triannuel.
- Règles de facturation prises en charge : Date to Date, Fixed Calendar Month, Unfixed Calendar
  Month, Fixed Prorata, Unfixed Prorata.
- Vérifiez tous les détails de configuration, puis cliquez sur **Review & Deploy**.

## Se connecter à votre instance

Une fois l'instance en cours d'exécution, ouvrez **Instance Overview** pour obtenir son **adresse
IP**, le **nom d'utilisateur par défaut** (selon l'image du SE — `ubuntu` pour Ubuntu, `rocky` pour
Rocky Linux, etc. ; voir [Connexion par SSH](/fr/public-cloud/compute/connect-ssh)) et, si vous
n'avez pas ajouté de clé SSH, le **Provisioning Password**.

Pour l'atteindre en SSH (port 22) depuis Internet, l'instance a besoin d'une IP publique **et**
d'une règle autorisant le trafic. Cela n'est pas ouvert automatiquement :

**Réseau public**

- Assurez-vous que l'instance a une adresse IPv4 publique — voir
  [IP publiques](/fr/public-cloud/networking/public-network/public-ips).
- Autorisez le SSH : ajoutez une règle de [pare-feu](/fr/public-cloud/compute/settings/firewall)
  pour le TCP **22**, puis une règle de
  [redirection de ports](/fr/public-cloud/compute/settings/port-forwarding) associant le port 22 de
  l'IP publique au port 22 de l'instance.

**Réseau VPC**

- Attribuez une [IP publique](/fr/public-cloud/networking/vpc/public-ips) et ajoutez une règle de
  [redirection de ports](/fr/public-cloud/compute/settings/port-forwarding) pour le port 22.
- Autorisez le trafic entrant dans votre [ACL réseau](/fr/public-cloud/networking/vpc/network-acls)
  (TCP 22).

Connectez-vous ensuite :

- **Clé SSH** — utilisez la clé ajoutée dans _Configurer les paramètres du serveur_.
- **Mot de passe** — si vous n'avez pas ajouté de clé, utilisez le **Provisioning Password** depuis
  l'onglet Overview de l'instance (voir
  [Connexion par SSH](/fr/public-cloud/compute/connect-ssh#où-trouver-le-mot-de-passe)) ; changez-le
  après votre première connexion.

Consultez [Connexion par SSH](/fr/public-cloud/compute/connect-ssh) pour les commandes exactes.
Aucune règle réseau n'est nécessaire pour l'[Accès console](/fr/public-cloud/compute/console-access)
(via navigateur), et les instances Windows utilisent la
[Connexion par RDP](/fr/public-cloud/compute/connect-rdp).

## Voir aussi

- [Vue d'ensemble des instances](/fr/public-cloud/compute/instance-overview)
- [Journaux d'activité](/fr/public-cloud/compute/activity-logs)
