---
title: Technitium DNS Server
---

Technitium DNS Server is an open-source DNS server with a web administration console. It can run as
an authoritative DNS server, recursive resolver, forwarding resolver, and DNS management platform
from a ZCP instance.

## Software included

| Component             | Version   |
| --------------------- | --------- |
| Technitium DNS Server | 15.4.0    |
| Ubuntu                | 24.04 LTS |

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 1 GB    | 2 GB        |
| Storage  | 10 GB   | 20 GB       |

## Environment variables

If deployment variable fields are available in your launch flow, use them there. Otherwise, provide
the same values through user data that writes `/etc/zmi/deploy.env`, or configure them after first
boot. Leave the admin password blank to generate a secure random password.

| Variable                                 | Description                                                      |
| ---------------------------------------- | ---------------------------------------------------------------- |
| `DNS_SERVER_ADMIN_PASSWORD`              | Admin password for the `admin` web console user                  |
| `DNS_SERVER_DOMAIN`                      | Primary domain name used by the DNS server                       |
| `DNS_SERVER_WEB_SERVICE_LOCAL_ADDRESSES` | Admin UI listen addresses. Defaults to `0.0.0.0,[::]`            |
| `DNS_SERVER_RECURSION`                   | Recursion policy. Defaults to `AllowOnlyForPrivateNetworks`      |
| `DNS_SERVER_RECURSION_NETWORK_ACL`       | ACL used when recursion is `UseSpecifiedNetworkACL`              |
| `DNS_SERVER_FORWARDERS`                  | Comma-separated upstream resolvers, such as `1.1.1.1,9.9.9.9`    |
| `DNS_SERVER_FORWARDER_PROTOCOL`          | Forwarder protocol: `Udp`, `Tcp`, `Tls`, `Https`, or `HttpsJson` |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On first boot, the setup service configures Technitium, starts `dns.service`, and writes credentials
to a root-only file. Track progress:

```bash
sudo journalctl -u technitium-first-boot.service -f
```

### 3. Retrieve credentials

```bash
sudo cat /etc/dns/credentials.txt
```

The file contains the admin UI URL, username, password, DNS server domain, recursion mode, and
forwarder settings.

### 4. Access the admin UI

Open:

```text
http://<your-vm-ip>:5380/
```

Log in with username `admin` and the password from `/etc/dns/credentials.txt`.

### 5. Test DNS

From the VM:

```bash
dig @127.0.0.1 example.com
```

From another trusted host:

```bash
dig @<your-vm-ip> example.com
```

## Managing Technitium

```bash
# Check service status
systemctl status dns.service

# Restart
sudo systemctl restart dns.service

# View logs
sudo journalctl -u dns.service -f
```

Common paths:

| Path                                                     | Purpose                           |
| -------------------------------------------------------- | --------------------------------- |
| `/opt/technitium/dns/`                                   | Technitium application files      |
| `/etc/dns/`                                              | Configuration and ZMI credentials |
| `/etc/default/technitium-dns`                            | First-boot generated environment  |
| `/etc/systemd/system/dns.service.d/zmi-environment.conf` | Systemd environment drop-in       |

## Ports

Open by default:

| Port | Protocol | Purpose                |
| ---- | -------- | ---------------------- |
| 22   | TCP      | SSH                    |
| 53   | TCP/UDP  | DNS                    |
| 5380 | TCP      | Admin web console HTTP |

Optional ports:

| Port  | Protocol | Purpose                               |
| ----- | -------- | ------------------------------------- |
| 53443 | TCP      | Admin web console HTTPS               |
| 853   | TCP      | DNS-over-TLS                          |
| 853   | UDP      | DNS-over-QUIC                         |
| 443   | TCP/UDP  | DNS-over-HTTPS and HTTP/3             |
| 80    | TCP      | DNS-over-HTTP, reverse proxy, or ACME |
| 67    | UDP      | DHCP service                          |

Open optional ports only when you enable the matching feature.

## Security

Avoid running an open public recursive resolver. Keep the default `AllowOnlyForPrivateNetworks`
recursion policy or configure a specific trusted recursion ACL. Restrict the admin console to
trusted administrators.

## Next steps

- [Technitium DNS Server](https://technitium.com/dns/)
- [Technitium DNS Server GitHub](https://github.com/TechnitiumSoftware/DnsServer)
- [Technitium API documentation](https://github.com/TechnitiumSoftware/DnsServer/blob/master/APIDOCS.md)
