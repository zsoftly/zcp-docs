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
- Replace `example.ca` with a domain you control. Use your actual ingress addresses and nameservers.
- A git repository to keep the file in.
- `jq`, which the script uses to read the zone slug out of the CLI's JSON output. Install it with
  `brew install jq` on macOS, or `apt install jq` on Debian and Ubuntu.

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

Keep the file next to your infrastructure code, not in a personal folder. Its value is that everyone
can see it and changes arrive through review.

## Step 3: Use Shared Regional Ingress Names

Use one A record as a regional ingress target only when its services share the same ingress and move
together. Point each service at that target with one direct CNAME. Updating the A record then
changes the destination for every alias in that regional group. Do not use CNAME chains or loops.

The `example.ca` file groups the `yow-edge` and `yul-edge` targets with the services they own.

A CNAME owner cannot hold other record data. Keep each regional target as a direct A record. Keep
the zone apex as an A record because the apex also carries the SOA and NS records and may carry MX
or TXT records. MX and NS targets must point directly to address records, not CNAMEs. See
[RFC 1034 section 3.6.2](https://www.rfc-editor.org/rfc/rfc1034.html#section-3.6.2) and
[RFC 2181 sections 10.1 and 10.3](https://www.rfc-editor.org/rfc/rfc2181.html#section-10).

A CNAME changes DNS lookup only. It does not create an HTTP redirect. Clients still send the
original service name in TLS SNI and the HTTP `Host` header, so routing and certificates must cover
every service name. A shared target also does not add automatic high availability or bandwidth.

TTL controls how long resolvers can cache each answer. Use a short TTL such as 300 while you
migrate, then raise it when the records are stable. A shorter TTL does not invalidate existing
caches. DNS cache behavior is defined in
[RFC 1034 section 2.3](https://www.rfc-editor.org/rfc/rfc1034.html#section-2.3).

## Step 4: Write the Apply Script

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

Make it executable:

```bash
chmod +x dns/apply-zone.sh
```

## Step 5: Dry Run First

Never point a new script at a live zone. Print the commands first:

```bash
dns/apply-zone.sh example.ca dns/zones/example.ca.records my-project --dry-run
```

Read the output. Every line should carry the name, type and content you expect, and MX lines should
carry a priority. A quoted TXT value must still show its quotes.

## Step 6: Apply

:::danger

This script cannot migrate an A record to a CNAME. Create and verify the target A record, then
remove the old service A record before you add its CNAME.

:::

```bash
dns/apply-zone.sh example.ca dns/zones/example.ca.records my-project
```

The script reports each record as it goes, and marks any that fail with `[FAIL]` rather than
stopping. Read that output: a partial apply is the failure mode worth catching early.

## Step 7: Verify Against the File

Check what the name servers actually serve, rather than what the console shows:

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
- **`record-create` replaces a matching RRset.** It replaces an existing record set with the same
  name and type. It cannot migrate an A record to a CNAME because the old A record must be removed
  before the CNAME can exist at that owner. Create and verify the target A record first, then remove
  each old service A record and add its CNAME.
- **Do not manage multi-value TXT RRsets with this loop.** Each independent TXT line for the same
  name replaces that name's TXT RRset. Use support for a workflow that manages separate values in
  one RRset, or exclude externally managed multi-value RRsets from this file to avoid overwrite.
- **The script adds and updates, it does not prune.** It applies the records the file names and
  nothing else. Deleting a line from the file does not remove that record from the zone. Remove it
  yourself with `zcp dns record-delete`, then delete the line, so the file and the zone stay in
  step.

## Next Steps

- [DNS record types](/public-cloud/dns/records)
- [Host a domain on ZCP DNS with the CLI](/tutorials/host-dns-on-zcp-cli)
- [Manage infrastructure with Terraform or OpenTofu](/tutorials/manage-infrastructure-terraform)
