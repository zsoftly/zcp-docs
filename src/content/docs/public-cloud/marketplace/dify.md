---
title: Dify
---

Dify is an open-source platform for building LLM applications and AI agents. It combines a visual
workflow builder, retrieval-augmented generation (RAG) pipelines, prompt management, and an agent
framework so teams can design, test, and deploy generative-AI apps from one interface.

:::note[Coming soon]

A pre-built Dify image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from the
marketplace and follow the steps below to install Dify yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 40 GB   | 80 GB       |

Dify runs as a multi-container Docker Compose stack (API, worker, web, database, vector store, and
nginx), so RAM and storage requirements grow with usage.

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

## Install Dify

Dify ships as a Docker Compose stack, so install Docker Engine and the Compose plugin first.

Set up Docker's official APT repository for Ubuntu 24.04 LTS (`noble`):

```bash
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sudo tee /etc/apt/sources.list.d/docker.sources >/dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
```

Install Docker Engine and the Compose plugin:

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Allow the `ubuntu` user to run Docker without sudo, then re-open your SSH session:

```bash
sudo usermod -aG docker ubuntu
```

Clone the latest Dify release, copy the environment file, and start the stack:

```bash
sudo apt install -y git jq
git clone --branch "$(curl -s https://api.github.com/repos/langgenius/dify/releases/latest | jq -r .tag_name)" https://github.com/langgenius/dify.git
cd dify/docker
cp .env.example .env
docker compose up -d
```

Confirm all containers are up:

```bash
docker compose ps
```

## Configure Dify

The stack's nginx container publishes ports 80 and 443. Open a browser and complete the one-time
admin setup:

```text
http://<your-vm-ip>/install
```

Create the admin account, then sign in at `http://<your-vm-ip>/`. From **Settings → Model
Provider**, add an LLM provider (such as OpenAI, Anthropic, or a self-hosted Ollama endpoint) before
building apps.

For production, edit `dify/docker/.env` to set a public-facing URL and enable HTTPS. Dify can
terminate TLS through its bundled nginx (set `NGINX_HTTPS_ENABLED=true` and mount certificates), or
you can run it behind your own reverse proxy. Apply changes with:

```bash
cd ~/dify/docker
docker compose down && docker compose up -d
```

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the ports Dify needs and add them
to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Next steps

- [Dify documentation](https://docs.dify.ai/)
- [Dify installation guide](https://docs.dify.ai/en/getting-started/install-self-hosted/docker-compose)
