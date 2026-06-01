# ZSoftly Documentation

Source for [docs.zcp.zsoftly.ca](https://docs.zcp.zsoftly.ca), the official documentation for the
ZSoftly Cloud Platform (ZCP) and ZSoftly Private Cloud Platform (ZPCP).

Built with [Starlight](https://starlight.astro.build) (Astro).

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 10

## Local development

```bash
pnpm install
pnpm dev          # dev server at http://localhost:4321 (content only)
pnpm build        # full production build
pnpm preview      # serve built output (use this to test code blocks and search)
```

> Code block syntax highlighting and Pagefind search only work correctly in `pnpm preview`, not
> `pnpm dev`.

## Quality checks

Run before every commit:

```bash
pnpm fmt && pnpm lint && pnpm typecheck && pnpm build
```

## Content structure

```
src/content/docs/
├── public-cloud/     # ZCP — ZSoftly Cloud Platform (portal, CLI, API)
└── private-cloud/    # ZPCP — ZSoftly Private Cloud Platform
```

All content is Markdown (`.md`) or MDX (`.mdx`). Frontmatter requires at minimum:

```yaml
---
title: Page Title
---
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Contributor docs

Guides in [docs/](./docs/):

- [content-standards.md](./docs/content-standards.md): writing style and Starlight authoring rules
- [release-process.md](./docs/release-process.md): branch naming, commit format, local validation,
  the PR
- [launch-checklist.md](./docs/launch-checklist.md): content and quality checks before publishing

## License

Source code and tooling: [MIT](./LICENSE)

Documentation content: © 2026 ZSoftly Technologies Inc. All rights reserved.
