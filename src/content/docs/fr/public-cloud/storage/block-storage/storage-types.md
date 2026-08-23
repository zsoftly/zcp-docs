---
title: Types de stockage et résilience
sidebar_position: 2
---

Le stockage bloc du nuage public ZCP est offert en niveaux de stockage locaux à l'hôte et en niveaux
partagés répliqués. Choisissez le niveau selon les besoins de performance, de reprise et la
criticité de la charge de travail.

## Disponibilité

- **YUL-1** est la région de production principale pour le stockage local.
- **YOW-1** est destiné au développement et aux tests. Ne l'utilisez pas comme cible de production
  pour cette offre de stockage.
- La disponibilité et la possibilité de commander dépendent de la région et du plan sélectionnés.
  Confirmez la sélection actuelle dans le portail ou auprès de ZSoftly avant le déploiement.
- Les plans affichés dans le portail constituent la référence pour la disponibilité régionale
  actuelle. Si un plan n'est pas indiqué comme pouvant être commandé, ne présumez pas qu'il est
  disponible pour un déploiement en libre-service.

## Tarification et commande

La [page de tarification de ZCP](https://zcp.zsoftly.ca/pricing/#block-storage) est la source des
tarifs actuels et de l'état de commande des niveaux locaux. La documentation explique le
comportement et le choix du stockage, sans recopier les tableaux de prix.

## Niveaux de stockage

| Niveau  | Stockage              | Résilience                            | Utilisation adaptée                                                                          |
| ------- | --------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `b2.l1` | SSD NVMe local        | Un hôte et un disque                  | Bases de données avec réplication applicative, caches, données temporaires et compilations   |
| `b2.l2` | SSD SATA local        | Un hôte et un disque                  | Capacité locale économique et charges avec moins d'I/O                                       |
| `b2.g1` | NVMe partagé répliqué | Distribué dans le cluster de stockage | Charges de production qui exigent une reprise sur hôte et une résilience du stockage partagé |
| `b2.g2` | SSD partagé répliqué  | Distribué dans le cluster de stockage | Charges de production qui exigent une reprise sur hôte et une résilience du stockage partagé |

Le stockage local attache la VM à un stockage situé sur son hôte. Il offre les performances directes
du disque, mais le volume dépend de cet hôte. Le stockage local n'offre ni réplication au niveau du
stockage ni migration à chaud normale entre hôtes.

Le stockage partagé répliqué ajoute le réseau et la réplication. Il offre une meilleure tolérance
aux pannes, car les données restent disponibles dans le cluster de stockage lorsque la plateforme
permet la reprise sur un autre hôte.

## Tailles et disques racine

Les niveaux de disque racine locaux commencent à **40 Gio**. Les tailles fixes suivantes comprennent
60, 80, 120, 160, 200, 320 et 400 Gio. Le dimensionnement personnalisé d'un volume de données a un
minimum de 10 Gio lorsque le plan choisi prend en charge les volumes personnalisés.

Le stockage racine est inclus dans le plan VM choisi. Un volume de données séparé est utile si vous
devez séparer les données applicatives du système d'exploitation, modifier la VM indépendamment des
données ou appliquer un plan de sauvegarde distinct.

## Sauvegarde et reprise

Le stockage local ne remplace pas les sauvegardes. Une panne d'hôte, une opération de maintenance
sur l'hôte ou une panne de disque peut rendre un volume local indisponible. Utilisez la réplication
applicative, les instantanés de volume et les sauvegardes selon l'objectif de reprise de la charge
de travail.

Choisissez le stockage partagé répliqué si la charge exige une résilience au niveau du stockage ou
une reprise sur un autre hôte. Choisissez le stockage local si les performances directes du disque
ou un coût de stockage inférieur comptent davantage qu'une reprise inter-hôtes immédiate.

Voir aussi : [Créer un volume](/fr/public-cloud/storage/block-storage/create-volume),
[Instantanés de volume](/fr/public-cloud/storage/block-storage/snapshots),
[Sauvegardes](/fr/public-cloud/backups-snapshots/backups)
