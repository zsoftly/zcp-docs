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

- **Guillemets.** La valeur est une chaîne entre guillemets, et la plateforme refuse une valeur sans
  guillemets. Dans la CLI, protégez-la afin que l'interpréteur de commandes transmette les
  guillemets, par exemple `'"v=spf1 -all"'`.
- **Une chaîne par enregistrement.** Conservez une longue clé DKIM dans un seul enregistrement. La
  plateforme la stocke telle quelle.
- **Une seule valeur par nom.** Un nom contient une seule valeur `TXT`. La création d'une deuxième
  valeur `TXT` sous le même nom remplace la première. Le sommet contient donc soit un enregistrement
  SPF, soit un enregistrement de vérification, mais pas les deux. Voir
  [Limites connues](/fr/public-cloud/dns/records#limites-connues).

Voir aussi : [Enregistrements MX](/fr/public-cloud/dns/records/mx),
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Types d'enregistrements](/fr/public-cloud/dns/records)
