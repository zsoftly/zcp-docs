---
title: Régions
description: Régions de ZSoftly Cloud Platform (YOW et YUL) et ce que chacune offre.
---

ZCP est exploité dans deux régions canadiennes. Vous choisissez une région lorsque vous créez une
ressource, comme une instance, un réseau, un volume ou une grappe. Les ressources sont limitées à
leur région : une VM utilise des réseaux et des volumes dans la même région.

| Code  | Emplacement | Processeurs | Niveaux de stockage            |
| ----- | ----------- | ----------- | ------------------------------ |
| `YOW` | Ottawa      | Intel, AMD  | NVMe, HDD (budget)             |
| `YUL` | Montreal    | AMD         | Pro NVMe, Premium SSD (budget) |

La région est encodée dans chaque ID de plan (`1` = YOW, `2` = YUL). Consultez
[Noms des plans](/fr/public-cloud/compute/plan-names) pour le schéma de nommage et
[Types d'instances](/fr/public-cloud/compute/instance-types) pour les caractéristiques et les
niveaux de stockage offerts dans chaque région.

## Choisir une région

- **Latence** : choisissez la région la plus proche de vos utilisateurs.
- **Processeur** : YOW offre Intel et AMD; YUL offre AMD.
- **Stockage** : les deux régions proposent un niveau économique pour les charges de travail
  sensibles aux coûts. YUL offre Premium SSD; YOW offre HDD.
- **Résidence des données** : les deux régions sont au Canada.

## Voir aussi

- [Créer une instance](/fr/public-cloud/compute/create-instance)
- [Types d'instances](/fr/public-cloud/compute/instance-types)
