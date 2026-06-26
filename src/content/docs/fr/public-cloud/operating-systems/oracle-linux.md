---
title: Oracle Linux
description:
  Déployez Oracle Linux sur ZCP, y compris les versions disponibles, l'utilisateur de connexion par
  défaut, l'accès SSH, la configuration au premier démarrage et les liens vers la documentation
  officielle d'Oracle Linux.
---

ZCP propose une image **Oracle Linux** maintenue dans chaque région. Oracle Linux est une
distribution Linux de qualité entreprise, compatible au niveau binaire avec Red Hat Enterprise Linux
(RHEL), et livrée avec le choix entre le Red Hat Compatible Kernel ou l'Unbreakable Enterprise
Kernel (UEK) d'Oracle. L'image elle-même est gratuite à télécharger et à utiliser. Aucune activation
n'est requise.

Pour savoir comment toutes les images ZCP se comportent au premier démarrage, consultez
[Images de système d'exploitation](/fr/public-cloud/operating-systems/).

## Versions disponibles

Oracle Linux suit la Lifetime Support Policy d'Oracle : environ 10 ans de support Premier par
version majeure, suivis du support étendu (Extended Support), puis du support de maintien indéfini
(Sustaining Support).

| Version        | Statut        | Fin du support Premier             |
| -------------- | ------------- | ---------------------------------- |
| Oracle Linux 9 | ✅ Disponible | 2032 (Extended/Sustaining au-delà) |

Les dates de support sont fixées par Oracle. Confirmez dans la
[Oracle Lifetime Support Policy](https://www.oracle.com/a/ocom/docs/elsp-lifetime-069338.pdf).

## Cas d'usage

Oracle Linux est une distribution gratuite et compatible RHEL d'Oracle, avec un **Unbreakable
Enterprise Kernel (UEK)** optionnel et haute performance ainsi qu'une correction sans temps d'arrêt
**Ksplice** intégrée :

- **Oracle Database et intergiciels** : le SE natif et entièrement pris en charge pour Oracle
  Database, WebLogic et la suite Oracle E-Business Suite.
- **Serveurs d'entreprise compatibles RHEL** : exécutez sans modification des logiciels de la
  famille RHEL, en choisissant le Red Hat Compatible Kernel ou l'UEK pour les fonctionnalités et les
  performances d'un noyau plus récent.
- **Correction sans temps d'arrêt** : Ksplice applique les mises à jour du noyau et de l'espace
  utilisateur critique sans redémarrage, idéal pour les services à haute disponibilité.
- **Hébergement web et de bases de données** : Nginx, Apache, MySQL (celui d'Oracle), PostgreSQL et
  MariaDB sur une base durable.
- **Conteneurs et cloud natif** : Podman, Docker et Kubernetes (y compris les services de conteneurs
  d'Oracle) sur un SE hôte pris en charge.
- **Migrations** : une cible simple pour quitter CentOS ou d'autres distributions de la famille
  RHEL, avec le script de conversion gratuit `centos2ol` d'Oracle.
- **Charges de travail d'entreprise et réglementées** : cycle de vie prévisible ainsi que
  durcissement CIS/STIG pour les environnements sensibles à la conformité.

## Utilisateur de connexion par défaut

L'utilisateur par défaut est **`cloud-user`**, avec `sudo` pour l'administration. Connectez-vous en
[SSH](/fr/public-cloud/compute/connect-ssh/) avec la clé que vous avez attachée à la création, ou
avec le mot de passe généré par le portail. Confirmez l'utilisateur exact affiché pour l'image dans
le portail.

```bash
ssh cloud-user@<your-instance-ip>
```

## Déployer une instance Oracle Linux

1. Allez dans **Compute → Create Instance** (voir
   [Créer une instance](/fr/public-cloud/compute/create-instance/)).
2. Choisissez l'image **Oracle Linux**.
3. Sélectionnez une région et un [forfait](/fr/public-cloud/compute/instance-types/), et attachez
   une clé SSH.
4. Attachez-la à un réseau et créez l'instance.

## Premières étapes recommandées

- Mettez à jour les paquets : `sudo dnf upgrade -y`.
- Confirmez l'accès par clé SSH, puis restreignez l'accès avec une
  [règle de pare-feu](/fr/public-cloud/compute/settings/firewall/).

## Documentation Oracle Linux

- [Documentation Oracle Linux](https://docs.oracle.com/en/operating-systems/oracle-linux/)

## Bon à savoir

- Les **instantanés et sauvegardes** fonctionnent lorsque l'agent invité est installé. Voir
  [Instantanés de VM](/fr/public-cloud/backups-snapshots/vm-snapshots/) et
  [Sauvegardes](/fr/public-cloud/backups-snapshots/backups/).
- Autres options compatibles RHEL : [Rocky Linux](/fr/public-cloud/operating-systems/rocky-linux/)
  et [AlmaLinux](/fr/public-cloud/operating-systems/alma-linux/).
