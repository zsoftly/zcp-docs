---
title: 'Manage a DNS Zone as a File in Version Control'
description:
  Keep every DNS record for a domain in one reviewable file, apply it with a short script and the
  zcp CLI, and rebuild the zone from that file whenever you need to.
sidebar:
  label: 'Manage a Zone as a File'
---

Clicking records into a console works until the day you need to know what changed, or rebuild a zone
somewhere else. This tutorial keeps every record for a domain in one plain text file, applies it
with a short script and the `zcp` CLI, and puts that file in version control beside the rest of your
infrastructure.

By the end you have:

- A records file that describes the whole zone
- A script that applies it, and can show you what it would do first
- A repeatable way to rebuild the zone from the file

Plan for about 20 minutes.

## Before You Start

You need:

- The `zcp` CLI installed and authenticated. See [CLI installation](/public-cloud/cli/installation).
- A project and a domain you control.
- A git repository to keep the file in.

Read [Known limitations](/public-cloud/dns/records#known-limitations) before you start. A name and
type hold one value today, which shapes what a file like this can express.

## Step 1: Choose a Layout

Use one line per record, with the content last so it can contain spaces:

```text
NAME    TYPE    TTL    PRIO    CONTENT
```

Four rules make the file readable and easy to parse:

- `@` means the zone apex
- `-` means the type takes no priority
- Lines starting with `#` are comments
- `CONTENT` is the final field, so it may contain spaces

## Step 2: Write the Records File

Create `dns/zones/example.ca.records`. Group records by purpose and align the columns, so a reviewer
can see the shape of the zone without parsing it:

```text
# example.ca - zone records
#
# Columns are whitespace separated and CONTENT is the final field, so it may
# contain spaces. "@" is the zone apex and "-" means the type takes no priority.
#
# TXT values keep their double quotes, because the API rejects an unquoted value.

# NAME     TYPE   TTL  PRIO  CONTENT

# Website -----------------------------------------------------------------
  @        A      300  -     198.51.100.10
  www      CNAME  300  -     example.ca.

# Application endpoints ---------------------------------------------------
  api      A      300  -     198.51.100.11
  app      A      300  -     198.51.100.12

# Mail routing ------------------------------------------------------------
  @        MX     300  10    mail.example.ca.

# Mail authentication -----------------------------------------------------
  @        TXT    300  -     "v=spf1 include:mailprovider.ca -all"
  _dmarc   TXT    300  -     "v=DMARC1; p=quarantine; rua=mailto:security@example.ca"
```

Keep the file next to your infrastructure code, not in a personal folder. Its value is that everyone
can see it and changes arrive through review.

## Step 3: Write the Apply Script

Create `dns/apply-zone.sh`. It creates the zone if it is missing, then walks the file line by line:

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

# CONTENT is the last field and may contain spaces, so read the first four
# fields and let the remainder fall into CONTENT.
while read -r NAME TYPE TTL PRIO CONTENT; do
  case "$NAME" in ''|\#*) continue ;; esac
  ARGS=(dns record-create --domain "${SLUG:-PENDING}" --name "$NAME" --type "$TYPE" \
        --ttl "$TTL" --content "$CONTENT" --project "$PROJECT" --region default -y)
  [ "$PRIO" != "-" ] && ARGS+=(--priority "$PRIO")
  echo "-> $NAME $TYPE $CONTENT"
  run "${ARGS[@]}" || echo "   [FAIL] $NAME $TYPE" >&2
done < "$FILE"

echo "Done. Verify with: dig NS $ZONE +short"
```

Make it executable:

```bash
chmod +x dns/apply-zone.sh
```

## Step 4: Dry Run First

Never point a new script at a live zone. Print the commands first:

```bash
dns/apply-zone.sh example.ca dns/zones/example.ca.records my-project --dry-run
```

Read the output. Every line should carry the name, type and content you expect, and MX lines should
carry a priority. A quoted TXT value must still show its quotes.

## Step 5: Apply

```bash
dns/apply-zone.sh example.ca dns/zones/example.ca.records my-project
```

The script reports each record as it goes, and marks any that fail with `[FAIL]` rather than
stopping. Read that output: a partial apply is the failure mode worth catching early.

## Step 6: Verify Against the File

Check what the name servers actually serve, rather than what the console shows:

```bash
zcp dns show <zone-slug> --project my-project --region default
dig @ns1.example-dns.ca A example.ca +short
dig @ns1.example-dns.ca MX example.ca +short
dig @ns1.example-dns.ca TXT example.ca +short
```

Query both name servers. A record that answers on one and not the other means the zone has not
finished propagating between them.

## Notes

- **Commit the file, never a token.** The file describes records. Credentials belong in your secret
  store and reach the script through the environment.
- **Short TTLs while you iterate.** 300 seconds keeps mistakes cheap. Raise them once the zone is
  settled.
- **The file is the source of truth.** When someone changes a record in the console, the file and
  the zone have diverged. Re-apply from the file, or update the file to match, and say which you
  did.
- **Creating a record replaces an existing set.** Applying the whole file over a live zone rewrites
  every record it names. That is what makes it repeatable, and also why the dry run matters.

## Next Steps

- [DNS record types](/public-cloud/dns/records)
- [Host a domain on ZCP DNS with the CLI](/tutorials/host-dns-on-zcp-cli)
- [Manage infrastructure with Terraform or OpenTofu](/tutorials/manage-infrastructure-terraform)
