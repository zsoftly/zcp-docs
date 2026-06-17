---
title: Démarrage rapide
sidebar_position: 4
description: Déployez votre première VM sur ZSoftly Public Cloud en moins de 10 minutes.
---

# Démarrage rapide

Déployez une VM, connectez-vous avec SSH et attachez un volume de stockage bloc, de bout en bout.

## Prérequis

- Un compte ZSoftly Public Cloud ([s'inscrire](/fr/public-cloud/getting-started/account-signup))
- Un client SSH, comme Terminal sur macOS/Linux ou PowerShell/Windows Terminal sur Windows

## Étape 1 : ajouter une clé SSH

Avant de créer une VM, ajoutez votre clé SSH publique au portail pour pouvoir vous connecter sans
mot de passe.

1. Dans le portail, allez à **Profil → Clés SSH**.
2. Cliquez sur **Ajouter une clé SSH**.
3. Collez votre clé publique, par exemple depuis `~/.ssh/id_ed25519.pub` ou `~/.ssh/id_rsa.pub`.
4. Donnez-lui un nom, puis cliquez sur **Soumettre**.

Si vous n'avez pas encore de clé SSH :

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

## Étape 2 : créer un réseau

Votre VM a besoin d'un réseau. Pour une configuration simple, utilisez un réseau public.

1. Dans le portail, allez à **Réseaux → Réseau public**.
2. Cliquez sur l'icône **+**.
3. Choisissez un **Emplacement**.
4. Assignez le réseau à un **Projet**, ou utilisez le projet par défaut.
5. Donnez-lui un nom, puis cliquez sur **Créer**.

## Étape 3 : créer une VM

1. Dans le portail, allez à **Instances**.
2. Cliquez sur l'icône **+**.
3. Configurez l'instance :
   - **Emplacement** : le même que celui de votre réseau
   - **Image** : choisissez un système d'exploitation, par exemple Ubuntu 24.04
   - **Type de CPU** : CPU partagé pour les tests, CPU dédié pour la production
   - **Plan** : General Compute, avec la plus petite taille qui convient
   - **Projet** : assignez l'instance à votre projet
   - **Réseau** : sélectionnez le réseau public créé à l'étape précédente
   - **IPv4 publique** : activez cette option
   - **Clé SSH** : sélectionnez la clé ajoutée à l'étape 1
   - **Nom du serveur** : donnez un nom à votre VM
4. Choisissez un **Cycle de facturation**, par exemple horaire pour les tests.
5. Cliquez sur **Review & Deploy**.

Votre VM sera prête en 30 à 60 secondes.

## Étape 4 : se connecter avec SSH

Lorsque la VM indique l'état **Running** :

1. Ouvrez la page **Overview** de la VM pour trouver l'**Adresse IP publique**.
2. Connectez-vous depuis votre terminal :

```bash
ssh root@<public-ip-address>
```

Si vous avez utilisé Ubuntu, le nom d'utilisateur par défaut est `ubuntu` :

```bash
ssh ubuntu@<public-ip-address>
```

## Étape 5 : attacher du stockage bloc (facultatif)

Pour ajouter du stockage persistant séparé du disque racine :

1. Allez à **Stockage bloc** dans le portail.
2. Cliquez sur **+** → **Créer Stockage bloc**.
3. Sélectionnez le même **Emplacement** et le même **Projet** que votre VM.
4. Choisissez l'**Instance** à laquelle attacher le volume.
5. Sélectionnez une **Taille de volume**.
6. Cliquez sur **Créer un volume**.

Une fois le volume attaché, formatez-le et montez-le sur votre VM :

```bash
# Find the new disk (usually /dev/vdb)
lsblk

# Format it
sudo mkfs.ext4 /dev/vdb

# Mount it
sudo mkdir -p /data
sudo mount /dev/vdb /data

# Make it persistent across reboots
echo '/dev/vdb /data ext4 defaults 0 2' | sudo tee -a /etc/fstab
```

## Prochaines étapes

- [Réseau VPC](/fr/public-cloud/networking/vpc/create-vpc) : isolez votre infrastructure avec des
  réseaux privés.
- [Stockage objet](/fr/public-cloud/storage/object-storage/create-bucket) : stockage compatible S3
  pour les fichiers et les sauvegardes.
- [Kubernetes](/fr/public-cloud/kubernetes/create-cluster) : grappes de conteneurs gérées.
- [ZCP CLI](/fr/public-cloud/cli/installation) : gérez vos ressources depuis le terminal.
