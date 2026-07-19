---
title: DNS Records
description:
  The DNS record types available on ZCP, plus shared naming and TTL rules and links to each record
  type reference.
---

DNS records connect your domain to services. Each record has a **name**, a **type**, a **value**,
and a **TTL**. This page covers the shared rules. Each type has its own page with fields, examples,
and constraints.

## Record Types

| Type         | Purpose                                     | Page                                           |
| ------------ | ------------------------------------------- | ---------------------------------------------- |
| `A` / `AAAA` | Point a name at an IPv4 or IPv6 address     | [A and AAAA](/public-cloud/dns/records/a-aaaa) |
| `CNAME`      | Alias one name to another                   | [CNAME](/public-cloud/dns/records/cname)       |
| `MX`         | Route email to a mail server                | [MX](/public-cloud/dns/records/mx)             |
| `TXT`        | Store text (SPF, DKIM, verification)        | [TXT](/public-cloud/dns/records/txt)           |
| `CAA`        | Restrict certificate issuance to chosen CAs | [CAA](/public-cloud/dns/records/caa)           |
| `NS`         | Delegate a subdomain to other name servers  | [NS](/public-cloud/dns/records/ns)             |

:::note

`SRV` and `LOC` records are not available yet.

:::

## Names Are Relative

The record **name** is relative to your zone. Enter `www` for `www.example.com`, not the full name.
Use `@` for the zone root (the apex). In the CLI and API, ZCP appends the zone for you, so a full
name like `www.example.com` becomes `www.example.com.example.com`.

## Values With a Trailing Dot

Hostname values, such as a `CNAME` target, an `MX` mail server, or an `NS` name server, should end
with a trailing dot. For example, use `mail.example.com.`. The dot marks the name as fully qualified
so ZCP does not treat it as relative to your zone.

## TTL

The **TTL** (time to live) is how long, in seconds, resolvers cache the record. The default is
`14400` (4 hours). Lower it to `300` a day or two before you plan to change a record, so the change
propagates quickly. Raise it again once the record is stable.

## How to Manage Records

Every type works the same way across all surfaces:

- **Console**: the DNS section of the portal, then **Create Record**.
- **CLI**: [Manage DNS with the CLI](/public-cloud/dns/cli).
- **API**: [Manage DNS with the API](/public-cloud/dns/api).

There is no update action. To change a record, delete it and create it again with the new value.

See also: [DNS Overview](/public-cloud/dns/overview), [Worked examples](/public-cloud/dns/examples),
[Troubleshooting](/public-cloud/dns/troubleshooting)
