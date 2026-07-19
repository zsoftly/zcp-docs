---
title: CNAME Records
description:
  Alias one name to another with a CNAME record on ZCP DNS, including the apex and coexistence
  rules.
---

A `CNAME` record makes one name an alias of another. A lookup for the alias returns the target's
records. Use it to point a subdomain at a hostname with an existing address, such as a load balancer
or a platform-as-a-service endpoint.

## Fields

| Field   | Example            | Notes                                            |
| ------- | ------------------ | ------------------------------------------------ |
| Name    | `blog`             | Relative to the zone.                            |
| Type    | `CNAME`            |                                                  |
| Content | `www.example.com.` | The target hostname. End it with a trailing dot. |
| TTL     | `14400`            | Seconds. Default 4 hours.                        |

## Create

Console (zone-file view):

```text
blog CNAME www.example.com. 14400
```

CLI:

```bash
zcp dns record-create --domain examplecom --name blog --type CNAME --content www.example.com.
```

API: `POST` with `{ "name": "blog", "type": "CNAME", "content": "www.example.com.", "ttl": 14400 }`.

## Verify

```bash
dig blog.example.com +short
# www.example.com.
# 203.0.113.10
```

The answer shows the alias, then the target's address.

## Notes

- **Not at the apex.** A `CNAME` cannot sit at the zone root (`@`). The apex already has `SOA` and
  `NS` records, and a `CNAME` cannot coexist with other records at the same name. Use an
  [`A` or `AAAA`](/public-cloud/dns/records/a-aaaa) record for the apex.
- **Alone at its name.** A name with a `CNAME` cannot also hold an `A`, `MX`, `TXT`, or any other
  record. Pick one.
- **Trailing dot.** End the target with a dot (`www.example.com.`) so ZCP treats it as an absolute
  name and does not append your zone.

See also: [A and AAAA](/public-cloud/dns/records/a-aaaa),
[Worked examples](/public-cloud/dns/examples), [Record types](/public-cloud/dns/records)
