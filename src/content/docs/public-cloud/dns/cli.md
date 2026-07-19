---
title: Manage DNS with the CLI
description:
  Create DNS zones, add and remove records, and delegate your domain to ZSoftly from the terminal
  with the zcp CLI.
---

The `zcp` CLI manages your DNS zones and records from the terminal. This page covers each step:
create a zone, read the name servers to delegate to, add and remove records, and verify the result.

## Before You Start

- The `zcp` CLI installed and authenticated. See the
  [CLI installation guide](/public-cloud/cli/installation) and
  [CLI Quickstart](/public-cloud/cli/quickstart).
- A domain you control at its registrar.

:::note

DNS commands are account-level. They do not need `--region` or `--project`, unlike most other `zcp`
commands. The one exception is `zcp dns create`, which needs `--project` to place the new zone in a
project.

:::

## Create a Zone

Add your domain to ZCP. This creates the DNS zone ZSoftly serves.

```bash
zcp dns create --name example.com --project default-9
```

Output:

```text
FIELD    VALUE
Slug     examplecom
Name     example.com
Status   false
Created  2026-07-18T21:08:26.000000Z
```

ZCP generates a **slug** from the domain name. Every later command addresses the zone by this slug,
not by the domain name. Copy it from this output or from `zcp dns list`. The `Status` value turns
active shortly after creation.

:::tip

ZCP serves DNS from a single account-wide region, so `zcp dns create` ignores `ZCP_REGION` and sets
the region for you. Pass only `--name` and `--project`.

:::

## Read Your Name Servers

When you create a zone, ZCP adds its `SOA` and `NS` records for you. The `NS` record set holds the
two name servers you point your registrar at.

```bash
zcp dns show examplecom
```

Output:

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

Point your registrar at both name servers before you send live traffic. See
[Domains](/public-cloud/dns/domains) for the per-registrar steps and the Cloudflare Registrar
exception.

## Add Records

Use `zcp dns record-create` with the zone slug, a relative name, a type, and the content.

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

The `--name` value is **relative** to the zone. Pass `www`, not `www.example.com`. ZCP appends the
zone for you. Passing a full name like `www.example.com` creates `www.example.com.example.com`. Use
`@` for the zone root.

:::

Record rules:

- The default TTL is `14400` seconds (4 hours). Override it with `--ttl`, for example `--ttl 3600`.
- Wrap `TXT` content in escaped quotes, for example `'"v=spf1 -all"'`, so the quotes reach the
  record.
- End a `CNAME` target with a trailing dot (`www.example.com.`) to keep it fully qualified.
- An `MX` record needs `--priority`. Put the mail server in `--content` and the preference number in
  `--priority`, for example `--priority 10`. The CLI stops with an error if you leave it off.
- Supported types are `A`, `AAAA`, `CNAME`, `MX`, `TXT`, `CAA`, and `NS`. `SRV` and `LOC` are not
  available yet.

:::note

Create `MX` records in the [portal](/public-cloud/dns/records) or with the
[API](/public-cloud/dns/api#mx-records) too.

:::

## List and Show Records

`zcp dns show` prints the zone and every record it holds.

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

For scripting, add `--output json` and pipe to `jq`.

```bash
zcp dns list --output json
zcp dns show examplecom --output json
```

## Update a Record

There is no update command. To change a record, delete it and create it again with the new value.

```bash
zcp dns record-delete --domain examplecom --name www --type A --yes
zcp dns record-create --domain examplecom --name www --type A --content 203.0.113.20
```

## Delete a Record

Address the record set by name and type.

```bash
zcp dns record-delete --domain examplecom --name www --type A
```

Add `--yes` to skip the confirmation prompt in scripts. Output:

```text
DNS record A "www.example.com." deleted from domain "examplecom".
```

## Delete a Zone

This removes the zone and all of its records.

```bash
zcp dns delete examplecom
```

Add `--yes` to skip the confirmation prompt.

## Verify

Query the ZSoftly name servers directly to confirm a record before global propagation finishes.

```bash
# Ask a ZSoftly name server for the record
dig A www.example.com @ns1.zsoftly.ca +short

# After you delegate at your registrar, query any public resolver
dig A www.example.com @1.1.1.1 +short
```

See also: [DNS Overview](/public-cloud/dns/overview), [Domains](/public-cloud/dns/domains),
[DNS Records](/public-cloud/dns/records), [Worked examples](/public-cloud/dns/examples),
[Manage DNS with the API](/public-cloud/dns/api),
[Troubleshooting](/public-cloud/dns/troubleshooting), [CLI Reference](/public-cloud/cli/reference)
