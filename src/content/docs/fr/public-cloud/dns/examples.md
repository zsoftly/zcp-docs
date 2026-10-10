---
title: Exemples DNS
description:
  Exemples DNS complets pour ZCP. Hébergez un site Web, acheminez les courriels, vérifiez la
  propriété d'un domaine, limitez l'émission de certificats et déléguez un sous-domaine, avec une
  vérification pour chaque cas.
---

Voici des exemples pratiques pour les tâches DNS courantes. Chacun utilise la CLI `zcp` avec une
zone dont le slug est `examplecom`, puis vérifie le résultat avec `dig`. Obtenez votre slug avec
`zcp dns list`. Les mêmes enregistrements fonctionnent depuis la
[console](/fr/public-cloud/dns/records) et l'[API](/fr/public-cloud/dns/api/).

:::note

Ajoutez vos enregistrements **avant** de déléguer le domaine à ZSoftly, puis vérifiez-les. Consultez
[Domaines](/fr/public-cloud/dns/domains) pour la délégation et
[Dépannage](/fr/public-cloud/dns/troubleshooting) pour vérifier la propagation.

:::

## Héberger un site Web

Faites pointer la racine et `www` vers votre serveur.

```bash
zcp dns record-create --domain examplecom --name @   --type A --content 203.0.113.10
zcp dns record-create --domain examplecom --name www --type A --content 203.0.113.10
```

Vérifiez depuis un résolveur public :

```bash
dig A example.com     +short   # 203.0.113.10
dig A www.example.com +short   # 203.0.113.10
```

## Acheminer les courriels

Ajoutez un serveur de courrier et une politique SPF. `MX` reçoit la priorité dans son propre champ.

```bash
zcp dns record-create --domain examplecom --name @ --type MX --content mail.example.com. --priority 10
zcp dns record-create --domain examplecom --name @ --type TXT --content '"v=spf1 mx -all"'
```

Vérifiez :

```bash
dig MX  example.com +short   # 10 mail.example.com.
dig TXT example.com +short   # "v=spf1 mx -all"
```

Voir [Enregistrements MX](/fr/public-cloud/dns/records/mx) et
[Enregistrements TXT](/fr/public-cloud/dns/records/txt).

## Vérifier la propriété d'un domaine

De nombreux services vous demandent de publier un enregistrement `TXT` pour prouver que le domaine
vous appartient. Collez la valeur fournie.

```bash
zcp dns record-create --domain examplecom --name @ --type TXT --content '"provider-verification=abc123"'
```

```bash
dig TXT example.com +short
```

Un nom peut contenir plusieurs valeurs `TXT`, donc cet enregistrement s'ajoute à un enregistrement
SPF déjà présent sous `@`. Voir
[Plusieurs valeurs par nom et par type](/fr/public-cloud/dns/records#plusieurs-valeurs-par-nom-et-par-type).

## Limiter l'émission de certificats

La console DNS ZCP ne propose pas `CAA` comme type d'enregistrement. Créez l'enregistrement avec la
CLI ou l'API.

```bash
zcp dns record-create --domain examplecom --name @ --type CAA --content '0 issue "letsencrypt.org"'
```

```bash
dig CAA example.com +short   # 0 issue "letsencrypt.org"
```

Consultez les [enregistrements CAA](/fr/public-cloud/dns/records/caa).

## Déléguer un sous-domaine

Confiez `subzone.example.com` à un autre fournisseur DNS.

```bash
zcp dns record-create --domain examplecom --name subzone --type NS --content ns1.other-dns.com.
```

```bash
dig NS subzone.example.com +short
```

Un nom et un type peuvent contenir plusieurs valeurs, donc un deuxième enregistrement `NS` sous le
même nom ajoute un deuxième serveur de noms. Voir
[Plusieurs valeurs par nom et par type](/fr/public-cloud/dns/records#plusieurs-valeurs-par-nom-et-par-type).

:::caution

Un seul enregistrement `NS` prive le sous-domaine délégué de toute redondance. Si ce serveur de noms
cesse de répondre, le sous-domaine ne se résout plus. Pour un sous-domaine de production, ajoutez un
deuxième enregistrement `NS` sous le même nom.

:::

## Modifier un enregistrement

Aucune action de mise à jour n'existe. Supprimez l'enregistrement, puis recréez-le avec la nouvelle
valeur.

```bash
zcp dns record-delete --domain examplecom --name www --type A --yes
zcp dns record-create --domain examplecom --name www --type A --content 203.0.113.20
```

Vérifiez la nouvelle valeur après l'expiration du TTL dans les caches des résolveurs :

```bash
dig A www.example.com +short   # 203.0.113.20
```

## Supprimer un enregistrement

```bash
zcp dns record-delete --domain examplecom --name subzone --type NS
```

Ajoutez `--yes` pour ignorer la demande de confirmation dans un script.

Voir aussi : [Types d'enregistrements](/fr/public-cloud/dns/records),
[Gérer le DNS avec la CLI](/fr/public-cloud/dns/cli),
[Dépannage](/fr/public-cloud/dns/troubleshooting)
