# Contributing to ZSoftly Documentation

Thank you for helping improve the ZSoftly docs. This guide covers how to report issues, suggest
changes, and submit pull requests.

## Reporting issues

Use [GitHub Issues](https://github.com/zsoftly/zcp-docs/issues) for:

- Typos, factual errors, or outdated content
- Missing topics or gaps in coverage
- Broken links or incorrect code examples
- Unclear explanations

**Not the right place for:** platform bugs, billing issues, or support requests — use the
[ZSoftly Console](https://cloud.zcp.zsoftly.ca) support ticket system for those.

## Making changes

### 1. Fork and clone

```bash
git clone https://github.com/YOUR_USERNAME/zcp-docs
cd zcp-docs
pnpm install
```

### 2. Run locally

```bash
pnpm build && pnpm preview
```

> Use `pnpm preview` (not `pnpm dev`) to verify code block rendering and search.

### 3. Edit content

All docs live in `src/content/docs/`. Each file is standard Markdown with a `title` frontmatter
field:

```yaml
---
title: Page Title
---
```

- Keep sentences short and direct.
- Use code blocks with a language tag (` ```bash `, ` ```python `, etc.).
- Replace screenshots with the `:::note Screenshot pending:::` admonition if you cannot take a fresh
  one.
- Do not reference internal ZSoftly infrastructure details, credentials, or IP addresses.

### 4. Run quality checks

```bash
pnpm fmt && pnpm lint && pnpm typecheck && pnpm build
```

All four must pass before opening a pull request.

### 5. Open a pull request

- Target the `main` branch.
- Title: short description of what changed (e.g. `fix: correct S3 endpoint for YOW region`).
- Description: what you changed and why.
- One logical change per PR — split unrelated fixes into separate PRs.

## Commit style

Follow [Conventional Commits](https://www.conventionalcommits.org):

| Prefix   | Use for                              |
| -------- | ------------------------------------ |
| `fix:`   | Correcting wrong or outdated content |
| `feat:`  | Adding new doc pages or sections     |
| `chore:` | Config, tooling, dependency updates  |
| `style:` | Formatting-only changes              |

## What we will not merge

- Promotional or marketing content
- Changes that expose internal ZSoftly infrastructure
- Content that duplicates upstream documentation (CloudStack, Ceph, etc.) — link to it instead
- AI-generated content that has not been reviewed for accuracy

## Questions

Open a [GitHub Discussion](https://github.com/zsoftly/zcp-docs/discussions) or a GitHub Issue with
the `question` label.
