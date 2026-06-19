---
title: Coolify
---

Coolify is an open-source, self-hosted PaaS and a drop-in alternative to Heroku, Netlify, and
Vercel. It deploys applications, databases, and services to your own server with Git-based workflows
and a web dashboard, while keeping all your data under your control.

:::note[Coming soon]

A pre-built Coolify image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Coolify yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 2 GB    | 4 GB        |
| Storage  | 30 GB   | 60 GB       |

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

## Install Coolify

Coolify ships an official one-line installer that sets up Docker, Docker Compose, and the full
Coolify stack for you. Run it as root:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

The installer pulls the required images and starts every service. When it finishes, it prints the
dashboard URL. Nothing else needs to be installed by hand.

## Configure Coolify

1. Open the dashboard in your browser at `http://<your-vm-ip>:8000`.
2. The first account you create becomes the root administrator. Set a strong email and password
   immediately, as registration closes after the first user.
3. Under **Settings**, set your instance's domain so Coolify can issue Let's Encrypt TLS
   certificates and serve the dashboard over HTTPS. Coolify includes a built-in Traefik reverse
   proxy that handles routing and certificates for both the dashboard and your deployed apps, so no
   separate proxy is required.
4. Add your server's public SSH key and connect a Git source (GitHub, GitLab, or a generic
   repository) to start deploying applications.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the ports Coolify needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8000/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 6001/tcp
sudo ufw allow 6002/tcp
```

Ports 80 and 443 serve your deployed apps and TLS. Ports 6001 and 6002 are used by Coolify's
realtime and terminal features.

## Next steps

- [Coolify documentation](https://coolify.io/docs)
- [Coolify installation guide](https://coolify.io/docs/get-started/installation)
