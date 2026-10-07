---
title: Enregistrements CAA
description:
  Découvrez comment les enregistrements CAA limitent l'émission de certificats et la limite actuelle
  de la console DNS ZCP.
---

Un enregistrement `CAA` énumère les autorités de certification autorisées à émettre des certificats
pour votre domaine. Les autorités de certification vérifient cette politique avant l'émission.

:::caution

Vous ne pouvez pas créer d'enregistrements `CAA` dans la console DNS ZCP. Communiquez avec le
soutien si vous devez publier un enregistrement CAA.

:::

## Champs

| Champ   | Exemple                     | Remarques                                                             |
| ------- | --------------------------- | --------------------------------------------------------------------- |
| Nom     | `@`                         | Généralement le sommet. S'applique au domaine et à ses sous-domaines. |
| Type    | `CAA`                       |                                                                       |
| Contenu | `0 issue "letsencrypt.org"` | Indicateur, balise et valeur.                                         |
| TTL     | `14400`                     | En secondes.                                                          |

La valeur comporte trois parties : un **indicateur** (généralement `0`), une **balise** (`issue`,
`issuewild` ou `iodef`) et une **valeur** entre guillemets (le domaine de l'autorité, ou une URL de
contact pour `iodef`).

## Remarques

- **`issue`** autorise une AC à émettre des certificats non génériques. **`issuewild`** couvre les
  certificats génériques. **`iodef`** définit un contact pour les signalements de violation de
  politique.
- **Aucun enregistrement CAA signifie aucune restriction.** Sans enregistrement `CAA`, aucune
  politique ne limite l'émission de certificats.

Voir aussi : [Enregistrements TXT](/fr/public-cloud/dns/records/txt),
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Types d'enregistrements](/fr/public-cloud/dns/records)
