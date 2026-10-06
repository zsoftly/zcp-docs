---
title: Sauvegardes
sidebar_position: 3
---

## Sauvegardes d'instance

Les sauvegardes créent des copies planifiées des données de votre instance afin de vous protéger
contre les suppressions accidentelles, les défaillances logicielles ou les menaces de sécurité.
ZSoftly Public Cloud fournit des sauvegardes automatisées quotidiennes, hebdomadaires ou
personnalisées.

### Facturation des sauvegardes

La plateforme facture chaque sauvegarde en fonction de l'espace de stockage qu'elle utilise. Chaque
sauvegarde est associée à son propre abonnement. Celui-ci prend fin lorsque vous supprimez la
sauvegarde ou que le processus de rétention la supprime.

- Mettre un calendrier en pause arrête la création de nouvelles sauvegardes. Les sauvegardes
  existantes continuent d'entraîner des frais de stockage jusqu'à leur suppression.
- Le coût des sauvegardes dépend de la quantité de données stockées et de la durée de rétention.
- Les journaux d'activité enregistrent les changements de calendrier, les exécutions, les échecs et
  le nettoyage de rétention. Ils n'ont aucune incidence sur la facturation.

La mise à jour de la plateforme du T3 2026 indique que la facturation des sauvegardes existantes est
toujours en cours de migration. Consultez **Billing → Abonnements** et contactez le support pour
confirmer si la migration de la facturation de vos sauvegardes est terminée.

Pour en savoir plus, consultez la
[mise à jour de la plateforme du T3 2026](/fr/changelog/q3-2026-platform-update).

### Créer un calendrier de sauvegarde

- Dans le menu de gauche, cliquez sur **Sauvegardes**.
- Cliquez sur **Créer Sauvegardes** ou sur l'icône **+**.

### Étapes

1. **Emplacement** : sélectionnez le centre de données.
2. **Projet** : assignez la sauvegarde à un projet.
3. **Instance** : sélectionnez la VM à sauvegarder.
4. **Schedule** : définissez la fréquence de sauvegarde (intervalles et heure). Vous pouvez aussi
   cliquer sur **Take One Immediate** pour lancer une sauvegarde immédiate.
5. **Créer** : facturation : Hourly seulement, règle Fixed Prorata. Cliquez sur **Créer Backup**.

![Étapes de création d'un calendrier de sauvegarde](../../../../../assets/backups-snapshots/backups-steps.webp)

Voir aussi : [Instantanés de VM](/fr/public-cloud/backups-snapshots/vm-snapshots),
[Instantanés de volume](/fr/public-cloud/storage/block-storage/snapshots)
