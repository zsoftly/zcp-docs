#!/usr/bin/env bash
# Post-deploy smoke test with retry logic.
# Usage: ./smoke-test.sh <domain> [max_retries] [retry_delay_seconds]
#
# Checks key pages return HTTP 200 and that robots.txt and the sitemap are
# served for the host being tested. Retries the full suite if any check fails,
# giving Caddy time to propagate the new release.

set -euo pipefail

# TLS is verified by default. A smoke test that skips verification cannot tell a
# healthy release from one serving a wrong or expired certificate. Set
# SMOKE_INSECURE=1 only for a host with a certificate curl cannot chain.
CURL_TLS=()
if [ "${SMOKE_INSECURE:-0}" = "1" ]; then
  CURL_TLS=(-k)
  echo "[WARN] TLS verification disabled via SMOKE_INSECURE"
fi

DOMAIN="${1:?Usage: smoke-test.sh <domain> [max_retries] [retry_delay]}"
MAX_RETRIES="${2:-3}"
RETRY_DELAY="${3:-20}"

PATHS=(
  "/"
  "/public-cloud/getting-started/introduction"
  "/public-cloud/cli/installation"
  "/public-cloud/compute/create-instance"
  "/public-cloud/networking/vpc/create-vpc"
  "/private-cloud/overview"
  "/public-cloud/api/authentication"
  "/public-cloud/cli/quickstart"
)

MARKDOWN_PATHS=(
  "/public-cloud/getting-started/introduction.md|# Introduction"
  "/llms.txt|# ZSoftly Cloud Platform Documentation"
  "/llms-full.txt|## Source:"
)

# A normal documentation page must negotiate to its generated Markdown export
# when a client sends Accept: text/markdown. These are nested English and
# French pages because the documentation home redirects and has no export.
MARKDOWN_NEGOTIATION_CHECKS=(
  "/public-cloud/getting-started/introduction|/public-cloud/getting-started/introduction.md|# Introduction"
  "/fr/public-cloud/getting-started/introduction|/fr/public-cloud/getting-started/introduction.md|# Introduction"
)

SMOKE_TMP_DIR="$(mktemp -d)"

trap 'rm -rf -- "$SMOKE_TMP_DIR"' EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

temp_file() {
  mktemp "$SMOKE_TMP_DIR/smoke.XXXXXX"
}

has_vary_accept() {
  local headers="$1"
  grep -Eiq '^vary:[[:space:]]*([^[:space:],]+[[:space:]]*,[[:space:]]*)*accept([[:space:]]*,|[[:space:]]*$)' "$headers"
}

# The sitemap host is baked in at build time from PUBLIC_SITE_URL. A release
# built for the wrong host serves pages that look right while pointing every
# crawler at another domain, and a search engine that reads that sitemap finds
# nothing it can use. Check it on the live host, not only in the build output.
check_crawler_files() {
  local fail=0
  local status body

  for path in "/robots.txt" "/sitemap-index.xml"; do
    # curl writes 000 on a transport error; || true keeps set -e from killing
    # the retry loop, matching the sitemap fetch below.
    status=$(curl -s "${CURL_TLS[@]}" --max-time 15 -o /dev/null -w "%{http_code}" "https://${DOMAIN}${path}" || true)
    if [ "$status" = "200" ]; then
      echo "[OK] ${path} -> ${status}"
    else
      echo "[FAIL] ${path} -> ${status}"
      fail=1
    fi
  done

  body=$(curl -s "${CURL_TLS[@]}" --max-time 15 "https://${DOMAIN}/sitemap-index.xml" || true)
  if echo "$body" | grep -q "<loc>https://${DOMAIN}/"; then
    echo "[OK] /sitemap-index.xml points at ${DOMAIN}"
  else
    echo "[FAIL] /sitemap-index.xml does not point at ${DOMAIN}"
    echo "$body" | grep -o '<loc>[^<]*</loc>' | head -3 | sed 's/^/        /'
    fail=1
  fi

  return $fail
}

check_markdown_files() {
  local fail=0 path expected response status body
  for entry in "${MARKDOWN_PATHS[@]}"; do
    path="${entry%%|*}"
    expected="${entry#*|}"
    response=$(curl -s "${CURL_TLS[@]}" --max-time 15 -w $'\n%{http_code}' "https://${DOMAIN}${path}" || true)
    status="${response##*$'\n'}"
    body="${response%$'\n'*}"
    if [ "$status" != "200" ]; then
      echo "[FAIL] ${path} -> ${status}"
      fail=1
    elif [[ "$body" == *'<!doctype html'* || "$body" == *'<html'* ]]; then
      echo "[FAIL] ${path} returned HTML instead of Markdown"
      fail=1
    elif [[ "$body" == *"${expected}"* ]]; then
      echo "[OK] ${path} -> Markdown body"
    else
      echo "[FAIL] ${path} did not contain expected Markdown content"
      fail=1
    fi
  done
  return $fail
}

