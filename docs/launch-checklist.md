# Pre-Publish Checklist

Content and quality validation to run before a change is published. Maintainers handle the
deployment steps separately.

---

## Build and quality

- [ ] `pnpm fmt:check` passes (no unformatted files)
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` completes and internal-link validation reports no broken links
- [ ] `dist/` has the expected page count (CI requires at least 50 files)

---

## Content

- [ ] Changed pages render correctly in `pnpm preview` (not just `pnpm dev`)
- [ ] Code blocks show syntax highlighting and the correct language
- [ ] Asides render as styled callouts, not literal `:::note` text
- [ ] Tables render (remember GFM tables do not work in `.mdx`)
- [ ] `<Tabs>` switch and stay synced where `syncKey` is set
- [ ] No em dashes, no banned words (see [content-standards.md](./content-standards.md))
- [ ] Public Cloud pages name no internal backends; "S3-compatible" only
- [ ] No real credentials, internal IPs, or hostnames in examples

---

## Navigation and links

- [ ] Sidebar groups and order are correct
- [ ] On-page (right-hand) heading nav is sensible
- [ ] All internal links resolve, including cross-section links
- [ ] External links open the intended target
- [ ] Pagefind search returns results for new pages

---

## SEO and metadata

- [ ] New pages have a `title`
- [ ] Key pages have a `description`
- [ ] Sitemap is accessible at `/sitemap-index.xml`
- [ ] Preview environments are not indexed; production is indexable

---

## After publish

- [ ] The published page loads over HTTPS and renders correctly
- [ ] Search returns results for new pages
- [ ] No broken links or missing images on the changed pages
