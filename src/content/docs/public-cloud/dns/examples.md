---
title: DNS Examples
description:
  End-to-end DNS recipes for ZCP. Host a website, route email, verify domain ownership, restrict
  certificate issuance, and delegate a subdomain, each with verification.
---

Practical recipes for common DNS tasks. Each one uses the `zcp` CLI against a zone with the slug
`examplecom`, then verifies the result with `dig`. Read your slug from `zcp dns list`. The same
records work from the [console](/public-cloud/dns/records) and the [API](/public-cloud/dns/api).

:::note

Add your records **before** you delegate the domain to ZSoftly, then verify. See
[Domains](/public-cloud/dns/domains) for delegation and
[Troubleshooting](/public-cloud/dns/troubleshooting) for checking propagation.

:::

## Host a Website

Point the root and `www` at your server.

```bash
zcp dns record-create --domain examplecom --name @   --type A --content 203.0.113.10
zcp dns record-create --domain examplecom --name www --type A --content 203.0.113.10
```

Verify from a public resolver:

```bash
dig A example.com     +short   # 203.0.113.10
dig A www.example.com +short   # 203.0.113.10
```

## Route Email

Add a mail server and an SPF policy. `MX` takes a priority in its own field.

```bash
zcp dns record-create --domain examplecom --name @ --type MX --content mail.example.com. --priority 10
zcp dns record-create --domain examplecom --name @ --type TXT --content '"v=spf1 mx -all"'
```

Verify:

```bash
dig MX  example.com +short   # 10 mail.example.com.
dig TXT example.com +short   # "v=spf1 mx -all"
```

See [MX records](/public-cloud/dns/records/mx) and [TXT records](/public-cloud/dns/records/txt).

## Verify Domain Ownership

Many services ask you to publish a `TXT` record to prove you own the domain. Paste the value they
give you.

```bash
zcp dns record-create --domain examplecom --name @ --type TXT --content '"provider-verification=abc123"'
```

```bash
dig TXT example.com +short
```

## Restrict Certificate Issuance

Allow only your certificate authority to issue certificates.

```bash
zcp dns record-create --domain examplecom --name @ --type CAA --content '0 issue "letsencrypt.org"'
```

```bash
dig CAA example.com +short   # 0 issue "letsencrypt.org"
```

## Delegate a Subdomain

Hand `subzone.example.com` to another DNS provider.

```bash
zcp dns record-create --domain examplecom --name subzone --type NS --content ns1.other-dns.com.
zcp dns record-create --domain examplecom --name subzone --type NS --content ns2.other-dns.com.
```

```bash
dig NS subzone.example.com +short
```

## Change a Record

There is no update action. Delete the record, then create it with the new value.

```bash
zcp dns record-delete --domain examplecom --name www --type A --yes
zcp dns record-create --domain examplecom --name www --type A --content 203.0.113.20
```

Verify the new value, allowing for the record's TTL to expire in resolver caches:

```bash
dig A www.example.com +short   # 203.0.113.20
```

## Remove a Record

```bash
zcp dns record-delete --domain examplecom --name subzone --type NS
```

Add `--yes` to skip the confirmation prompt in scripts.

See also: [Record types](/public-cloud/dns/records),
[Manage DNS with the CLI](/public-cloud/dns/cli),
[Troubleshooting](/public-cloud/dns/troubleshooting)
