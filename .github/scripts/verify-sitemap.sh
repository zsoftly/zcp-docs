#!/usr/bin/env bash
# Verify the built sitemap points at the host this build is meant for.
#
# Usage: ./verify-sitemap.sh <expected-site-url> [dist-dir]
#
# Astro bakes the `site` value from astro.config.mjs into sitemap-index.xml, into
# every <loc> and hreflang alternate in the child sitemaps, and into every
# canonical link. A build that picks up the wrong PUBLIC_SITE_URL still succeeds
# and still renders correctly in a browser, so nothing catches it. What ships is
# a sitemap index served on one host whose child sitemap lives on another. Google
# parses the index, cannot use the child, and reports zero discovered pages.
#
# This check fails the build instead.

set -euo pipefail

EXPECTED="${1:?Usage: verify-sitemap.sh <expected-site-url> [dist-dir]}"
DIST="${2:-dist}"

ORIGIN="${EXPECTED%/}"
PREFIX="${ORIGIN}/"
INDEX="${DIST}/sitemap-index.xml"

# Pulls both <loc> values and hreflang alternate hrefs. XML namespaces are
# declared with xmlns=, so they are not matched here.
extract_urls() {
  grep -oE '(<loc>|href=")https?://[^"<]+' "$1" | sed -E 's/^(<loc>|href=")//'
}

check_file() {
  local file="$1"
  local locs checked off

  # Astro writes the whole sitemap on one line, so count occurrences, not lines.
  locs=$(grep -o '<loc>' "$file" | wc -l | tr -d ' ')
  if [ "$locs" -eq 0 ]; then
    echo "[FAIL] ${file} contains no <loc> entries"
    return 1
  fi

  # Every URL is checked, not just the <loc> values, so report both counts.
  checked=$(extract_urls "$file" | wc -l | tr -d ' ')
  off=$(extract_urls "$file" | awk -v p="$PREFIX" 'index($0, p) != 1' | sort -u)
  if [ -n "$off" ]; then
    echo "[FAIL] ${file} references URLs outside ${ORIGIN}"
    echo "$off" | head -5 | sed 's/^/        /'
    return 1
  fi

  echo "[OK] ${file}: ${locs} entries, ${checked} URLs checked, all under ${ORIGIN}"
  return 0
}

if [ ! -f "$INDEX" ]; then
  echo "[ERROR] Sitemap index not found at ${INDEX}"
  exit 1
fi

echo "[INFO] Expecting every sitemap URL to start with ${PREFIX}"

fail=0
check_file "$INDEX" || fail=1

# Each child listed in the index must exist in the build output and be clean too.
# Map each child URL back to a path under DIST by stripping the origin, so a
# sitemap nested in a subdirectory resolves correctly. check_file on the index
# has already proved every URL starts with PREFIX.
while IFS= read -r child; do
  [ -n "$child" ] || continue
  child_file="${DIST}/${child#"$PREFIX"}"
  if [ ! -f "$child_file" ]; then
    echo "[FAIL] Sitemap index lists ${child}, but ${child_file} is not in the build output"
    fail=1
    continue
  fi
  check_file "$child_file" || fail=1
done < <(grep -o '<loc>[^<]*</loc>' "$INDEX" | sed 's|<loc>||; s|</loc>||')

if [ "$fail" -ne 0 ]; then
  echo "[ERROR] Sitemap does not match ${ORIGIN}. Check PUBLIC_SITE_URL for this build."
  exit 1
fi

echo "[OK] Sitemap matches ${ORIGIN}"
