---
title: NS Records
description: Delegate a subdomain to another set of name servers with an NS record on ZCP DNS.
---

An `NS` record names the authoritative name servers for a zone. ZCP creates the `NS` record set for
your domain automatically (pointing at `ns1.zsoftly.ca` and `ns2.zsoftly.ca`). Add your own `NS`
records to **delegate a subdomain** to a different DNS provider.

## Fields

| Field   | Example              | Notes                                                     |
| ------- | -------------------- | --------------------------------------------------------- |
| Name    | `subzone`            | The subdomain to delegate.                                |
| Type    | `NS`                 |                                                           |
| Content | `ns1.other-dns.com.` | A name server for the subdomain. End with a trailing dot. |
| TTL     | `3600`               | Seconds.                                                  |

## Delegate a Subdomain

To hand `subzone.example.com` to another provider, add an `NS` record for `subzone`.

Console (zone-file view):

```text
subzone NS ns1.other-dns.com. 3600
```

CLI:

```bash
zcp dns record-create --domain examplecom --name subzone --type NS --content ns1.other-dns.com.
```

After this change, ZCP returns a referral to the delegated provider for `subzone.example.com`. The
delegated provider must host the `subzone.example.com` zone.

## Verify

```bash
dig NS subzone.example.com +short
# ns1.other-dns.com.
```

## One Name Server per Delegation

A name and type hold one value, so `subzone` holds one `NS` record. A second `NS` record at the same
name replaces the first, with no warning. See
[Known limitations](/public-cloud/dns/records#known-limitations).

:::caution

A single `NS` record leaves the delegated subdomain with no redundancy. If that one name server
stops answering, the subdomain stops resolving. Do not delegate a production subdomain from a ZCP
zone. To delegate to two or more name servers, host the parent zone with a DNS provider that accepts
several `NS` values at one name.

:::

## Delegating to ZCP From Elsewhere

The reverse also works. To host a subdomain on ZCP while the parent domain stays at another
provider, create the subdomain as a ZCP domain (for example, `dev.example.com`). At the parent
provider, add `NS` records for `dev` pointing at `ns1.zsoftly.ca` and `ns2.zsoftly.ca`. See
[Domains](/public-cloud/dns/domains).

## Notes

- **A ZCP zone delegates to one name server.** Standard practice is two or more. ZCP cannot hold
  more than one `NS` value at a name.
- **The child provider must host the zone.** Delegation only forwards queries. The records live at
  the provider you delegate to.
- **Do not delete the apex `NS` set.** ZCP manages your domain's own `ns1`/`ns2.zsoftly.ca` records.

See also: [Domains](/public-cloud/dns/domains), [Worked examples](/public-cloud/dns/examples),
[Record types](/public-cloud/dns/records)
