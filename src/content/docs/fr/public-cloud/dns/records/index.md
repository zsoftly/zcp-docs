---
title: Enregistrements DNS
description:
  Découvrez les types d'enregistrements DNS offerts par ZCP, les règles communes de nommage et de
  TTL, ainsi que la référence de chaque type.
---

Les enregistrements DNS relient votre domaine à des services. Chaque enregistrement possède un
**nom**, un **type**, une **valeur** et un **TTL**. Cette page décrit les règles communes. La page
de chaque type présente ses champs, des exemples et ses contraintes.

## Types d'enregistrements

| Type         | Rôle                                                 | Page                                             |
| ------------ | ---------------------------------------------------- | ------------------------------------------------ |
| `A` / `AAAA` | Faire pointer un nom vers une adresse IPv4 ou IPv6   | [A et AAAA](/fr/public-cloud/dns/records/a-aaaa) |
| `CNAME`      | Créer un alias d'un nom vers un autre                | [CNAME](/fr/public-cloud/dns/records/cname)      |
| `MX`         | Acheminer les courriels vers un serveur de courrier  | [MX](/fr/public-cloud/dns/records/mx)            |
| `TXT`        | Stocker du texte (SPF, DKIM, vérification)           | [TXT](/fr/public-cloud/dns/records/txt)          |
| `CAA`        | Limiter l'émission de certificats aux AC choisies    | [CAA](/fr/public-cloud/dns/records/caa)          |
| `NS`         | Déléguer un sous-domaine à d'autres serveurs de noms | [NS](/fr/public-cloud/dns/records/ns)            |

:::note

Les enregistrements `SRV` et `LOC` ne sont pas encore disponibles.

:::

## Les noms sont relatifs

Le **nom** de l'enregistrement est relatif à votre zone. Saisissez `www` pour `www.example.com`, et
non le nom complet. Utilisez `@` pour la racine de la zone, aussi appelée sommet. Dans le CLI et
l'API, ZCP ajoute la zone. Un nom complet comme `www.example.com` deviendrait donc
`www.example.com.example.com`.

## Valeurs terminées par un point

Les valeurs qui constituent des noms d'hôte, comme la cible d'un `CNAME`, le serveur de courrier
d'un `MX` ou le serveur de noms d'un `NS`, doivent se terminer par un point. Utilisez par exemple
`mail.example.com.`. Le point indique un nom pleinement qualifié afin que ZCP ne le traite pas comme
un nom relatif à votre zone.

## TTL

Le **TTL** (durée de vie) indique, en secondes, combien de temps les résolveurs conservent
l'enregistrement en cache. Sa valeur par défaut est `14400`, soit 4 heures. Réduisez-la à `300` un
ou deux jours avant une modification prévue afin de propager rapidement le changement. Augmentez-la
de nouveau lorsque l'enregistrement est stable.

## Gérer les enregistrements

Tous les types se gèrent de la même façon dans chaque interface :

- **Console** : ouvrez la section DNS du portail, puis cliquez sur **Créer un enregistrement**.
- **CLI** : [Gérer le DNS avec le CLI](/fr/public-cloud/dns/cli).
- **API** : [Gérer le DNS avec l'API](/fr/public-cloud/dns/api).

Aucune action de mise à jour n'existe. Pour modifier un enregistrement, supprimez-le, puis
recréez-le avec la nouvelle valeur.

Voir aussi : [Vue d'ensemble du DNS](/fr/public-cloud/dns/overview),
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Dépannage](/fr/public-cloud/dns/troubleshooting)
