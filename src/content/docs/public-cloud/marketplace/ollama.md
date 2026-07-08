---
title: Ollama
---

Ollama is a local large language model (LLM) runtime that downloads, runs, and serves open models
such as Llama, Qwen, Gemma, and DeepSeek on your own hardware. It exposes a simple REST API and a
command-line interface, so you can run inference privately without sending data to a third-party
provider.

## Software included

| Component | Version   |
| --------- | --------- |
| Ollama    | 0.9.2     |
| Ubuntu    | 24.04 LTS |

No models are pre-loaded. You pull the models you need on first boot (see
[Getting started](#getting-started)).

## Requirements

Ollama runs on **CPU and RAM**. A GPU is optional and speeds up inference. Two things decide the
plan you need:

- **RAM** has to hold the model you run (about the model file size plus headroom for the context). A
  model that does not fit in RAM will not run.
- **Storage** has to hold the model files you pull, plus the operating system and working space. Add
  the size of every extra model you keep, because they add up fast.

Size the instance for the largest model you plan to run. The figures below use Q4 quantization,
Ollama's default.

| Model size | Example       | Model file (approx.) | Minimum RAM | Suggested disk |
| ---------- | ------------- | -------------------- | ----------- | -------------- |
| 1-3B       | Llama 3.2 3B  | 2-3 GB               | 8 GB        | 20 GB          |
| 7-8B       | Llama 3.1 8B  | 5 GB                 | 8 GB        | 30 GB          |
| 13-14B     | Llama 2 13B   | 9 GB                 | 16 GB       | 40 GB          |
| 32-34B     | Qwen 2.5 32B  | 20 GB                | 32 GB       | 60 GB          |
| 70B        | Llama 3.3 70B | 40 GB                | 64 GB       | 100 GB         |

## Recommended plans by region

Plan names and storage tiers differ by region. The general-purpose plans below give each model
enough RAM, and their root disk holds the model files. See
[Instance Types](/public-cloud/compute/instance-types/) and the
[pricing page](https://zcp.zsoftly.ca/pricing) for current specs and prices.

| Model size | YOW-1 (Ottawa)                     | YUL-1 (Montréal)                   |
| ---------- | ---------------------------------- | ---------------------------------- |
| 1-8B       | `ci1.l` (4 vCPU, 8 GB, 120 GB)     | `ca2.l` (4 vCPU, 8 GB, 120 GB)     |
| 13-14B     | `ci1.xl` (4 vCPU, 16 GB, 160 GB)   | `ca2.xl` (4 vCPU, 16 GB, 160 GB)   |
| 32-34B     | `ci1.2xl` (8 vCPU, 32 GB, 200 GB)  | `ca2.2xl` (8 vCPU, 32 GB, 200 GB)  |
| 70B        | `ci1.4xl` (16 vCPU, 64 GB, 320 GB) | `ca2.4xl` (16 vCPU, 64 GB, 320 GB) |

Adjust from there:

- **Same RAM, lower cost**: the memory-focused family gives the same RAM with fewer vCPUs, good for
  occasional use. Use `cim1.*` in YOW-1 or `cam2.*` in YUL-1 (for example `cim1.xl` or `cam2.xl` for
  64 GB).
- **Faster responses**: add vCPUs with the CPU-focused family (`cac1.*` in YOW-1, `cac2.*` in
  YUL-1), or choose a GPU plan for 13B and larger models.
- **Several large models on one instance**: attach a
  [block storage volume](/public-cloud/compute/settings/block-storage/) instead of moving to a
  bigger plan.

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script starts the service. This takes under a minute. Track progress:

```bash
journalctl -u ollama-first-boot.service -f
```

The login message (MOTD) confirms when Ollama is ready.

### 3. Pull a model and run a prompt

```bash
ollama pull llama3.2
ollama run llama3.2 "Hello, what can you do?"
```

### 4. Use the API

The API listens on port `11434`. Test it from the VM:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

From another host, replace `localhost` with the VM's IP.

## Managing Ollama

Ollama runs as a systemd service.

```bash
# Check status
systemctl status ollama

# Restart
sudo systemctl restart ollama

# View logs
sudo journalctl -u ollama -f

# List, pull, and remove models
ollama list
ollama pull qwen2.5
ollama rm qwen2.5
```

Models are stored in `/usr/share/ollama/.ollama/models`. A summary of URLs and commands is written
to `/etc/ollama/info.txt`.

## Security

Port 11434 is open on the VM's network interface, and Ollama has **no built-in authentication**. UFW
is enabled and allows SSH (port 22) and the Ollama API (port 11434).

**To restrict the API to a specific IP:**

```bash
sudo ufw delete allow 11434/tcp
sudo ufw allow from <trusted-ip> to any port 11434
```

**To reach the API without opening the firewall, use an SSH tunnel:**

```bash
# Run this on your local machine
ssh -L 11434:localhost:11434 ubuntu@<your-vm-ip>
```

**For production use**, place Ollama behind a reverse proxy that enforces TLS and authentication, or
restrict access to trusted IPs only.

## Next steps

- [Ollama documentation](https://docs.ollama.com/)
- [Ollama API reference](https://docs.ollama.com/api)
