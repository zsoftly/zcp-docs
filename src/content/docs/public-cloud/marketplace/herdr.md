---
title: Herdr
description:
  Deploy and operate the Herdr terminal workspace image on ZCP, authenticate customer-owned Claude
  Code and Codex accounts, and recover named sessions after an SSH drop or reboot.
---

Herdr is a terminal workspace manager for running named Claude Code and Codex sessions over SSH.
This image ships Herdr with the Claude Code and Codex command-line agents installed. The image
contains no customer AI credentials.

## Software Included

| Component   | Version     |
| ----------- | ----------- |
| Herdr       | 0.9.5       |
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

SSH is the intended external access method. The local firewall allows inbound SSH and denies other
inbound traffic by default. Each SSH user keeps Herdr session state, agent resume references, and
account credentials in that user's home directory on the VM's persistent disk.

The image contains no Claude or Codex credentials. Authenticate only with accounts you control.

:::caution

Do not snapshot a VM after any account login for reuse as an image. Baked-in credentials would
expose your accounts to anyone who deploys from that image.

:::

## First Connection

Connect to the deployed VM over SSH as `ubuntu`. Confirm first boot completed and the Herdr CLI is
available:

```bash
sudo systemctl status herdr-first-boot.service --no-pager
herdr --version
```

Start Herdr in your SSH session:

```bash
herdr
```

Use a named session when you want a separate workspace:

```bash
herdr session attach project-a
```

## Customer-Owned Claude and Codex Accounts

Initialize and authenticate each agent as your SSH user first:

```bash
claude
codex
```

Complete the authentication flows privately. Once each client has created its configuration
directory, install the Herdr integration for that user:

```bash
herdr integration install claude
herdr integration install codex
```

The Claude integration requires `~/.claude` and the Codex integration requires `~/.codex`. Do not
run either command as root. The image never preloads these directories, hooks, access tokens, API
keys, or sessions.

## SSH Disconnection and Reboot Recovery

For an ordinary SSH disconnection, the Herdr server keeps panes and their running processes alive.
Reconnect and attach the same named session:

```bash
herdr session attach project-a
```

A VM reboot stops the server and every process running in its panes. The restore is not automatic on
boot. Reconnect over SSH and run `herdr session attach <name>` to rebuild the saved workspace, tabs,
panes, current directories, layout, and focus. Claude Code and Codex resume prior conversations
through each agent's own authenticated session restore.

:::note

Do not expect a running shell command, development server, or test process to survive a VM reboot.
Arbitrary processes in Herdr panes are not persistent across reboots.

:::

## Upgrading the Image

Herdr image updates ship as a new immutable template. Do not use unattended in-application updates
on a marketplace VM, because they would move the installed Herdr release outside the image
lifecycle.

Before an operator upgrades, stop the source VM or take a consistent offline snapshot. Session state
lives in each SSH user's home directory. Preserve it by backing up `/home` or the data disk. Keep
the source VM and backup until the replacement VM passes your validation.

## References

- [Herdr install guide](https://herdr.dev/tui/docs/install/)
- [Herdr session state and restore](https://herdr.dev/tui/docs/session-state/)
