---
title: Domains
sidebar_position: 1
---

## DNS Domains

The Domain Name System (DNS) translates human-readable domain names into IP addresses.

### Add a Domain

- From the left-hand menu, click **DNS**.
- Click the **+** icon.
- Choose the **Project** and enter your domain name.
- Click **Add Domain**.

:::note Screenshot pending. Will be updated once the ZSoftly portal is confirmed stable. :::

### Point your domain to ZSoftly

Once your domain is added, log in to your domain registrar and update the nameservers to:

```
ns1.zsoftly.ca
ns2.zsoftly.ca
```

DNS propagation typically takes a few minutes up to 48 hours depending on your registrar and
previous TTL settings.

See also: [DNS Records](./records)
