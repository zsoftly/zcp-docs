---
title: Enregistrements A et AAAA
description:
  Faites pointer un nom d'hôte vers une adresse IPv4 (A) ou IPv6 (AAAA) sur ZCP DNS, avec des
  exemples pour la console, le CLI et l'API, ainsi que des commandes de vérification.
---

Un enregistrement `A` associe un nom à une adresse **IPv4**. Un enregistrement `AAAA` associe un nom
à une adresse **IPv6**. Utilisez ces enregistrements pour faire pointer un nom vers votre serveur.

## Champs

| Champ   | Exemple        | Remarques                                    |
| ------- | -------------- | -------------------------------------------- |
| Nom     | `@` ou `www`   | Relatif à la zone. `@` représente le sommet. |
| Type    | `A` / `AAAA`   |                                              |
| Contenu | `203.0.113.10` | Une adresse IPv4 (`A`) ou IPv6 (`AAAA`)      |
| TTL     | `14400`        | En secondes. Valeur par défaut de 4 heures.  |

## Créer

Console (affichage sous forme de fichier de zone) :

```text
@   A     203.0.113.10        14400
www A     203.0.113.10        14400
ipv6 AAAA 2001:db8::10        14400
```

CLI :

```bash
zcp dns record-create --domain examplecom --name @    --type A    --content 203.0.113.10
zcp dns record-create --domain examplecom --name www  --type A    --content 203.0.113.10
zcp dns record-create --domain examplecom --name ipv6 --type AAAA --content 2001:db8::10
```

API : envoyez une requête `POST` avec
`{ "name": "www", "type": "A", "content": "203.0.113.10", "ttl": 14400 }`. Voir
[Gérer le DNS avec l'API](/fr/public-cloud/dns/api#ajouter-un-enregistrement).

## Vérifier

```bash
dig A    www.example.com  +short   # 203.0.113.10
dig AAAA ipv6.example.com +short   # 2001:db8::10
```

## Remarques

- **Sommet et adresse IP.** Faites pointer le sommet (`@`) vers une adresse IP fixe avec un
  enregistrement `A` ou `AAAA`. N'utilisez pas de `CNAME` au sommet. Voir
  [CNAME](/fr/public-cloud/dns/records/cname).
- **Plusieurs adresses.** Ajoutez plusieurs enregistrements `A` portant le même nom, mais des
  adresses IP différentes, pour renvoyer plusieurs adresses. Cette configuration fournit une
  distribution DNS simple, sans vérification d'intégrité.
- **Double pile.** Publiez un enregistrement `A` et un enregistrement `AAAA` pour un même nom afin
  de servir les clients IPv4 et IPv6.

Voir aussi : [CNAME](/fr/public-cloud/dns/records/cname),
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Types d'enregistrements](/fr/public-cloud/dns/records)
