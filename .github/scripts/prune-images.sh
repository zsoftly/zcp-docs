#!/usr/bin/env bash
# Deletes old container image versions from one GHCR package.
# Docs: platform docs/deployments/web-deployments.md
set -euo pipefail

: "${ORG:?}" "${PACKAGE:?}" "${GH_TOKEN:?}" "${PINNED_FILE:?}"
KEEP_BUILDS="${KEEP_BUILDS:-10}"
MIN_AGE_DAYS="${MIN_AGE_DAYS:-2}"
DRY_RUN="${DRY_RUN:-true}"

API="https://api.github.com/orgs/${ORG}/packages/container/${PACKAGE}"
REGISTRY="https://ghcr.io"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

printf 'Authorization: Bearer %s\n' "$GH_TOKEN" >"$WORK/api.hdr"
printf 'user = "token:%s"\n' "$GH_TOKEN" >"$WORK/registry-login.cfg"

api() {
  curl -fsS --max-time 30 \
    -H @"$WORK/api.hdr" \
    -H 'Accept: application/vnd.github+json' \
    -H 'X-GitHub-Api-Version: 2022-11-28' "$@"
}

[[ "$KEEP_BUILDS" =~ ^[1-9][0-9]*$ ]] || { echo "[ERROR] KEEP_BUILDS must be a positive number"; exit 1; }
[[ "$MIN_AGE_DAYS" =~ ^[0-9]+$ ]] || { echo "[ERROR] MIN_AGE_DAYS must be a number"; exit 1; }
[[ "$DRY_RUN" =~ ^(true|false)$ ]] || { echo "[ERROR] DRY_RUN must be true or false"; exit 1; }

grep -oE 'sha256:[0-9a-f]{64}' "$PINNED_FILE" | sort -u >"$WORK/pinned.txt" || true
if [ ! -s "$WORK/pinned.txt" ]; then
  echo "[ERROR] The pinned digest list is empty. Nothing is deleted."
  exit 1
fi

echo '[]' >"$WORK/versions.json"
page=1
while :; do
  api --retry 3 "${API}/versions?per_page=100&page=${page}" >"$WORK/page.json"
  count="$(jq -e 'if type == "array" then length else error("not a list") end' "$WORK/page.json")" \
    || { echo "[ERROR] Could not read the version list. Nothing is deleted."; exit 1; }
  [ "$count" -gt 0 ] || break
  jq -s 'add | unique_by(.id)' "$WORK/versions.json" "$WORK/page.json" >"$WORK/merged.json"
  mv "$WORK/merged.json" "$WORK/versions.json"
  page=$((page + 1))
done

total="$(jq 'length' "$WORK/versions.json")"
if [ "$total" -eq 0 ]; then
  echo "[INFO] ${PACKAGE} has no versions."
  exit 0
fi

cutoff="$(($(date -u +%s) - MIN_AGE_DAYS * 86400))"
jq -r --argjson keep "$KEEP_BUILDS" --argjson cutoff "$cutoff" --rawfile pinned "$WORK/pinned.txt" '
  ($pinned | split("\n") | map(select(length > 0))) as $pins
  | map(. + {tags: (.metadata.container.tags // [])})
  | (map(select((.tags | length) > 0 and (.tags | all(test("^(dev|sha)-")))))
     | sort_by(.created_at) | reverse | .[:$keep] | map(.name)) as $dev
  | map(select(
      (.tags | any(test("^(dev|sha)-") | not))
      or (.name as $n | $dev | index($n))
      or (.name as $n | $pins | index($n))
      or ((.created_at | fromdateiso8601) > $cutoff)
    ))
  | .[].name
' "$WORK/versions.json" | sort -u >"$WORK/roots.txt"

if [ ! -s "$WORK/roots.txt" ]; then
  echo "[ERROR] No version would be kept. Nothing is deleted."
  exit 1
fi

jq -r '.[].name' "$WORK/versions.json" | sort -u >"$WORK/names.txt"
if [ -z "$(comm -12 "$WORK/names.txt" "$WORK/pinned.txt")" ]; then
  echo "[ERROR] No pinned digest belongs to ${PACKAGE}. Nothing is deleted."
  exit 1
fi

curl -fsS --retry 3 --max-time 30 --config "$WORK/registry-login.cfg" \
  "${REGISTRY}/token?service=ghcr.io&scope=repository:${ORG}/${PACKAGE}:pull" \
  | jq -er '"Authorization: Bearer " + .token' >"$WORK/registry.hdr"

cp "$WORK/roots.txt" "$WORK/keep.txt"
while read -r digest; do
  curl -fsS --retry 3 --max-time 30 \
    -H @"$WORK/registry.hdr" \
    -H 'Accept: application/vnd.oci.image.index.v1+json, application/vnd.docker.distribution.manifest.list.v2+json, application/vnd.oci.image.manifest.v1+json, application/vnd.docker.distribution.manifest.v2+json' \
    "${REGISTRY}/v2/${ORG}/${PACKAGE}/manifests/${digest}" >"$WORK/manifest.json"
  jq -r '.manifests[]?.digest' "$WORK/manifest.json" >>"$WORK/keep.txt"
done <"$WORK/roots.txt"
sort -u -o "$WORK/keep.txt" "$WORK/keep.txt"

jq -r --rawfile keep "$WORK/keep.txt" '
  ($keep | split("\n") | map(select(length > 0))) as $k
  | map(select(.name as $n | $k | index($n) | not))
  | .[] | "\(.id) \(.name) \(.created_at) \((.metadata.container.tags // []) | join(","))"
' "$WORK/versions.json" >"$WORK/delete.txt"

kept="$(($total - $(wc -l <"$WORK/delete.txt")))"
echo "[INFO] ${PACKAGE}: ${total} versions, ${kept} kept, $(wc -l <"$WORK/delete.txt" | tr -d ' ') to delete."

deleted=0
while read -r id digest created tags; do
  if [ "$DRY_RUN" = "true" ]; then
    echo "[INFO] Would delete ${digest} (${created}) ${tags}"
  else
    api -X DELETE "${API}/versions/${id}" >/dev/null
    echo "[OK] Deleted ${digest} (${created}) ${tags}"
    deleted=$((deleted + 1))
  fi
done <"$WORK/delete.txt"

if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  {
    echo "### Image cleanup: ${PACKAGE}"
    echo "- Versions: ${total}"
    echo "- Kept: ${kept}"
    echo "- Deleted: ${deleted} (dry run: ${DRY_RUN})"
  } >>"$GITHUB_STEP_SUMMARY"
fi
