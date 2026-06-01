# Release Process

How to develop a change and ship it through dev, stg, and prd.

For the pipeline internals (workflows, secrets, runners) see [cicd.md](./cicd.md). For environment
definitions see [environments.md](./environments.md).

---

## Git workflow

```
issue branch -> main -> dev (auto) -> release/YYYY-MM-DD-HHMM -> stg (manual) -> prd (manual, same branch)
```

The same release branch is deployed to stg and then prd. Nothing reaches prd that was not first
validated on stg; the prd workflow enforces this by reading the branch Dokploy has on stg.

---

## Day to day

1. Branch from `main`:
   ```bash
   git switch main && git pull
   git switch -c fix/correct-s3-endpoint
   ```
2. Make the change and validate locally:
   ```bash
   pnpm fmt && pnpm lint && pnpm typecheck && pnpm build
   ```
   `pnpm build` runs internal-link validation. Use `pnpm preview` to check rendering, code blocks,
   and search.
3. Commit with a [conventional commit](#commit-format) message and open a PR to `main`.
4. Merge to `main`. This auto-deploys to **dev** (`dev-docs.apps.zcp.zsoftly.ca`).
5. Validate the change on dev.

---

## Releasing to stg and prd

1. Cut a release branch from the dev-verified `main` (UTC timestamp):
   ```bash
   RELEASE_TS=$(date -u +%Y-%m-%d-%H%M)
   git switch main && git pull
   git switch -c release/$RELEASE_TS
   git push -u origin release/$RELEASE_TS
   ```
2. Deploy to **stg**: Actions tab, **"20: Deploy Staging"**, Run workflow, branch =
   `release/$RELEASE_TS`.
3. Validate stg (`stg-docs.apps.zcp.zsoftly.ca`): changed pages render, navigation resolves, search
   works, no broken links.
4. Deploy to **prd**: Actions tab, **"30: Deploy Production"**, same release branch. The workflow
   refuses to run unless that branch is the one currently on stg.
5. Validate prd against [launch-checklist.md](./launch-checklist.md).
6. Open a PR from `release/$RELEASE_TS` back to `main` if the branch picked up release-only fixes,
   then merge so `main` stays the source of truth.

### From the CLI

```bash
gh workflow run 20-deploy-stg.yml --ref main -f branch=release/$RELEASE_TS
gh workflow run 30-deploy-prd.yml --ref main -f branch=release/$RELEASE_TS
```

`--ref main` selects the workflow definition; the `branch` input is what gets deployed.

---

## Fixes found during stg validation

Branch from the release branch, not `main`, so the fix ships with the release:

```bash
git switch release/YYYY-MM-DD-HHMM
git switch -c fix/short-description
# fix, commit, push, open a PR targeting the release branch
```

After merge, redeploy stg, then prd, with the same release branch. Land the fix back on `main` too.

---

## Rollback

Re-run **"30: Deploy Production"** with the previous release branch name. The runner rebuilds that
branch and rsyncs it over the live files. Roll stg back the same way with **"20: Deploy Staging"**
so stg and prd stay on the same branch.

---

## Branch naming

| Type    | Pattern                   | Example                     |
| ------- | ------------------------- | --------------------------- |
| Feature | `feat/{description}`      | `feat/add-dns-domains-page` |
| Fix     | `fix/{description}`       | `fix/correct-s3-endpoint`   |
| Content | `content/{description}`   | `content/rewrite-vpc-intro` |
| Release | `release/YYYY-MM-DD-HHMM` | `release/2026-06-01-1430`   |
| Hotfix  | `hotfix/{description}`    | `hotfix/broken-cli-link`    |

Use lowercase and hyphens. No spaces, no underscores, no uppercase.

---

## Commit format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short summary>

[optional body]
```

| Type      | When to use                                      |
| --------- | ------------------------------------------------ |
| `content` | Copy changes, rewrites, new prose                |
| `feat`    | New doc page or section, new component           |
| `fix`     | Wrong or outdated content, broken link, bad code |
| `style`   | Formatting only, no content change               |
| `chore`   | Config, tooling, dependency updates              |
| `ci`      | GitHub Actions, deploy scripts, Caddy config     |
| `docs`    | Changes to this `docs/` folder or `CONTRIBUTING` |

Examples:

```
content: rewrite DNS domains page and add registrar reference
fix: correct S3 endpoint for the YOW region
ci: switch staging smoke test to the new hostname
```

Never add `Co-Authored-By: Claude`, a "Generated with Claude Code" footer, or any AI attribution to
commit messages or PR descriptions. The maintainer reviews, commits, and pushes all changes; see
[CLAUDE.md](../CLAUDE.md).
