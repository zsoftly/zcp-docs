---
title: Debian
description:
  Déployez Debian 12 et Debian 13 sur ZCP dans YOW-1 et YUL-1 avec des pratiques opérationnelles
  adaptées à la région.
---

ZCP prend en charge deux images publiques Debian :

| Image       | Version       | Régions          | Utilisateur par défaut |
| ----------- | ------------- | ---------------- | ---------------------- |
| `Debian-13` | 13 (Trixie)   | `yow-1`, `yul-1` | `debian`               |
| `Debian-12` | 12 (Bookworm) | `yow-1`, `yul-1` | `debian`               |

:::caution

YUL-1 est la région principale pour la production. Utilisez YOW-1 pour le développement et les
tests; YOW-1 n'est pas recommandé pour les charges de production. La disponibilité dépend de la
région. Confirmez la région cible et la version dans le portail avant d'automatiser le déploiement.
Le portail constitue la vérification finale si la configuration du catalogue et l'état du
déploiement changent à des moments différents.

:::

![Portail ZCP affichant Debian 13 (Trixie) et Debian 12 (Bookworm) dans le sélecteur d'images](../../../../../assets/public-cloud/debian-versions-portal.webp)

## Bonnes pratiques

- Épinglez la version Debian et la région dans le code d'infrastructure.
- Utilisez des clés SSH et le compte `debian` avec le principe du moindre privilège. Ne partagez pas
  les identifiants administratifs.
- Rendez la configuration cloud-init idempotente et vérifiez la fin du premier démarrage.
- Appliquez les correctifs depuis les dépôts officiels Debian.
- Configurez les règles de pare-feu, les sauvegardes ou instantanés, la surveillance et les alertes
  d'espace disque avant d'exposer une application.
- Séparez les données du système d'exploitation et celles de l'application lorsque la charge, le
  plan de sauvegarde ou le plan de récupération le justifient.

## Références officielles

- [Debian Cloud](https://wiki.debian.org/Cloud)
- [Cycle de vie des images cloud Debian](https://wiki.debian.org/Cloud/ImageLifecycle)
- [Images officielles Debian](https://wiki.debian.org/Teams/DPL/OfficialImages)
- [Images cloud Debian](https://cloud.debian.org/images/cloud/)
- [cloud-init](https://cloud-init.io/)

## Alternatives prises en charge

Utilisez une image du [catalogue actuel des images de SE](/fr/public-cloud/operating-systems/) :

- [Ubuntu](/fr/public-cloud/operating-systems/ubuntu/) : 26.04, 24.04, 22.04 ou 20.04 LTS
- [Rocky Linux](/fr/public-cloud/operating-systems/rocky-linux/) : 9
- [AlmaLinux](/fr/public-cloud/operating-systems/alma-linux/) : 9
- [Oracle Linux](/fr/public-cloud/operating-systems/oracle-linux/) : 10 ou 9
