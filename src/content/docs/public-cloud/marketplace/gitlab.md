---
title: GitLab CE 18.11
---

GitLab Community Edition is a complete DevOps platform delivered as a single application. It
provides Git repository hosting, CI/CD pipelines, issue tracking, container registry, and more — all
self-hosted on your own infrastructure.

## Software included

| Component | Version   |
| --------- | --------- |
| GitLab CE | 18.11.x   |
| Ubuntu    | 24.04 LTS |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script runs automatically. It configures the external URL and runs
`gitlab-ctl reconfigure` to initialise all GitLab services. This takes **3–5 minutes**.

Track progress:

```bash
journalctl -u gitlab-first-boot.service -f
```

The MOTD on login will confirm when GitLab is ready.

### 3. Retrieve the initial root password

```bash
sudo cat /etc/gitlab/initial_root_password
```

:::caution

This file is automatically deleted 24 hours after first boot. Log in and change the root password
before it expires.

:::

### 4. Access the GitLab UI

Open a browser and navigate to your VM's IP or hostname:

```text
http://<your-vm-ip>
```

Log in with:

| Field    | Value                                    |
| -------- | ---------------------------------------- |
| Username | `root`                                   |
| Password | From `/etc/gitlab/initial_root_password` |

Change your password immediately after first login.

## Optional: set a custom external URL

If GitLab will be served at a domain name, provide the URL at deploy time using cloud-init userdata.
Without it, GitLab defaults to `http://<hostname>`.

Add this to your VM's userdata at deploy time:

```yaml
#cloud-config
write_files:
  - path: /run/gitlab-external-url
    content: 'https://gitlab.example.com'
    permissions: '0600'
    owner: root:root
```

To change the URL after deployment, edit `/etc/gitlab/gitlab.rb`:

```ruby
external_url 'https://gitlab.example.com'
```

Then run:

```bash
sudo gitlab-ctl reconfigure
```

## Managing GitLab

```bash
# Check all service statuses
sudo gitlab-ctl status

# Restart all services
sudo gitlab-ctl restart

# View logs (all services)
sudo gitlab-ctl tail

# View logs for a specific service
sudo gitlab-ctl tail nginx
sudo gitlab-ctl tail puma
```

Configuration file: `/etc/gitlab/gitlab.rb`

After editing `gitlab.rb`, always run `sudo gitlab-ctl reconfigure` to apply changes.

## Security

Port 80 is open by default. UFW is enabled.

**To enable HTTPS with Let's Encrypt**, edit `/etc/gitlab/gitlab.rb`:

```ruby
external_url 'https://gitlab.example.com'
letsencrypt['enable'] = true
letsencrypt['contact_emails'] = ['admin@example.com']
```

Then run:

```bash
sudo gitlab-ctl reconfigure
```

:::tip

Restrict SSH Git access (port 22) to known IP ranges if your GitLab is not intended to be public.
Create individual user accounts — avoid sharing the root account.

:::

## Next steps

- [GitLab CE documentation](https://docs.gitlab.com/ee/)
- [GitLab administration guide](https://docs.gitlab.com/ee/administration/)
- [CI/CD pipeline reference](https://docs.gitlab.com/ee/ci/)
