#!/usr/bin/env bash
# Trigger a Dokploy deploy and wait for completion.
# Usage: ./dokploy-deploy.sh <api_url> <api_key> <application_id> [timeout_seconds]

set -euo pipefail

API_URL="${1:?Usage: dokploy-deploy.sh <api_url> <api_key> <app_id> [timeout]}"
API_KEY="${2:?Missing api_key}"
APP_ID="${3:?Missing application_id}"
TIMEOUT="${4:-600}"

ENCODED_INPUT=$(python3 -c "import json,urllib.parse; print(urllib.parse.quote(json.dumps({'json':{'applicationId':'${APP_ID}'}})))")

# Get current status before deploy to detect change
BEFORE_STATUS=$(curl -sf \
  "${API_URL}/api/trpc/application.one?input=${ENCODED_INPUT}" \
  -H "x-api-key: ${API_KEY}" 2>/dev/null \
  | python3 -c "import json,sys; print(json.load(sys.stdin).get('result',{}).get('data',{}).get('json',{}).get('applicationStatus','unknown'))" 2>/dev/null || echo "unknown")

# Deploy metadata from GitHub Actions environment
DEPLOY_ACTOR="${GITHUB_ACTOR:-unknown}"
DEPLOY_SHA="${GITHUB_SHA:-unknown}"
DEPLOY_BRANCH="${GITHUB_REF_NAME:-unknown}"
DEPLOY_RUN_URL="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-}/actions/runs/${GITHUB_RUN_ID:-0}"

echo "[INFO] Deploy triggered by: ${DEPLOY_ACTOR}"
echo "[INFO] Commit: ${DEPLOY_SHA:0:8} on ${DEPLOY_BRANCH}"
echo "[INFO] Workflow: ${DEPLOY_RUN_URL}"
echo "[INFO] Current status: ${BEFORE_STATUS}"
echo "[INFO] Triggering deploy for ${APP_ID}"

# Trigger deploy
curl -sf -X POST \
  "${API_URL}/api/trpc/application.deploy" \
  -H "x-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"json\":{\"applicationId\":\"${APP_ID}\"}}" > /dev/null

echo "[OK] Deploy triggered"

# Write GitHub Actions job summary
write_summary() {
  local result="$1"
  local elapsed="$2"
  if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
    echo "**Deploy ${result}** — @${DEPLOY_ACTOR} deployed \`${DEPLOY_SHA:0:8}\` from \`${DEPLOY_BRANCH}\` in ${elapsed}s" >> "$GITHUB_STEP_SUMMARY"
  fi
}

# Wait for status to transition away from "done" (building) then back to "done" or "error"
START=$(date +%s)
SAW_RUNNING=false

while true; do
  ELAPSED=$(( $(date +%s) - START ))
  if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
    echo "[ERROR] Deploy timed out after ${TIMEOUT}s"
    write_summary "timeout" "$ELAPSED"
    exit 1
  fi

  STATUS=$(curl -sf \
    "${API_URL}/api/trpc/application.one?input=${ENCODED_INPUT}" \
    -H "x-api-key: ${API_KEY}" 2>/dev/null \
    | python3 -c "import json,sys; print(json.load(sys.stdin).get('result',{}).get('data',{}).get('json',{}).get('applicationStatus','unknown'))" 2>/dev/null || echo "unknown")

  if [ "$STATUS" = "running" ] || [ "$STATUS" = "idle" ]; then
    SAW_RUNNING=true
    echo "[INFO] Building... (${ELAPSED}s)"
  elif [ "$STATUS" = "done" ] && [ "$SAW_RUNNING" = true ]; then
    echo "[OK] Deploy completed in ${ELAPSED}s"
    write_summary "success" "$ELAPSED"
    exit 0
  elif [ "$STATUS" = "done" ] && [ "$SAW_RUNNING" = false ] && [ "$ELAPSED" -lt 15 ]; then
    echo "[INFO] Waiting for build to start... (${ELAPSED}s)"
  elif [ "$STATUS" = "done" ] && [ "$SAW_RUNNING" = false ]; then
    echo "[OK] Deploy completed in ${ELAPSED}s (fast build)"
    write_summary "success" "$ELAPSED"
    exit 0
  elif [ "$STATUS" = "error" ]; then
    echo "[ERROR] Deploy failed after ${ELAPSED}s"
    write_summary "failed" "$ELAPSED"
    exit 1
  else
    echo "[INFO] Status: ${STATUS} (${ELAPSED}s)"
  fi

  sleep 10
done
