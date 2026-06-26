---
title: Images de système d'exploitation
description:
  Fonctionnement des images de système d'exploitation ZCP, y compris les images de base maintenues,
  la configuration au premier démarrage, l'accès et les mots de passe, ainsi que le catalogue
  complet des images Linux et Windows avec un lien vers chacune.
---

Les **images de système d'exploitation** ZCP sont les images de base à partir desquelles vous lancez
une instance. Chaque image est construite et maintenue par ZSoftly, reconstruite et revalidée à
chaque version, et optimisée pour démarrer rapidement et fonctionner proprement sur la plateforme.

Cela diffère de la [Place de marché](/fr/public-cloud/marketplace/), où chaque image est une
**application** (WordPress, GitLab, une base de données, …) préinstallée et configurée
automatiquement par-dessus Ubuntu. Utilisez une image de SE lorsque vous voulez un système
d'exploitation vierge sur lequel bâtir. Utilisez une image de la Place de marché lorsque vous voulez
une application prête à l'emploi.

## Fonctionnement des images ZCP

Chaque image de SE, Linux ou Windows, se comporte de la même façon au premier démarrage :

- **Base maintenue** : ZSoftly construit chaque image à partir de la version officielle du
  fournisseur, puis ajoute les pilotes paravirtuels et un agent invité pour des E/S rapides, un
  arrêt et un redémarrage en douceur, et des instantanés de VM cohérents avec les applications.
  ZSoftly valide ensuite l'image avant de la publier.
- **Configuration au premier démarrage** : l'image définit automatiquement un nom d'hôte unique et
  un identifiant d'administrateur unique par instance, de sorte qu'aucune instance ne soit livrée
  avec le même mot de passe.
- **Accès** : les images Linux acceptent une **clé SSH** (recommandé) ou un mot de passe généré par
  le portail. Les images Windows utilisent **RDP** avec un mot de passe administrateur généré
  automatiquement. Régénérez le mot de passe depuis le portail à tout moment (il s'applique après le
  prochain redémarrage).
- **Dimensionnement adapté** : choisissez tout [forfait](/fr/public-cloud/compute/instance-types/)
  qui répond aux besoins de l'image. Linux fonctionne aisément sur les plus petits forfaits, Windows
  exige au moins 4 Go de RAM et 2 vCPU.

Pour le flux de déploiement de bout en bout, consultez
[Créer une instance](/fr/public-cloud/compute/create-instance/). Pour basculer une instance
existante vers une image différente, consultez
[Changer de SE](/fr/public-cloud/compute/settings/change-os/).

## Utilisateur de connexion par défaut

Chaque image possède un utilisateur administratif par défaut. Confirmez le nom exact dans le portail
au moment où vous créez l'instance.

| Image        | Utilisateur par défaut | Se connecter avec                            |
| ------------ | ---------------------- | -------------------------------------------- |
| Ubuntu       | `ubuntu`               | [SSH](/fr/public-cloud/compute/connect-ssh/) |
| Rocky Linux  | `rocky`                | [SSH](/fr/public-cloud/compute/connect-ssh/) |
| AlmaLinux    | `almalinux`            | [SSH](/fr/public-cloud/compute/connect-ssh/) |
| Oracle Linux | `cloud-user`           | [SSH](/fr/public-cloud/compute/connect-ssh/) |
| Windows      | `Administrator`        | [RDP](/fr/public-cloud/compute/connect-rdp/) |

Chaque instance dispose aussi d'une console **VNC** dans le navigateur pour un accès sans SSH ni
RDP, utile pour le premier démarrage et le dépannage. Consultez
[Accès à la console](/fr/public-cloud/compute/console-access/).

## Catalogue

### Linux

Gratuit et à code source ouvert, sans licence ni activation requise.

| Image                                                            | Versions disponibles           | État          |
| ---------------------------------------------------------------- | ------------------------------ | ------------- |
| [Ubuntu](/fr/public-cloud/operating-systems/ubuntu/)             | 26.04, 24.04, 22.04, 20.04 LTS | ✅ Disponible |
| [Rocky Linux](/fr/public-cloud/operating-systems/rocky-linux/)   | 9                              | ✅ Disponible |
| [AlmaLinux](/fr/public-cloud/operating-systems/alma-linux/)      | 9                              | ✅ Disponible |
| [Oracle Linux](/fr/public-cloud/operating-systems/oracle-linux/) | 9                              | ✅ Disponible |

### Windows

Sous licence **apportez votre propre licence (BYOL)**. Vous fournissez et activez votre propre
licence.

| Image                                                                | Éditions / versions        | État          |
| -------------------------------------------------------------------- | -------------------------- | ------------- |
| [Windows Server](/fr/public-cloud/operating-systems/windows-server/) | 2022 Standard, 2025 Std/DC | ✅ Disponible |
| [Windows Server](/fr/public-cloud/operating-systems/windows-server/) | 2022 Datacenter            | 🚧 À venir    |
| [Windows 11 Pro](/fr/public-cloud/operating-systems/windows-11/)     | 11 Pro                     | ✅ Disponible |
