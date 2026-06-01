# Launch Checklist

Validation before promoting a release to prd. Run through this against stg first, then confirm the
prd items after deploy.

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
- [ ] dev and stg are not indexed
- [ ] prd is indexable (no `noindex` header or meta)

---

## Pipeline

- [ ] Release branch follows `release/YYYY-MM-DD-HHMM`
- [ ] stg deploy succeeded and its smoke test passed
- [ ] prd deploy used the same branch that is live on stg
- [ ] prd smoke test passed against the live hostname

---

## prd verification (after deploy)

- [ ] Homepage loads over HTTPS with a valid TLS certificate
- [ ] A spot-check of changed pages renders correctly
- [ ] Search works on the live site
- [ ] No 4xx or 5xx on the smoke-tested paths
- [ ] Caddy security headers are present (see `deploy/caddy/prd.Caddyfile`)
- [ ] The canonical hostname and the deploy/smoke hostname agree (see the note in
      [environments.md](./environments.md#prd))
