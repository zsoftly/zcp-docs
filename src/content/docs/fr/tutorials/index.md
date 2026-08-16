---
title: Tutoriels
description:
  Tutoriels pratiques de bout en bout pour la plateforme infonuagique ZSoftly. Suivez le guide, d'un
  nouveau compte jusqu'à un déploiement fonctionnel.
sidebar:
  label: Vue d'ensemble
---

Des tutoriels étape par étape qui vous mènent de rien à un résultat fonctionnel. Chacun part d'un
compte tout neuf et détaille chaque commande, pour que vous puissiez copier, coller et apprendre au
fil de l'eau.

Vous cherchez une fonctionnalité précise plutôt qu'un guide complet ? La
[référence CLI](/fr/public-cloud/cli/reference) et les guides par service dans la barre latérale
couvrent ces cas.

## Tutoriels

### [Déployer un VPS et installer Dokploy avec le CLI](/fr/tutorials/deploy-vps-dokploy-cli)

Passez d'un compte neuf à une machine virtuelle publique exécutant [Dokploy](https://dokploy.com),
une plateforme d'applications auto-hébergée. Vous installez et authentifiez le CLI, créez un VPS
avec une IP publique et un accès SSH, puis installez Dokploy, le tout depuis le terminal. Environ 15
minutes.

Vous apprenez à :

- Installer et authentifier le CLI `zcp`
- Importer une clé SSH et choisir une région, un plan et une image
- Créer une VM exposée sur Internet avec une IP publique
- Vous connecter en SSH et installer Dokploy

### [Exécuter Ollama pour le chat et l’inférence sur ZCP](/fr/tutorials/ollama-chat-and-inference)

Déployez Ollama dans YUL-1 sur une VM Intel de 64 Go, utilisez un modèle local avec le CLI et l’API
REST, mesurez la performance sans GPU et vérifiez le coût de la VM, du réseau et de l’adresse IP.

Vous apprenez à :

- Lire le catalogue YUL et déployer l’image Marketplace Ollama
- Tester d’abord un modèle 8B, puis mesurer un modèle 70B
- Utiliser `/api/chat`, `/api/generate` et un tunnel SSH
- Exécuter des tests limités et supprimer toutes les ressources

### [Exécuter Open WebUI avec Ollama sur ZCP](/fr/tutorials/open-webui-with-ollama)

Ajoutez Open WebUI à la même VM qu’Ollama. Exécutez le client navigateur sur la même machine,
reliez-le au service Ollama de l’hôte et gardez l’accès privé par un tunnel SSH chiffré.

Vous apprenez à :

- Installer Docker et démarrer Open WebUI avec un volume persistant
- Relier Open WebUI à Ollama sur la même VM
- Accéder à Open WebUI par un tunnel SSH chiffré
- Nettoyer le conteneur, la VM, l’IP, les règles et le réseau de test

## Pour aller plus loin

- [Démarrage rapide du CLI](/fr/public-cloud/cli/quickstart) : la version courte, quand vous avez
  déjà un compte
- [Démarrage rapide Public Cloud](/fr/public-cloud/getting-started/quickstart) : le même premier
  déploiement depuis le portail web
- [Journal des modifications](/fr/changelog/) : les nouveautés de la plateforme

### [Gérer ZCP avec Terraform ou OpenTofu](/tutorials/manage-infrastructure-terraform/)

Provisionnez un réseau et une machine virtuelle de manière déclarative avec le fournisseur officiel
`zsoftly/zcp`, publié dans les registres Terraform et OpenTofu. Vous écrivez un fichier de
configuration, l'appliquez, le modifiez et le détruisez, et chaque ressource reste suivie. Environ
15 minutes. (Tutoriel en anglais.)

Vous apprenez à :

- Installer le fournisseur et vous authentifier avec un jeton API
- Décrire un réseau et une VM en HCL puis appliquer le plan
- Redimensionner une VM sans la recréer et importer des ressources créées ailleurs
- Détruire la pile entière sans laisser de ressources orphelines
