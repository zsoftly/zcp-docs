---
title: OpenHands Agent Canvas
description:
  Deploy and operate the OpenHands Agent Canvas image on ZCP, connect customer-owned model providers
  and repositories, and recover workspace data after a reboot.
---

OpenHands Agent Canvas is a self-hosted coding-agent interface. Nginx serves the web interface over
HTTPS on port 443. Agent Canvas is published only on loopback. The container runs as an unprivileged
user. The image contains no model-provider, repository, or customer account credentials.

## Software Included

| Component              | Version     |
| ---------------------- | ----------- |
| OpenHands Agent Canvas | 1.38.0      |
| Ubuntu                 | 26.04.1 LTS |

## Requirements

| Resource | Minimum |
| -------- | ------- |
| vCPU     | 2       |
| Memory   | 4 GiB   |
| Storage  | 40 GiB  |

## First Login

First boot creates a per-VM HTTPS password, an OpenHands session API key, and a self-signed TLS
certificate. Connect through SSH and read the generated credentials:

```bash
sudo cat /etc/openhands/credentials.txt
```

Before accepting the browser certificate warning, retrieve its SHA-256 fingerprint through the same
trusted SSH connection:

```bash
sudo openssl x509 -in /etc/openhands/tls/fullchain.pem -noout -fingerprint -sha256
```

Open `https://<vm-public-ip>/canvas/`. Compare the browser certificate fingerprint with the value
from SSH, then sign in with the generated HTTPS credentials.

When Agent Canvas shows **Add a backend**, enter:

| Field     | Value                                                      |
| --------- | ---------------------------------------------------------- |
| Host Name | A friendly label for this VM                               |
| Type      | Local                                                      |
| Host      | `https://<vm-public-ip>`                                   |
| API Key   | The session API key from `credentials.txt`, not an LLM key |

Select **Next**. Choose a usage-data preference if prompted, select the OpenHands agent, then
continue to **Set up your LLM**. Add a provider, model, and credentials that you own.

Before starting a task, confirm that your provider credential grants access to the selected model
and has available quota. For paid providers, confirm that billing or credit is available. The image
includes no model usage credit.

:::caution

The bootstrap certificate expires after 30 days. Before production use, replace
`/etc/openhands/tls/fullchain.pem` and `/etc/openhands/tls/privkey.pem` with a trusted certificate
and key for the VM DNS name. Set their modes to `0644` and `0600`, then run
`sudo systemctl reload nginx`.

:::

## Connect a Repository

Do not put model-provider or repository credentials in cloud-init user data, the image, or support
tickets.

For a GitHub repository, open **Settings** > **Secrets**. Save your GitHub personal access token as
a custom secret named exactly `GITHUB_TOKEN`. Return to **Home**, choose **GitHub**, search for and
select the repository or enter its HTTPS URL, choose a branch, then launch the task.

This standalone image uses HTTPS and a personal access token for GitHub repository access. This
image does not provide cloud OAuth or a documented SSH private-key onboarding path. OpenHands
encrypts saved secrets with the per-VM `OH_SECRET_KEY` and stores them in its persistent application
data.

## Security and Isolation

The web interface is available only over HTTPS on port 443 and requires the generated HTTPS
credentials. The Agent Canvas backend also requires its session API key. Keep port 443 limited to
trusted source networks in the ZCP network ACL where possible.

Agent commands run in an unprivileged container without host networking, privileged mode, or a host
Docker socket. The image does not support nested Docker containers. Conversations share this runtime
trust boundary, so use a separate VM for untrusted repositories or prompts.

## Persistence and Recovery

Persistent application data and `/var/lib/openhands/projects` survive ordinary container and VM
restarts. This data includes encrypted repository credentials. Treat VM snapshots as
credential-bearing data.

After a reboot, inspect the service and logs:

```bash
sudo systemctl status openhands-first-boot.service --no-pager
sudo docker compose -f /opt/openhands/docker-compose.yml ps
sudo docker compose -f /opt/openhands/docker-compose.yml logs --tail=120
sudo nginx -t
```

Confirm the Agent Canvas interface responds and that existing conversations and projects remain.

Do not delete the OpenHands persistent volume, `/var/lib/openhands/projects`,
`/etc/openhands/runtime.env`, or `/etc/openhands/credentials.txt` while recovering a VM.

## Upgrades

Validate the target pinned container reference on a separate candidate first. For an existing VM,
stop it and take a consistent ZCP snapshot. Start the VM, then update only the pinned image
reference in `/opt/openhands/docker-compose.yml`. Pull and start that exact image:

```bash
sudo docker compose -f /opt/openhands/docker-compose.yml pull
sudo docker compose -f /opt/openhands/docker-compose.yml up -d --pull never
```

Keep the OpenHands persistent volume, `/var/lib/openhands/projects`, `/etc/openhands/runtime.env`,
and `/etc/openhands/credentials.txt` in place. Wait for the service to become healthy, then run:

```bash
sudo /usr/local/bin/openhands-health.sh
```

Verify existing conversations and projects before resuming work. If the upgrade fails, restore the
stopped snapshot. Do not run an older image against data written by a newer release.
