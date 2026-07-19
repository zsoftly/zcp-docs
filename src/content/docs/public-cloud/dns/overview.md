---
title: DNS Overview
description:
  Host authoritative DNS for your domains on the ZSoftly Cloud Platform. Learn how zones, name
  servers, and records work together and choose a management method.
---

Host your domain's authoritative DNS on ZCP. You add a domain, point your registrar at ZSoftly's
name servers, and manage all your records from the console, the CLI, or the API.

## How It Works

A **domain** (also called a zone) is the container for your records, for example `example.com`. When
you add a domain, ZCP creates the zone and adds its `SOA` and `NS` records for you. You then
delegate the domain to ZSoftly at your registrar, and ZCP answers DNS queries for it.

Use this workflow:

1. **Add your domain** to ZCP. See [Domains](/public-cloud/dns/domains).
2. **Add your records** while the domain still resolves through its current provider.
3. **Delegate** the domain to ZSoftly's name servers at your registrar.
4. **Verify** global resolution for the new records. See
   [Troubleshooting](/public-cloud/dns/troubleshooting).

This order avoids an empty-zone window during the switch.

## Name Servers

ZCP serves every zone from two authoritative name servers:

| Name server | Value            |
| ----------- | ---------------- |
| Primary     | `ns1.zsoftly.ca` |
| Secondary   | `ns2.zsoftly.ca` |

Point your domain at both. The exact values also appear in the console and in `zcp dns show`.

## Supported Record Types

| Type         | Purpose                                     | Details                                        |
| ------------ | ------------------------------------------- | ---------------------------------------------- |
| `A` / `AAAA` | Map a name to an IPv4 or IPv6 address       | [A and AAAA](/public-cloud/dns/records/a-aaaa) |
| `CNAME`      | Alias one name to another                   | [CNAME](/public-cloud/dns/records/cname)       |
| `MX`         | Route email to a mail server                | [MX](/public-cloud/dns/records/mx)             |
| `TXT`        | Store text (SPF, DKIM, verification)        | [TXT](/public-cloud/dns/records/txt)           |
| `CAA`        | Restrict certificate issuance to chosen CAs | [CAA](/public-cloud/dns/records/caa)           |
| `NS`         | Delegate a subdomain to other name servers  | [NS](/public-cloud/dns/records/ns)             |

:::note

`SRV` and `LOC` records are not available yet.

:::

## Ways to Manage DNS

- **Console**: the DNS section of the portal. See [Records](/public-cloud/dns/records) for the
  per-type reference.
- **CLI**: [Manage DNS with the CLI](/public-cloud/dns/cli).
- **API**: [Manage DNS with the API](/public-cloud/dns/api).
- **Infrastructure as code**: the `zcp_dns_record` resource in the
  [Terraform / OpenTofu provider](/tutorials/manage-infrastructure-terraform).

DNS commands are account-level. They do not need a region or project, unlike most other resources.
The one exception is creating a domain, which takes a project.

## Next Steps

- [Add a domain and delegate it](/public-cloud/dns/domains)
- [Record types reference](/public-cloud/dns/records)
- [Worked examples](/public-cloud/dns/examples): host a website, route email, verify ownership,
  restrict certificate issuance, and delegate a subdomain.

See also: [Manage DNS with the CLI](/public-cloud/dns/cli),
[Manage DNS with the API](/public-cloud/dns/api),
[Troubleshooting](/public-cloud/dns/troubleshooting)
