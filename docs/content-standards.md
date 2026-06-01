# Content Standards

How to write and structure documentation in this repo. This is the content equivalent of a code
style guide. The Starlight-specific authoring rules are also summarized in
[CLAUDE.md](../CLAUDE.md); this file is the human reference.

---

## Writing style

Write spartan, direct, technical prose. The reader is configuring infrastructure and wants the
answer, not a narrative.

### Do

- Use clear, simple language and short sentences.
- Use active voice. "The system generates the report", not "the report is generated".
- Address the reader as "you".
- Lead with the action. "Click **Add Domain**", not "You will want to click Add Domain".
- Support claims with concrete values and examples.
- Keep one idea per sentence.

### Avoid

- **Em dashes.** Use a period, comma, colon, or parentheses instead. This is enforced by review.
- Semicolons in prose.
- Marketing and hyperbole: "powerful", "seamless", "robust", "cutting-edge", "game-changer".
- Filler: "simply", "just", "basically", "of course", "in order to".
- Weak setups: "It is important to note that", "In today's world", "At the end of the day".
- Unnecessary adjectives and adverbs.

### Banned words

Avoid these in prose: `leverage`, `utilize`, `delve`, `seamless`, `robust`, `powerful`,
`cutting-edge`, `game-changer`, `unlock`, `revolutionize`, `harness`, `realm`, `landscape`,
`tapestry`, `navigating`, `in conclusion`, `furthermore`, `moreover`.

`can` and `may` are fine in reference docs where precision needs them; prefer the direct form when
the sentence reads cleanly without them.

---

## Headings

- Use Title Case for headings, consistent across a page and with sibling pages.
- One `<h1>` per page comes from the `title` frontmatter; start body headings at `##`.
- Keep headings short and scannable. The right-hand on-page nav is built from them.

---

## Frontmatter

Every page needs at least a `title`. Add a `description` for any page you want to read well in
search results and social previews.

```yaml
---
title: Domains
description: Register, transfer, and manage DNS domains in the ZSoftly Cloud Platform.
---
```

---

## Asides (callouts)

Valid types are **`note`, `tip`, `caution`, `danger`** only. `:::warning` is not valid and renders
as plain text; use `:::caution`.

Always use the blank-line block form. Prettier (`proseWrap: always`) can otherwise collapse an
inline aside and break rendering:

```md
:::caution

Changing the OS erases all data on the VM. Back up critical data first.

:::
```

Content jammed onto the `:::type` line, or a closing `:::` on a content line, does not render.

---

## Markdown vs MDX

- Use `.md` by default.
- Use `.mdx` only when you need components, such as Starlight `<Tabs>` / `<TabItem>`. Add the import
  at the top:
  ```mdx
  import { Tabs, TabItem } from '@astrojs/starlight/components';
  ```
- **GFM tables do not render in `.mdx`.** They work in `.md`. In `.mdx`, write tables as raw HTML
  (`<table>...</table>`); Starlight styles them the same.

---

## Code blocks

- Always tag the language: ` ```bash `, ` ```python `, ` ```json `.
- Blocks render as flat boxes (no frame chrome) by design, via `defaultProps.frame: 'none'` in
  `ec.config.mjs`. Do not re-enable frames.
- For multi-language API or SDK examples, use `<Tabs syncKey="lang">` so the language choice syncs
  across the page. Keep CLI, shell, and portal-UI examples single-language.
- Do not put real credentials, internal IPs, or hostnames in examples. Use placeholders such as
  `your-token`, `<access-key>`, `example.com`.

---

## Vendor neutrality

- **Public Cloud (ZCP)** pages under `src/content/docs/public-cloud/` must be vendor-neutral. Do not
  name internal backends. Object storage is "S3-compatible", full stop.
- **Private Cloud (ZPCP)** pages under `src/content/docs/private-cloud/` intentionally document the
  stack the customer operates (CloudStack, Ceph, and so on). Leave those references in place.
- The `.../api/docs/ceph` and `.../api/docs/nimbo` URLs are real endpoints. Keep the hrefs, but use
  neutral link text.

---

## Content structure

```
src/content/docs/
├── public-cloud/     # ZCP: portal, CLI, API
└── private-cloud/    # ZPCP
```

- One logical topic per page.
- Cross-link related pages with a "See also" line or a "Next steps" list using relative links.
- Internal links are validated at build time. A broken link fails CI, so run `pnpm build` before you
  open a PR.

---

## Before you open a PR

```bash
pnpm fmt && pnpm lint && pnpm typecheck && pnpm build
```

All four must pass. `pnpm fmt` rewraps prose to 100 columns and normalizes formatting; run it last
so the diff is clean.
