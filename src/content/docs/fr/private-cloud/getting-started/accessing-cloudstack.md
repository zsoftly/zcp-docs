---
title: Accéder à CloudStack
sidebar_position: 2
---

# Accéder à Apache CloudStack

L'interface de gestion CloudStack de votre nuage privé est le principal plan de contrôle de votre
infrastructure.

## Interface de gestion

L'interface CloudStack est disponible à l'URL indiquée dans votre document d'identifiants,
généralement :

```
http://<management-server-ip>:8080/client
```

ou en HTTPS si TLS est configuré :

```
https://<management-server-hostname>/client
```

Connectez-vous avec les identifiants administrateur de votre document de remise.

## Changer le mot de passe administrateur

Immédiatement après la première connexion :

1. Cliquez sur l'icône **Account** dans le coin supérieur droit.
2. Sélectionnez **Change Password**.
3. Définissez un mot de passe robuste et conservez-le de façon sécuritaire.

## Accès API

CloudStack expose une API native :

```
http://<management-server-ip>:8080/client/api
```

Consultez la [documentation de l'API Apache CloudStack](https://cloudstack.apache.org/api.html) pour
la référence complète.

## Clients pris en charge

- **CloudStack UI** : navigateur Web, sans installation requise.
- **cmk** : CLI de gestion CloudStack (binaire Go v6.5.0) : voir
  [Référence Apache CloudStack](../../reference/apache-cloudstack) pour les étapes d'installation et
  de configuration.
- **Terraform** : via le
  [fournisseur CloudStack](https://registry.terraform.io/providers/cloudstack/cloudstack/latest).
- **Ansible** : via la
  [collection CloudStack](https://docs.ansible.com/ansible/latest/collections/ngine_io/cloudstack/).
