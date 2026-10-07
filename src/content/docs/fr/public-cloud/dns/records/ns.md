---
title: Enregistrements NS
description:
  Déléguez un sous-domaine à un autre ensemble de serveurs de noms avec un enregistrement NS sur ZCP
  DNS.
---

Un enregistrement `NS` désigne les serveurs de noms faisant autorité d'une zone. ZCP crée
automatiquement l'ensemble d'enregistrements `NS` de votre domaine, qui pointe vers `ns1.zsoftly.ca`
et `ns2.zsoftly.ca`. Ajoutez vos propres enregistrements `NS` pour **déléguer un sous-domaine** à un
autre fournisseur DNS.

## Champs

| Champ   | Exemple              | Remarques                                               |
| ------- | -------------------- | ------------------------------------------------------- |
| Nom     | `subzone`            | Sous-domaine à déléguer.                                |
| Type    | `NS`                 |                                                         |
| Contenu | `ns1.other-dns.com.` | Serveur de noms du sous-domaine. Terminez par un point. |
| TTL     | `3600`               | En secondes.                                            |

## Déléguer un sous-domaine

Pour confier `subzone.example.com` à un autre fournisseur, ajoutez un enregistrement `NS` portant le
nom `subzone`.

Console (affichage sous forme de fichier de zone) :

```text
subzone NS ns1.other-dns.com. 3600
```

CLI :

```bash
zcp dns record-create --domain examplecom --name subzone --type NS --content ns1.other-dns.com.
```

Après cette modification, ZCP renvoie les résolveurs vers le fournisseur délégué pour
`subzone.example.com`. Ce fournisseur doit héberger la zone `subzone.example.com`.

## Vérifier

```bash
dig NS subzone.example.com +short
# ns1.other-dns.com.
```

## Plusieurs serveurs de noms par délégation

Un nom et un type peuvent contenir plusieurs valeurs. La création d'un deuxième enregistrement `NS`
sous `subzone` l'ajoute à l'ensemble, ce qui permet de déléguer le sous-domaine à deux serveurs de
noms ou plus pour la redondance. Voir
[Plusieurs valeurs par nom et par type](/fr/public-cloud/dns/records#plusieurs-valeurs-par-nom-et-par-type).

## Déléguer vers ZCP depuis un autre fournisseur

L'inverse fonctionne aussi. Pour héberger un sous-domaine sur ZCP tout en gardant le domaine parent
chez un autre fournisseur, créez le sous-domaine comme domaine ZCP, par exemple `dev.example.com`.
Chez le fournisseur parent, ajoutez des enregistrements `NS` portant le nom `dev` et pointant vers
`ns1.zsoftly.ca` et `ns2.zsoftly.ca`. Voir [Domaines](/fr/public-cloud/dns/domains).

## Remarques

- **Utilisez au moins deux serveurs de noms.** Ajoutez chaque valeur `NS` sous le sous-domaine
  délégué. L'usage courant prévoit plusieurs serveurs de noms pour la redondance.
- **Le fournisseur enfant doit héberger la zone.** La délégation achemine seulement les requêtes.
  Les enregistrements résident chez le fournisseur auquel vous déléguez.
- **Ne supprimez pas l'ensemble `NS` du sommet.** ZCP gère les enregistrements `ns1` et
  `ns2.zsoftly.ca` de votre domaine.

Voir aussi : [Domaines](/fr/public-cloud/dns/domains),
[Exemples pratiques](/fr/public-cloud/dns/examples),
[Types d'enregistrements](/fr/public-cloud/dns/records)
