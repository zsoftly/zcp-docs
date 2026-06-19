---
title: Zammad
---

Zammad is an open-source helpdesk and ticketing system for customer support and IT service teams. It
consolidates email, chat, social, and phone channels into a shared inbox with ticketing, SLAs,
knowledge base, and reporting. It runs as a self-hosted web application backed by PostgreSQL and
Elasticsearch.

:::note[Coming soon]

A pre-built Zammad image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Zammad yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 40 GB   | 80 GB       |

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

## Install Zammad

Zammad recommends a dedicated host with at least **4 GB of RAM** and depends on **Elasticsearch**
for search, reporting, and attachment indexing. Install Elasticsearch first, then Zammad from the
official packager.io apt repository.

Install Elasticsearch (8.x or 9.x):

```bash
curl -fsSL https://artifacts.elastic.co/GPG-KEY-elasticsearch \
  | sudo gpg --dearmor -o /usr/share/keyrings/elasticsearch-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/elasticsearch-keyring.gpg] https://artifacts.elastic.co/packages/9.x/apt stable main" \
  | sudo tee /etc/apt/sources.list.d/elastic-9.x.list
sudo apt update
sudo apt install -y elasticsearch
sudo systemctl enable --now elasticsearch
```

Add the official Zammad repository and install Zammad from the Ubuntu 24.04 list:

```bash
sudo curl -fsSL "https://dl.packager.io/srv/zammad/zammad/key" \
  | gpg --dearmor | sudo tee /etc/apt/keyrings/pkgr-zammad.gpg > /dev/null
sudo curl -fsSL "https://dl.packager.io/srv/zammad/zammad/stable/installer/ubuntu/24.04.list" \
  -o /etc/apt/sources.list.d/zammad.list
sudo apt update
sudo apt install -y zammad
```

The package installs Zammad, its PostgreSQL database, an nginx site, and all services, then starts
them automatically.

## Configure Zammad

1. Point Zammad at Elasticsearch and build the search index:

   ```bash
   sudo zammad run rails r "Setting.set('es_url', 'http://localhost:9200')"
   sudo zammad run rake zammad:searchindex:rebuild
   ```

2. Open `http://<your-vm-ip>/` in your browser and complete the web-based setup wizard. The first
   account you create becomes the system administrator.
3. The package ships an nginx vhost on port 80. For production, edit
   `/etc/nginx/sites-enabled/zammad.conf` to add your domain and a TLS certificate (Let's Encrypt
   via certbot is supported) so the UI is served over HTTPS on 443.
4. Configure your email channel under **Admin → Channels** to start receiving and sending tickets.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the ports Zammad needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

Keep Elasticsearch (port 9200) bound to localhost and do not expose it externally.

## Next steps

- [Zammad documentation](https://docs.zammad.org/)
- [Zammad installation guide](https://docs.zammad.org/en/latest/install/package.html)
