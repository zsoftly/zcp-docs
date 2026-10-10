---
title: 'Gérer une zone DNS sous forme de fichier dans le contrôle de version'
description:
  Conservez chaque enregistrement DNS d’un domaine dans un fichier révisable, appliquez-le avec un
  court script et la CLI zcp, puis recréez la zone à partir de ce fichier lorsque nécessaire.
sidebar:
  label: 'Gérer une zone sous forme de fichier'
---

Ajouter des enregistrements dans une console fonctionne jusqu’au jour où vous devez savoir ce qui a
changé ou recréer une zone ailleurs. Ce tutoriel conserve chaque enregistrement d’un domaine dans un
fichier texte, l’applique avec un court script et la CLI `zcp`, puis place ce fichier dans le
contrôle de version avec le reste de votre infrastructure.

À la fin, vous disposez de :

- Un fichier d’enregistrements qui décrit toute la zone
- Un script qui l’applique et peut d’abord vous montrer ce qu’il ferait
- Une méthode répétable pour recréer la zone à partir du fichier

Prévoyez environ 20 minutes.

## Avant de commencer

Vous avez besoin de :

- La CLI `zcp` installée et authentifiée. Consultez
  l’[installation de la CLI](/fr/public-cloud/cli/installation).
- Un projet et un domaine que vous contrôlez.
- Remplacez `example.ca` par un domaine que vous contrôlez. Utilisez vos vraies adresses d’entrée et
  vos serveurs de noms.
- Un dépôt Git pour conserver le fichier.
- `jq`, utilisé par le script pour lire le slug de la zone dans la sortie JSON de la CLI.
  Installez-le avec `brew install jq` sur macOS ou `apt install jq` sur Debian et Ubuntu.

