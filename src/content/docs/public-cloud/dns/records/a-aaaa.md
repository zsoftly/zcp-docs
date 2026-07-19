---
title: A and AAAA Records
description:
  Point a hostname at an IPv4 (A) or IPv6 (AAAA) address on ZCP DNS, with console, CLI, and API
  examples and verification.
---

An `A` record maps a name to an **IPv4** address. An `AAAA` record maps a name to an **IPv6**
address. Use these records to point a name to your server.

## Fields

| Field   | Example        | Notes                                  |
| ------- | -------------- | -------------------------------------- |
| Name    | `@` or `www`   | Relative to the zone. `@` is the apex. |
| Type    | `A` / `AAAA`   |                                        |
| Content | `203.0.113.10` | An IPv4 (`A`) or IPv6 (`AAAA`) address |
| TTL     | `14400`        | Seconds. Default 4 hours.              |

## Create

Console (zone-file view):

```text
@   A     203.0.113.10        14400
www A     203.0.113.10        14400
ipv6 AAAA 2001:db8::10        14400
```

CLI:

```bash
zcp dns record-create --domain examplecom --name @    --type A    --content 203.0.113.10
zcp dns record-create --domain examplecom --name www  --type A    --content 203.0.113.10
zcp dns record-create --domain examplecom --name ipv6 --type AAAA --content 2001:db8::10
```

API: `POST` with `{ "name": "www", "type": "A", "content": "203.0.113.10", "ttl": 14400 }`. See
[Manage DNS with the API](/public-cloud/dns/api#add-a-record).

## Verify

```bash
dig A    www.example.com  +short   # 203.0.113.10
dig AAAA ipv6.example.com +short   # 2001:db8::10
```

## Notes

- **Apex and IP address.** Point the apex (`@`) at a fixed IP with an `A` or `AAAA` record. Do not
  use a `CNAME` at the apex. See [CNAME](/public-cloud/dns/records/cname).
- **Multiple addresses.** Add several `A` records with the same name and different IPs to return
  multiple addresses. This provides simple DNS-based distribution without health checks.
- **Dual stack.** Publish both an `A` and an `AAAA` record for a name to serve IPv4 and IPv6
  clients.

See also: [CNAME](/public-cloud/dns/records/cname), [Worked examples](/public-cloud/dns/examples),
[Record types](/public-cloud/dns/records)
