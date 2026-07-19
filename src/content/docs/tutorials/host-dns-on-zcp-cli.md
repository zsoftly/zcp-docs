---
title: 'Host a Domain on ZCP DNS and Manage Records with the CLI'
description:
  Point a domain you own at ZSoftly name servers and manage its DNS records end to end from the
  terminal with the zcp CLI.
sidebar:
  label: 'Host DNS on ZCP (CLI)'
---

This tutorial takes a domain you already own and makes ZSoftly the authoritative DNS host for it.
You create the zone, read the name servers, add records, delegate the domain at your registrar, and
confirm it resolves on the public internet. Every step runs from your terminal with the `zcp` CLI.

By the end you have:

- A DNS zone hosted on ZCP
- A, CNAME, TXT, and MX records resolving on the public internet
- The domain delegated from your registrar to ZSoftly name servers

Plan for about 20 minutes of hands-on work. Name server changes then propagate on their own.
Propagation often completes within a few hours. Allow up to 48 hours.

:::note

The slugs and values in this tutorial (project `default-9`, domain `example.com`, the generated zone
slug `examplecom`, and the sample IPs) are **examples**. Yours will differ. Each step shows the
command used to print the right value for your account.

:::

## Before You Start

- A ZSoftly Public Cloud account. [Sign up](/public-cloud/getting-started/account-signup) first if
  you do not have one.
- The `zcp` CLI installed. See the [CLI installation guide](/public-cloud/cli/installation).
- A domain you control at a registrar, with access to change its name servers.
- `dig` for verification (preinstalled on macOS and Linux, and part of `bind-utils` or `dnsutils` on
  most distributions).

:::caution

Add your records in ZCP **before** you delegate at the registrar. Delegating first, then adding
records, leaves a window where the domain resolves to nothing.

:::

## Step 1: Authenticate

Create a token in the portal under **Profile → API Tokens**, then add a CLI profile and paste it.

```bash
zcp profile add default
zcp auth validate
```

DNS commands are account-level, so you do not set a region or project for them. The one exception is
`zcp dns create`, which takes `--project`.

## Step 2: Create the Zone

Add your domain. This creates the DNS zone ZSoftly serves.

```bash
zcp dns create --name example.com --project default-9
```

```text
FIELD    VALUE
Slug     examplecom
Name     example.com
Status   false
Created  2026-07-18T21:08:26.000000Z
```

Copy the **Slug**. Every record command uses it. List it again anytime:

```bash
zcp dns list
```

## Step 3: Read Your Name Servers

ZCP adds the zone's `SOA` and `NS` records for you. The `NS` record set names the two servers you
delegate to.

```bash
zcp dns show examplecom
```

```text
Records (2):
NAME          TYPE  CONTENT                                                                   TTL
example.com.  SOA   ns1.zsoftly.ca. hostmaster.zsoftly.ca. 2026071801 10800 3600 604800 3600  3600
example.com.  NS    ns1.zsoftly.ca., ns2.zsoftly.ca.                                          3600
```

Write down both name servers. You need them in Step 5.

## Step 4: Add Your Records

Create the records to route your traffic. Use `@` for the zone root and a relative name for
subdomains.

```bash
# Point the root and www at your server
zcp dns record-create --domain examplecom --name @   --type A --content 203.0.113.10
zcp dns record-create --domain examplecom --name www --type A --content 203.0.113.10

# Point an app subdomain at another host
zcp dns record-create --domain examplecom --name api --type A --content 203.0.113.20

# Alias blog to www
zcp dns record-create --domain examplecom --name blog --type CNAME --content www.example.com.

# Publish an SPF policy
zcp dns record-create --domain examplecom --name @ --type TXT --content '"v=spf1 -all"'

# Route mail (MX needs a priority)
zcp dns record-create --domain examplecom --name @ --type MX --content mail.example.com. --priority 10
```

:::caution

The `--name` is **relative** to the zone. Use `www`, not `www.example.com`. Use `@` for the root. A
full name like `www.example.com` becomes `www.example.com.example.com`.

:::

Confirm the zone holds what you expect:

```bash
zcp dns show examplecom
```

## Step 5: Delegate at Your Registrar

Now make ZSoftly authoritative. At the registrar where you bought the domain, replace the name
servers with the two ZSoftly values from Step 3. The exact menu differs per registrar. The
[Domains](/public-cloud/dns/domains) page has a per-registrar quick reference.

:::note

**Cloudflare Registrar** does not allow third-party name servers on the domain apex. If Cloudflare
Registrar holds your domain, delegate a **subdomain** instead. In the Cloudflare DNS app, add two
`NS` records for the subdomain (for example, name `dev`). Point them to `ns1.zsoftly.ca` and
`ns2.zsoftly.ca`. Then create the zone in ZCP as `dev.example.com`. See the
[Cloudflare exception](/public-cloud/dns/domains#cloudflare-exception).

:::

## Step 6: Verify

Before you delegate, query a ZSoftly name server directly. It answers even while the old name
servers are still live at your registrar.

```bash
dig A www.example.com @ns2.zsoftly.ca +short
# 203.0.113.10
```

After you delegate and propagation catches up, any public resolver returns the same answer.

```bash
dig NS example.com @1.1.1.1 +short
# ns1.zsoftly.ca.
# ns2.zsoftly.ca.

dig A www.example.com @1.1.1.1 +short
# 203.0.113.10
```

To watch global propagation, use an online checker such as
[whatsmydns.net](https://www.whatsmydns.net/) with the **NS** record type.

## Next Steps

- [Manage DNS with the CLI](/public-cloud/dns/cli): the full record command reference.
- [Manage DNS with the API](/public-cloud/dns/api): do the same over REST.
- [Domains](/public-cloud/dns/domains): per-registrar name server steps and the Cloudflare
  exception.
