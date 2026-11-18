---
title: Agent Orchestrator
---

Agent Orchestrator ships ZSoftly's own [ai-craft](https://github.com/zsoftly/zs-ai-craft)
engineering workflow with Claude Code and Codex pre-installed. Instead of one AI writing code
unchecked, one orchestrator plans and delegates, an implementation agent writes the code, and two
review agents check it in parallel from different angles before you accept the result. There is no
desktop environment or web UI — everything runs over SSH.

## Software included

| Component   | Version                          |
| ----------- | -------------------------------- |
| ai-craft    | 2.2.0 (pinned commit `d17d6946`) |
| Claude Code | 2.1.309                          |
| Codex       | 0.166.0                          |
| Ubuntu      | 26.04.1 LTS                      |

## Requirements

| Resource | Minimum | Recommended (2 parallel agent tasks)  |
| -------- | ------- | ------------------------------------- |
| vCPU     | 2       | 4                                     |
| RAM      | 4 GB    | 8 GB                                  |
| Storage  | 20 GB   | 40 GB+ for larger repos and worktrees |

Agent Orchestrator has no built-in task scheduler or sandbox. Each additional parallel agent task
needs roughly its own vCPU/RAM budget on top of these numbers. `AGENT_ORCHESTRATOR_MAX_TASKS`
defaults to `4`, more than the Minimum tier above is sized for — lower it to `1` or `2` on a
minimum-size VM, or size up to Recommended before running more than two parallel tasks.

## Environment variables

If deployment variable fields are available in your launch flow, use them there. Otherwise, provide
the same values through user data that writes `/etc/zmi/deploy.env`, or configure them after first
boot instead. All of these are optional.

| Variable                       | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| `GITHUB_TOKEN`                 | Configures `git`/`gh` for the `ubuntu` user non-interactively. |
| `ANTHROPIC_API_KEY`            | Lets Claude Code authenticate without an interactive login.    |
| `OPENAI_API_KEY`               | Lets Codex authenticate without an interactive login.          |
| `AGENT_ORCHESTRATOR_MAX_TASKS` | Concurrent `agent-task` slots. Default `4`.                    |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Start a persistent session

Agent CLI sessions do not survive an SSH disconnect on their own. Run them inside `tmux` so you can
reconnect without losing your place:

```bash
tmux new -s work
```

### 3. Authenticate Claude Code and Codex

Each CLI uses your own account. Nothing is pre-authenticated in the image.

```bash
claude   # interactive login
codex    # interactive login
```

To skip interactive login, supply `ANTHROPIC_API_KEY` and/or `OPENAI_API_KEY` at deploy time — first
boot makes them available to every new shell for the `ubuntu` user.

### 4. Connect GitHub access

```bash
gh auth login
```

Or supply `GITHUB_TOKEN` at deploy time to have this configured automatically.

### 5. Run parallel tasks in separate worktrees

```bash
cd ~/workspace
git clone <your-repo-url>
cd <your-repo>
git worktree add ../<your-repo>-task-a -b task-a
cd ../<your-repo>-task-a
agent-task claude
```

`agent-task` gates how many agent CLIs can run at once (see Task limits below). See
`~/workspace/README.md` on the VM for the full worktree pattern.

### 6. Run the orchestrator workflow

Inside the Claude Code session:

```text
/zs-orchestrate add rate limiting to the login endpoint
```

Codex uses the same agents, with slightly different mechanics — see
[ai-craft's workflow doc](https://github.com/zsoftly/zs-ai-craft/blob/main/docs/workflow.md#running-it-in-codex)
for how to spawn them there.

## Task limits

`agent-task` is a concurrency gate, not a sandbox:

```bash
agent-task claude ...
agent-task codex ...
```

It refuses to start a new task once `AGENT_ORCHESTRATOR_MAX_TASKS` (default `4`) are already
running, until one finishes. Running `claude`/`codex` directly instead of through `agent-task` still
works — it is just not limit-gated. This is a self-managed VM you own, not a multi-tenant sandbox,
so the gate is a usage control, not a security boundary.

To change the limit after deploy, edit `/etc/agent-orchestrator/limits.conf` directly; no restart is
required.

## Session persistence and reboot recovery

`tmux` keeps a session alive across SSH disconnects, but a VM reboot still ends every running
process, `tmux` included. After a reboot:

- Reconnect over SSH and start a new `tmux` session.
- Claude Code and Codex each keep their own conversation history on disk, so you can resume a prior
  conversation through each CLI's own resume feature rather than starting over.
- Your repositories and Git worktrees under `~/workspace` are unaffected — they live on the VM's
  normal disk, not in memory.

## Credentials

No credential is ever baked into this image. `GITHUB_TOKEN`, `ANTHROPIC_API_KEY`, and
`OPENAI_API_KEY` are entirely customer-supplied, either at deploy time or interactively afterward.

> ai-craft's agent set includes `zs-cmp-deploy-agent`, a ZSoftly internal deployment helper. It
> ships with the rest of the agents; it is inert without ZSoftly's own deployment context, but you
> will see it listed alongside the customer-facing agents.

## Security

UFW allows only SSH (`22/tcp`) inbound. All outbound traffic is allowed, which is needed for GitHub,
Anthropic, and OpenAI API access.

## Next steps

- [ai-craft repository](https://github.com/zsoftly/zs-ai-craft)
- [ai-craft workflow doc](https://github.com/zsoftly/zs-ai-craft/blob/main/docs/workflow.md)
- [Claude Code documentation](https://code.claude.com/docs/en/overview)
- [Codex documentation](https://learn.chatgpt.com/docs)
