---
title: Configure Email Authentication DNS
description: Publish and verify dedicated DKIM and DMARC records on an existing ZCP DNS zone.
sidebar:
  label: Configure Email Authentication DNS
---

Email authentication DNS records help receiving systems distinguish mail sent by your approved
systems from mail that only claims to use your domain. This tutorial configures dedicated DKIM and
DMARC record sets on an existing ZCP DNS zone. It also explains how to handle SPF safely.

Choose one owner for each record set: the `zcp` CLI or Terraform/OpenTofu. Do not use both tools to
manage the same name and type. The CLI accepts one content value per create and deletes records by
their complete name and type. Terraform models records as name-and-type record sets.

By the end, you will have:

- An inventory of the DNS zone and the systems permitted to send mail
- A published DKIM record or CNAME at a provider-issued selector
- A DMARC record in monitoring mode with reports sent to a mailbox you control
- A verification routine for DNS and authenticated mail from every sender

This guide assumes ZCP already hosts the authoritative zone. To create a zone and delegate it at
your registrar, follow [Host a Domain on ZCP (CLI)](/tutorials/host-dns-on-zcp-cli/).

:::caution

DNS records are only one part of email security. Publishing a DKIM record does not turn on signing
in a sending system, and publishing DMARC does not prove every sender passes it. Test delivered mail
after each change.

:::

## Before You Start

You need:

- A ZCP DNS zone for a domain you control
- The [`zcp` CLI](/public-cloud/cli/installation) authenticated with a token, or Terraform or
  OpenTofu with `ZCP_BEARER_TOKEN` set in your shell
- Access to every system that sends mail using the domain, including application delivery,
  notifications, support, billing, marketing, and device or service alerts
- A mailbox dedicated to DMARC aggregate reports, such as `dmarc-reports@example.ca`
- The exact DKIM and SPF instructions from each sending system

The `example.ca` names in this guide are illustrative placeholders. Replace them with a domain you
control. Do not paste a private DKIM key into DNS. DNS publishes a public key or a provider-issued
CNAME target only.

## Inventory the Zone and Senders

Start by recording the current state. Save the output in your change record. It gives you the zone
slug, name servers, and the record sets you must preserve.

```bash
zcp dns list
zcp dns show <domain-slug> --output json
```

Ask both authoritative ZCP name servers for the records that matter. Replace `example.ca` with your
domain.

```bash
for ns in ns1.zsoftly.ca ns2.zsoftly.ca; do
  dig TXT example.ca "@$ns" +short
  dig TXT _dmarc.example.ca "@$ns" +short
  dig TXT selector._domainkey.example.ca "@$ns" +short
  dig CNAME selector._domainkey.example.ca "@$ns" +short
done
```

List each legitimate sender, the domain it uses in the visible From address, the envelope sender
domain, and its DKIM selector or CNAME instructions. Include systems that only send occasionally.
Assign an owner who approves changes and reviews DMARC reports. Keep the inventory with the record
values and the date each sender was last tested.

:::caution

Do not delete an existing root (`@`) `TXT` record set to add SPF when the zone apex is the
envelope-sender domain. It can contain unrelated domain verification values. Do not add a second SPF
policy at any envelope-sender domain. SPF permits one policy record and has a 10-DNS-lookup ceiling,
so unreviewed `include` chains are risky. Use the complete value issued by the systems you
authorize, then validate it before changing live mail.

:::

The current ZCP CLI creates or deletes an entire name-and-type record set. It has no in-place record
update command. The current Terraform provider also replaces a `zcp_dns_record` when its content,
name, type, or TTL changes. For an existing SPF record or another multi-value `TXT` record set, use
the established DNS change process that can preserve the full intended set. Do not create a second
root `TXT` resource or run a delete-and-recreate change during normal mail delivery.

## Understand the Record Names

SPF, DKIM, and DMARC use different DNS names and answer different questions.

- **SPF** is a `TXT` policy at the envelope-sender domain. When that domain is the zone apex, the
  record name is `@`. It can also be a subdomain, such as `bounce.example.ca`. Keep a single,
  complete policy and account for DNS lookups in all authorized includes.
- **DKIM** is a `TXT` record or `CNAME` at `<selector>._domainkey.example.ca`. It lets receivers
  retrieve the public material needed to validate a message signature.
