---
title: Vue d'ensemble du DNS
description:
  Hébergez le DNS faisant autorité de vos domaines sur la plateforme infonuagique ZSoftly. Voyez
  comment les zones, les serveurs de noms et les enregistrements fonctionnent ensemble, puis
  choisissez une méthode de gestion.
---

Hébergez le DNS faisant autorité de votre domaine sur ZCP. Ajoutez un domaine, faites pointer votre
registraire vers les serveurs de noms ZSoftly, puis gérez tous vos enregistrements depuis la
console, le CLI ou l'API.

## Fonctionnement

Un **domaine** (aussi appelé zone) contient vos enregistrements, par exemple `example.com`. Lorsque
vous ajoutez un domaine, ZCP crée la zone et ses enregistrements `SOA` et `NS`. Vous déléguez
ensuite le domaine à ZSoftly chez votre registraire. ZCP répond alors aux requêtes DNS pour ce
domaine.

Suivez ce flux de travail :

1. **Ajoutez votre domaine** à ZCP. Voir [Domaines](/fr/public-cloud/dns/domains).
2. **Ajoutez vos enregistrements** pendant que le domaine passe encore par son fournisseur actuel.
3. **Déléguez** le domaine aux serveurs de noms ZSoftly chez votre registraire.
4. **Vérifiez** la résolution mondiale des nouveaux enregistrements. Voir
   [Dépannage](/fr/public-cloud/dns/troubleshooting).

Cet ordre évite une période avec une zone vide pendant la transition.

## Serveurs de noms

ZCP sert chaque zone depuis deux serveurs de noms faisant autorité :

| Serveur de noms | Valeur           |
| --------------- | ---------------- |
| Principal       | `ns1.zsoftly.ca` |
| Secondaire      | `ns2.zsoftly.ca` |

Faites pointer votre domaine vers les deux serveurs. Les valeurs exactes figurent aussi dans la
console et dans la sortie de `zcp dns show`.

## Types d'enregistrements pris en charge

| Type         | Rôle                                                 | Détails                                          |
| ------------ | ---------------------------------------------------- | ------------------------------------------------ |
| `A` / `AAAA` | Associer un nom à une adresse IPv4 ou IPv6           | [A et AAAA](/fr/public-cloud/dns/records/a-aaaa) |
| `CNAME`      | Créer un alias d'un nom vers un autre                | [CNAME](/fr/public-cloud/dns/records/cname)      |
| `MX`         | Acheminer les courriels vers un serveur de courrier  | [MX](/fr/public-cloud/dns/records/mx)            |
| `TXT`        | Stocker du texte (SPF, DKIM, vérification)           | [TXT](/fr/public-cloud/dns/records/txt)          |
| `CAA`        | Limiter l'émission de certificats aux AC choisies    | [CAA](/fr/public-cloud/dns/records/caa)          |
| `NS`         | Déléguer un sous-domaine à d'autres serveurs de noms | [NS](/fr/public-cloud/dns/records/ns)            |

:::note

Les enregistrements `SRV` et `LOC` ne sont pas encore disponibles.

:::

## Méthodes de gestion du DNS

- **Console** : la section DNS du portail. Consultez [Enregistrements](/fr/public-cloud/dns/records)
  pour la référence de chaque type.
- **CLI** : [Gérer le DNS avec le CLI](/fr/public-cloud/dns/cli).
- **API** : [Gérer le DNS avec l'API](/fr/public-cloud/dns/api).
- **Infrastructure en tant que code** : la ressource `zcp_dns_record` du
  [fournisseur Terraform / OpenTofu](/tutorials/manage-infrastructure-terraform) (en anglais).

Les commandes DNS s'exécutent au niveau du compte. Contrairement à la plupart des autres ressources,
elles n'exigent ni région ni projet. Seule la création d'un domaine exige un projet.

## Prochaines étapes

- [Ajouter et déléguer un domaine](/fr/public-cloud/dns/domains)
- [Référence des types d'enregistrements](/fr/public-cloud/dns/records)
- [Exemples pratiques](/fr/public-cloud/dns/examples) : hébergez un site Web, acheminez les
  courriels, vérifiez la propriété d'un domaine, limitez l'émission de certificats et déléguez un
  sous-domaine.

Voir aussi : [Gérer le DNS avec le CLI](/fr/public-cloud/dns/cli),
[Gérer le DNS avec l'API](/fr/public-cloud/dns/api),
[Dépannage](/fr/public-cloud/dns/troubleshooting)
