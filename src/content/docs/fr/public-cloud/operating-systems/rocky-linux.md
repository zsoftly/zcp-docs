---
title: Rocky Linux
description:
  Déployez Rocky Linux sur ZCP, y compris les versions disponibles, l'utilisateur de connexion par
  défaut, l'accès SSH, la configuration au premier démarrage et les liens vers la documentation
  officielle de Rocky Linux.
---

ZCP propose une image **Rocky Linux** maintenue dans chaque région. Rocky Linux est une distribution
Linux communautaire de qualité entreprise, compatible au niveau binaire avec Red Hat Enterprise
Linux (RHEL). C'est un choix de remplacement direct pour les charges de travail conçues pour RHEL.
Elle est gratuite et libre. Aucune licence ni activation n'est requise.

Pour savoir comment toutes les images ZCP se comportent au premier démarrage, consultez
[Images de système d'exploitation](/fr/public-cloud/operating-systems/).

## Versions disponibles

Rocky Linux suit le rythme de publication et le cycle de vie de RHEL. Chaque version majeure
bénéficie d'environ 10 ans de support.

| Version       | Statut        | Fin de vie |
| ------------- | ------------- | ---------- |
| Rocky Linux 9 | ✅ Disponible | 2032-05-31 |

Les dates de fin de vie sont fixées par la Rocky Enterprise Software Foundation. Confirmez sur le
[guide des versions de Rocky Linux](https://wiki.rockylinux.org/rocky/version/).

## Cas d'usage

Rocky Linux est le successeur communautaire de CentOS et une base gratuite, compatible bug pour bug
avec RHEL, idéale lorsque vous voulez du Linux entreprise sans coûts d'abonnement :

- **Serveurs de production compatibles RHEL** : exécutez sans modification des logiciels conçus pour
  RHEL, avec les mêmes paquets, les mêmes politiques SELinux et les outils `dnf`/`yum`.
- **Cible de migration depuis CentOS** : un remplacement direct pour les déploiements CentOS 7/8 en
  fin de vie.
- **Hébergement d'applications d'entreprise** : SAP, Oracle Database, JBoss/WildFly et autres
  charges de travail d'entreprise certifiées qui attendent un SE de la famille RHEL.
- **Serveurs web et de bases de données** : Nginx, Apache, PostgreSQL, MariaDB et MySQL sur une base
  stable et durable.
- **Conteneurs et virtualisation** : nœuds Podman, Docker et Kubernetes. Les hôtes KVM utilisent la
  pile de virtualisation de la famille RHEL.
- **HPC et calcul scientifique** : une base commune et reproductible pour les grappes de calcul et
  les pipelines de recherche.
- **Charges de travail sensibles à la conformité** : cycle de vie prévisible de 10 ans et conseils
  de durcissement CIS/STIG pour les environnements réglementés.

## Utilisateur de connexion par défaut

L'utilisateur par défaut est **`rocky`**, avec `sudo` pour l'administration. Connectez-vous en
[SSH](/fr/public-cloud/compute/connect-ssh/) avec la clé que vous avez attachée à la création, ou
avec le mot de passe généré par le portail.

```bash
ssh rocky@<your-instance-ip>
```

## Déployer une instance Rocky Linux

1. Allez dans **Compute → Create Instance** (voir
   [Créer une instance](/fr/public-cloud/compute/create-instance/)).
2. Choisissez l'image **Rocky Linux**.
3. Sélectionnez une région et un [forfait](/fr/public-cloud/compute/instance-types/), et attachez
   une clé SSH.
4. Attachez-la à un réseau et créez l'instance.

## Premières étapes recommandées

- Mettez à jour les paquets : `sudo dnf upgrade -y`.
- Confirmez l'accès par clé SSH, puis restreignez l'accès avec une
  [règle de pare-feu](/fr/public-cloud/compute/settings/firewall/).

## Documentation Rocky Linux

- [Documentation Rocky Linux](https://docs.rockylinux.org/)

## Bon à savoir

- Les **instantanés et sauvegardes** fonctionnent lorsque l'agent invité est installé. Voir
  [Instantanés de VM](/fr/public-cloud/backups-snapshots/vm-snapshots/) et
  [Sauvegardes](/fr/public-cloud/backups-snapshots/backups/).
- Autres options compatibles RHEL : [AlmaLinux](/fr/public-cloud/operating-systems/alma-linux/) et
  [Oracle Linux](/fr/public-cloud/operating-systems/oracle-linux/).