- **DMARC** is a `TXT` record at `_dmarc.example.ca`. It tells receivers what policy to apply when
  the visible From domain does not have aligned authenticated mail, and it requests reports.

The receiving system needs SPF or DKIM to authenticate and align with the visible From domain for a
DMARC pass. DNS configuration alone cannot make that happen. Configure each sending system to use
the correct domain, enable its DKIM signing, and send a test message after publication.

For a standards reference on SPF record selection and lookup limits, see
[RFC 7208](https://www.rfc-editor.org/info/rfc7208).

## Choose One Management Path

Use the CLI for a small, reviewed change to an unused dedicated record name. Use Terraform or
OpenTofu when your team already manages this zone as code and reviews plans. The examples below
create only the dedicated DKIM and DMARC record sets after you confirm that each name is absent.

Do not apply the CLI commands if Terraform or OpenTofu owns the same record set. Do not apply the
Terraform configuration if someone changes the same record set through the CLI or console. Record
ownership alongside your sender inventory.

If the zone apex is the envelope-sender domain and it has no `TXT` record set at all, use one
ownership path to create a single SPF policy with the complete value supplied by all authorized
senders. Do this only after you have checked every sender and the value's DNS lookups. An active
sending domain with an existing root `TXT` set needs a separate reviewed change because this
tutorial cannot safely merge or update that shared set.

## Publish DKIM and DMARC with the CLI

Set variables for your zone and the instructions supplied by a sending system. The DKIM value below
is read from your terminal to avoid putting it in shell history. Enter the complete DNS
presentation: a quoted string for a short TXT value, or the provider's complete quoted, chunked
presentation for a long key. Enter the exact CNAME target when the sender asks for a CNAME.

```bash
export DOMAIN_SLUG="exampleca"
export DOMAIN_NAME="example.ca"
export DKIM_SELECTOR="mailer1"
read -r DKIM_CONTENT
```

Confirm that the selector name and `_dmarc` do not already have a record set. Query the actual
authoritative name servers from `zcp dns show <domain-slug>`. Require a successful authoritative
answer from both. A timeout, `SERVFAIL`, or `REFUSED` response is not permission to create a record.

```bash
for ns in ns1.zsoftly.ca ns2.zsoftly.ca; do
  dig TXT "$DKIM_SELECTOR._domainkey.$DOMAIN_NAME" "@$ns" +norecurse +noall +comments +answer
  dig CNAME "$DKIM_SELECTOR._domainkey.$DOMAIN_NAME" "@$ns" +norecurse +noall +comments +answer
  dig TXT "_dmarc.$DOMAIN_NAME" "@$ns" +norecurse +noall +comments +answer
done
```

Replace the illustrative `ns1.zsoftly.ca` and `ns2.zsoftly.ca` values with the authoritative servers
listed for your zone. If any answer section contains a record, stop and review its existing owner.

Create the DKIM `TXT` record only when the sender issued a TXT value. ZCP appends the zone to the
relative name, so use `mailer1._domainkey`, not the complete domain name.

```bash
zcp dns record-create \
  --domain "$DOMAIN_SLUG" \
  --name "$DKIM_SELECTOR._domainkey" \
  --type TXT \
  --content "$DKIM_CONTENT" \
  --ttl 3600
```

If the sending system issued a CNAME instead, create a CNAME with its exact target and do not also
create the TXT record.

```bash
zcp dns record-create \
  --domain "$DOMAIN_SLUG" \
  --name "$DKIM_SELECTOR._domainkey" \
  --type CNAME \
  --content "<provider-issued-target>." \
  --ttl 3600
```

Create DMARC in monitoring mode first. The reporting mailbox must exist and its owner must review
the reports.

```bash
zcp dns record-create \
  --domain "$DOMAIN_SLUG" \
  --name _dmarc \
  --type TXT \
  --content '"v=DMARC1; p=none; rua=mailto:dmarc-reports@example.ca"' \
  --ttl 3600
```

If, and only if, authoritative queries confirm there is no root `TXT` record set, you can publish
the one complete SPF policy that all authorized senders provide. Enter its complete DNS presentation
when prompted. Do not use `v=spf1 -all` for an active sending domain unless no system is authorized
to send with it.

```bash
dig TXT "$DOMAIN_NAME" @ns1.zsoftly.ca +norecurse +noall +comments +answer
dig TXT "$DOMAIN_NAME" @ns2.zsoftly.ca +norecurse +noall +comments +answer
read -r SPF_CONTENT

zcp dns record-create \
  --domain "$DOMAIN_SLUG" \
  --name @ \
  --type TXT \
  --content "$SPF_CONTENT" \
  --ttl 3600
```

`TXT` data must reach DNS as quoted character strings. A sender's setup page can display an unquoted
value for copy and paste. In that case, obtain its DNS presentation before you create the record. A
single string needs surrounding quotes. A long value can need quoted chunks of no more than 255
bytes, which resolvers concatenate as one TXT value. Keep provider-issued chunks intact. Do not
split a public key into separate DNS records, and do not invent a key. Verify the published answer
against the sender's instructions before enabling signing.

## Publish DKIM and DMARC with Terraform or OpenTofu

Use this path only when infrastructure as code owns the dedicated records. Set the token in your
shell. Do not put it in `main.tf` or commit it.

```bash
export ZCP_BEARER_TOKEN="<your-token>"
```

Create `main.tf`. This configuration refers to an existing zone by its slug. It deliberately does
not declare the zone itself, so an apply cannot replace it.

```hcl
terraform {
  required_providers {
    zcp = {
      source  = "zsoftly/zcp"
      version = "~> 0.2.0"
    }
  }
}

variable "domain_slug" {
  type = string
}

variable "dkim_selector" {
  type = string
}

variable "dkim_txt_content" {
  type = string
}

provider "zcp" {}

resource "zcp_dns_record" "dkim" {
  domain  = var.domain_slug
  name    = "${var.dkim_selector}._domainkey"
  type    = "TXT"
  content = var.dkim_txt_content
  ttl     = 3600

  lifecycle {
    prevent_destroy = true
  }
}

resource "zcp_dns_record" "dmarc" {
  domain  = var.domain_slug
  name    = "_dmarc"
  type    = "TXT"
  content = "\"v=DMARC1; p=none; rua=mailto:dmarc-reports@example.ca\""
  ttl     = 3600

  lifecycle {
    prevent_destroy = true
  }
}
```

If the root `TXT` record set is absent, you can add this third resource after you have validated the
complete policy from every authorized sender. Do not add it to a configuration for a root `TXT` set
that already exists.

```hcl
variable "spf_txt_content" {
  type = string
}

resource "zcp_dns_record" "spf" {
  domain  = var.domain_slug
  name    = "@"
  type    = "TXT"
  content = var.spf_txt_content
  ttl     = 3600

  lifecycle {
    prevent_destroy = true
  }
}
```

If the sender issued a CNAME selector, replace both the `dkim_txt_content` variable and the
`zcp_dns_record.dkim` resource above with the following variable and resource. Do not declare both
DKIM resources at the same selector name.

```hcl
variable "dkim_cname_target" {
  type = string
}

resource "zcp_dns_record" "dkim_cname" {
  domain  = var.domain_slug
  name    = "${var.dkim_selector}._domainkey"
  type    = "CNAME"
  content = var.dkim_cname_target
  ttl     = 3600

  lifecycle {
    prevent_destroy = true
  }
}
```

Set `dkim_cname_target` to the complete provider-issued hostname with a trailing dot, for example
`selector.provider.example.ca.`. A target without the final dot can be treated as relative to your
zone.

Store the variable values with your DNS configuration. A DKIM TXT value contains public key
material. A DKIM CNAME value contains a provider-issued DNS target. Keep the bearer token in the
environment and out of source control.

```bash
terraform init
terraform plan -var='domain_slug=exampleca' -var='dkim_selector=mailer1'
terraform apply -var='domain_slug=exampleca' -var='dkim_selector=mailer1'
```

OpenTofu uses the same configuration and subcommands with `tofu` in place of `terraform`. Read the
plan before approval. A `zcp_dns_record` represents the full record set identified by `domain`,
`name`, and `type`. Its content is write-only, so the provider does not detect out-of-band content
changes. A change in the configuration forces replacement. The `prevent_destroy` guard blocks a
planned destroy while its resource block remains in the configuration. Removing the resource block
also removes the guard, so it is not a rollback method. Read every plan. Remove the guard only for
an approved maintenance change after you have reviewed the replacement and rollback plan.

:::caution

Do not use `create_before_destroy` for a DNS record set. The same name and type identify the full
set, and deleting the old resource can remove the new data. Do not add a `zcp_dns_record` for a live
root SPF record or an existing multi-value `TXT` set. The provider's scalar `content` field does not
provide a safe way to merge values managed elsewhere.

:::

To bring an existing zone or dedicated record set under Terraform, first write the matching resource
block. The supported import forms are:

```bash
terraform import zcp_dns_domain.existing exampleca
terraform import zcp_dns_record.dkim exampleca/TXT/mailer1._domainkey
```

The record import format is `<domain-slug>/<type>/<relative-name>`. The provider cannot read record
content back in a comparable form, so import seeds identity only. Run `terraform plan` after import
and do not approve a replacement of a live record set until you have confirmed the full planned
value and rollback plan.

## Verify DNS and Delivered Mail

First query both authoritative servers. Get their names from `zcp dns show <domain-slug>` for your
zone. The names below are illustrative. Then query a public recursive resolver after delegation and
caches have refreshed.

```bash
for ns in ns1.zsoftly.ca ns2.zsoftly.ca; do
  dig TXT mailer1._domainkey.example.ca "@$ns" +short
  dig TXT _dmarc.example.ca "@$ns" +short
done

dig TXT mailer1._domainkey.example.ca @1.1.1.1 +short
dig TXT _dmarc.example.ca @1.1.1.1 +short
```

For a CNAME-based selector, replace the first `TXT` query with `CNAME`. Compare the answer with the
exact instructions from the sending system. A successful DNS lookup does not prove that the sender
is signing messages, so this is only the first check.

Send a message from every legitimate source to a test mailbox you control. Review the received
message headers from a trusted receiver. Its `Authentication-Results` header should show the
authentication results for the message. Confirm the visible From domain aligns with a passing SPF or
DKIM result. Test replies, application notices, forwarded mail, and any sending path that uses a
different envelope sender or selector.

## Move DMARC from Monitoring to Enforcement

Start with `p=none` and collect reports. Reconcile each report source against your sender inventory.
Fix missing DKIM signing, missing SPF authorization, or domain alignment before changing policy.

When the reports and delivery tests show that legitimate traffic authenticates correctly, move to
`p=quarantine`. Continue review during the change. Move to `p=reject` only when the remaining
failures are understood and accepted. Signed messages can be forwarded or changed by intermediary
systems, so include those paths in your review before tightening the policy.

Use the same management path that owns `_dmarc` to make each change. With the CLI, record the prior
record content before the approved maintenance change, then restore that exact content if delivery
testing fails. With Terraform or OpenTofu, keep the prior reviewed configuration and use a reviewed
plan to return to it. Do not run a broad `destroy` for DNS changes.

## Keep DNS in an Email Security Program

Review DMARC reports, sender inventory, DNS changes, and test evidence on a regular schedule. Give
new systems a sender review before they use your domain. Remove retired senders from SPF and retire
unused DKIM selectors and signing configuration after mail queues and verification needs are clear.

DNS does not replace controls outside DNS:

- Require multi-factor authentication for administrator and DNS access.
- Apply least privilege and review recovery access, forwarding, delegation, and offboarding.
- Tune inbound filtering and impersonation controls, then review quarantine results and narrow
  exceptions.
- Review external group membership and data-sharing settings.
- Treat message encryption certificates and AI-connected mail features as separate decisions about
  recipients, key recovery, data access, and cost.

For the policy and ownership decisions behind this technical work, read
[Email Security Needs an Owner](https://zcp.zsoftly.ca/blog/email-security-needs-an-owner).

## Next Steps

- [Host a Domain on ZCP (CLI)](/tutorials/host-dns-on-zcp-cli/) for zone creation and delegation.
- [Manage DNS with the CLI](/public-cloud/dns/cli) for supported DNS commands.
- [TXT Records](/public-cloud/dns/records/txt) for quoting and direct lookup examples.
- [DNS Troubleshooting](/public-cloud/dns/troubleshooting) for authoritative and recursive DNS
  checks.
