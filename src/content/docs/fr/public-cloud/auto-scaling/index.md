---
title: Mise à l'échelle automatique
---

La mise à l'échelle automatique ajuste automatiquement le nombre d'instances VM selon la demande en
temps réel, afin d'assurer la disponibilité tout en réduisant les coûts.

### Créer un groupe de mise à l'échelle automatique

- Dans le menu de gauche, cliquez sur **Auto-Scaling**.
- Cliquez sur **Créer New**.

:::note

Captures d'écran à venir.

:::

### Étapes

1. **Projet** : assignez le groupe à un projet.
2. **Emplacement** : sélectionnez le centre de données.
3. **Réseau** : sélectionnez ou créez un réseau.
4. **Équilibreur de charge** : sélectionnez l'équilibreur de charge qui répartira le trafic.
5. **Forwarding Rules** : définissez les plages de ports publics et privés.
6. **Image** : sélectionnez le système d'exploitation ou le modèle.
7. **Plan** : choisissez le CPU, la mémoire et le stockage.
8. **Server Settings** : définissez le mot de passe des instances.
9. **Capacity Planner** : définissez le nombre minimal et maximal d'instances et la période de grâce
   (secondes).
10. **Policies** :
    - **Scale Up Policy** : déclenchée lorsque l'utilisation dépasse un seuil; ajoute des instances.
    - **Scale Down Policy** : déclenchée lorsque la demande baisse; retire des instances.
    - **Expressions** : définissez Counter, Operator et Threshold pour chaque politique.
    - **Scheduled Policies** : effectue la mise à l'échelle à des heures précises plutôt qu'en
      réaction aux métriques.
11. **Nom** : fournissez un nom unique.
12. **Créer** : cycles de facturation : Monthly, Quarterly, Semiannually, Yearly, Bi-annually,
    Tri-annually. Cliquez sur **Créer**.
