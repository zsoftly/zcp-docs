---
title: Agent Orchestrator
---

Agent Orchestrator ships the real
[Agent Orchestrator](https://github.com/OrchestratorInc/agent-orchestrator) desktop app with Claude
Code and Codex pre-installed. It plans tasks, delegates them to agents in isolated Git worktrees,
and tracks approvals through its own graphical interface. Agent Orchestrator is a desktop
application, not a CLI tool, so this image provides a KDE desktop reachable over RDP.

## Software included

| Component          | Version     |
| ------------------ | ----------- |
| Agent Orchestrator | 0.15.3      |
| Claude Code        | 2.1.309     |
| Codex              | 0.166.0     |
| Ubuntu             | 26.04.1 LTS |

This image uses XRDP, so you can connect with a standard Remote Desktop Protocol client from
Windows, macOS, or Linux. SSH is also available.

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 40 GB   | 50 GB+      |

## Environment variables

If deployment variable fields are available in your launch flow, use them there. Otherwise, provide
the same values through user data that writes `/etc/zmi/deploy.env`, or configure them after first
boot instead. Both are optional.

| Variable                      | Description                             |
| ----------------------------- | --------------------------------------- |
| `AGENT_ORCHESTRATOR_USERNAME` | Desktop username. Defaults to `ubuntu`. |
| `AGENT_ORCHESTRATOR_PASSWORD` | Desktop password. Generated if blank.   |

GitHub, Claude Code, and Codex credentials are never baked into this image or written to any
deploy-time configuration — they live only in the app's own local storage once you sign in.

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On first boot, the setup service applies platform metadata, regenerates SSH host keys, creates or
updates the desktop user, configures KDE Plasma as the XRDP session, and starts XRDP.

Track progress:

```bash
sudo journalctl -u agent-orchestrator-first-boot.service -f
```

### 3. Retrieve desktop credentials

```bash
sudo cat /etc/agent-orchestrator/credentials.env
```

The file is readable only by root.

### 4. Connect over RDP

Open your RDP client and connect to:

```text
<your-vm-ip>:3389
```

Use the configured desktop username and password.

### 5. Open Agent Orchestrator

Double-click the **Agent Orchestrator** icon on the desktop (the app-menu search is not reliable
over this remote desktop session). On first launch, sign in with your own GitHub account and connect
your own Claude Code and Codex credentials through the app's settings — nothing is
pre-authenticated.

### 6. Run a task

Point the app at a Git repository (clone it first in a terminal, or let the app do it) and create a
task. Agent Orchestrator creates an isolated worktree and branch per task, assigns an agent, and
routes CI failures and review feedback back to it until the work is ready to merge.

### 7. Run tasks in parallel

Create additional tasks the same way — each gets its own worktree, branch, and agent, so they do not
interfere with each other. Review and approve each one from the app's UI as it completes.

## Session persistence and reboot recovery

Agent Orchestrator keeps task state, worktrees, and conversation history on disk, not in memory, so
a VM reboot does not lose work in progress:

- Reconnect over RDP and reopen the app; in-progress and completed tasks are still listed.
- Your repositories and Git worktrees are unaffected — they live on the VM's normal disk.

## Security

Do not expose RDP broadly to the public internet. Restrict port 3389 to trusted IPs, use a VPN, or
use an SSH tunnel where possible. UFW allows only SSH (`22/tcp`) and RDP (`3389/tcp`) inbound;
nothing else is ever opened. All outbound traffic is allowed, which is needed for GitHub, Anthropic,
and OpenAI API access.

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
sudo cat /etc/agent-orchestrator/credentials.env
```

If the first-boot service failed, rerun it after fixing the reported problem:

```bash
sudo systemctl reset-failed agent-orchestrator-first-boot
sudo systemctl start agent-orchestrator-first-boot
```

## Next steps

- [Agent Orchestrator repository](https://github.com/OrchestratorInc/agent-orchestrator)
- [Claude Code documentation](https://code.claude.com/docs/en/overview)
- [Codex documentation](https://learn.chatgpt.com/docs)
