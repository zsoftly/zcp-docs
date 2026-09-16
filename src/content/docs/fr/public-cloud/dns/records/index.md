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

Les enregistrements `SRV` et `LOC` ne sont pas encore disponibles. Voir
[Limites connues](#limites-connues).

:::

## Les noms sont relatifs

Le **nom** de l'enregistrement est relatif à votre zone. Saisissez `www` pour `www.example.com`, et
non le nom complet. Utilisez `@` pour la racine de la zone, aussi appelée sommet. Dans la CLI et
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

## Limites connues

Ces limites s'appliquent autant à la console qu'à la CLI et à l'API.

### Les valeurs TXT exigent des guillemets doubles

Entourez la valeur d'un enregistrement `TXT` de guillemets doubles. La plateforme refuse une valeur
sans guillemets avec le message `DNS operation failed. Please try again or contact support.`

Entourez la valeur de guillemets doubles, par exemple `"v=spf1 include:example.net ~all"`. Dans un
interpréteur de commandes, placez des guillemets simples autour des guillemets doubles afin que ces
derniers parviennent à l'enregistrement :

```bash
zcp dns record-create --domain examplecom --name @ --type TXT \
  --content '"v=spf1 include:example.net ~all"'
```

### Une seule valeur par nom et par type

Un nom et un type contiennent une seule valeur. La création d'une deuxième valeur sous le même nom
et le même type remplace la première, sans avertissement. Cette règle s'applique à tous les types
d'enregistrement, y compris `A` et `AAAA`. Elle ne se limite pas à `TXT` et `MX`.

Ce que cela exclut :

- **Les enregistrements `A` en tourniquet.** Un nom se résout vers une seule adresse IPv4. Un
  deuxième enregistrement `A` sous ce nom remplace le premier.
- **Plusieurs adresses IPv6.** Un nom se résout vers une seule adresse IPv6.
- **Un serveur de courrier de secours.** Le sommet d'une zone contient un seul enregistrement `MX`.
- **Un SPF et une valeur de vérification à la fois.** Le sommet d'une zone contient soit un
  enregistrement SPF, soit un enregistrement `TXT` de vérification, mais pas les deux.
- **Une délégation redondante.** Un sous-domaine délégué contient un seul enregistrement `NS`, donc
  un seul serveur de noms.

Un nom peut toujours contenir une valeur par type. Un enregistrement `A` et un enregistrement `AAAA`
coexistent sous le même nom, puisque les types diffèrent.

Le `CNAME` fait exception. Un nom qui porte un `CNAME` ne porte rien d'autre, donc il ne peut pas
contenir en plus un enregistrement `A`, `MX` ou `TXT`. N'utilisez un `CNAME` que sur un nom qui ne
sert à rien d'autre, et jamais à l'apex de la zone.

La console, la CLI et l'API n'offrent aujourd'hui aucun contournement. Ouvrez un
[billet de soutien](/fr/troubleshooting#ouvrir-un-billet-de-soutien) si vous avez besoin de
plusieurs valeurs sous un même nom et un même type.

### Les enregistrements SRV et LOC échouent

Vous ne pouvez pas créer d'enregistrement `SRV` ni `LOC`. Les deux échouent avec le message
`DNS operation failed. Please try again or contact support.` Tous les autres types fonctionnent :
`A`, `AAAA`, `CNAME`, `MX`, `TXT`, `CAA` et `NS`. Ouvrez un
[billet de soutien](/fr/troubleshooting#ouvrir-un-billet-de-soutien) si vous avez besoin d'un
enregistrement `SRV` ou `LOC`.

## Gérer les enregistrements

Tous les types se gèrent de la même façon dans chaque interface :

- **Console** : ouvrez la section DNS du portail, puis cliquez sur **Créer un enregistrement**.
- **CLI** : [Gérer le DNS avec la CLI](/fr/public-cloud/dns/cli).
- **API** : [Gérer le DNS avec l'API](/fr/public-cloud/dns/api/).

Aucune action de mise à jour n'existe. Pour modifier un enregistrement, supprimez-le, puis
recréez-le avec la nouvelle valeur.

Voir aussi : [Vue d'ensemble du DNS](/fr/public-cloud/dns/overview),
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Dépannage](/fr/public-cloud/dns/troubleshooting)
