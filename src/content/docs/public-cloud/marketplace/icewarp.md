---
title: IceWarp
---

IceWarp is a business collaboration platform for email, WebClient, TeamChat, video conferencing,
file sharing, and document collaboration. The ZCP image runs IceWarp Server with its supporting
database and cache services on Ubuntu 24.04.

## Software included

| Component             | Version       |
| --------------------- | ------------- |
| IceWarp Server        | 14.3.0.9      |
| IceWarp container     | 14.3.0.9      |
| MariaDB               | 10.6          |
| Redis                 | 7 Alpine      |
| Docker                | Latest stable |
| Docker Compose plugin | Latest stable |
| Ubuntu                | 24.04 LTS     |

The image runs the pinned container image `icewarptechnology/icewarp-server:14.3.0.9`.

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 80 GB   | 200 GB+     |

IceWarp is stateful. Mailboxes, calendars, uploaded files, MariaDB data, Redis data, logs, cache,
configuration, and collaboration state can grow over time.

## Environment variables

Set these values during marketplace deployment to configure the first boot. Leave password fields
blank to have secure random values generated where supported.

| Variable                       | Description                                                     |
| ------------------------------ | --------------------------------------------------------------- |
| `ICEWARP_PUBLIC_HOSTNAME`      | Public hostname for WebClient/Admin, such as `mail.example.com` |
| `ICEWARP_DOMAIN`               | Primary mail domain, such as `example.com`                      |
| `ICEWARP_ADMIN_USER`           | Initial IceWarp admin username. Defaults to `admin`             |
| `ICEWARP_ADMIN_PASS`           | Initial IceWarp admin password                                  |
| `ICEWARP_ADMIN_PASSWORD`       | Compatibility alias for `ICEWARP_ADMIN_PASS`                    |
| `ICEWARP_LICENSE`              | IceWarp license key, or blank if using the trial flow           |
| `ICEWARP_GENERATE_LETSENCRYPT` | `0` or `1`; enable only after DNS points to the VM              |
| `ICEWARP_USE_HTTPS`            | `0` or `1`; enables HTTPS service behavior                      |
| `MARIADB_ROOT_PASSWORD`        | Internal MariaDB root password                                  |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On first boot, IceWarp reads `/etc/zmi/deploy.env`, starts the Docker Compose stack, configures the
domain and admin account, and writes credentials to a root-only file. Track progress:

```bash
sudo journalctl -u icewarp-first-boot.service -f
```

### 3. Retrieve credentials

```bash
sudo cat /etc/icewarp/credentials.txt
```

### 4. Open IceWarp

Open the WebClient or admin interface:

```text
http://<your-vm-ip>/
http://<your-vm-ip>/admin/
```

If `ICEWARP_USE_HTTPS=1`, use `https://` instead.

## Managing IceWarp

IceWarp runs as a Docker Compose stack in `/opt/icewarp`.

```bash
# Check status
cd /opt/icewarp && sudo docker compose ps

# Restart
cd /opt/icewarp && sudo docker compose restart

# View logs
cd /opt/icewarp && sudo docker compose logs -f
```

Important paths:

| Path                              | Purpose                         |
| --------------------------------- | ------------------------------- |
| `/opt/icewarp/docker-compose.yml` | Compose stack                   |
| `/opt/icewarp/.env`               | Root-only runtime secrets       |
| `/etc/icewarp/credentials.txt`    | Root-only generated credentials |
| `/etc/icewarp/info.txt`           | Setup and operation notes       |
| `/data/icewarp`                   | Preferred persistent app data   |
| `/var/lib/icewarp`                | Fallback persistent app data    |

## Ports

The VM firewall allows common IceWarp service ports. Expose only the ports you need at the ZCP
network or port-forward layer.

| Port        | Protocol | Purpose                |
| ----------- | -------- | ---------------------- |
| 22          | TCP      | SSH                    |
| 80          | TCP      | HTTP WebClient/Admin   |
| 443         | TCP      | HTTPS WebClient/Admin  |
| 25          | TCP      | SMTP                   |
| 465         | TCP      | SMTPS                  |
| 587         | TCP      | SMTP submission        |
| 110         | TCP      | POP3                   |
| 995         | TCP      | POP3S                  |
| 143         | TCP      | IMAP                   |
| 993         | TCP      | IMAPS                  |
| 5222, 5223  | TCP      | XMPP client access     |
| 5269        | TCP      | XMPP server federation |
| 5060        | TCP/UDP  | SIP                    |
| 5061        | UDP      | SIP TLS                |
| 10000-10010 | UDP      | Media/RTP range        |

## DNS and licensing

Production mail and collaboration use requires DNS planning:

- `A` or `AAAA` record for the public hostname
- `MX` record for the mail domain
- SPF, DKIM, and DMARC records
- PTR/rDNS for the sending IP
- TLS certificate after DNS points to the VM

Port 25 may be restricted by the cloud provider or upstream network policy. If outbound mail is
blocked, use an approved relay or request the required policy exception through your provider.

IceWarp requires a valid license or successful trial activation. If trial activation is unavailable,
provide a valid `ICEWARP_LICENSE` during deployment and retry on a fresh VM.

## Security

Change generated credentials after first login and do not reuse them across VMs. For production,
serve IceWarp through a DNS name with TLS and expose only the mail and web ports you need.

## Next steps

- [IceWarp product site](https://www.icewarp.com/)
- [IceWarp Linux installation guide](https://support.icewarp.com/hc/en-us/articles/12868451777937-IceWarp-Installation-Guide-for-Linux)
- [IceWarp licensing help](https://support.icewarp.com/hc/en-us/categories/203155547-LICENSING)
