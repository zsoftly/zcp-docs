---
title: Groupes d'affinité
---

Les groupes d'affinité contrôlent le placement des VM sur les hôtes hyperviseurs dans
l'infrastructure infonuagique. Utilisez-les pour regrouper des VM afin de réduire la latence ou pour
les répartir entre plusieurs hôtes afin d'améliorer la tolérance aux pannes.

![Page des groupes d'affinité dans le portail ZCP](../../../../../assets/affinity-groups/affinity-groups-affinity-groups.webp)

### Créer un groupe d'affinité

- Dans le menu de gauche, cliquez sur **Affinity Groups**.
- Cliquez sur **Create Affinity Groups** ou sur l'icône **+**.
- Choisissez un **Projet** et une **Availability Zone**.
- Entrez un **Nom** et une **Description**.
- Sélectionnez le type de groupe d'affinité :

| Type                                | Comportement                                                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Host Affinity (Strict)**          | Les VM doivent toujours s'exécuter sur le même hôte hyperviseur. Le déploiement échoue si ce n'est pas possible. |
| **Host Anti-Affinity (Strict)**     | Les VM doivent toujours s'exécuter sur des hôtes différents. Le déploiement échoue si ce n'est pas possible.     |
| **Host Anti-Affinity (Non-Strict)** | Privilégie des hôtes différents, mais autorise le même hôte si la capacité l'exige.                              |
| **Host Affinity (Non-Strict)**      | Privilégie le même hôte, mais autorise des hôtes différents au besoin.                                           |

- Cliquez sur **Soumettre**.
