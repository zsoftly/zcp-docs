FROM node:22-alpine AS builder

LABEL org.opencontainers.image.source=https://github.com/zsoftly/zcp-docs
LABEL org.opencontainers.image.description="ZSoftly Documentation"

# Patch Alpine OS packages with fixes published since the base image was built
RUN apk upgrade --no-cache

WORKDIR /app
RUN corepack enable pnpm

COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM caddy:2-alpine

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
