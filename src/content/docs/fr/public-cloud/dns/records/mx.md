---
title: Enregistrements MX
description:
  Acheminez les courriels vers un serveur de courrier avec un enregistrement MX sur ZCP DNS. Le
  champ distinct de priorité est obligatoire pour ce type.
---

Un enregistrement `MX` achemine les courriels de votre domaine vers un serveur de courrier. Chaque
enregistrement `MX` possède une **priorité**, soit un nombre de préférence, et le nom d'hôte d'un
**serveur de courrier**. La livraison tente d'abord le nombre de priorité le plus bas.

## Champs

| Champ    | Exemple             | Remarques                                                            |
| -------- | ------------------- | -------------------------------------------------------------------- |
| Nom      | `@`                 | Généralement le sommet, pour les adresses `@votre-domaine`.          |
| Type     | `MX`                |                                                                      |
| Priorité | `10`                | De 0 à 65535. ZCP préfère les valeurs basses. Obligatoire pour `MX`. |
| Contenu  | `mail.example.com.` | Nom d'hôte du serveur de courrier. Terminez-le par un point.         |
| TTL      | `3600`              | En secondes.                                                         |

:::caution

Les enregistrements `MX` exigent une **priorité**. Placez-la dans son propre champ et non dans la
valeur du serveur de courrier. L'API exige la priorité pour `MX` et la refuse pour tous les autres
types.

:::

## Créer

Dans la console, choisissez le type `MX`, puis saisissez la **Priorité** et la valeur du serveur de
courrier dans leurs champs respectifs.

```text
@ MX 10 mail.example.com. 3600
```

CLI (`MX` exige `--priority`) :

```bash
zcp dns record-create --domain examplecom --name @ --type MX \
  --content mail.example.com. --priority 10 --ttl 3600
```

API (envoyez `priority` dans un champ distinct) :

```bash
curl -s -X POST "https://api.zcp.zsoftly.ca/api/dns/domains/examplecom/records" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{ "name": "@", "type": "MX", "content": "mail.example.com.", "priority": 10, "ttl": 3600 }'
```

## Vérifier

```bash
dig MX example.com +short
# 10 mail.example.com.
```

## Un seul serveur de courrier par nom

Un nom et un type contiennent une seule valeur. Le sommet contient donc un seul enregistrement `MX`.
La création d'un deuxième enregistrement `MX` sous `@` remplace le premier, sans avertissement.
Ouvrez un [billet de soutien](/fr/troubleshooting#ouvrir-un-billet-de-soutien) si vous avez besoin
d'un serveur principal et d'un serveur de secours sous le même nom. Voir
[Limites connues](/fr/public-cloud/dns/records#limites-connues).

## Remarques

- **La priorité est distincte.** N'insérez pas le nombre dans la valeur (`10 mail.example.com.`). La
  console, la CLI et l'API reçoivent chacun la priorité dans son propre champ.
- **Le serveur de courrier exige une adresse.** La cible `MX` doit se résoudre en enregistrement `A`
  ou `AAAA`. Elle ne peut pas pointer vers un `CNAME`.
- **Une priorité de `0` est valide** et est envoyée correctement.

Voir aussi : [Enregistrements TXT](/fr/public-cloud/dns/records/txt) pour SPF et DKIM,
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Types d'enregistrements](/fr/public-cloud/dns/records)
