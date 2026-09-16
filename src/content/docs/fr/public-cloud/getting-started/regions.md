---
title: Régions
description: Régions de ZSoftly Cloud Platform (YOW et YUL) et ce que chacune offre.
---

ZCP est exploité dans deux régions canadiennes. Vous choisissez une région lorsque vous créez une
ressource, comme une instance, un réseau, un volume ou une grappe. Les ressources sont limitées à
leur région : une VM utilise des réseaux et des volumes dans la même région.

| Code  | Emplacement | Processeurs | Niveaux de stockage                      |
| ----- | ----------- | ----------- | ---------------------------------------- |
| `YOW` | Ottawa      | Intel, AMD  | NVMe, HDD (budget)                       |
| `YUL` | Montreal    | Intel, AMD  | Pro NVMe (`b2.g1`), Premium SSD (budget) |

`YUL` et `YOW` sont les codes de région. La CLI, l'API et Terraform reçoivent la région sous forme
de slug, `yul-1` ou `yow-1`. Exécutez `zcp region list` pour les consulter. Le chiffre d'un slug
n'est pas le chiffre de région d'un ID de plan. YUL porte le slug `yul-1` et le chiffre de plan `2`.

La région est encodée dans chaque ID de plan (`1` = YOW, `2` = YUL). Consultez
[Noms des plans](/fr/public-cloud/compute/plan-names) pour le schéma de nommage et
[Types d'instances](/fr/public-cloud/compute/instance-types) pour les caractéristiques et les
niveaux de stockage offerts dans chaque région.

## Choisir une région

- **Latence** : choisissez la région la plus proche de vos utilisateurs.
- **Processeur** : YOW et YUL offrent Intel et AMD. La capacité Intel de YUL utilise les familles
  `ci2` et `cim2` avec le niveau de stockage `b2.g1`.
- **Stockage** : les deux régions proposent un niveau économique pour les charges de travail
  sensibles aux coûts. YUL offre Premium SSD; YOW offre HDD.
- **Résidence des données** : les deux régions sont au Canada.

## Voir aussi

- [Créer une instance](/fr/public-cloud/compute/create-instance)
- [Types d'instances](/fr/public-cloud/compute/instance-types)
