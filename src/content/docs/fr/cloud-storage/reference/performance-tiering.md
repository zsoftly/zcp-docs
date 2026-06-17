---
title: Performance et hiérarchisation
sidebar_position: 5
---

Un cluster dédié vous permet d'adapter les classes de périphériques et les mécanismes de protection
des données à chaque charge de travail, plutôt que d'accepter une couche universelle.

## NVMe comme couche rapide ou cache

Vous pouvez utiliser les disques NVMe de deux façons :

- **Comme pool rapide dédié**. Placez les charges de travail sensibles à la latence (bases de
  données, métadonnées, compartiments chauds) sur un pool entièrement NVMe, et les données
  volumineuses ou froides sur des disques de grande capacité.
- **Comme couche de cache pour les disques rotatifs**. Placez du NVMe devant des HDD de grande
  capacité afin que les données fréquemment consultées soient servies depuis la mémoire flash.

Une quantité modeste de NVMe combinée à des disques de grande capacité offre une forte performance
par Go stocké, sans payer pour une capacité entièrement flash.

## Réplication ou codage d'effacement

Pour chaque pool, choisissez le mécanisme de protection des données adapté à la charge de travail :

- **Réplication** (par exemple 3x). Latence minimale et récupération plus simple. Surcoût plus élevé
  en capacité brute.
- **Codage d'effacement**. Bien meilleur ratio entre capacité utilisable et capacité brute. Idéal
  pour les données volumineuses, orientées débit ou archivées.

La combinaison de mécanismes différents entre les pools d'un même cluster vous permet d'ajuster le
coût et la performance par charge de travail.

| Ressource                        | URL                                                            |
| -------------------------------- | -------------------------------------------------------------- |
| Pools Ceph                       | https://docs.ceph.com/en/latest/rados/operations/pools/        |
| CRUSH / classes de périphériques | https://docs.ceph.com/en/latest/rados/operations/crush-map/    |
| Codage d'effacement              | https://docs.ceph.com/en/latest/rados/operations/erasure-code/ |

:::tip

Vous ne savez pas comment organiser les pools et les classes de périphériques pour votre charge de
travail? ZSoftly conçoit la disposition avec vous pendant le
[provisionnement](/fr/cloud-storage/getting-started/provisioning#données-de-dimensionnement).

:::
