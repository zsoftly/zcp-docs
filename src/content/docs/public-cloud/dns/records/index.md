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

`SRV` and `LOC` records are not available yet. See [Known limitations](#known-limitations).

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

## Known Limitations

These limits apply to the console, the CLI, and the API alike.

### TXT Values Need Double Quotes

Wrap a `TXT` value in double quotes. The platform rejects an unquoted value with the message
`DNS operation failed. Please try again or contact support.`

Wrap the value in double quotes, for example `"v=spf1 include:example.net ~all"`. In a shell, put
single quotes around the double quotes so the shell passes them through to the record:

```bash
zcp dns record-create --domain examplecom --name @ --type TXT \
  --content '"v=spf1 include:example.net ~all"'
```

### One Value per Name and Type

A name and type hold one value. Creating a second value at the same name and type replaces the
first, with no warning. This applies to every record type, including `A` and `AAAA`. It is not
limited to `TXT` and `MX`.

What this rules out:

- **Round-robin `A` records.** A name resolves to one IPv4 address. A second `A` record at that name
  replaces the first.
- **Several IPv6 addresses.** A name resolves to one IPv6 address.
- **A backup mail server.** A zone apex holds one `MX` record.
- **SPF and a verification value together.** A zone apex holds either an SPF record or a
  verification `TXT` record, not both.
- **A redundant delegation.** A delegated subdomain holds one `NS` record, so it has one name
  server.

A name can still hold one value of each type. An `A` record and an `AAAA` record coexist at the same
name, because the types differ.

The console, the CLI, and the API offer no way around this today. Open a
[support ticket](/troubleshooting#raise-a-support-ticket) if you need several values at one name and
type.

### SRV and LOC Records Fail

You cannot create `SRV` or `LOC` records. Both fail with the message
`DNS operation failed. Please try again or contact support.` Every other type works: `A`, `AAAA`,
`CNAME`, `MX`, `TXT`, `CAA`, and `NS`. Open a
[support ticket](/troubleshooting#raise-a-support-ticket) if you need an `SRV` or `LOC` record.

## How to Manage Records

Every type works the same way across all surfaces:

- **Console**: the DNS section of the portal, then **Create Record**.
- **CLI**: [Manage DNS with the CLI](/public-cloud/dns/cli).
- **API**: [Manage DNS with the API](/public-cloud/dns/api/).

There is no update action. To change a record, delete it and create it again with the new value.

See also: [DNS Overview](/public-cloud/dns/overview), [Worked examples](/public-cloud/dns/examples),
[Troubleshooting](/public-cloud/dns/troubleshooting)
