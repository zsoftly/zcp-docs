---
title: CAA Records
description:
  Learn how CAA records restrict certificate issuance and the current ZCP DNS console limitation.
---

A `CAA` record lists the certificate authorities allowed to issue certificates for your domain.
Certificate authorities check this policy before issuing a certificate.

:::caution

The ZCP DNS console does not offer `CAA` as a record type. Create `CAA` records with the CLI or API.

:::

## Fields

| Field   | Example                     | Notes                                              |
| ------- | --------------------------- | -------------------------------------------------- |
| Name    | `@`                         | Usually the apex. Applies to the domain and below. |
| Type    | `CAA`                       |                                                    |
| Content | `0 issue "letsencrypt.org"` | Flags, tag, and value.                             |
| TTL     | `14400`                     | Seconds.                                           |

The value has three parts: **flags** (usually `0`), a **tag** (`issue`, `issuewild`, or `iodef`),
and a quoted **value** (the CA's domain, or a contact URL for `iodef`).

## Create

CLI (wrap the value so the quotes reach the record):

```bash
zcp dns record-create --domain examplecom --name @ --type CAA --content '0 issue "letsencrypt.org"'
```

API: `POST` with
`{ "name": "@", "type": "CAA", "content": "0 issue \"letsencrypt.org\"", "ttl": 14400 }`.

## Verify

```bash
dig CAA example.com +short
# 0 issue "letsencrypt.org"
```

## Notes

- **`issue`** allows a CA to issue non-wildcard certificates. **`issuewild`** covers wildcard
  certificates. **`iodef`** sets a contact for policy-violation reports.
- **No CAA record means no restriction.** Without a `CAA` record, no policy restricts certificate
  issuance.

See also: [TXT records](/public-cloud/dns/records/txt),
[Worked examples](/public-cloud/dns/examples), [Record types](/public-cloud/dns/records)
