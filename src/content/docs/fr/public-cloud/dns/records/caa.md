---
title: Enregistrements CAA
description:
  Limitez l'émission de certificats pour votre domaine aux autorités de certification choisies avec
  un enregistrement CAA sur ZCP DNS.
---

Un enregistrement `CAA` énumère les autorités de certification autorisées à émettre des certificats
pour votre domaine. Les autorités de certification vérifient cette politique avant l'émission.

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

## Créer

Console (affichage sous forme de fichier de zone) :

```text
@ CAA 0 issue "letsencrypt.org"    14400
@ CAA 0 iodef "mailto:security@example.com" 14400
```

CLI (protégez la valeur afin que les guillemets parviennent à l'enregistrement) :

```bash
zcp dns record-create --domain examplecom --name @ --type CAA --content '0 issue "letsencrypt.org"'
```

API : envoyez une requête `POST` avec
`{ "name": "@", "type": "CAA", "content": "0 issue \"letsencrypt.org\"", "ttl": 14400 }`.

## Vérifier

```bash
dig CAA example.com +short
# 0 issue "letsencrypt.org"
```

## Remarques

- **`issue`** autorise une AC à émettre des certificats non génériques. **`issuewild`** couvre les
  certificats génériques. **`iodef`** définit un contact pour les signalements de violation de
  politique.
- **Autorisez chaque AC employée.** Si vos certificats proviennent de plusieurs autorités, ajoutez
  un enregistrement `issue` pour chacune. Les autorités absentes doivent refuser l'émission.
- **Aucun enregistrement CAA signifie aucune restriction.** Sans enregistrement `CAA`, aucune
  politique ne limite l'émission de certificats.

Voir aussi : [Enregistrements TXT](/fr/public-cloud/dns/records/txt),
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Types d'enregistrements](/fr/public-cloud/dns/records)
