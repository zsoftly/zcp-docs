# CLAUDE.md — ZCP Docs

AI assistant instructions for this repository (the ZSoftly documentation site).

---

## Project Documentation

- **[README.md](./README.md)** — overview and local setup
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — workflow, quality checks, commit style, PRs
- **[docs/](./docs/)** — contributor guides: [content-standards](./docs/content-standards.md),
  [release-process](./docs/release-process.md), [launch-checklist](./docs/launch-checklist.md)
- **Internal platform docs** — for product, API, or operations details not documented here, search
  the platform repo ([github.com/zsoftly/platform](https://github.com/zsoftly/platform) → `docs/`,
  typically a sibling checkout at `../platform`) as the source of truth. Do not copy internal-only
  details into these public pages.

---

## Critical AI Policies

### Never Commit or Push

Do NOT run `git commit`, `git push`, `git add`, or any git write operation — ever. The maintainer
personally reviews, commits, and pushes all code. Make the file changes, validate them, and stop.

Read-only git operations (`git status`, `git diff`, `git log`, `git show`) are fine.

### No AI Attribution

Never add `Co-Authored-By: Claude …`, a "Generated with Claude Code" footer, or any other
Claude/Anthropic/AI reference to commit messages or PR descriptions.

### No Emojis in Code

No emojis in `.astro`, `.ts`, `.css`, `.mjs`, scripts, or GitHub Actions files. Use `[OK]`,
`[ERROR]`, `[WARN]`, `[INFO]` in code. Emojis are fine in `.md`/`.mdx` documentation only.

### Never Hardcode Home Paths

Use `$HOME` or `~/` instead of `/Users/<name>/` or any specific username in docs, scripts, and
config.

---

## Docs Authoring Conventions

These are Starlight-specific and easy to get wrong:

### Asides (callouts)

- Valid types are **`note`, `tip`, `caution`, `danger`** only. `:::warning` is NOT valid and renders
  as plain text — use `:::caution`.
- Always use the blank-line block form so Prettier (`proseWrap: always`) can't collapse them:

  ```md
  :::caution

  Your warning text here.

  :::
  ```

  Content on the same line as `:::type`, or a closing `:::` jammed onto a content line, breaks
  rendering.

### MDX vs Markdown

- Use `.mdx` only when you need components (e.g. Starlight `<Tabs>`/`<TabItem>`). Add the import:
  `import { Tabs, TabItem } from '@astrojs/starlight/components';`
- **GFM tables do NOT render in `.mdx`** (they work in `.md`). In `.mdx`, write tables as raw HTML
  (`<table>…</table>`); Starlight styles them the same.

### Code blocks

- Code blocks render as flat boxes (no frame chrome) via `defaultProps.frame: 'none'` in
  `ec.config.mjs`. This is intentional and also works around an Expressive Code 0.42 / Astro 6 bug
  where terminal frames fail to paint single-line code blocks. Do not re-enable frames.
- Multi-language examples (API/SDK) go in `<Tabs>` with `syncKey` so the language choice syncs
  across sections. CLI/shell/portal-UI examples stay single-language.

### Vendor neutrality (Public vs Private cloud)

- **Public Cloud (ZCP)** pages (`src/content/docs/public-cloud/`) must be vendor-neutral — do NOT
  name internal backends (e.g. "backed by Ceph"). Object storage is "S3-compatible", full stop.
- **Private Cloud (ZPCP)** pages (`src/content/docs/private-cloud/`) intentionally document the
  stack the customer operates (Ceph, CloudStack, etc.) — leave those references in place.
- The `…/api/docs/ceph` and `…/api/docs/nimbo` URLs are real API endpoints; keep the hrefs, but use
  neutral link text.

---

## Environment Names

Always use the short forms:

| Use   | Never use            |
| ----- | -------------------- |
| `dev` | `development`        |
| `stg` | `staging`            |
| `prd` | `prod`, `production` |

---

## Tech Stack Quick Reference

- Framework: **Astro 6** + **Starlight 0.39**
- Code blocks: **Expressive Code 0.42** (configured in `ec.config.mjs`)
- Content: Markdown + MDX via Starlight content collections (`src/content/docs/`)
- Layout overrides: `src/overrides/*.astro`; global styles: `src/styles/custom.css`
- Package manager: **pnpm 10**
- Link checking: `starlight-links-validator` (the build fails on broken internal links)

---

## Validating Changes

Run these to validate before handing back (do not commit afterward):

| Command          | Purpose                                     |
| ---------------- | ------------------------------------------- |
| `pnpm fmt`       | Format with Prettier                        |
| `pnpm fmt:check` | Check formatting (CI gate)                  |
| `pnpm lint`      | ESLint                                      |
| `pnpm typecheck` | `astro sync && tsc --noEmit`                |
| `pnpm build`     | Production build + internal-link validation |
| `pnpm dev`       | Local dev server                            |
| `pnpm preview`   | Serve the production build                  |

Leave `pnpm install` and any dependency version changes to the maintainer — flag them, don't run
them.
