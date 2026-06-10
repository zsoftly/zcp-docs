---
title: cPanel
---

# cPanel

cPanel is the industry-standard web hosting control panel used by hosting providers and website
owners worldwide. It provides a graphical interface for managing websites, email accounts,
databases, DNS, FTP, and more. WHM (Web Host Manager) is the server-level administration interface
that sits above cPanel.

## Software included

| Component    | Version                      |
| ------------ | ---------------------------- |
| cPanel & WHM | Latest stable (release tier) |
| Ubuntu       | 24.04 LTS                    |

## Getting started

### 1. Connect to WHM

cPanel licenses are IP-based and are activated when you access WHM for the first time from the VM's
public IP. Open a browser and navigate to:

```text
https://<your-vm-ip>:2087
```

Log in with:

| Field    | Value                   |
| -------- | ----------------------- |
| Username | `root`                  |
| Password | Your VM's root password |

> If you do not know your root password, reset it from the ZCP control panel under **Instances →
> Reset Password**.

### 2. Complete the WHM setup wizard

The WHM setup wizard runs on first login. It will prompt you to:

1. Accept the license agreement
2. Enter a contact email address
3. Configure nameservers
4. Set up IP addresses and networking
5. Choose default packages

Work through the wizard before creating any hosting accounts.

### 3. Create your first cPanel account

In WHM, go to **Account Functions → Create a New Account** to set up a hosting account. Each account
gets its own cPanel interface accessible at:

```text
https://<your-vm-ip>:2083
```

## Port reference

| Interface     | Port     | Protocol |
| ------------- | -------- | -------- |
| WHM (admin)   | 2087     | HTTPS    |
| WHM (admin)   | 2086     | HTTP     |
| cPanel (user) | 2083     | HTTPS    |
| cPanel (user) | 2082     | HTTP     |
| Webmail       | 2096     | HTTPS    |
| FTP           | 21       | FTP      |
| HTTP          | 80       | HTTP     |
| HTTPS         | 443      | HTTPS    |
| SSH           | 22       | SSH      |
| SMTP          | 25, 587  | SMTP     |
| IMAP          | 143, 993 | IMAP     |
| POP3          | 110, 995 | POP3     |

## Managing cPanel & WHM

cPanel and WHM manage their own services internally. Use WHM for all server-level changes. The
`cpanel` command suite is available from SSH:

```bash
# Check cPanel service status
sudo /usr/local/cpanel/scripts/check_cpanel_rpms --fix

# Restart cPanel services
sudo /scripts/restartsrv_cpsrvd

# View the cPanel error log
sudo tail -f /usr/local/cpanel/logs/error_log
```

## Security

cPanel manages its own firewall (CSF/LFD) independently of UFW. UFW is disabled in favour of
cPanel's firewall management during installation.

> Change the root password immediately and set up two-factor authentication in WHM. Restrict WHM
> access to your office IP if possible.

## Next steps

- [cPanel documentation](https://docs.cpanel.net/)
- [WHM administration guide](https://docs.cpanel.net/whm/)
- [cPanel security advisor](https://docs.cpanel.net/whm/security-center/security-advisor/)
