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

Vous pouvez créer des enregistrements `SRV` et `LOC` dans la console et avec l'API. La CLI `zcp` ne
les crée pas encore.

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

## Plusieurs valeurs par nom et par type

Un nom et un type peuvent contenir plusieurs valeurs. La création d'un enregistrement sous un nom et
un type qui contiennent déjà des valeurs ajoute la nouvelle valeur à l'ensemble. Les valeurs
existantes restent. Par exemple, vous pouvez ajouter un deuxième enregistrement `A`, un deuxième
enregistrement `MX` ou un troisième enregistrement `TXT` sous le même nom. Aucun billet de soutien
n'est nécessaire.

![Quatre valeurs TXT au sommet de example.ca dans la console DNS](../../../../../../assets/dns/dns-several-txt-values.webp)

La création d'une copie exacte d'une valeur existante ne crée pas de seconde copie et ne supprime
pas les autres valeurs.

La suppression d'une valeur dans la console retire uniquement cette valeur. Les autres valeurs
restent.

Saisissez une valeur `TXT` avec ou sans guillemets doubles. La plateforme la stocke et la renvoie
entre guillemets.

## Limites connues

La limite relative aux CNAME s'applique à la console, à la CLI et à l'API. La limite de suppression
par la CLI est propre à la CLI.

### Un CNAME ne peut pas partager un nom

Un nom qui porte un `CNAME` ne porte rien d'autre, donc il ne peut pas contenir en plus un
enregistrement `A`, `MX` ou `TXT`. La création d'un `CNAME` sous un nom qui contient déjà d'autres
enregistrements échoue avec une erreur du type
`RRset www IN CNAME: Conflicts with pre-existing RRset`. N'utilisez un `CNAME` que sur un nom qui ne
sert à rien d'autre, et jamais à l'apex de la zone.

### Aucune mise à jour sur place

Il n'existe aucune action de mise à jour. Pour modifier une valeur, supprimez-la, puis recréez-la
avec la nouvelle valeur.

### La suppression par la CLI retire l'ensemble complet

`zcp dns record-delete` supprime l'ensemble d'enregistrements sous un nom et un type, donc toutes
les valeurs qu'il contient. Pour retirer une seule valeur avec la CLI, supprimez l'ensemble, puis
recréez les valeurs à conserver. La console retire une seule valeur.

### Les CAA ne sont pas disponibles dans la console

La console DNS ZCP ne propose pas `CAA` comme type d'enregistrement. Utilisez la CLI ou l'API pour
créer des enregistrements `CAA`.

## Gérer les enregistrements

Utilisez l'interface documentée pour votre flux de travail :

- **Console** : ouvrez la section DNS du portail, puis cliquez sur **Créer un enregistrement**. La
  console retire une valeur sélectionnée.
- **CLI** : [Gérer le DNS avec la CLI](/fr/public-cloud/dns/cli). `zcp dns record-delete` supprime
  l'ensemble d'enregistrements complet.
- **API** : [Gérer le DNS avec l'API](/fr/public-cloud/dns/api/).

Aucune action de mise à jour n'existe. Pour modifier un enregistrement, supprimez-le, puis
recréez-le avec la nouvelle valeur.

Voir aussi : [Vue d'ensemble du DNS](/fr/public-cloud/dns/overview),
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Dépannage](/fr/public-cloud/dns/troubleshooting)
