---
title: Domains
description:
  Register, transfer, and manage DNS domains in the ZSoftly Cloud Platform, including how to point
  popular registrars at ZSoftly's name servers.
---

Manage authoritative DNS for your domains directly in ZCP. Add a domain, point your registrar at
ZSoftly's name servers, and manage all your records from one console.

## Overview

The **DNS** section lets you host your domain's DNS zone on ZSoftly infrastructure. Once a domain is
added and your registrar is pointed at ZSoftly's name servers, ZCP becomes the authoritative DNS
provider for that domain.

Typical workflow:

1. **Add your domain** to ZCP (for example, `example.com`).
2. **Update name servers** at your domain registrar to point to ZSoftly.
3. **Add DNS records** (A, AAAA, CNAME, MX, TXT, etc.) to route traffic.
4. **Verify propagation** and you're live.

## Add a domain

1. Navigate to **DNS → Domains** in the ZCP console.
2. Click **Add Domain**.
3. Enter your domain name (for example, `example.com`) and confirm.
4. ZCP creates the DNS zone and shows the **name servers** you must configure at your registrar.

## ZSoftly name servers

After adding a domain, ZCP assigns **two authoritative name servers**. Point your domain's name
server (NS) settings at these values from your registrar's control panel:

| Name server | Value            |
| ----------- | ---------------- |
| Primary     | `ns1.zsoftly.ca` |
| Secondary   | `ns2.zsoftly.ca` |

:::note The exact name server hostnames are also shown in the ZCP console when you add your domain.
If the console displays different values, always use the ones shown there. :::

## Update name servers at your registrar

To make ZSoftly authoritative for your domain, replace the name servers at the registrar where you
**purchased** the domain with both ZSoftly values. The general process is the same everywhere:

1. Sign in to your domain registrar.
2. Find the **Nameservers** (or **DNS** / **Name server**) settings for your domain.
3. Switch from the default/registrar-managed name servers to **custom name servers**.
4. Enter both ZSoftly name servers (primary and secondary) exactly as shown in the ZCP console.
5. Remove any leftover name servers so only the two ZSoftly values remain.
6. Save your changes.

:::caution Name server changes can take up to **24–48 hours** to propagate globally, though they
often complete much sooner. During propagation, visitors may be served by either the old or new DNS.
Add your DNS records in ZCP _before_ switching name servers to avoid downtime. :::

### Registrar quick reference

Find your registrar below and follow its official guide. Steps and menu names change over time, so
the vendor's own documentation is always the source of truth.

| Registrar                                         | Official guide for changing name servers                                                                                                             |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GoDaddy**                                       | [Change my domain nameservers](https://www.godaddy.com/help/change-my-domain-nameservers-664)                                                        |
| **Namecheap**                                     | [How to change DNS for a domain](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)                |
| **Squarespace Domains** (formerly Google Domains) | [Making changes to nameservers](https://support.squarespace.com/hc/en-us/articles/4404183898125-Making-changes-to-nameservers)                       |
| **Amazon Route 53**                               | [Adding or changing name servers and glue records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-name-servers-glue-records.html)  |
| **IONOS**                                         | [Using your own name servers for a domain](https://www.ionos.com/help/domains/using-your-own-name-servers/using-your-own-name-servers-for-a-domain/) |
| **Name.com**                                      | [Changing nameservers for DNS management](https://www.name.com/support/articles/205934547-changing-nameservers-for-dns-management)                   |
| **Hover**                                         | [Changing your domain nameservers](https://support.hover.com/support/solutions/articles/201000064742-changing-your-domain-nameservers)               |
| **Porkbun**                                       | [How to change nameservers](https://kb.porkbun.com/article/22-how-to-change-nameservers)                                                             |
| **Bluehost**                                      | [How to change your Bluehost nameservers](https://www.bluehost.com/help/article/custom-nameservers)                                                  |
| **HostGator**                                     | [Change name servers with other registrars](https://www.hostgator.com/help/article/how-do-i-change-my-dns-or-name-servers)                           |
| **Cloudflare Registrar**                          | See the [Cloudflare exception](#cloudflare-exception) below — direct name server changes are **not** supported.                                      |

### Example: GoDaddy

1. Sign in to your [GoDaddy Domain Portfolio](https://dcc.godaddy.com/control/portfolio).
2. Select your domain, then choose **Domain Edit Options → Edit Nameservers** (or the **⋯** menu →
   **Edit Nameservers**).
3. Choose **I'll use my own nameservers** (Enter my own nameservers).
4. Replace the existing values with the two ZSoftly name servers from the ZCP console.
5. Click **Save**.

### Example: Namecheap

1. Sign in to Namecheap and open **Domain List** in the left sidebar.
2. Click **Manage** next to your domain.
3. In the **Nameservers** section, select **Custom DNS** from the drop-down.
4. Enter both ZSoftly name servers in the fields provided.
5. Click the green **✓ (checkmark)** to save.

:::tip Most registrars use the same pattern: find **Nameservers**, switch to **Custom DNS**, and
enter the two ZSoftly values. If you can't find the setting, search the registrar's help center for
_"change nameservers"_. :::

## Cloudflare exception

**Cloudflare Registrar does not allow you to point your domain at third-party name servers like
ZSoftly's.** Per Cloudflare's [Registrar FAQ](https://developers.cloudflare.com/registrar/faq/), a
domain registered with Cloudflare _must_ use the Cloudflare-assigned name servers — there is no
field to enter custom name servers, and Cloudflare warns you of this at the time of purchase.

If your domain is registered with **Cloudflare Registrar**, choose one of these two paths instead:

**Option A — Recreate the records in Cloudflare (keep the domain at Cloudflare).** Leave the domain
on Cloudflare's name servers and, in the Cloudflare dashboard, manually create DNS records that
point to your ZSoftly resources (for example, an `A` record to your ZCP instance's public IP). In
this setup Cloudflare stays authoritative and you manage records in Cloudflare rather than in ZCP.
Use the
[Cloudflare DNS records guide](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/).

**Option B — Transfer the domain to a registrar that allows custom name servers.** Transfer the
domain out of Cloudflare to a registrar such as GoDaddy, Namecheap, or Porkbun, then follow the
[registrar quick reference](#registrar-quick-reference) to point its name servers at ZSoftly. See
Cloudflare's
[transfer-out guide](https://developers.cloudflare.com/registrar/account-options/transfer-out-from-cloudflare/).
Note that registrar transfers can take several days and the domain must be unlocked with a valid
transfer (EPP/auth) code.

:::note This restriction applies only when Cloudflare is your **registrar**. If your domain is
registered elsewhere and merely _uses_ Cloudflare's name servers, just change the name servers back
at the actual registrar using the guides above. :::

## Verify propagation

After saving, confirm the world sees ZSoftly as authoritative for your domain.

From a terminal:

```bash
# Query your domain's name servers
dig NS example.com +short

# Or on Windows
nslookup -type=ns example.com
```

You should see the ZSoftly name servers in the response. You can also check global propagation with
an online tool such as [whatsmydns.net](https://www.whatsmydns.net/) (select the **NS** record
type).

:::caution If the old name servers still appear after 48 hours, double-check that you saved **both**
ZSoftly values, removed any stale entries, and that the domain isn't locked or expired at the
registrar. :::

## Next steps

- [Manage DNS records](./records) — add and edit A, CNAME, MX, TXT, and other records once ZSoftly
  is authoritative.
