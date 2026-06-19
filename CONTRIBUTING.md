# Contributing to ZSoftly Documentation

Thanks for helping improve the ZSoftly docs. They're open source. There are three ways to
contribute. Use whichever suits you:

- **Open an issue** to report a problem or request a change.
- **Open a pull request** to propose the fix directly.
- **Send an email** to **<docs-support@zsoftly.ca>** and we'll take it from there.

**Turnaround:** we aim to triage and fulfill documentation requests within **20 business days**.
Complex changes may take longer. We'll say so on the issue or PR.

**Not here:** platform bugs, billing, or account/support requests. Use the support ticket system in
the [ZSoftly Console](https://cloud.zcp.zsoftly.ca) for those.

## A note on languages

The docs are bilingual (English + French). **English is the source of truth.** Contribute in
**English**. You do not need to touch the French version. We machine-translate changes to French and
a dedicated native bilingual reviewer reviews them before they ship. (If you do submit French edits,
they go through the same review.)

## Report an issue

Open a [GitHub Issue](https://github.com/zsoftly/zcp-docs/issues) for:

- Typos, factual errors, or outdated content
- Missing topics or gaps in coverage
- Broken links or incorrect code examples
- Unclear explanations
- Translation problems (English or French)

Be specific: link the exact page, quote the wrong text, and say what it should be.

## Open a pull request

### 1. Fork, clone, install

```bash
git clone https://github.com/YOUR_USERNAME/zcp-docs
cd zcp-docs
pnpm install
```

### 2. Edit the English content

All docs live in `src/content/docs/` (English). Each page is Markdown with a `title` frontmatter
field. Follow [docs/content-standards.md](./docs/content-standards.md) for style, asides, code
blocks, and structure. Don't edit `src/content/docs/fr/**`. Our translation/review workflow handles
the French copy.

### 3. Run the checks

```bash
pnpm fmt && pnpm lint && pnpm typecheck && pnpm build
```

All four must pass. `pnpm build` validates internal links and fails on breakage. Run `pnpm fmt` last
so the diff is clean.

### 4. Open the PR

- Target the `main` branch.
- Title: a short summary (e.g. `fix: correct S3 endpoint for the YOW region`).
- Description: what changed and why. One logical change per PR.

We'll review, request changes if needed, and handle the French translation after merge.

## Commit style

Follow [Conventional Commits](https://www.conventionalcommits.org):

| Prefix   | Use for                              |
| -------- | ------------------------------------ |
| `fix:`   | Correcting wrong or outdated content |
| `feat:`  | Adding new doc pages or sections     |
| `chore:` | Config, tooling, dependency updates  |
| `style:` | Formatting-only changes              |

## What we don't publish

- Promotional or marketing content in technical pages
- Internal ZSoftly infrastructure details, credentials, or IP addresses
- Content that duplicates upstream documentation (CloudStack, Ceph, etc.). We link to it instead
- Unreviewed machine translation
