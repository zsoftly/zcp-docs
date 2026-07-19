---
title: 'Héberger un domaine sur ZCP DNS et gérer ses enregistrements avec le CLI'
description:
  Faites pointer un domaine qui vous appartient vers les serveurs de noms ZSoftly et gérez tous ses
  enregistrements DNS depuis le terminal avec le CLI zcp.
sidebar:
  label: 'Héberger le DNS sur ZCP (CLI)'
---

Ce tutoriel transforme un domaine que vous possédez déjà en une zone DNS faisant autorité hébergée
par ZSoftly. Vous créez la zone, consultez les serveurs de noms, ajoutez des enregistrements,
déléguez le domaine chez votre registraire, puis confirmez sa résolution sur Internet. Chaque étape
s'exécute depuis votre terminal avec le CLI `zcp`.

À la fin, vous disposez de ce qui suit :

- Une zone DNS hébergée sur ZCP
- Des enregistrements A, CNAME, TXT et MX se résolvant sur Internet
- Un domaine délégué depuis votre registraire aux serveurs de noms ZSoftly

Prévoyez environ 20 minutes de travail. Les changements de serveurs de noms se propagent ensuite
automatiquement. La propagation se termine souvent en quelques heures, mais prévoyez jusqu'à 48
heures.

:::note

Les slugs et valeurs de ce tutoriel, soit le projet `default-9`, le domaine `example.com`, le slug
de zone généré `examplecom` et les exemples d'adresses IP, sont des **exemples**. Les vôtres seront
différents. Chaque étape indique la commande à utiliser pour afficher la bonne valeur pour votre
compte.

:::

## Avant de commencer

- Un compte ZSoftly Public Cloud. [Créez-en un](/fr/public-cloud/getting-started/account-signup) si
  vous n'en avez pas.
- Le CLI `zcp` installé. Voir le [guide d'installation du CLI](/fr/public-cloud/cli/installation).
- Un domaine que vous contrôlez chez un registraire, avec l'autorisation d'en modifier les serveurs
  de noms.
- `dig` pour la vérification. Il est préinstallé sur macOS et Linux et fait partie de `bind-utils`
  ou de `dnsutils` dans la plupart des distributions.

:::caution

Ajoutez vos enregistrements dans ZCP **avant** d'effectuer la délégation chez le registraire. Une
délégation effectuée avant l'ajout des enregistrements crée une période pendant laquelle le domaine
ne renvoie aucune réponse DNS.

:::

## Étape 1 : S'authentifier

Créez un jeton dans le portail sous **Profil → Jetons d'API**, puis ajoutez un profil CLI et collez
le jeton.

```bash
zcp profile add default
zcp auth validate
```

Les commandes DNS s'exécutent au niveau du compte. Vous ne leur fournissez donc ni région ni projet.
Seule `zcp dns create` reçoit l'option `--project`.

## Étape 2 : Créer la zone

Ajoutez votre domaine. Cette commande crée la zone DNS servie par ZSoftly.

```bash
zcp dns create --name example.com --project default-9
```

```text
FIELD    VALUE
Slug     examplecom
Name     example.com
Status   false
Created  2026-07-18T21:08:26.000000Z
```

Copiez le **Slug**. Toutes les commandes d'enregistrement l'emploient. Vous pouvez le retrouver en
tout temps :

```bash
zcp dns list
```

## Étape 3 : Consulter vos serveurs de noms

ZCP ajoute les enregistrements `SOA` et `NS` de la zone. L'ensemble d'enregistrements `NS` désigne
les deux serveurs auxquels vous effectuerez la délégation.

```bash
zcp dns show examplecom
```

```text
Records (2):
NAME          TYPE  CONTENT                                                                   TTL
example.com.  SOA   ns1.zsoftly.ca. hostmaster.zsoftly.ca. 2026071801 10800 3600 604800 3600  3600
example.com.  NS    ns1.zsoftly.ca., ns2.zsoftly.ca.                                          3600
```

Notez les deux serveurs de noms. Vous en aurez besoin à l'étape 5.

## Étape 4 : Ajouter vos enregistrements

Créez les enregistrements qui achemineront votre trafic. Utilisez `@` pour la racine de la zone et
un nom relatif pour les sous-domaines.

```bash
# Point the root and www at your server
zcp dns record-create --domain examplecom --name @   --type A --content 203.0.113.10
zcp dns record-create --domain examplecom --name www --type A --content 203.0.113.10

# Point an app subdomain at another host
zcp dns record-create --domain examplecom --name api --type A --content 203.0.113.20

# Alias blog to www
zcp dns record-create --domain examplecom --name blog --type CNAME --content www.example.com.

# Publish an SPF policy
zcp dns record-create --domain examplecom --name @ --type TXT --content '"v=spf1 -all"'

# Route mail (MX needs a priority)
zcp dns record-create --domain examplecom --name @ --type MX --content mail.example.com. --priority 10
```

:::caution

La valeur de `--name` est **relative** à la zone. Utilisez `www`, et non `www.example.com`. Utilisez
`@` pour la racine. Un nom complet comme `www.example.com` devient `www.example.com.example.com`.

:::

Confirmez que la zone contient les enregistrements attendus :

```bash
zcp dns show examplecom
```

## Étape 5 : Effectuer la délégation chez votre registraire

Faites maintenant de ZSoftly le fournisseur DNS faisant autorité. Chez le registraire où vous avez
acheté le domaine, remplacez les serveurs de noms par les deux valeurs ZSoftly obtenues à l'étape 3.
Le menu exact varie selon le registraire. La page [Domaines](/fr/public-cloud/dns/domains) fournit
une référence rapide pour chacun.

:::note

**Cloudflare Registrar** n'autorise pas les serveurs de noms tiers au sommet du domaine. Si votre
domaine est détenu par Cloudflare Registrar, déléguez plutôt un **sous-domaine**. Dans l'application
DNS de Cloudflare, ajoutez deux enregistrements `NS` pour le sous-domaine, par exemple sous le nom
`dev`. Faites-les pointer vers `ns1.zsoftly.ca` et `ns2.zsoftly.ca`. Créez ensuite la zone
`dev.example.com` dans ZCP. Voir
l'[exception Cloudflare](/fr/public-cloud/dns/domains#exception-cloudflare).

:::

## Étape 6 : Vérifier

Avant la délégation, interrogez directement un serveur de noms ZSoftly. Il répond même lorsque les
anciens serveurs de noms demeurent actifs chez votre registraire.

```bash
dig A www.example.com @ns2.zsoftly.ca +short
# 203.0.113.10
```

Après la délégation et la propagation, tous les résolveurs publics renvoient la même réponse.

```bash
dig NS example.com @1.1.1.1 +short
# ns1.zsoftly.ca.
# ns2.zsoftly.ca.

dig A www.example.com @1.1.1.1 +short
# 203.0.113.10
```

Pour suivre la propagation mondiale, utilisez un outil en ligne comme
[whatsmydns.net](https://www.whatsmydns.net/) avec le type d'enregistrement **NS**.

## Prochaines étapes

- [Gérer le DNS avec le CLI](/fr/public-cloud/dns/cli) : consultez la référence complète des
  commandes d'enregistrement.
- [Gérer le DNS avec l'API](/fr/public-cloud/dns/api) : effectuez les mêmes opérations par REST.
- [Domaines](/fr/public-cloud/dns/domains) : consultez les étapes propres à chaque registraire et
  l'exception Cloudflare.
