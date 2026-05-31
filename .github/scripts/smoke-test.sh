#!/usr/bin/env bash
# Post-deploy smoke test with retry logic.
# Usage: ./smoke-test.sh <domain> [max_retries] [retry_delay_seconds]
#
# Checks key pages return HTTP 200. Retries the full suite if any page fails,
# giving Dokploy/Traefik time to propagate the new deployment.

set -euo pipefail

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

run_checks() {
  local fail=0
  for path in "${PATHS[@]}"; do
    status=$(curl -sk --max-time 15 -o /dev/null -w "%{http_code}" "https://${DOMAIN}${path}")
    if [ "$status" = "200" ]; then
      echo "[OK] ${path} -> ${status}"
    else
      echo "[FAIL] ${path} -> ${status}"
      fail=1
    fi
  done
  return $fail
}

for attempt in $(seq 1 "$MAX_RETRIES"); do
  echo ""
  echo "[INFO] Smoke test attempt ${attempt}/${MAX_RETRIES} on https://${DOMAIN}"
  if run_checks; then
    echo ""
    echo "[OK] All ${#PATHS[@]} pages returned 200 on https://${DOMAIN}"
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
