---
title: TXT Records
description:
  Store text data with a TXT record on ZCP DNS for SPF, DKIM, DMARC, and domain verification, with
  quoting rules.
---

A `TXT` record stores free text at a name. The common uses are email authentication (SPF, DKIM,
DMARC) and proving domain ownership to a third-party service.

## Fields

| Field   | Example         | Notes                                                 |
| ------- | --------------- | ----------------------------------------------------- |
| Name    | `@` or a label  | Verification records often use a label like `_dmarc`. |
| Type    | `TXT`           |                                                       |
| Content | `"v=spf1 -all"` | The text, wrapped in double quotes.                   |
| TTL     | `14400`         | Seconds.                                              |

## Create

Console (zone-file view):

```text
@      TXT "v=spf1 mx -all"                 14400
_dmarc TXT "v=DMARC1; p=reject; rua=mailto:dmarc@example.com" 14400
```

CLI (wrap the content so the quotes reach the record):

```bash
zcp dns record-create --domain examplecom --name @ --type TXT --content '"v=spf1 -all"'
```

API: `POST` with `{ "name": "@", "type": "TXT", "content": "\"v=spf1 -all\"", "ttl": 14400 }`.

## Verify

```bash
dig TXT example.com +short
# "v=spf1 -all"
```

## Common Uses

- **SPF**: `"v=spf1 mx -all"` lists the hosts allowed to send mail for your domain.
- **DKIM**: a long public key at a selector name like `selector._domainkey`.
- **DMARC**: a policy at `_dmarc`, for example `"v=DMARC1; p=reject"`.
- **Domain verification**: a value a provider gives you to prove you control the domain.

## Notes

- **Quoting.** The value is a quoted string. On the CLI, wrap it so the shell passes the quotes
  through, for example `'"v=spf1 -all"'`.
- **One string per record.** For a long DKIM key, keep it as a single record. The platform stores it
  as given.
- **Multiple TXT records.** A resolver returns all TXT records sharing a name.

See also: [MX records](/public-cloud/dns/records/mx), [Worked examples](/public-cloud/dns/examples),
[Record types](/public-cloud/dns/records)
