---
title: Facturation
---

### Sommaire de facturation

Accédez à **Billing → Summary** pour obtenir une vue d'ensemble de la situation financière de votre
compte.

- **Services actifs** : nombre et ventilation des coûts par type de service (VM, IP, réseaux, etc.).
- **Cost Reports** : ventilation détaillée des dépenses par ressource.
- **Seuil de facturation postpayée** : consultez le montant qui déclenche une facture et un
  prélèvement sur votre carte enregistrée, puis configurez des alertes de facturation.
- **Type de facturation** : prépayé ou postpayé. Il affiche la consommation totale, l'utilisation
  mensuelle et les dépenses prévues.
- **Factures** : consultez les factures passées et en attente.
- **Recent Transactions** : registre détaillé des paiements récents.

## Choisir une option de facturation à l'inscription

Choisissez **Prépayé** si vous souhaitez ajouter du crédit à votre compte avant de provisionner un
nouveau service. Choisissez **Postpayé** si vous souhaitez utiliser des services d'abord et payer
les factures plus tard.

| Option       | Fonctionnement                                                                                                                                                                                                                                                                                                                                                                                             | À choisir si                                                                                                       |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Prépayé**  | Ajoutez du crédit à votre compte avant de provisionner un nouveau service. Votre utilisation réduit ce solde et vous ne pouvez pas créer un nouveau service sans crédit suffisant. Une utilisation active ou un renouvellement peut tout de même rendre le solde négatif. Votre prochain ajout de crédit règle le solde négatif avant d'ajouter du crédit utilisable.                                      | Vous souhaitez financer votre utilisation à l'avance ou utiliser un cycle de facturation trimestriel ou plus long. |
| **Postpayé** | Enregistrez une carte de crédit dans Stripe, puis utilisez des services horaires ou mensuels avant de payer les factures. Lorsque votre utilisation atteint votre seuil de facturation, ZCP génère une facture et prélève cette carte. Un nouveau cycle de seuil commence ensuite. PayPal, les virements bancaires, les télévirements et les paiements manuels ne sont pas acceptés pour le mode postpayé. | Vous souhaitez payer après avoir utilisé des services avec une carte de crédit enregistrée dans Stripe.            |

Chaque cycle de facturation postpayée commence avec un seuil de facturation initial de **100 CAD**
pour un compte personnel et de **300 CAD** pour un compte d'organisation. Lorsque votre utilisation
atteint ce seuil, ZCP génère une facture et prélève automatiquement votre carte enregistrée. Ce
seuil n'est pas une limite de dépenses. Il est distinct du crédit à votre compte prépayé et du
crédit promotionnel de lancement.

Choisissez Prépayé ou Postpayé pendant l'inscription. Après la création de votre compte, il reste
dans ce mode de facturation pendant toute sa durée de vie. Le mode postpayé accepte uniquement une
carte de crédit enregistrée dans Stripe.

Vous pouvez ajouter du crédit à votre compte dans **Billing → Modes de paiement** si vous utilisez
le mode prépayé.

### Abonnements

**Billing → Abonnements** affiche tous les services abonnés :

- **Actif** : service en cours d'exécution et facturé.
- **Inactive** : service annulé, non facturé à partir de la date d'annulation.
- **Scheduled for Deletion** : service marqué pour suppression. La facturation cesse lorsque ZCP le
  retire.

### Modes de paiement

**Billing → Modes de paiement** permet aux comptes prépayés de gérer leurs préférences de paiement
et d'ajouter du crédit à leur compte. Entrez le montant de l'ajout de crédit. ZCP le facture à votre
mode de paiement par défaut.

Les modes de paiement acceptés sont :

- **Carte** : Visa, Mastercard et American Express, traitées de façon sécurisée par **Stripe**.
- **PayPal** : paiement depuis votre solde PayPal ou un compte lié.
- **Bank Transfer / Wire** : pour les paiements manuels, communiquez avec notre
  [équipe des ventes](https://zcp.zsoftly.ca/contact?source=docs&topic=billing). Elle organisera le
  transfert et appliquera les fonds à votre compte sous forme de crédit à votre compte.

Les paiements par carte et PayPal sont en libre-service dans le portail. Les virements bancaires
sont organisés avec l'équipe des ventes.

### Transactions

**Billing → Transactions** affiche l'historique complet des transactions, avec les montants et les
détails.

### Relevé de compte

**Billing → Relevé de compte** fournit un sommaire complet des transactions, paiements et usages sur
une période donnée. Il comprend les factures, les détails d'utilisation et l'information sur les
crédits promotionnels de lancement.
