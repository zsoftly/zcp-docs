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

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 4       | 8           |
| RAM      | 8 GB    | 16 GB       |
| Storage  | 20 GB   | 50 GB       |

Ollama runs on CPU out of the box. A GPU is optional but strongly recommended for larger models and
faster inference. Model files are large, so size storage to fit the models you plan to pull.

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
