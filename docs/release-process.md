# Contributing Changes

How to develop a change and get it published.

For reporting issues and the fork/PR basics, see [CONTRIBUTING.md](../CONTRIBUTING.md). For writing
style and Starlight authoring rules, see [content-standards.md](./content-standards.md).

---

## Workflow

```
branch -> open PR -> CI passes -> merge to main -> published
```

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
3. Commit with a [conventional commit](#commit-format) message and open a PR to `main`. CI
   (formatting, lint, type check, dependency audit, build) must be green.
4. After review and merge to `main`, the change is published to the documentation site through
   ZSoftly's internal deployment pipeline. Maintainers handle promotion through the staging and
   production stages.

---

## Branch naming

| Type    | Pattern                 | Example                     |
| ------- | ----------------------- | --------------------------- |
| Feature | `feat/{description}`    | `feat/add-dns-domains-page` |
| Fix     | `fix/{description}`     | `fix/correct-s3-endpoint`   |
| Content | `content/{description}` | `content/rewrite-vpc-intro` |

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
| `ci`      | GitHub Actions or build config                   |
| `docs`    | Changes to this `docs/` folder or `CONTRIBUTING` |

Examples:

```
content: rewrite DNS domains page and add registrar reference
fix: correct S3 endpoint for the YOW region
```

Do not add `Co-Authored-By: Claude`, a "Generated with Claude Code" footer, or any AI attribution to
commit messages or PR descriptions.
