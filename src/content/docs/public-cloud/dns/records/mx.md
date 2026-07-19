---
title: MX Records
description:
  Route email to a mail server with an MX record on ZCP DNS. MX needs a priority, set in its own
  field.
---

An `MX` record routes email for your domain to a mail server. Each `MX` record has a **priority** (a
preference number) and a **mail server** hostname. Mail delivery tries the lowest priority number
first.

## Fields

| Field    | Example             | Notes                                                    |
| -------- | ------------------- | -------------------------------------------------------- |
| Name     | `@`                 | Usually the apex, so mail addresses are `@your-domain`.  |
| Type     | `MX`                |                                                          |
| Priority | `10`                | 0 to 65535. ZCP prefers lower values. Required for `MX`. |
| Content  | `mail.example.com.` | The mail server hostname. End it with a trailing dot.    |
| TTL      | `3600`              | Seconds.                                                 |

:::caution

`MX` records need a **priority**. Set it in its own field, not inside the mail server value. The API
requires priority for `MX` and rejects it for every other type.

:::

## Create

Console: choose type `MX`, set **Priority** and the mail server value in their own fields.

```text
@ MX 10 mail.example.com. 3600
```

CLI (`MX` requires `--priority`):

```bash
zcp dns record-create --domain examplecom --name @ --type MX \
  --content mail.example.com. --priority 10 --ttl 3600
```

API (send `priority` as a separate field):

```bash
curl -s -X POST "https://api.zcp.zsoftly.ca/api/dns/domains/examplecom/records" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{ "name": "@", "type": "MX", "content": "mail.example.com.", "priority": 10, "ttl": 3600 }'
```

## Verify

```bash
dig MX example.com +short
# 10 mail.example.com.
```

## Multiple Mail Servers

Add several `MX` records with different priorities for a primary and a backup:

```bash
zcp dns record-create --domain examplecom --name @ --type MX --content mail1.example.com. --priority 10
zcp dns record-create --domain examplecom --name @ --type MX --content mail2.example.com. --priority 20
```

Mail delivers to `mail1` first, then falls back to `mail2` if the primary is unreachable.

## Notes

- **Priority is separate.** Do not put the number in the value (`10 mail.example.com.`). The
  console, CLI, and API each take priority in its own field.
- **The mail server needs an address.** The `MX` target must resolve to an `A` or `AAAA` record. It
  cannot point at a `CNAME`.
- **A `0` priority is valid** and is sent correctly.

See also: [TXT records](/public-cloud/dns/records/txt) for SPF and DKIM,
[Worked examples](/public-cloud/dns/examples), [Record types](/public-cloud/dns/records)
