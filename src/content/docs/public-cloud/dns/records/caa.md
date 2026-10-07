---
title: CAA Records
description:
  Learn how CAA records restrict certificate issuance and the current ZCP DNS console limitation.
---

A `CAA` record lists the certificate authorities allowed to issue certificates for your domain.
Certificate authorities check this policy before issuing a certificate.

:::caution

You cannot create `CAA` records in the ZCP DNS console. Contact support if you need to publish a CAA
record.

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

## Notes

- **`issue`** allows a CA to issue non-wildcard certificates. **`issuewild`** covers wildcard
  certificates. **`iodef`** sets a contact for policy-violation reports.
- **No CAA record means no restriction.** Without a `CAA` record, no policy restricts certificate
  issuance.

See also: [TXT records](/public-cloud/dns/records/txt),
[Worked examples](/public-cloud/dns/examples), [Record types](/public-cloud/dns/records)
