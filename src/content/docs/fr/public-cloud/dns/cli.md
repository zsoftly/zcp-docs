---
title: Gérer le DNS avec le CLI
description:
  Créez des zones DNS, ajoutez ou supprimez des enregistrements et déléguez votre domaine à ZSoftly
  depuis le terminal avec le CLI zcp.
---

Le CLI `zcp` gère vos zones et enregistrements DNS depuis le terminal. Cette page couvre chaque
étape : créer une zone, consulter les serveurs de noms auxquels la déléguer, ajouter ou supprimer
des enregistrements, puis vérifier le résultat.

## Avant de commencer

- Le CLI `zcp` doit être installé et authentifié. Consultez le
  [guide d'installation du CLI](/fr/public-cloud/cli/installation) et le
  [démarrage rapide du CLI](/fr/public-cloud/cli/quickstart).
- Vous devez contrôler un domaine chez son registraire.

:::note

Les commandes DNS s'exécutent au niveau du compte. Contrairement à la plupart des autres commandes
`zcp`, elles n'exigent ni `--region` ni `--project`. Seule la commande `zcp dns create` exige
`--project` afin de placer la nouvelle zone dans un projet.

:::

## Créer une zone

Ajoutez votre domaine à ZCP. Cette commande crée la zone DNS servie par ZSoftly.

```bash
zcp dns create --name example.com --project default-9
```

Sortie :

```text
FIELD    VALUE
Slug     examplecom
Name     example.com
Status   false
Created  2026-07-18T21:08:26.000000Z
```

ZCP génère un **slug** à partir du nom de domaine. Toutes les commandes suivantes désignent la zone
par ce slug, et non par son nom de domaine. Copiez-le depuis cette sortie ou depuis `zcp dns list`.
La valeur de `Status` devient active peu après la création.

:::tip

ZCP sert le DNS depuis une seule région pour l'ensemble du compte. `zcp dns create` ignore donc
`ZCP_REGION` et définit la région pour vous. Passez uniquement `--name` et `--project`.

:::

## Consulter vos serveurs de noms

Lorsque vous créez une zone, ZCP ajoute ses enregistrements `SOA` et `NS`. L'ensemble
d'enregistrements `NS` contient les deux serveurs de noms vers lesquels faire pointer votre
registraire.

```bash
zcp dns show examplecom
```

Sortie :

```text
FIELD    VALUE
Slug     examplecom
Name     example.com
Status   true
Created  2026-07-18T21:08:26.000000Z
Updated  2026-07-18T21:08:26.000000Z

Records (2):
NAME          TYPE  CONTENT                                                                   TTL
example.com.  SOA   ns1.zsoftly.ca. hostmaster.zsoftly.ca. 2026071801 10800 3600 604800 3600  3600
example.com.  NS    ns1.zsoftly.ca., ns2.zsoftly.ca.                                          3600
```

Faites pointer votre registraire vers les deux serveurs de noms avant d'y envoyer le trafic en
production. Consultez [Domaines](/fr/public-cloud/dns/domains) pour les étapes propres à chaque
registraire et l'exception Cloudflare Registrar.

## Ajouter des enregistrements

Utilisez `zcp dns record-create` avec le slug de la zone, un nom relatif, un type et le contenu.

```bash
# Apex A record (use @ for the zone root)
zcp dns record-create --domain examplecom --name @ --type A --content 203.0.113.10

# Subdomain A record
zcp dns record-create --domain examplecom --name www --type A --content 203.0.113.10

# IPv6 address
zcp dns record-create --domain examplecom --name ipv6 --type AAAA --content 2001:db8::10

# Alias one name to another
zcp dns record-create --domain examplecom --name blog --type CNAME --content www.example.com.

# Text record for SPF or domain verification
zcp dns record-create --domain examplecom --name @ --type TXT --content '"v=spf1 -all"'

# Mail server (MX needs a priority)
zcp dns record-create --domain examplecom --name @ --type MX --content mail.example.com. --priority 10
```

:::caution

La valeur de `--name` est **relative** à la zone. Passez `www`, et non `www.example.com`. ZCP ajoute
la zone. Un nom complet comme `www.example.com` crée `www.example.com.example.com`. Utilisez `@`
pour la racine de la zone.

:::

Règles relatives aux enregistrements :

- Le TTL par défaut est de `14400` secondes, soit 4 heures. Modifiez-le avec `--ttl`, par exemple
  `--ttl 3600`.
- Protégez le contenu `TXT` avec des guillemets, par exemple `'"v=spf1 -all"'`, afin que ceux-ci
  parviennent à l'enregistrement.
- Terminez une cible `CNAME` par un point (`www.example.com.`) afin qu'elle reste pleinement
  qualifiée.
- Un enregistrement `MX` exige `--priority`. Placez le serveur de courrier dans `--content` et le
  nombre de préférence dans `--priority`, par exemple `--priority 10`. Le CLI renvoie une erreur si
  cette option manque.
- Les types pris en charge sont `A`, `AAAA`, `CNAME`, `MX`, `TXT`, `CAA` et `NS`. `SRV` et `LOC` ne
  sont pas encore disponibles.

:::note

Vous pouvez aussi créer des enregistrements `MX` dans le [portail](/fr/public-cloud/dns/records) ou
avec l'[API](/fr/public-cloud/dns/api#enregistrements-mx).

:::

## Lister et afficher les enregistrements

`zcp dns show` affiche la zone et tous ses enregistrements.

```bash
zcp dns show examplecom
```

```text
Records (6):
NAME                  TYPE   CONTENT                                                                   TTL
www.example.com.      A      203.0.113.10                                                              14400
ipv6.example.com.     AAAA   2001:db8::10                                                              14400
blog.example.com.     CNAME  www.example.com.                                                          14400
example.com.          TXT    "v=spf1 -all"                                                             14400
example.com.          SOA    ns1.zsoftly.ca. hostmaster.zsoftly.ca. 2026071807 10800 3600 604800 3600  3600
example.com.          NS     ns1.zsoftly.ca., ns2.zsoftly.ca.                                          3600
```

Pour un script, ajoutez `--output json`, puis redirigez la sortie vers `jq`.

```bash
zcp dns list --output json
zcp dns show examplecom --output json
```

## Mettre à jour un enregistrement

Il n'existe aucune commande de mise à jour. Pour modifier un enregistrement, supprimez-le, puis
recréez-le avec la nouvelle valeur.

```bash
zcp dns record-delete --domain examplecom --name www --type A --yes
zcp dns record-create --domain examplecom --name www --type A --content 203.0.113.20
```

## Supprimer un enregistrement

Désignez l'ensemble d'enregistrements par son nom et son type.

```bash
zcp dns record-delete --domain examplecom --name www --type A
```

Ajoutez `--yes` pour ignorer la demande de confirmation dans un script. Sortie :

```text
DNS record A "www.example.com." deleted from domain "examplecom".
```

## Supprimer une zone

Cette commande supprime la zone et tous ses enregistrements.

```bash
zcp dns delete examplecom
```

Ajoutez `--yes` pour ignorer la demande de confirmation.

## Vérifier

Interrogez directement les serveurs de noms ZSoftly afin de vérifier un enregistrement avant la fin
de la propagation mondiale.

```bash
# Ask a ZSoftly name server for the record
dig A www.example.com @ns1.zsoftly.ca +short

# After you delegate at your registrar, query any public resolver
dig A www.example.com @1.1.1.1 +short
```

Voir aussi : [Vue d'ensemble du DNS](/fr/public-cloud/dns/overview),
[Domaines](/fr/public-cloud/dns/domains), [Enregistrements DNS](/fr/public-cloud/dns/records),
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Gérer le DNS avec l'API](/fr/public-cloud/dns/api),
[Dépannage](/fr/public-cloud/dns/troubleshooting),
[Référence du CLI](/fr/public-cloud/cli/reference)
