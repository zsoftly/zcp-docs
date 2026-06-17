---
title: OpenStack
sidebar_position: 2
---

# Référence OpenStack

OpenStack est l'autre plateforme d'orchestration infonuagique prise en charge pour ZSoftly Private
Cloud, au même titre qu'Apache CloudStack. Si votre environnement utilise OpenStack, les concepts
d'orchestration correspondent aux projets, services et API OpenStack.

## Version

Votre document d'identifiants précise la version exacte d'OpenStack déployée dans votre
environnement.

## Documentation officielle

| Ressource                   | URL                                                       |
| --------------------------- | --------------------------------------------------------- |
| Accueil de la documentation | https://docs.openstack.org                                |
| Guides d'installation       | https://docs.openstack.org/install-guide/                 |
| Guides d'administration     | https://docs.openstack.org/admin/                         |
| CLI (OpenStackClient)       | https://docs.openstack.org/python-openstackclient/latest/ |
| Référence API               | https://docs.openstack.org/api-quick-start/               |
| Versions                    | https://releases.openstack.org                            |

ZSoftly ne maintient pas de miroir de la documentation OpenStack. La documentation officielle
ci-dessus fait autorité.

## OpenStackClient (osc)

`openstack` est la CLI unifiée officielle.

### Installer

```bash
pip install python-openstackclient
openstack --version
```

Utilisez un virtualenv ou `pipx` pour l'isoler du Python système.

### Configurer

Authentifiez-vous avec un fichier `clouds.yaml` ou `openrc`. Votre URL d'authentification, votre
projet et vos identifiants se trouvent dans le document d'identifiants fourni lors de la remise.

`clouds.yaml` (dans `~/.config/openstack/` ou le répertoire de travail) :

```yaml
clouds:
  zsoftly:
    auth:
      auth_url: https://<your-keystone-endpoint>:5000/v3
      username: <your-username>
      password: <your-password>
      project_name: <your-project>
      user_domain_name: Default
      project_domain_name: Default
    region_name: <your-region>
    interface: public
    identity_api_version: 3
```

```bash
export OS_CLOUD=zsoftly
```

Vous pouvez aussi télécharger un fichier RC depuis Horizon (**Project → API Access → Download
OpenStack RC File**) et l'exécuter avec `source`.

### Vérifier

```bash
openstack token issue
openstack catalog list
```

### Exemples d'utilisation

```bash
openstack server list
openstack network list
openstack image list
openstack flavor list
```

## Tableau de bord Horizon

Horizon est l'interface Web d'OpenStack. Son URL se trouve dans votre document d'identifiants; vous
pouvez télécharger les identifiants CLI depuis **Project → API Access**.
