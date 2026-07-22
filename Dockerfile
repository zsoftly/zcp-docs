FROM node:22-bookworm-slim AS builder

WORKDIR /app
RUN corepack enable pnpm

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

# Chromium for Playwright — rehype-mermaid renders Mermaid diagrams to static
# SVG at build time. Debian base (not Alpine) is required because Playwright's
# Chromium needs glibc. This builder stage is discarded; the runtime image below
# stays caddy:2-alpine.
RUN pnpm exec playwright install --with-deps chromium

COPY . .

# Non-prod host for Docker (dev/stg) builds; prod is built by the iaas play
# without this arg and falls back to the canonical host in astro.config.mjs.
ARG PUBLIC_SITE_URL=https://dev-docs.apps.zcp.zsoftly.ca
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL
RUN pnpm build

FROM caddy:2-alpine

# Labels apply to the final runtime image (a builder-stage LABEL is discarded).
LABEL org.opencontainers.image.source=https://github.com/zsoftly/zcp-docs
LABEL org.opencontainers.image.description="ZSoftly Documentation"

# Patch Alpine OS packages — clears OS-level CVEs in the shipped runtime image
RUN apk upgrade --no-cache

ARG CADDYFILE=dev.Caddyfile
COPY deploy/caddy/${CADDYFILE} /etc/caddy/Caddyfile
COPY --from=builder /app/dist /srv

ENV SITE_DOMAIN=:80
ENV SITE_ROOT=/srv

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:80/ || exit 1
