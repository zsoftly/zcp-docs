---
title: Dépannage
description:
  Diagnostiquer les problèmes courants des produits ZSoftly et savoir quand ouvrir un billet de
  soutien.
---

Cette section couvre les problèmes connus touchant ZCP (Public Cloud), ZPCP (Private Cloud) et ZCS
(Cloud Storage). Chaque article explique la cause du problème et la façon de le résoudre. Certains
problèmes doivent être corrigés par notre équipe d'ingénierie côté plateforme. Dans ces cas,
l'article vous indique d'ouvrir un billet de soutien.

## Problèmes connus

- [Détachement ou suppression bloqué par une erreur d'instantané](./detach-blocked-by-snapshot)

## Ouvrir un billet de soutien

Si votre problème n'est pas listé ici, ou si une page vous demande de communiquer avec le soutien,
ouvrez un billet :

- **Portail** : connectez-vous à la [console](https://cloud.zcp.zsoftly.ca), ouvrez **Support** et
  créez un billet.
- **CLI** : exécutez `zcp support list` pour suivre vos billets ouverts depuis la ligne de commande.

Incluez les éléments suivants dans chaque billet afin de nous aider à le résoudre sans échanges
inutiles :

1. Le nom et le type de la ressource, par exemple le nom de l'instance ou du volume.
2. La région où se trouve la ressource.
3. Le message d'erreur exact, ou une capture d'écran.
4. Ce que vous tentiez de faire, et environ à quel moment.
