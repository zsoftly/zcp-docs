---
title: HermesAgent
---

HermesAgent is a self-hosted AI agent runtime from Nous Research. It can keep persistent memory, use
tools, create or import skills, run sessions, and connect to external model providers from your own
ZCP instance.

## Software included

| Component             | Version       |
| --------------------- | ------------- |
| HermesAgent           | 2026.8.3      |
| Docker                | Latest stable |
| Docker Compose plugin | Latest stable |
| Ubuntu                | 24.04 LTS     |

The image runs the pinned container image `nousresearch/hermes-agent:v2026.8.3`.

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 1       | 2           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 20 GB   | 40 GB       |

HermesAgent uses external model providers by default. If you plan to run local models on the same
VM, size the instance separately for those model workloads.

## Environment variables

Set these values during marketplace deployment if you want first boot to configure provider keys or
gateway access. Secrets are read from `/etc/zmi/deploy.env` and copied into a root-only runtime
environment file.

| Variable                  | Description                                     |
| ------------------------- | ----------------------------------------------- |
| `OPENROUTER_API_KEY`      | OpenRouter provider API key                     |
| `FIREWORKS_API_KEY`       | Fireworks provider API key                      |
| `GOOGLE_API_KEY`          | Google/Gemini provider API key                  |
| `GEMINI_API_KEY`          | Gemini provider API key alias                   |
| `VULTR_API_KEY`           | Vultr inference/API key                         |
| `EXA_API_KEY`             | Exa search tool key                             |
| `FIRECRAWL_API_KEY`       | Firecrawl tool key                              |
| `FAL_KEY`                 | fal.ai tool key                                 |
| `SLACK_BOT_TOKEN`         | Slack bot integration token                     |
| `SLACK_APP_TOKEN`         | Slack Socket Mode token                         |
| `TELEGRAM_BOT_TOKEN`      | Telegram bot token                              |
| `API_SERVER_KEY`          | Gateway API key when gateway access is enabled  |
| `GATEWAY_ALLOW_ALL_USERS` | Allows gateway access for QA or trusted testing |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On first boot, HermesAgent creates its runtime directories, applies `/etc/zmi/deploy.env` if
present, starts the Docker Compose stack, and writes setup notes. Track progress:

```bash
journalctl -u hermesagent-first-boot.service -f
```

The login message (MOTD) confirms when HermesAgent is ready.

### 3. Retrieve setup notes

```bash
cat /etc/hermesagent/info.txt
sudo cat /etc/hermesagent/credentials.txt
```

The credentials file is root-only because it may contain generated secrets and access details.

### 4. Open the dashboard through an SSH tunnel

HermesAgent is intentionally localhost-only by default. Run this from your workstation:

```bash
ssh -L 9119:127.0.0.1:9119 ubuntu@<your-vm-ip>
```

Then open:

```text
http://127.0.0.1:9119
```

## Managing HermesAgent

HermesAgent runs as a Docker Compose stack in `/opt/hermesagent`.

```bash
# Check status
cd /opt/hermesagent && sudo docker compose ps

# Restart
cd /opt/hermesagent && sudo docker compose restart

# View logs
cd /opt/hermesagent && sudo docker compose logs -f
```

## Persistent data

HermesAgent stores runtime data separately from the operating system where possible. If a blank data
disk is attached before first boot, the image formats it, mounts it at `/data`, and stores app data
under `/data/hermesagent`. Without a data disk, it falls back to `/var/lib/hermesagent`.

Data that can grow includes agent memory, session history, imported or generated skills, logs, tool
outputs, cached results, and runtime state files.

## Security

UFW allows SSH only by default. The dashboard listens on `127.0.0.1:9119` and should be accessed
through an SSH tunnel. Do not expose the dashboard or gateway directly to the internet unless you
put it behind TLS and authentication.

Treat `/opt/hermesagent/.env`, `/etc/hermesagent/credentials.txt`, and the data directory as
sensitive.

## Next steps

- [HermesAgent upstream](https://github.com/nousresearch/hermes-agent)
- [Vultr HermesAgent deployment guide](https://docs.vultr.com/how-to-deploy-hermes-agent-open-source-self-hosted-ai-agent)
