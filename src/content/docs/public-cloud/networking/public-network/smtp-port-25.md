---
title: SMTP Port 25
description:
  Outbound SMTP (port 25) is blocked by default on compute instances to protect sender reputation.
  Learn what is blocked and how to request an exception.
sidebar_position: 5
---

Outbound TCP port 25 is blocked by default on every compute instance to protect platform-wide email
sender reputation. Spam or a compromised instance that sends mail directly over port 25 can damage
the reputation of a shared IP range and affect other customers on that range. Most major cloud
providers apply the same default.

## Port 25 access

| Traffic                  | State              |
| ------------------------ | ------------------ |
| Outbound TCP 25 (IPv4)   | Blocked by default |
| Outbound TCP 25 (IPv6)   | Blocked by default |
| Outbound TCP 465 and 587 | Open               |
| Inbound TCP 25           | Open               |

## Sending email from your instance

Send outgoing mail through an authenticated SMTP relay or transactional email provider on port 587
or 465 instead of port 25. Both ports are open by default. A relay also handles delivery retries,
bounce management, and sender reputation.

## Request port 25 to be opened

We review port 25 requests from verified customers who operate a production mail server. Each
request is reviewed for its use case and sending history.

### How to request

- Primary: open a support request from the cloud console.
- Secondary: email the [support team](mailto:support@zsoftly.ca).

Include the following in your request:

- Your account name.
- The public IPs for which you request access.
- A short description of your mail use case and expected volume.
- Confirmation that SPF and DKIM are configured for the sending domain.
- The reverse DNS (PTR) hostname you want for each IP.

:::note

We set the PTR record for each approved IP. Most receiving mail servers expect a valid PTR record
that resolves to your sending domain.

:::

See also: [Public IPs](/public-cloud/networking/public-network/public-ips),
[Egress Rules](/public-cloud/networking/public-network/egress-rules)