check_markdown_negotiation() {
  local fail=0 entry page markdown_path expected
  local markdown_headers markdown_body exported_body html_headers html_body
  local markdown_status exported_status html_status

  for entry in "${MARKDOWN_NEGOTIATION_CHECKS[@]}"; do
    page="${entry%%|*}"
    entry="${entry#*|}"
    markdown_path="${entry%%|*}"
    expected="${entry#*|}"
    markdown_headers=$(temp_file)
    markdown_body=$(temp_file)
    exported_body=$(temp_file)
    html_headers=$(temp_file)
    html_body=$(temp_file)

    markdown_status=$(curl -s "${CURL_TLS[@]}" --max-time 15 -H 'Accept: text/markdown' \
      -D "$markdown_headers" -o "$markdown_body" -w "%{http_code}" "https://${DOMAIN}${page}" || true)
    exported_status=$(curl -s "${CURL_TLS[@]}" --max-time 15 \
      -o "$exported_body" -w "%{http_code}" "https://${DOMAIN}${markdown_path}" || true)
    html_status=$(curl -s "${CURL_TLS[@]}" --max-time 15 \
      -D "$html_headers" -o "$html_body" -w "%{http_code}" "https://${DOMAIN}${page}" || true)

    local entry_fail=0
    if [ "$markdown_status" != "200" ] || [ "$exported_status" != "200" ] || [ "$html_status" != "200" ]; then
      echo "[FAIL] ${page}: expected HTTP 200 (Markdown ${markdown_status}, export ${exported_status}, HTML ${html_status})"
      entry_fail=1
    fi
    if ! cmp -s "$markdown_body" "$exported_body"; then
      echo "[FAIL] ${page}: negotiated Markdown body differs from ${markdown_path}"
      entry_fail=1
    fi
    if ! grep -Fq "$expected" "$markdown_body"; then
      echo "[FAIL] ${page}: negotiated Markdown body is missing expected title"
      entry_fail=1
    fi
    if grep -Eiq '<!doctype html|<html[ >]' "$markdown_body"; then
      echo "[FAIL] ${page}: Accept: text/markdown returned HTML"
      entry_fail=1
    fi
    if ! grep -Eiq '^content-type:[[:space:]]*text/markdown([;[:space:]]|$)' "$markdown_headers"; then
      echo "[FAIL] ${page}: negotiated response is missing text/markdown content type"
      entry_fail=1
    fi
    if ! has_vary_accept "$markdown_headers"; then
      echo "[FAIL] ${page}: negotiated response is missing Vary: Accept"
      entry_fail=1
    fi
    if ! grep -Eiq '<!doctype html|<html[ >]' "$html_body"; then
      echo "[FAIL] ${page}: normal request did not return HTML"
      entry_fail=1
    fi
    if ! grep -Eiq '^content-type:[[:space:]]*text/html([;[:space:]]|$)' "$html_headers"; then
      echo "[FAIL] ${page}: normal response is missing text/html content type"
      entry_fail=1
    fi
    if ! has_vary_accept "$html_headers"; then
      echo "[FAIL] ${page}: normal response is missing Vary: Accept"
      entry_fail=1
    fi

    if [ "$entry_fail" -eq 0 ]; then
      echo "[OK] ${page} negotiates to ${markdown_path} and defaults to HTML"
    else
      fail=1
    fi
  done
  return $fail
}

run_checks() {
  local fail=0
  for path in "${PATHS[@]}"; do
    status=$(curl -s "${CURL_TLS[@]}" --max-time 15 -o /dev/null -w "%{http_code}" "https://${DOMAIN}${path}" || true)
    if [ "$status" = "200" ]; then
      echo "[OK] ${path} -> ${status}"
    else
      echo "[FAIL] ${path} -> ${status}"
      fail=1
    fi
  done

  check_crawler_files || fail=1
  check_markdown_files || fail=1
  check_markdown_negotiation || fail=1

  return $fail
}

for attempt in $(seq 1 "$MAX_RETRIES"); do
  echo ""
  echo "[INFO] Smoke test attempt ${attempt}/${MAX_RETRIES} on https://${DOMAIN}"
  if run_checks; then
    echo ""
    echo "[OK] All ${#PATHS[@]} pages, crawler files, Markdown exports, and negotiated Markdown pages check out on https://${DOMAIN}"
    exit 0
  fi

  if [ "$attempt" -lt "$MAX_RETRIES" ]; then
    echo "[INFO] Retrying in ${RETRY_DELAY}s..."
    sleep "$RETRY_DELAY"
  fi
done

echo ""
echo "[ERROR] Smoke tests failed after ${MAX_RETRIES} attempts"
exit 1
