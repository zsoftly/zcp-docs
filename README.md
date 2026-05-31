# ZSoftly Documentation

Source for [docs.zsoftly.ca](https://docs.zsoftly.ca) — the official documentation for the ZSoftly
Cloud Platform (ZCP) and ZSoftly Private Cloud Platform (ZPCP).

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

## License

Source code and tooling: [MIT](./LICENSE)

Documentation content: © 2026 ZSoftly Technologies Inc. All rights reserved.
