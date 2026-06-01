# Environments

The docs site uses three environments with short, canonical names.

---

## Environment Names

| Name | Full name   | Never use                |
| ---- | ----------- | ------------------------ |
| dev  | Development | `development`, `develop` |
| stg  | Staging     | `staging`, `stage`       |
| prd  | Production  | `prod`, `production`     |

These names match the per-environment configs in `deploy/caddy/{dev,stg,prd}.Caddyfile` and the
GitHub Actions workflow inputs.

---

## Hosting model

All environments serve the same static Starlight build (`dist/`). The build is identical across
environments; only the host and routing differ.

| Env | Host                     | Stack                           | Deploy mechanism               |
| --- | ------------------------ | ------------------------------- | ------------------------------ |
| dev | Dokploy (`zsoftly-iaas`) | Caddy (built into Docker image) | GitHub Actions to Dokploy API  |
| stg | Dokploy (`zsoftly-iaas`) | Caddy (built into Docker image) | GitHub Actions to Dokploy API  |
| prd | bare-metal VM            | static `dist/` over Caddy       | GitHub Actions, rsync over SSH |

dev and stg run as Docker images (`Dockerfile` plus `deploy/caddy/{dev,stg}.Caddyfile`) managed by
Dokploy. prd is plain static files rsynced to a bare-metal VM, the same VM that serves
`zcp.zsoftly.ca`, fronted by `deploy/caddy/prd.Caddyfile`.

---

## dev

**Purpose:** Continuous preview. Every merge to `main` auto-deploys here.

| Property       | Value                          |
| -------------- | ------------------------------ |
| Domain         | `dev-docs.apps.zcp.zsoftly.ca` |
| SEO indexed    | No                             |
| Deploy trigger | Automatic on `main` merge      |
| Artifact       | Built from `main` HEAD         |
| Workflow       | `10-deploy-dev.yml`            |
| Dokploy app    | `DOKPLOY_APP_ID_DEV`           |

**Who uses it:** Maintainers. Confirms `main` is shippable before a release is cut.

---

## stg

**Purpose:** Release dress rehearsal. A `release/*` branch is deployed here and validated before
prd.

| Property       | Value                            |
| -------------- | -------------------------------- |
| Domain         | `stg-docs.apps.zcp.zsoftly.ca`   |
| SEO indexed    | No                               |
| Deploy trigger | Manual from a `release/*` branch |
| Artifact       | Built from the release branch    |
| Workflow       | `20-deploy-stg.yml`              |
| Dokploy app    | `DOKPLOY_APP_ID_STG`             |

The workflow switches the Dokploy stg app to the release branch (via `saveGithubProvider`) before
deploying, so stg always reflects exactly one release branch at a time. prd reads this value to
confirm a branch was staged before it ships.

---

## prd

**Purpose:** Live public documentation.

| Property       | Value                                                |
| -------------- | ---------------------------------------------------- |
| Canonical URL  | `docs.zsoftly.ca` (`site` in `astro.config.mjs`)     |
| Deploy target  | `docs.zcp.zsoftly.ca` (smoke-tested by the workflow) |
| Host           | bare-metal VM (shared with `zcp.zsoftly.ca`)         |
| SEO indexed    | Yes                                                  |
| Deploy trigger | Manual from a `release/*` branch already live on stg |
| Artifact       | Built from the release branch on the runner          |
| Workflow       | `30-deploy-prd.yml`                                  |

**Who uses it:** Public. Customers, prospects, search engines.

> **Reconcile this:** the canonical site URL (`astro.config.mjs`, `README.md`) is `docs.zsoftly.ca`,
> but `30-deploy-prd.yml` smoke-tests `docs.zcp.zsoftly.ca`. They are likely the same host under two
> names. Confirm which is the public hostname and align the smoke test, `site`, and Caddy host
> matcher so all three agree.

**Validation checklist:** see [launch-checklist.md](./launch-checklist.md).

---

## Environment configuration

Per-environment Caddy configs live in `deploy/caddy/`:

- `dev.Caddyfile`
- `stg.Caddyfile`
- `prd.Caddyfile`

Secrets are GitHub repository secrets, not per-environment GitHub environments. See
[cicd.md](./cicd.md#secrets) for the full list.
