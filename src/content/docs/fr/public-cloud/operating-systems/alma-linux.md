---
title: AlmaLinux
description:
  Déployez AlmaLinux sur ZCP, y compris les versions disponibles, l'utilisateur de connexion par
  défaut, l'accès SSH, la configuration au premier démarrage et les liens vers la documentation
  officielle d'AlmaLinux.
---

ZCP propose une image **AlmaLinux** maintenue dans chaque région. AlmaLinux est une distribution
Linux communautaire de qualité entreprise, compatible au niveau binaire 1:1 avec Red Hat Enterprise
Linux (RHEL). Elle est gratuite et libre. Aucune licence ni activation n'est requise.

Pour savoir comment toutes les images ZCP se comportent au premier démarrage, consultez
[Images de système d'exploitation](/fr/public-cloud/operating-systems/).

## Versions disponibles

AlmaLinux reflète le rythme de publication et le cycle de vie de RHEL, avec environ 10 ans de
support par version majeure.

| Version     | Statut        | Fin de vie                                 |
| ----------- | ------------- | ------------------------------------------ |
| AlmaLinux 9 | ✅ Disponible | 2032-05-31 (support actif jusqu'à 2027-05) |

Les dates de fin de vie sont fixées par la AlmaLinux OS Foundation. Confirmez dans les
[notes de version d'AlmaLinux](https://wiki.almalinux.org/release-notes/).

## Cas d'usage

AlmaLinux est une reconstruction gratuite de RHEL, compatible au niveau binaire 1:1, détenue par la
communauté et gouvernée par une fondation à but non lucratif. Elle vous donne une base d'entreprise
stable sans abonnement :

- **Serveurs de production compatibles RHEL** : exécutez sans modification des logiciels certifiés
  RHEL, avec des paquets, des politiques SELinux et un outillage `dnf` identiques.
- **Remplacement de CentOS** : un parcours de migration populaire et bien pris en charge pour
  quitter CentOS en fin de vie, avec l'outil ELevate pour les mises à niveau sur place.
- **Hébergement d'applications d'entreprise** : SAP, Oracle Database et serveurs d'applications Java
  qui ciblent l'écosystème RHEL.
- **Serveurs web et de bases de données** : Nginx, Apache, PostgreSQL, MariaDB et MySQL sur une base
  durable.
- **Conteneurs et DevOps** : nœuds Podman, Docker et Kubernetes. Hôtes de compilation et d'exécution
  CI/CD.
- **Parcs cloud et d'hébergement** : une base prévisible et maintenue côté sécurité pour les parcs
  qui ont besoin d'un cycle de vie de 10 ans.
- **Charges de travail réglementées** : conseils de durcissement CIS Benchmark et STIG pour les
  environnements sensibles à la conformité.

## Utilisateur de connexion par défaut

L'utilisateur par défaut est **`almalinux`**, avec `sudo` pour l'administration. Connectez-vous en
[SSH](/fr/public-cloud/compute/connect-ssh/) avec la clé que vous avez attachée à la création, ou
avec le mot de passe généré par le portail.

```bash
ssh almalinux@<your-instance-ip>
```

## Déployer une instance AlmaLinux

1. Allez dans **Compute → Create Instance** (voir
   [Créer une instance](/fr/public-cloud/compute/create-instance/)).
2. Choisissez l'image **AlmaLinux**.
3. Sélectionnez une région et un [forfait](/fr/public-cloud/compute/instance-types/), et attachez
   une clé SSH.
4. Attachez-la à un réseau et créez l'instance.

## Premières étapes recommandées

- Mettez à jour les paquets : `sudo dnf upgrade -y`.
- Confirmez l'accès par clé SSH, puis restreignez l'accès avec une
  [règle de pare-feu](/fr/public-cloud/compute/settings/firewall/).

## Documentation AlmaLinux

- [Documentation AlmaLinux](https://wiki.almalinux.org/)

## Bon à savoir

- Les **instantanés et sauvegardes** fonctionnent lorsque l'agent invité est installé. Voir
  [Instantanés de VM](/fr/public-cloud/backups-snapshots/vm-snapshots/) et
  [Sauvegardes](/fr/public-cloud/backups-snapshots/backups/).
- Autres options compatibles RHEL : [Rocky Linux](/fr/public-cloud/operating-systems/rocky-linux/)
  et [Oracle Linux](/fr/public-cloud/operating-systems/oracle-linux/).
