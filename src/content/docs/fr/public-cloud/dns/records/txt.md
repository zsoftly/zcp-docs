---
title: Enregistrements TXT
description:
  Stockez du texte dans un enregistrement TXT sur ZCP DNS pour SPF, DKIM, DMARC et la vérification
  de domaine, en respectant les règles de guillemets.
---

Un enregistrement `TXT` stocke du texte libre sous un nom. Il sert souvent à l'authentification du
courrier électronique (SPF, DKIM et DMARC) et à prouver la propriété d'un domaine auprès d'un
service tiers.

## Champs

| Champ   | Exemple         | Remarques                                                |
| ------- | --------------- | -------------------------------------------------------- |
| Nom     | `@` ou un label | La vérification emploie souvent un label comme `_dmarc`. |
| Type    | `TXT`           |                                                          |
| Contenu | `"v=spf1 -all"` | Texte entouré de guillemets doubles.                     |
| TTL     | `14400`         | En secondes.                                             |

## Créer

Console (affichage sous forme de fichier de zone) :

```text
@      TXT "v=spf1 mx -all"                 14400
_dmarc TXT "v=DMARC1; p=reject; rua=mailto:dmarc@example.com" 14400
```

CLI (protégez le contenu afin que les guillemets parviennent à l'enregistrement) :

```bash
zcp dns record-create --domain examplecom --name @ --type TXT --content '"v=spf1 -all"'
```

API : envoyez une requête `POST` avec
`{ "name": "@", "type": "TXT", "content": "\"v=spf1 -all\"", "ttl": 14400 }`.

## Vérifier

```bash
dig TXT example.com +short
# "v=spf1 -all"
```

## Usages courants

- **SPF** : `"v=spf1 mx -all"` désigne les hôtes autorisés à envoyer des courriels pour votre
  domaine.
- **DKIM** : une longue clé publique sous un nom de sélecteur comme `selector._domainkey`.
- **DMARC** : une politique sous `_dmarc`, par exemple `"v=DMARC1; p=reject"`.
- **Vérification de domaine** : une valeur fournie par un service afin de prouver que vous contrôlez
  le domaine.

## Remarques

- **Guillemets.** Vous pouvez saisir la valeur avec ou sans guillemets doubles. La plateforme la
  stocke et la renvoie entre guillemets. Dans la CLI, pour transmettre vous-même les guillemets,
  protégez la valeur afin que l'interpréteur de commandes les transmette, par exemple
  `'"v=spf1 -all"'`.
- **Une chaîne par enregistrement.** Conservez une longue clé DKIM dans un seul enregistrement. La
  plateforme la stocke telle quelle.
- **Plusieurs valeurs par nom.** Un nom peut contenir plusieurs valeurs `TXT`. La création d'un
  autre enregistrement `TXT` sous le même nom l'ajoute à l'ensemble, donc le sommet peut contenir à
  la fois un enregistrement SPF et un enregistrement de vérification. Voir
  [Plusieurs valeurs par nom et par type](/fr/public-cloud/dns/records#plusieurs-valeurs-par-nom-et-par-type).

Voir aussi : [Enregistrements MX](/fr/public-cloud/dns/records/mx),
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Types d'enregistrements](/fr/public-cloud/dns/records)
