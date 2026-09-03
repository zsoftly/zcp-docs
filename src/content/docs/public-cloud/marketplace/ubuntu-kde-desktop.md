---
title: Ubuntu KDE Desktop
---

Ubuntu KDE provides an Ubuntu 24.04 desktop image with KDE Plasma and XRDP pre-installed for remote
desktop access. You can connect with a standard Remote Desktop Protocol client from Windows, macOS,
or Linux.

## Software included

| Component      | Version                |
| -------------- | ---------------------- |
| Ubuntu         | 24.04 LTS              |
| Desktop        | KDE Plasma             |
| Remote desktop | XRDP with Xorg backend |

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 30 GB       |

## Environment variables

If deployment variable fields are available in your launch flow, use them there. Otherwise, provide
the same values through user data that writes `/etc/zmi/deploy.env`, or configure them after first
boot to create or update the desktop login.

| Variable             | Description                            |
| -------------------- | -------------------------------------- |
| `UBUNTUKDE_USERNAME` | Desktop username. Defaults to `ubuntu` |
| `UBUNTUKDE_PASSWORD` | Desktop password. Generated if blank   |
| `DESKTOP_USERNAME`   | Generic alias for `UBUNTUKDE_USERNAME` |
| `DESKTOP_PASSWORD`   | Generic alias for `UBUNTUKDE_PASSWORD` |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On first boot, the setup service applies CloudStack metadata, regenerates SSH host keys, creates or
updates the desktop user, configures KDE Plasma as the XRDP session, and starts XRDP.

Track progress:

```bash
sudo journalctl -u ubuntukde-first-boot.service -f
```

### 3. Retrieve desktop credentials

```bash
sudo cat /etc/ubuntukde/credentials.env
```

The file is readable only by root.

### 4. Connect over RDP

Open your RDP client and connect to:

```text
<your-vm-ip>:3389
```

Use the configured desktop username and password.

## Managing Ubuntu KDE

```bash
# Check XRDP status
sudo systemctl status xrdp

# Restart XRDP
sudo systemctl restart xrdp

# View logs
sudo journalctl -u xrdp
sudo journalctl -u xrdp-sesman
```

Important files:

| File                                               | Purpose                       |
| -------------------------------------------------- | ----------------------------- |
| `/etc/zmi/deploy.env`                              | Optional deployment variables |
| `/etc/ubuntukde/info.txt`                          | Setup and operation notes     |
| `/etc/ubuntukde/credentials.env`                   | Desktop login credentials     |
| `/usr/local/bin/ubuntukde-first-boot.sh`           | First-boot script             |
| `/etc/systemd/system/ubuntukde-first-boot.service` | First-boot service            |

## Ports

| Port | Protocol | Purpose |
| ---- | -------- | ------- |
| 22   | TCP      | SSH     |
| 3389 | TCP      | RDP     |

## Security

Do not expose RDP broadly to the public internet. Restrict port 3389 to trusted IPs, use a VPN, or
use an SSH tunnel where possible. Change generated credentials after first login.

## Troubleshooting

If the RDP client cannot connect, confirm that the VM has a reachable public IP and that `3389/tcp`
is allowed by the ZCP firewall or security policy.

If login succeeds but the desktop does not appear, check the XRDP session logs:

```bash
sudo journalctl -u xrdp
sudo journalctl -u xrdp-sesman
cat ~/.xsession-errors
```

If the password is unknown, retrieve it as root:

```bash
sudo cat /etc/ubuntukde/credentials.env
```
