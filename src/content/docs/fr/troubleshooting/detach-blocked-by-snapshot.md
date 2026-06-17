---
title: Détachement ou suppression bloqué par une erreur d'instantané
description:
  Le détachement d'un volume ou la suppression d'une instance échoue avec une erreur d'instantané,
  même si aucun instantané n'est listé. Ouvrez un billet de soutien pour résoudre le problème.
---

## Symptôme

Une ou plusieurs des opérations suivantes échouent de façon répétée :

- Détacher un volume de stockage bloc d'une instance.
- Supprimer une instance.

Le portail affiche une notification d'erreur **Detach Disk** contenant le message suivant :

```text
Unable to detach volume, please specify an Instance that does not have Instance Snapshots
```

Lorsque vous ouvrez l'instance et consultez l'onglet **Instance Snapshots**, la liste est vide. Il
n'y a rien à supprimer, mais l'opération reste bloquée.

## Cause

Cela se produit lorsqu'une tentative précédente de création d'instantané d'instance a échoué en
cours de route. L'échec laisse derrière lui un enregistrement interne d'instantané en état d'erreur.
Le portail masque les instantanés échoués, ce qui donne l'impression que la liste est vide. La
plateforme tient toutefois encore compte de cet enregistrement et bloque l'opération jusqu'à ce que
notre équipe le supprime.

Il s'agit d'une condition rare côté plateforme. Il n'existe aucun moyen de la corriger depuis le
portail, la CLI ou l'API.

## Résolution

Ouvrez un billet de soutien afin que notre équipe d'ingénierie supprime l'enregistrement
d'instantané échoué. Il s'agit d'une correction rapide et sécuritaire qui n'affecte pas vos données
ni vos autres ressources.

Incluez les éléments suivants dans le billet :

1. Le nom de l'instance.
2. Le nom du volume, si le détachement échoue.
3. La région où se trouve l'instance.
4. Le message d'erreur exact.
5. La date et l'heure approximatives de votre dernière tentative de création d'un instantané de
   l'instance, si elles sont connues.

Une fois l'enregistrement supprimé par notre équipe, le détachement et la suppression fonctionnent
normalement.

:::tip

Si la création d'un instantané d'instance échoue, ouvrez immédiatement un billet avec le nom de
l'instance et l'heure de l'échec. La condition pourra être corrigée tôt, avant de bloquer un
détachement ou une suppression plus tard.

:::

Voir aussi : [Instantanés de VM](/fr/public-cloud/backups-snapshots/vm-snapshots),
[Stockage bloc](/fr/public-cloud/compute/settings/block-storage)
