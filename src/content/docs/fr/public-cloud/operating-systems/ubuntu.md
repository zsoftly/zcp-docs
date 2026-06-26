---
title: Ubuntu
description:
  Déployez Ubuntu Server LTS sur ZCP, y compris les versions disponibles, la connexion par défaut,
  l'accès par SSH et par mot de passe, la configuration au premier démarrage et les liens vers la
  documentation officielle de Canonical.
---

ZCP offre des images **Ubuntu Server LTS** maintenues dans toutes les régions. Chaque image est
livrée avec les pilotes paravirtuels et l'agent invité pour des E/S rapides et une gestion propre,
et définit un nom d'hôte et un identifiant d'administrateur uniques au premier démarrage. Ubuntu est
gratuit et à code source ouvert, sans licence ni activation requise.

Pour savoir comment toutes les images ZCP se comportent au premier démarrage, consultez
[Images de système d'exploitation](/fr/public-cloud/operating-systems/).

## Versions disponibles

ZCP suit les versions **à support à long terme (LTS)** d'Ubuntu. Choisissez la version la plus
récente, sauf si une application vous contraint à une plus ancienne. Chaque LTS bénéficie de **5 ans
de maintenance de sécurité standard** de la part de Canonical, prolongeable à **10 ans** grâce à la
maintenance de sécurité étendue (ESM) sous Ubuntu Pro.

| Version          | Nom de code      | État          | Fin du support standard                   |
| ---------------- | ---------------- | ------------- | ----------------------------------------- |
| Ubuntu 26.04 LTS | Resolute Raccoon | ✅ Disponible | Avril 2031 (ESM jusqu'en 2036)            |
| Ubuntu 24.04 LTS | Noble Numbat     | ✅ Disponible | Avril 2029 (ESM jusqu'en 2034)            |
| Ubuntu 22.04 LTS | Jammy Jellyfish  | ✅ Disponible | Avril 2027 (ESM jusqu'en 2032)            |
| Ubuntu 20.04 LTS | Focal Fossa      | ✅ Disponible | Terminé en avril 2025 (ESM jusqu'en 2030) |

:::caution

Ubuntu 20.04 LTS a atteint sa fin du support standard en avril 2025. Il ne reçoit désormais des
mises à jour de sécurité que par l'entremise d'Ubuntu Pro ESM. Déployez 22.04 ou une version plus
récente pour les nouvelles charges de travail. Les dates de fin de vie sont fixées par Canonical.
Confirmez-les sur la page du
[cycle de publication d'Ubuntu](https://ubuntu.com/about/release-cycle).

:::

## Cas d'usage

Ubuntu Server est le Linux le plus déployé dans le nuage et le choix par défaut pour les nouvelles
charges de travail Linux sur ZCP :

- **Hébergement Web et d'applications** : Nginx, Apache, Node.js, Python/Django, PHP/Laravel, Ruby
  on Rails et serveurs d'applications Java/Spring.
- **Conteneurs et Kubernetes** : hôtes Docker et containerd, et nœuds du plan de contrôle ou nœuds
  de travail Kubernetes. C'est la base standard pour les exécuteurs CI/CD nés du nuage.
- **Bases de données et données** : PostgreSQL, MySQL/MariaDB, MongoDB, Redis/Valkey, et charges de
  travail d'analytique ou de pipelines de données.
- **DevOps et automatisation** : Jenkins, exécuteurs GitLab, nœuds de contrôle Ansible/Terraform, et
  serveurs de compilation et d'empaquetage.
- **Charges de travail IA/AA et GPU** : TensorFlow, PyTorch et les chaînes d'outils CUDA
  fonctionnent sur la pile de pilotes bien prise en charge d'Ubuntu.
- **Périphérie, IdO et développement** : environnements de développement reproductibles,
  microservices et passerelles de périphérie légères.
- **Applications en un clic** : Ubuntu est la base de la plupart des images de la
  [Place de marché](/fr/public-cloud/marketplace/), donc tout ce qui y est déployé fonctionne sur le
  même SE que celui que vous obtenez ici.

## Utilisateur de connexion par défaut

L'utilisateur par défaut est **`ubuntu`**, avec `sudo` pour l'administration. Connectez-vous par
[SSH](/fr/public-cloud/compute/connect-ssh/) avec la clé que vous avez jointe lors de la création,
ou avec le mot de passe généré par le portail.

```bash
ssh ubuntu@<your-instance-ip>
```

## Déployer une instance Ubuntu

1. Allez à **Compute → Create Instance** (consultez
   [Créer une instance](/fr/public-cloud/compute/create-instance/)).
2. Choisissez une image **Ubuntu** et la version que vous voulez.
3. Choisissez une région et un [forfait](/fr/public-cloud/compute/instance-types/), et joignez une
   clé SSH.
4. Rattachez l'instance à un réseau et créez-la.

## Premières étapes recommandées

- Mettez à jour les paquets : `sudo apt update && sudo apt upgrade -y`.
- Confirmez que l'accès par clé SSH fonctionne, puis désactivez la connexion par mot de passe si
  vous n'utilisez que des clés.
- Verrouillez l'accès avec une [règle de pare-feu](/fr/public-cloud/compute/settings/firewall/).

## Documentation Ubuntu

Pour l'administration, les paquets et les détails de version, consultez la documentation officielle
de Canonical :

- [Documentation Ubuntu Server](https://documentation.ubuntu.com/server/)
- [Versions et cycle de vie d'Ubuntu](https://ubuntu.com/about/release-cycle)

## Bon à savoir

- **Les instantanés et les sauvegardes** fonctionnent avec l'agent invité installé. Consultez
  [Instantanés de VM](/fr/public-cloud/backups-snapshots/vm-snapshots/) et
  [Sauvegardes](/fr/public-cloud/backups-snapshots/backups/).
- Besoin d'une autre famille Linux ? Consultez
  [Rocky Linux](/fr/public-cloud/operating-systems/rocky-linux/),
  [AlmaLinux](/fr/public-cloud/operating-systems/alma-linux/) ou
  [Oracle Linux](/fr/public-cloud/operating-systems/oracle-linux/).
