---
title: Supabase
---

Supabase is an open-source Firebase alternative built on PostgreSQL. It bundles a Postgres database,
authentication, instant REST and GraphQL APIs, realtime subscriptions, storage, and a Studio admin
dashboard into one self-hostable stack. The Studio and APIs are served through the Kong gateway on
port 8000.

## Software included

| Component      | Version           |
| -------------- | ----------------- |
| Supabase       | Self-hosted stack |
| PostgreSQL     | 17                |
| Docker         | Latest stable     |
| Docker Compose | Latest stable     |
| Ubuntu         | 24.04 LTS         |

The stack includes Studio, the Kong API gateway, Auth (GoTrue), PostgREST, Realtime, Storage, and
postgres-meta, all on PostgreSQL 17.

## Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| vCPU     | 2       | 4           |
| RAM      | 4 GB    | 8 GB        |
| Storage  | 30 GB   | 80 GB       |

## Environment variables

You can optionally set these when deploying Supabase from the marketplace. Leave a password field
blank to have a secure random value generated automatically.

| Variable             | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `SITE_URL`           | Public URL for the Supabase instance and Studio dashboard |
| `POSTGRES_PASSWORD`  | Password for the PostgreSQL database                      |
| `DASHBOARD_PASSWORD` | Password for the Studio dashboard login                   |

## Getting started

### 1. Connect to your VM

```bash
ssh ubuntu@<your-vm-ip>
```

### 2. Wait for first-boot configuration

On the first boot, a setup script generates the database password, JWT secret, API keys, and Studio
credentials, then pulls the container images and starts the stack. The image pull is large, so this
takes roughly 15-20 minutes. Track progress:

```bash
journalctl -u supabase-first-boot.service -f
```

The login message (MOTD) confirms when Supabase is ready.

### 3. Retrieve the dashboard credentials and API keys

The Studio username and password, plus the `anon` and `service_role` API keys, are written to a
root-only file:

```bash
sudo cat /root/.credentials/supabase.txt
```

### 4. Access the Studio dashboard

Open a browser and navigate to:

```text
http://<your-vm-ip>:8000
```

Sign in with the `supabase` username and the generated password. The REST and Auth APIs are served
through the same gateway at `http://<your-vm-ip>:8000/rest/v1/` and
`http://<your-vm-ip>:8000/auth/v1/`.

## Managing Supabase

Supabase runs as a Docker Compose stack in `/data/supabase`.

```bash
# Check status
cd /data/supabase && docker compose ps

# Restart
cd /data/supabase && docker compose restart

# View logs
cd /data/supabase && docker compose logs -f
```

Environment configuration: `/data/supabase/.env`. Database and storage data are stored under
`/data/supabase/volumes`.

## Security

Ports 8000, 80, and 443 are open on the VM's network interface. UFW is enabled and allows those
ports plus SSH (port 22). Direct PostgreSQL access (5432) is not exposed.

Change the Studio dashboard password after first login. **For production use**, set
`SUPABASE_PUBLIC_URL`, `API_EXTERNAL_URL`, and `SITE_URL` in `/data/supabase/.env` to your domain,
restart the stack, and place Supabase behind a reverse proxy such as nginx with a TLS certificate so
Studio and the APIs are served over HTTPS instead of exposing port 8000 directly.

## Next steps

- [Supabase documentation](https://supabase.com/docs)
- [Self-hosting guide](https://supabase.com/docs/guides/self-hosting/docker)
