---
title: DNS Troubleshooting
description:
  Check DNS propagation, query ZSoftly's name servers directly, and fix the most common DNS record
  problems on ZCP.
---

Use these checks to confirm a DNS change and resolve common problems.

## Check a Record Before Propagation

A ZSoftly name server answers for your zone as soon as you save a record, even before the world sees
it. Query it directly to confirm the record is correct:

```bash
dig A www.example.com @ns1.zsoftly.ca +short
dig A www.example.com @ns2.zsoftly.ca +short
```

Both name servers should return the same answer. If the direct query is right but public resolvers
are wrong, the record is fine and you are waiting on propagation or a cached old value.

## Confirm Delegation

Public resolvers reach your ZCP records after you delegate the domain to ZSoftly. Confirm the public
response lists the ZSoftly name servers:

```bash
dig NS example.com +short
# ns1.zsoftly.ca.
# ns2.zsoftly.ca.
```

If this still shows the old name servers, the delegation has not propagated or was not saved at the
registrar. See [Domains](/public-cloud/dns/domains).

## Check Worldwide Propagation

Query several public resolvers in different regions. They should all agree:

```bash
for r in 1.1.1.1 8.8.8.8 9.9.9.9 208.67.222.222; do
  echo "$r:"; dig A www.example.com @$r +short
done
```

For a visual world map, use an online checker such as [whatsmydns.net](https://www.whatsmydns.net/)
and pick the record type.

## Common Problems

### The Change Has Not Shown Up

Resolvers cache records for the TTL. With the default `14400` (4 hours), a resolver holding the old
value waits up to four hours before refreshing it. Lower the TTL to `300` a day or two before a
planned change, then raise it again afterward.

### CNAME at the Root Does Not Work

A `CNAME` cannot sit at the apex (`@`) and cannot share a name with any other record. Use an `A` or
`AAAA` record for the root. See [CNAME records](/public-cloud/dns/records/cname).

### Fix MX Record Rejection

An `MX` record needs a **priority** in its own field. From the CLI, pass `--priority`. From the API,
send `priority` as a separate field. See [MX records](/public-cloud/dns/records/mx).

### TXT Record Looks Wrong

`TXT` content is a quoted string. On the CLI, wrap it so the shell passes the quotes through, for
example `'"v=spf1 -all"'`. See [TXT records](/public-cloud/dns/records/txt).

### SRV or LOC Record Fails

`SRV` and `LOC` records are not available yet. The other types (`A`, `AAAA`, `CNAME`, `MX`, `TXT`,
`CAA`, `NS`) work.

### NXDOMAIN Versus No Answer

`NXDOMAIN` means the name does not exist in the zone. An empty answer with `NOERROR` means the name
exists but has no record of the requested type. Check the requested name and type.

## Read the Zone as the Platform Sees It

`zcp dns show <slug>` prints the domain and every record it holds, including the `SOA` and `NS`
records ZCP manages. Compare it against what `dig` returns to find a missing or mistyped record.

```bash
zcp dns show examplecom
```

See also: [DNS Overview](/public-cloud/dns/overview), [Domains](/public-cloud/dns/domains),
[Worked examples](/public-cloud/dns/examples)
