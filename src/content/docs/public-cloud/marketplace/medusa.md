---
title: Medusa
---

Medusa is an open-source headless commerce platform built on Node.js. It provides a modular backend
with a built-in admin dashboard and REST/Store APIs that power custom storefronts. You own the data
and the code, and extend it with TypeScript modules.

:::note[Coming soon]

A pre-built Medusa image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Medusa yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 20 GB   | 40 GB       |

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

## Install Medusa

Medusa requires **Node.js v20+ (LTS)** and a running **PostgreSQL** server. Redis is optional but
recommended for production event handling.

Install Node.js 20 LTS from NodeSource:

```bash
sudo apt-get install -y ca-certificates curl gnupg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
  | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" \
  | sudo tee /etc/apt/sources.list.d/nodesource.list
sudo apt-get update && sudo apt-get install -y nodejs
node -v
```

Install PostgreSQL and Redis:

```bash
sudo apt install -y postgresql postgresql-contrib redis-server
sudo systemctl enable --now postgresql redis-server
```

Create a database role for Medusa (replace the password):

```bash
sudo -u postgres psql -c "CREATE USER medusa WITH PASSWORD 'change-me' CREATEDB;"
```

Scaffold a new Medusa application. The installer creates the project, runs migrations, and prompts
you for an admin email and password:

```bash
npx create-medusa-app@latest my-medusa-store \
  --db-url "postgres://medusa:change-me@localhost:5432/medusa-store"
```

When prompted, decline the Next.js Starter Storefront unless you want it on the same VM (it needs a
second process and Node v24 LTS or lower).

## Configure Medusa

The installer writes configuration to `my-medusa-store/.env`. Confirm the database and Redis URLs:

```bash
cd my-medusa-store
grep -E "DATABASE_URL|REDIS_URL|STORE_CORS|ADMIN_CORS" .env
```

Set `REDIS_URL=redis://localhost:6379` and update the CORS values to your storefront and admin
domains for production.

Start the server (admin and API on port 9000):

```bash
npm run dev
```

The admin dashboard is served at `http://<your-vm-ip>:9000/app` and the Store/Admin APIs at
`http://<your-vm-ip>:9000`. For production, build the app (`npm run build`), run it with a process
manager such as PM2, and place it behind nginx with TLS.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Medusa needs and add
them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 9000/tcp
```

## Next steps

- [Medusa documentation](https://docs.medusajs.com/)
- [Medusa installation guide](https://docs.medusajs.com/learn/installation)
