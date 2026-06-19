---
title: Qdrant
---

Qdrant is an open-source vector database and similarity-search engine built for storing and querying
high-dimensional embeddings. It powers semantic search, recommendations, and retrieval-augmented
generation (RAG) workloads, exposing both a REST and a gRPC API plus a built-in web dashboard.

:::note[Coming soon]

A pre-built Qdrant image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Qdrant yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 20 GB   | 50 GB       |

Storage and RAM scale with the number and dimensionality of vectors you index. Size them to fit your
expected collection.

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

## Install Qdrant

Qdrant is distributed as an official Docker image, so install Docker Engine and the Compose plugin
first.

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

Pull and run Qdrant, mapping the REST (6333) and gRPC (6334) ports and persisting data to the host:

```bash
docker pull qdrant/qdrant
docker run -d --name qdrant --restart unless-stopped \
  -p 6333:6333 -p 6334:6334 \
  -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
  qdrant/qdrant
```

Verify it is responding:

```bash
curl http://localhost:6333/healthz
```

## Configure Qdrant

The web dashboard is available at:

```text
http://<your-vm-ip>:6333/dashboard
```

Qdrant ships with no authentication. Before exposing it, set an API key so only authorized clients
can read or write your collections. Restart the container with the key set:

```bash
docker rm -f qdrant
docker run -d --name qdrant --restart unless-stopped \
  -p 6333:6333 -p 6334:6334 \
  -e QDRANT__SERVICE__API_KEY="<generate-a-strong-key>" \
  -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
  qdrant/qdrant
```

Clients then send the key in the `api-key` header. For production, place Qdrant behind a reverse
proxy with TLS so traffic and the API key are encrypted in transit.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the ports Qdrant needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 6333/tcp
sudo ufw allow 6334/tcp
```

## Next steps

- [Qdrant documentation](https://qdrant.tech/documentation/)
- [Qdrant installation guide](https://qdrant.tech/documentation/guides/installation/)
