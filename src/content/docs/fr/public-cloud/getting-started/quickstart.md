---
title: Démarrage rapide
sidebar_position: 4
description:
  Déployez votre première VM sur ZSoftly Public Cloud et envoyez une demande de création et
  d’attachement d’un volume de stockage bloc.
---

# Démarrage rapide

Déployez une VM, connectez-vous avec SSH, puis envoyez une demande de création et d’attachement d’un
volume de stockage bloc.

## Prérequis

- Un compte ZSoftly Public Cloud ([s'inscrire](/fr/public-cloud/getting-started/account-signup))
- Un client SSH, comme Terminal sur macOS/Linux ou PowerShell/Windows Terminal sur Windows
- Une paire de clés SSH

Si vous avez déjà une clé SSH, affichez le contenu de son fichier `.pub`. Sinon, générez une clé
Ed25519 :

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

Copiez le contenu de votre clé publique pour l’étape 2. Pour afficher la clé Ed25519 générée
ci-dessus, exécutez :

```bash
cat ~/.ssh/id_ed25519.pub
```

## Étape 1 : créer un réseau

Votre VM a besoin d'un réseau. Pour une configuration simple, utilisez un réseau public.

1. Dans le portail, allez à **Réseaux → Réseau public**.
2. Cliquez sur l'icône **+**. La page porte le titre **Create Isolated Network**.
3. Sélectionnez **Choose Project**, puis **Select Location**.
4. Dans **Network Details**, saisissez un **Network Name**.
5. Dans **Choose Network Plan**, sélectionnez un plan réseau.
6. Dans **Network Configuration**, ZSoftly n’a pas vérifié si **Gateway** et **Netmask** sont
   obligatoires. Si le portail remplit un champ avec une valeur pour le réseau sélectionné, laissez
   cette valeur inchangée. Si l’un des champs est vide ou semble afficher un texte d’espace réservé,
   ne saisissez ni ne déduisez une valeur. Arrêtez-vous et contactez le Support.
7. Choisissez un **Billing Cycle** et examinez le **Price Summary**.
8. Cliquez sur **Create Network**.

Si l'assistant refuse une entrée, notez le champ et le message d'erreur exacts. Ouvrez
[Support](/fr/troubleshooting#ouvrir-un-billet-de-soutien). Incluez le projet, l'emplacement, le
message exact et les détails non sensibles de la ressource.

## Étape 2 : créer une VM

1. Dans le portail, allez à **Instances**.
2. Cliquez sur l'icône **+**.
3. Configurez l'instance :
   - **Emplacement** : le même que celui de votre réseau
   - **Image** : choisissez un système d'exploitation, par exemple Ubuntu 24.04
   - **Type de CPU** : CPU partagé pour dev/test, CPU dédié pour les charges de travail prd
   - **Plan** : General Compute, avec la plus petite taille qui convient
   - **Projet** : assignez l'instance à votre projet
   - **Réseau** : sélectionnez le réseau public créé à l'étape précédente
   - **IPv4 publique** : activez cette option
   - **Clé SSH** : dans **Server Settings**, cliquez sur **Add now** à côté de **Add SSH Key To Your
     Instance**. Dans la boîte de dialogue, entrez un nom et collez votre clé publique, ou
     sélectionnez une clé existante.
   - **Nom du serveur** : donnez un nom à votre VM
   - **Server Hostname** : examinez la valeur préremplie et modifiez-la si votre règle de nommage
     l'exige
4. Choisissez **Billing Cycle**, puis **Hourly** pour les tests.
5. Cliquez sur **Review & Deploy**.

Après le déploiement, actualisez la liste des instances ou la page Overview jusqu'à ce que la VM
indique **Running**. Le délai de démarrage varie. Si le statut ne change pas, ouvrez les détails de
l'instance et notez le message d'erreur exact. Si le portail ne démarre pas la VM ou si l'erreur
persiste, ouvrez [Support](/fr/troubleshooting#ouvrir-un-billet-de-soutien). Incluez le projet,
l'emplacement, le nom de l'instance et le message exact.

## Étape 3 : se connecter avec SSH

Lorsque la VM indique l'état **Running** :

1. Ouvrez la page **Overview** de la VM pour trouver l'**Adresse IP publique**.
2. Dans **VM Settings**, ajoutez une règle de [pare-feu](/fr/public-cloud/compute/settings/firewall)
   pour le TCP **22**. Ajoutez ensuite une règle de
   [redirection de ports](/fr/public-cloud/compute/settings/port-forwarding) associant le port 22 de
   l'adresse IP publique au port 22 de la VM.
3. Connectez-vous depuis votre terminal. Pour une image Ubuntu, utilisez :

```bash
ssh ubuntu@203.0.113.10
```

Remplacez `203.0.113.10` par l'adresse IP publique affichée dans le portail. Les images Ubuntu
utilisent `ubuntu` par défaut. Pour les autres images, utilisez le nom d'utilisateur par défaut
indiqué dans [Se connecter avec SSH](/fr/public-cloud/compute/connect-ssh). Utilisez `root`
seulement si l'image l'indique comme utilisateur par défaut.

Si la connexion SSH échoue, notez l'erreur du terminal et vérifiez que la VM est **Running**.
Vérifiez l'adresse IP publique, la règle de pare-feu et la règle de redirection de ports pour le
port TCP 22. Consultez ensuite les
[paramètres de clés SSH](/fr/public-cloud/compute/settings/ssh-keys) et
[Se connecter avec SSH](/fr/public-cloud/compute/connect-ssh) pour le nom d'utilisateur de l'image
et la méthode d'authentification. Si l'échec persiste, ouvrez
[Support](/fr/troubleshooting#ouvrir-un-billet-de-soutien) avec le projet, l'emplacement, le nom de
l'instance et les détails non sensibles de l'erreur.

## Étape 4 : attacher du stockage bloc (facultatif)

Pour ajouter du stockage persistant séparé du disque racine, envoyez une demande de création et
d’attachement de volume pour l’instance virtuelle cible.

1. Allez à **Volumes** dans le portail.
2. Cliquez sur l'icône **+**.
3. Dans **Choose Project**, sélectionnez le projet attribué à votre instance virtuelle.
4. Dans **Select Location**, sélectionnez l'emplacement de votre instance virtuelle.
5. Dans **Select Instance to attach Volumes**, sélectionnez votre instance virtuelle.
6. Dans **Choose Storage Type**, sélectionnez un type de stockage, puis choisissez la taille dans
   **Select Volumes Size**.
7. Dans **Choose Name**, saisissez un **Volumes Name**, choisissez **Billing Cycle**, puis examinez
   le **Price Summary**.
8. Cliquez sur **Review & Deploy**.
9. Examinez le résumé, puis cliquez sur **Create Volumes**.

Si l'assistant refuse une entrée, notez le champ et le message d'erreur exacts. La page
[Créer un volume](/fr/public-cloud/storage/block-storage/create-volume) documente les captures
d'écran publiées et les libellés visibles. Si le message n'est pas clair ou si le portail refuse
toujours la valeur, ouvrez [Support](/fr/troubleshooting#ouvrir-un-billet-de-soutien) avec le
projet, l'emplacement, les détails non sensibles de la ressource et le message exact.

La capture d'écran publiée affiche le texte « Minimum 8GB storage is required ». Cette capture
d’écran est fournie à titre indicatif. Utilisez la valeur actuelle affichée pour le plan de stockage
sélectionné dans le portail.

La documentation publique s’arrête après l’envoi de la demande de création et d’attachement du
volume. Ne formatez pas un disque en vous fondant uniquement sur un nom de périphérique transitoire
ou sur une sélection manuelle. Demandez au
[Support](/fr/troubleshooting#ouvrir-un-billet-de-soutien) si le volume du portail peut être associé
au périphérique de l’instance virtuelle et si une procédure validée d’initialisation et de montage
est disponible. Si une erreur s’affiche, indiquez le projet, l’emplacement et le message exact. Dans
tous les cas, fournissez les détails non sensibles de la ressource.

## Prochaines étapes

- [Réseau VPC](/fr/public-cloud/networking/vpc/create-vpc) : isolez votre infrastructure avec des
  réseaux privés.
- [Stockage objet](/fr/public-cloud/storage/object-storage/create-bucket) : stockage compatible S3
  pour les fichiers et les sauvegardes.
- [Kubernetes](/fr/public-cloud/kubernetes/create-cluster) : grappes de conteneurs gérées.
- [ZCP CLI](/fr/public-cloud/cli/installation) : gérez vos ressources depuis le terminal.