Lisez les [limitations connues](/fr/public-cloud/dns/records#limites-connues) avant de commencer. Un
nom et un type peuvent contenir plusieurs valeurs. Utilisez donc une ligne pour chaque valeur à
ajouter.

## Étape 1 : Choisir une disposition

Utilisez une ligne par enregistrement, avec le contenu à la fin afin qu’il puisse contenir des
espaces :

```text
NAME    TYPE    TTL    PRIO    CONTENT
```

Quatre règles rendent le fichier lisible et facile à analyser :

- `@` représente l’apex de la zone
- `-` indique que le type ne prend pas de priorité
- Les lignes qui commencent par `#` sont des commentaires
- `CONTENT` est le dernier champ et peut donc contenir des espaces

## Étape 2 : Écrire le fichier d’enregistrements

Créez `dns/zones/example.ca.records`. Regroupez les enregistrements par objectif et alignez les
colonnes, afin qu’une personne qui révise le fichier voie la structure de la zone sans l’analyser :

```text
# example.ca - zone records
#
# Columns are whitespace separated and CONTENT is the final field, so it may
# contain spaces. "@" is the zone apex and "-" means the type takes no priority.
#
# TXT values may include double quotes. The platform accepts unquoted input and returns it quoted.

# NAME     TYPE   TTL  PRIO  CONTENT

# Website -----------------------------------------------------------------
  @        A      300  -     198.51.100.10
  www      CNAME  300  -     example.ca.

# YOW shared ingress -------------------------------------------------------
  yow-edge  A      300  -     192.0.2.10
  status    CNAME  300  -     yow-edge.example.ca.
  objects   CNAME  300  -     yow-edge.example.ca.

# YUL shared ingress -------------------------------------------------------
  yul-edge  A      300  -     198.51.100.20
  api       CNAME  300  -     yul-edge.example.ca.
  app       CNAME  300  -     yul-edge.example.ca.

# Mail routing ------------------------------------------------------------
  @        MX     300  10    mail.example.ca.

# Mail authentication -----------------------------------------------------
  @        TXT    300  -     "v=spf1 include:mailprovider.ca -all"
  _dmarc   TXT    300  -     "v=DMARC1; p=quarantine; rua=mailto:security@example.ca"
```

Conservez le fichier près de votre code d’infrastructure, pas dans un dossier personnel. Sa valeur
vient du fait que tout le monde le voit et que les changements passent par une révision.

## Étape 3 : Utiliser des noms d’entrée régionaux partagés

Utilisez un enregistrement A comme cible d’entrée régionale seulement lorsque ses services partagent
la même entrée et évoluent ensemble. Dirigez chaque service vers cette cible avec un CNAME direct.
L'ajout d'une nouvelle valeur A conserve l'ancienne destination dans l'ensemble d'enregistrements.
Retirez l'ancienne valeur après avoir vérifié la nouvelle destination afin que chaque alias de ce
groupe régional se résolve uniquement vers la nouvelle cible. Utilisez la console pour retirer une
seule valeur A. Avec la CLI, supprimez l'ensemble d'enregistrements A complet et recréez la valeur à
conserver. N’utilisez ni chaînes ni boucles de CNAME.

Le fichier `example.ca` regroupe les cibles `yow-edge` et `yul-edge` avec les services qu’elles
servent.

Un nom portant un enregistrement CNAME ne peut pas contenir d’autres données d’enregistrement.
Conservez chaque cible régionale sous forme d’enregistrement A direct. Conservez l’apex de la zone
comme enregistrement A, car l’apex porte aussi les enregistrements SOA et NS et peut porter des
enregistrements MX ou TXT. Les cibles MX et NS doivent pointer directement vers des enregistrements
d’adresse, pas vers des CNAME. Consultez la
[RFC 1034, section 3.6.2](https://www.rfc-editor.org/rfc/rfc1034.html#section-3.6.2) et la
[RFC 2181, sections 10.1 et 10.3](https://www.rfc-editor.org/rfc/rfc2181.html#section-10).

Un CNAME change uniquement la recherche DNS. Il ne crée pas de redirection HTTP. Les clients
envoient toujours le nom du service d’origine dans SNI TLS et dans l’en-tête HTTP `Host`, donc le
routage et les certificats doivent couvrir chaque nom de service. Une cible partagée n’ajoute pas
non plus de haute disponibilité ou de bande passante automatiquement.

Le TTL contrôle la durée pendant laquelle les résolveurs peuvent mettre chaque réponse en cache.
Utilisez un TTL court, comme 300, pendant une migration, puis augmentez-le lorsque les
enregistrements sont stables. Un TTL plus court n’invalide pas les caches existants. Le comportement
du cache DNS est défini dans la
[RFC 1034, section 2.3](https://www.rfc-editor.org/rfc/rfc1034.html#section-2.3).

## Étape 4 : Écrire le script d’application

Créez `dns/apply-zone.sh`. Il crée la zone si elle est absente, puis parcourt le fichier ligne par
ligne :

```bash
#!/usr/bin/env bash
# Apply a records file to a DNS zone with the zcp CLI.
#
# Usage: dns/apply-zone.sh <zone-name> <records-file> <project-slug> [--dry-run]
set -euo pipefail

ZONE="${1:?zone name required}"
FILE="${2:?records file required}"
PROJECT="${3:?project slug required}"
DRY_RUN="${4:-}"

[ -f "$FILE" ] || { echo "records file not found: $FILE" >&2; exit 1; }
case "$DRY_RUN" in
  ''|--dry-run) ;;
  *) echo "unknown option: $DRY_RUN (expected --dry-run or nothing)" >&2; exit 2 ;;
esac

run() {
  if [ "$DRY_RUN" = "--dry-run" ]; then
    printf '  would run: zcp %s\n' "$*"
  else
    zcp "$@"
  fi
}

slug_for_zone() {
  zcp dns list --project "$PROJECT" --region default -o json 2>/dev/null \
    | jq -r --arg z "$ZONE" '(.data // .)[] | select(.name == $z) | .slug' | head -1
}

SLUG="$(slug_for_zone)"
if [ -z "$SLUG" ]; then
  echo "Creating zone $ZONE in project $PROJECT"
  run dns create --name "$ZONE" --project "$PROJECT" --region default -y
  [ "$DRY_RUN" = "--dry-run" ] || SLUG="$(slug_for_zone)"
fi
echo "Zone slug: ${SLUG:-<pending>}"

FAILED=0

# CONTENT is the last field and may contain spaces, so read the first four
# fields and let the remainder fall into CONTENT.
while read -r NAME TYPE TTL PRIO CONTENT; do
  case "$NAME" in ''|\#*) continue ;; esac
  ARGS=(dns record-create --domain "${SLUG:-PENDING}" --name "$NAME" --type "$TYPE" \
        --ttl "$TTL" --content "$CONTENT" --project "$PROJECT" --region default -y)
  [ "$PRIO" != "-" ] && ARGS+=(--priority "$PRIO")
  echo "-> $NAME $TYPE $CONTENT"
  if ! run "${ARGS[@]}"; then
    echo "   [FAIL] $NAME $TYPE" >&2
    FAILED=1
  fi
done < "$FILE"

if [ "$FAILED" -ne 0 ]; then
  echo "One or more records failed. The zone is partially applied." >&2
  exit 1
fi

echo "Done. Verify with: dig NS $ZONE +short"
```

Rendez-le exécutable :

```bash
chmod +x dns/apply-zone.sh
```

## Étape 5 : Commencer par une simulation

Ne pointez jamais un nouveau script vers une zone active. Imprimez d’abord les commandes :

```bash
dns/apply-zone.sh example.ca dns/zones/example.ca.records my-project --dry-run
```

Lisez la sortie. Chaque ligne doit contenir le nom, le type et le contenu attendus, et les lignes MX
doivent inclure une priorité. Une valeur TXT entre guillemets doit conserver ses guillemets.

## Étape 6 : Appliquer

:::danger

Ce script ne peut pas migrer un enregistrement A vers un CNAME. Créez et vérifiez l’enregistrement A
cible, puis retirez l’ancien enregistrement A du service avant d’ajouter son CNAME.

:::

```bash
dns/apply-zone.sh example.ca dns/zones/example.ca.records my-project
```

Le script indique chaque enregistrement au fur et à mesure et marque ceux qui échouent avec `[FAIL]`
au lieu de s’arrêter. Lisez cette sortie : une application partielle est le mode d’échec à détecter
tôt.

## Étape 7 : Vérifier avec le fichier

Vérifiez ce que les serveurs de noms servent réellement plutôt que ce que la console affiche :

```bash
zcp dns show <zone-slug> --project my-project --region default
for ns in ns1.dns.example.ca ns2.dns.example.ca; do
  dig @"$ns" A example.ca +short
  dig @"$ns" A yow-edge.example.ca +short
  dig @"$ns" A yul-edge.example.ca +short
  dig @"$ns" CNAME status.example.ca +short
  dig @"$ns" CNAME api.example.ca +short
  dig @"$ns" MX example.ca +short
  dig @"$ns" TXT example.ca +short
done
```

Interrogez les deux serveurs de noms. Un enregistrement qui répond sur l’un et pas sur l’autre
signifie que la zone n’a pas fini de se propager entre eux.

## Notes

- **Validez le fichier, jamais un jeton.** Le fichier décrit les enregistrements. Les identifiants
  appartiennent à votre magasin de secrets et atteignent le script par l’environnement.
- **Des TTL courts pendant les itérations.** 300 secondes rendent les erreurs peu coûteuses.
  Augmentez-les lorsque la zone est stabilisée.
- **Le fichier répertorie les valeurs prévues.** Réexécuter ce script ajoute seulement des valeurs.
  Il ne réconcilie pas les changements effectués dans la console et ne retire pas les valeurs
  absentes du fichier. Mettez à jour le fichier et retirez vous-même les valeurs obsolètes lorsque
  la zone change en dehors du script.
- **`record-create` ajoute à un RRset correspondant.** Il ajoute une valeur à un ensemble
  d'enregistrements existant avec le même nom et le même type. Il ne peut pas migrer un
  enregistrement A vers un CNAME parce que l'ancien A doit être retiré avant que le CNAME existe
  pour ce propriétaire. Créez et vérifiez d'abord l'enregistrement A cible, puis retirez chaque
  ancien A de service et ajoutez son CNAME.
- **Le script ajoute des enregistrements, mais il ne purge pas la zone.** Il applique les
  enregistrements nommés dans le fichier et rien d'autre. Supprimer une ligne du fichier ne retire
  pas cette valeur de la zone. `zcp dns record-delete` supprime l'ensemble complet. Recréez donc les
  valeurs à conserver après l'avoir utilisé.

## Prochaines étapes

- [Types d’enregistrements DNS](/fr/public-cloud/dns/records)
- [Héberger un domaine sur ZCP DNS avec la CLI](/fr/tutorials/host-dns-on-zcp-cli)
- [Gérer l’infrastructure avec Terraform ou OpenTofu](/tutorials/manage-infrastructure-terraform)
