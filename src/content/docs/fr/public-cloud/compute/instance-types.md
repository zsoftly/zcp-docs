---
title: Types d'instances
sidebar_position: 9
description:
  Familles d'instances de calcul ZCP et niveaux de stockage. Les caractéristiques et prix à jour par
  taille se trouvent sur la page de tarification.
---

Les plans de calcul ZCP sont offerts en trois familles, dans deux régions et avec quatre niveaux de
stockage. Pour comprendre comment un ID de plan encode ces informations, consultez
[Noms des plans](/fr/public-cloud/compute/plan-names). Pour les **caractéristiques à jour par taille
(vCPU, RAM, disque racine) et les prix de chaque plan**, consultez la
[page de tarification](https://zcp.zsoftly.ca/pricing), qui est la source de référence.

## Familles

| Famille                        | Ratio RAM/vCPU                                 | Idéal pour                                                                            |
| ------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| Usage général                  | 2:1 (4:1 à partir de `xl`, plafonné à 16 vCPU) | Charges de travail Web et applicatives équilibrées                                    |
| Optimisé pour la mémoire (`m`) | 8:1                                            | Charges de travail exigeantes en RAM, comme les caches et bases de données en mémoire |
| Optimisé pour le CPU (`c`)     | 1:1                                            | Calcul haute densité                                                                  |

## Niveaux de stockage

Le niveau de stockage est fixe par série et varie selon la région. Consultez
[Régions](/fr/public-cloud/getting-started/regions).

| Niveau      | Régions | Séries                                       |
| ----------- | ------- | -------------------------------------------- |
| NVMe        | YOW     | `ci1`, `ca1`, `cim1`, `cam1`, `cac1`         |
| Pro NVMe    | YUL     | `ca2`, `cam2`, `cac2`                        |
| Premium SSD | YUL     | `ca2s`, `cam2s`, `cac2s` (niveau économique) |
| HDD         | YOW     | `ci1h`, `ca1h`, `cim1h` (niveau économique)  |

## Tailles

Les tailles vont de `xs`, `s`, `m`, `l`, `xl`, `2xl`, `4xl` à `6xl`, de la plus petite à la plus
grande. Certaines séries n'offrent pas toutes les tailles. La
[page de tarification](https://zcp.zsoftly.ca/pricing) indique les vCPU, la RAM et le disque racine
exactement offerts pour chaque taille; le portail affiche aussi les options courantes lors de la
création d'une instance.

## Voir aussi

- [Noms des plans](/fr/public-cloud/compute/plan-names)
- [Créer une instance](/fr/public-cloud/compute/create-instance)
- [Régions](/fr/public-cloud/getting-started/regions)
