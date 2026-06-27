---
title: Ollama
---

Ollama is a local large language model (LLM) runtime that downloads, runs, and serves open models
such as Llama, Qwen, Gemma, and DeepSeek on your own hardware. It exposes a simple REST API and a
command-line interface, so you can run inference privately without sending data to a third-party
provider.

:::note[Coming soon]

A pre-built Ollama image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Ollama yourself.

:::

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

- **Same RAM, lower cost**: the memory-optimized family gives the same RAM with fewer vCPUs, good
  for occasional use. Use `cim1.*` in YOW-1 or `cam2.*` in YUL-1 (for example `cim1.xl` or `cam2.xl`
  for 64 GB).
- **Faster responses**: add vCPUs with the cpu-optimized family (`cac1.*` in YOW-1, `cac2.*` in
  YUL-1), or choose a GPU plan for 13B and larger models.
- **Several large models on one instance**: attach a
  [block storage volume](/public-cloud/compute/settings/block-storage/) instead of moving to a
  bigger plan.

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps** and switch to the **Marketplace** tab. It opens on
   **Featured** by default, so select **Marketplace** next to it. Pick your region (YOW-1 or YUL-1),
   search for **Ubuntu 24.04 LTS**, and click **Deploy**. You can also create the instance from
   **Instances → Create**. Either way you get a clean Ubuntu 24.04 VM.

   ![The Marketplace tab in the ZSoftly Cloud portal, showing the region selector, category list, search box, and Deploy buttons](../../../../assets/marketplace/deploy-marketplace-tab.webp)

   ![Searching the Marketplace for an app, with the search box filtering the catalog down to a matching Deploy card](../../../../assets/marketplace/deploy-marketplace-search.webp)

2. Choose a plan that meets the requirements above.

3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Ollama

Run the official install script. It installs the `ollama` binary, creates a dedicated `ollama`
system user, and sets up a systemd service that starts automatically:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Confirm the service is running and check the version:

```bash
systemctl status ollama --no-pager
ollama --version
```

Pull a model and run a quick prompt:

```bash
ollama pull llama3.2
ollama run llama3.2 "Hello, what can you do?"
```

The API listens on `127.0.0.1:11434` by default. Test it locally:

```bash
curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?",
  "stream": false
}'
```

## Configure Ollama

By default Ollama binds only to localhost. To accept connections from other hosts, set `OLLAMA_HOST`
on the systemd service:

```bash
sudo systemctl edit ollama
```

Add the following override, then save:

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
```

Reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

Ollama has no built-in authentication. If you expose port 11434, place it behind a reverse proxy
that enforces TLS and authentication, or restrict access to trusted IPs only.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port Ollama needs and add it
to the instance's network/security rules in the portal:

```bash
sudo ufw allow 11434/tcp
```

## Next steps

- [Ollama documentation](https://docs.ollama.com/)
- [Ollama installation guide](https://docs.ollama.com/linux)
