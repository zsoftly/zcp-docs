#!/usr/bin/env bash
# Verify the built robots file advertises the sitemap for this deployment host.

set -euo pipefail

EXPECTED="${1:?Usage: .github/scripts/verify-robots.sh <expected-site-url> [dist-dir]}"
DIST="${2:-dist}"
ORIGIN="${EXPECTED%/}"
ROBOTS="${DIST}/robots.txt"
SITEMAP="Sitemap: ${ORIGIN}/sitemap-index.xml"

if [ ! -f "$ROBOTS" ]; then
  echo "[FAIL] Robots file not found at ${ROBOTS}"
  exit 1
fi

if ! grep -Fxq 'User-agent: *' "$ROBOTS" || ! grep -Fxq 'Allow: /' "$ROBOTS"; then
  echo "[FAIL] ${ROBOTS} does not preserve the crawler policy"
  exit 1
fi

if ! grep -Fxq "$SITEMAP" "$ROBOTS"; then
  echo "[FAIL] ${ROBOTS} does not advertise ${SITEMAP#Sitemap: }"
  exit 1
fi

echo "[OK] ${ROBOTS} advertises ${SITEMAP#Sitemap: }"
