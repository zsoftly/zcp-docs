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

  return $fail
}

for attempt in $(seq 1 "$MAX_RETRIES"); do
  echo ""
  echo "[INFO] Smoke test attempt ${attempt}/${MAX_RETRIES} on https://${DOMAIN}"
  if run_checks; then
    echo ""
    echo "[OK] All ${#PATHS[@]} pages, robots.txt, and the sitemap check out on https://${DOMAIN}"
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
