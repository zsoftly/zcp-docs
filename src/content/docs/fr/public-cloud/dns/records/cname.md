---
title: Enregistrements CNAME
description:
  Créez un alias d'un nom vers un autre avec un enregistrement CNAME sur ZCP DNS, en respectant les
  règles du sommet et de coexistence.
---

Un enregistrement `CNAME` crée un alias d'un nom vers un autre. Une requête visant l'alias renvoie
les enregistrements de la cible. Utilisez-le pour faire pointer un sous-domaine vers un nom d'hôte
possédant déjà une adresse, comme un répartiteur de charge ou un point de terminaison de
plateforme-service.

## Champs

| Champ   | Exemple            | Remarques                                   |
| ------- | ------------------ | ------------------------------------------- |
| Nom     | `blog`             | Relatif à la zone.                          |
| Type    | `CNAME`            |                                             |
| Contenu | `www.example.com.` | Nom d'hôte cible. Terminez-le par un point. |
| TTL     | `14400`            | En secondes. Valeur par défaut de 4 heures. |

## Créer

Console (affichage sous forme de fichier de zone) :

```text
blog CNAME www.example.com. 14400
```

CLI :

```bash
zcp dns record-create --domain examplecom --name blog --type CNAME --content www.example.com.
```

API : envoyez une requête `POST` avec
`{ "name": "blog", "type": "CNAME", "content": "www.example.com.", "ttl": 14400 }`.

## Vérifier

```bash
dig blog.example.com +short
# www.example.com.
# 203.0.113.10
```

La réponse affiche l'alias, puis l'adresse de la cible.

## Remarques

- **Jamais au sommet.** Un `CNAME` ne peut pas se trouver à la racine de la zone (`@`). Le sommet
  possède déjà des enregistrements `SOA` et `NS`, et un `CNAME` ne peut pas coexister avec d'autres
  enregistrements portant le même nom. Utilisez un enregistrement
  [`A` ou `AAAA`](/fr/public-cloud/dns/records/a-aaaa) pour le sommet.
- **Seul pour son nom.** Un nom associé à un `CNAME` ne peut pas aussi contenir un enregistrement
  `A`, `MX`, `TXT` ou d'un autre type. Choisissez une seule option.
- **Point final.** Terminez la cible par un point (`www.example.com.`) afin que ZCP la traite comme
  un nom absolu et n'y ajoute pas votre zone.

Voir aussi : [A et AAAA](/fr/public-cloud/dns/records/a-aaaa),
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Types d'enregistrements](/fr/public-cloud/dns/records)
