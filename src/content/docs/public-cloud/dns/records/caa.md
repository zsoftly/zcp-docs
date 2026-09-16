---
title: CAA Records
description:
  Restrict certificate issuance for your domain to selected certificate authorities with a CAA
  record on ZCP DNS.
---

A `CAA` record lists the certificate authorities allowed to issue certificates for your domain.
Certificate authorities check this policy before issuing a certificate.

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

Console (zone-file view):

```text
@ CAA 0 issue "letsencrypt.org"    14400
```

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

## One CAA Value per Name

A name and type hold one value, so the apex holds one `CAA` record. A second `CAA` record at `@`
replaces the first, with no warning. You cannot list a second certificate authority, and you cannot
publish an `issue` value and an `iodef` value at the same name. See
[Known limitations](/public-cloud/dns/records#known-limitations).

## Notes

- **`issue`** allows a CA to issue non-wildcard certificates. **`issuewild`** covers wildcard
  certificates. **`iodef`** sets a contact for policy-violation reports.
- **Pick the one value you need.** Unlisted certificate authorities must refuse issuance, so an
  `issue` value for a single CA blocks every other CA. Do not publish a `CAA` record if you get
  certificates from more than one CA.
- **No CAA record means no restriction.** Without a `CAA` record, no policy restricts certificate
  issuance.

See also: [TXT records](/public-cloud/dns/records/txt),
[Worked examples](/public-cloud/dns/examples), [Record types](/public-cloud/dns/records)
