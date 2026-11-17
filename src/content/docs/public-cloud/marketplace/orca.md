---
title: Orca
description:
  Deploy and operate the Orca coding workspace image on ZCP, connect customer-owned Claude Code and
  Codex accounts, and recover sessions after a reboot.
---

Orca is a browser-based coding workspace that runs on a private Ubuntu VM. This image ships Orca
with the Claude Code and Codex command-line agents installed. The image contains no customer AI
credentials.

## Software Included

| Component   | Version     |
| ----------- | ----------- |
| Orca        | 1.4.246     |
| Claude Code | 2.1.309     |
| Codex       | 0.166.0     |
| Ubuntu      | 26.04.1 LTS |

## Requirements

| Resource | Minimum |
| -------- | ------- |
| vCPU     | 2       |
| Memory   | 4 GiB   |
| Storage  | 40 GiB  |

## Access and Security

Only SSH is intended to be reachable from outside the VM. Orca listens on port `6768` on `0.0.0.0`,
and the local firewall denies inbound access to that port. Access it only through an SSH tunnel.

This headless runtime uses Xvfb for the browser experience. A desktop environment is not required.

The image contains no Claude or Codex credentials. Authenticate only with accounts you control. No
plan entitlement, price, or account access is included.

First boot downloads the Orca runtime and browser artifacts from upstream. Account setup and use
also need network access. Working DNS and outbound HTTPS are required.

:::caution

Do not snapshot a VM after any account login for reuse as an image. Baked-in credentials would
expose your accounts to anyone who deploys from that image.

:::

## First Connection

Wait for first boot to complete, then confirm the Orca service on the VM:

```bash
sudo orca-onboard status
```

The service reports `active` after startup. In acceptance testing, Orca took 20 to 30 seconds to
become ready after the status turned active. Confirm the local endpoint responds:

```bash
curl -fsS --connect-timeout 2 --max-time 5 http://127.0.0.1:6768/ >/dev/null && echo ready
```

From your workstation, open an SSH tunnel on local port `6768`. Orca generates URLs with that port,
so the local port must match:

```bash
ssh -t \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  -L 127.0.0.1:6768:127.0.0.1:6768 \
  ubuntu@<vm-public-ip>
```

Inside the interactive SSH session, start pairing:

```bash
sudo orca-onboard pair
```

Copy the private **Web client URL** printed by the helper into your own browser. Do not paste it
into chat, tickets, logs, or shared documents. Complete pairing while the command is running. When
pairing finishes, press `Ctrl-C` to restore the normal Orca service, then wait for readiness before
reconnecting through the browser URL.

If the SSH tunnel disconnects, open it again and reload the browser. Port `6768` stays firewalled,
so reopen the SSH tunnel rather than opening the port.

## Customer-Owned Claude and Codex Accounts

Run account setup in an interactive SSH session after first boot is ready:

```bash
sudo orca-onboard claude
sudo orca-onboard codex
```

Claude and Codex use separate accounts and do not share preloaded credentials. Codex uses
device-code authorization. Enable device-code login in your ChatGPT security settings, or ask your
workspace administrator to enable it, before starting the Codex flow.

## Persistent Data and Restarts

Back up the complete Orca home on the VM:

```text
/var/lib/orca
```

The profile is at `/var/lib/orca/.config/orca`. The clone workspace path is
`/var/lib/orca/workspaces`. Runtime-managed worktrees can live under
`/var/lib/orca/orca/workspaces`. Preserve both by backing up the whole home.

:::caution

This directory contains Orca pairing, Claude, and Codex credentials. Encrypt the backup, restrict
access, and never attach it to support tickets, logs, or image artifacts.

:::

A host reboot stops running processes. Reconnect after the VM returns, and do not treat a running
terminal or agent process as persistent. In acceptance testing, a previously authenticated Claude
conversation was restored after a reboot and answered a conversation-only prompt without manually
relaunching Claude.

## Troubleshooting

Check the service without a pager:

```bash
sudo orca-onboard status
sudo journalctl -u orca-first-boot.service -n 160 --no-pager
```

If the local readiness check fails, wait briefly and run it again. If pairing does not produce a
usable URL, stop the pairing command with `Ctrl-C`, wait for the normal service to become ready,
then start pairing again. Do not expose port `6768` to the public internet to work around a tunnel
problem. Do not copy pairing URLs into logs or capture broad service output while a pairing URL is
visible.

## Upgrading the Image

Orca image updates ship as a new immutable template. Do not use unattended in-application updates on
a marketplace VM, because they would move the installed Orca release outside the image lifecycle.

Before an operator upgrades, stop the source VM or take a consistent offline snapshot. Back up the
full `/var/lib/orca` directory. Live file copies are not safe for SQLite-backed state. Keep the
source VM and backup until the replacement VM passes your validation.

After an operator restores the backup to a test VM, re-authenticate privately. Validate workspaces,
profile, service, tunnel, and browser access on the restored VM before retiring the source VM.
