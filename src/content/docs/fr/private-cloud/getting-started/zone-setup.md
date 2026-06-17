---
title: Configuration de zone
sidebar_position: 4
---

Comprendre la façon dont ZSoftly a structuré votre déploiement CloudStack.

## Zones, pods et clusters CloudStack

Apache CloudStack organise l'infrastructure selon une hiérarchie :

```
Zone
└── Pod
    └── Cluster
        ├── Host (KVM hypervisor)
        └── Primary Storage (Ceph RBD)
```

**Zone** : un centre de données logique. Dans la plupart des déploiements ZSoftly, une zone
correspond à un emplacement physique.

**Pod** : un groupe d'hôtes connectés au niveau 2 dans une zone. Les déploiements standards
utilisent généralement un pod par zone.

**Cluster** : un groupe d'hôtes hyperviseurs qui partagent la même configuration et le même stockage
primaire.

**Host** : un hyperviseur KVM physique ou virtuel qui exécute vos VM.

## Disposition de votre déploiement

Votre document d'identifiants indique le nom de la zone et le nombre de clusters. Pour afficher la
disposition complète :

1. Connectez-vous à l'interface CloudStack comme administrateur.
2. Allez à **Infrastructure → Zones**.
3. Cliquez sur votre zone pour développer les pods, les clusters et les hôtes.

## Ce que ZSoftly gère

- L'ajout de nouveaux hôtes hyperviseurs aux clusters existants.
- L'expansion des pools de stockage Ceph.
- La configuration réseau au niveau de la zone.

Communiquez avec le soutien ZSoftly pour toute modification à la disposition de l'infrastructure
sous-jacente.

## Référence officielle

Consultez le
[Apache CloudStack Administrator Guide](https://docs.cloudstack.apache.org/en/latest/adminguide/)
pour la documentation complète sur la gestion des zones.
