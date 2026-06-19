---
title: Supabase
---

Supabase is an open-source Firebase alternative built on PostgreSQL. It bundles a Postgres database,
authentication, instant REST and GraphQL APIs, realtime subscriptions, storage, and a Studio admin
dashboard into one self-hostable stack. The Studio and APIs are served through the Kong gateway on
port 8000.

:::note[Coming soon]

A pre-built Supabase image is on its way. For now, deploy a fresh **Ubuntu 24.04 LTS** instance from
the marketplace and follow the steps below to install Supabase yourself.

:::

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 30 GB   | 80 GB       |

## Deploy the base instance

1. In the ZSoftly Cloud portal, open **Apps**, select **Supabase**, and click **Deploy**, or create
   an **Ubuntu 24.04 LTS** instance from **Instances → Create**. Both give you a clean Ubuntu 24.04
   VM.
2. Choose a plan that meets the requirements above and pick your region (YOW-1 or YUL-1).
3. When the instance is **Running**, connect over SSH:

```bash
ssh ubuntu@<your-vm-ip>
```

4. Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

## Install Supabase

Supabase self-hosts as a Docker Compose stack, so install Docker Engine and the Compose plugin
first.

Set up Docker's official APT repository for Ubuntu 24.04 LTS (`noble`):

```bash
sudo apt install -y ca-certificates curl git
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

Clone the Supabase repository and copy the `docker` directory into a project folder:

```bash
git clone --depth 1 https://github.com/supabase/supabase
mkdir supabase-project
cp -rf supabase/docker/* supabase-project
cp supabase/docker/.env.example supabase-project/.env
cd supabase-project
```

## Configure Supabase

Never run the stack with the example defaults. Open `.env` and set strong, unique values for at
least these variables before starting anything:

- `POSTGRES_PASSWORD`: the Postgres database password
- `JWT_SECRET`: secret used to sign API tokens
- `ANON_KEY`: public (anonymous) API key
- `SERVICE_ROLE_KEY`: privileged service-role API key
- `DASHBOARD_USERNAME`: Studio login username
- `DASHBOARD_PASSWORD`: Studio login password

The repository ships helper scripts to generate matching secrets and API keys for you:

```bash
sh utils/generate-keys.sh
sh utils/add-new-auth-keys.sh
```

Pull the images and start the stack:

```bash
sudo docker compose pull
sudo docker compose up -d --wait
```

Once the containers are healthy, the Studio dashboard and APIs are served through Kong on port 8000:

- Studio dashboard: `http://<your-vm-ip>:8000` (log in with `DASHBOARD_USERNAME` /
  `DASHBOARD_PASSWORD`)
- REST API: `http://<your-vm-ip>:8000/rest/v1/`
- Auth API: `http://<your-vm-ip>:8000/auth/v1/`

For a production setup, put Supabase behind a reverse proxy such as nginx with a TLS certificate,
then serve Studio and the APIs over HTTPS instead of exposing port 8000 directly.

## Open the firewall

The instance allows only SSH (port 22) externally by default. Open the port(s) Supabase needs and
add them to the instance's network/security rules in the portal:

```bash
sudo ufw allow 8000/tcp
```

## Next steps

- [Supabase documentation](https://supabase.com/docs)
- [Supabase self-hosting guide](https://supabase.com/docs/guides/self-hosting/docker)
