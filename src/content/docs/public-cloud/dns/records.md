---
title: DNS Records
sidebar_position: 2
---

DNS records connect your domain to specific services. To create a record, click **Create Record** in
your domain's dashboard.

### Record Types

**A Record**: maps a domain to an IPv4 address.

```text
@ A 192.0.2.1 14400
```

**AAAA Record**: maps a domain to an IPv6 address.

```text
@ AAAA 2001:0db8:85a3::8a2e:0370:7334 14400
```

**CNAME Record**: creates an alias pointing to another domain.

```text
blog CNAME example.com. 14400
```

**MX Record**: directs email to a mail server.

```text
@ MX 10 mail.example.com. 14400
```

**TXT Record**: stores text data (SPF, DKIM, domain verification).

```text
@ TXT "v=spf1 mx -all" 14400
```

**NS Record**: designates authoritative name servers.

```text
@ NS ns1.example.com. 14400
```

**SRV Record**: locates a specific service.

```text
_sip._tcp SRV 10 60 5060 sipserver.example.com. 14400
```

Use `@` for the root domain or enter a hostname for subdomains (e.g., `www`, `blog`).

See also: [Domains](/public-cloud/dns/domains)
