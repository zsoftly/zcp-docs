#!/usr/bin/env bash
# deploy-web.sh — Deploy or rollback ZCP docs static assets
#
# Usage:
#   deploy-web.sh deploy <artifact.tar.gz>   Deploy a new release
#   deploy-web.sh rollback                   Roll back to previous release
#
# This script only manages files. TLS, domains, and HTTP are handled by the
# reverse proxy in front (Traefik, nginx, Caddy — whatever the host uses).
#
# Environment variables (from /etc/zcp/docs.env):
#   SITE_ROOT      Absolute path the reverse proxy serves files from
#   RELEASES_DIR   Directory where release archives are kept
#   KEEP_RELEASES  Number of releases to retain (default: 5)
#
# The script maintains a "current" symlink and a "previous" symlink:
#   $RELEASES_DIR/
#   ├── current -> 2026-03-22-1430/
#   ├── previous -> 2026-03-20-0910/
#   ├── 2026-03-22-1430/
#   └── 2026-03-20-0910/

set -euo pipefail

SITE_ROOT="${SITE_ROOT:-/var/www/zcp-docs}"
RELEASES_DIR="${RELEASES_DIR:-/var/releases/zcp-docs}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"

log() { echo "[INFO] $*"; }
err() { echo "[ERROR] $*" >&2; exit 1; }

require_root() {
  [[ $EUID -eq 0 ]] || err "This script must be run as root"
}

link_site_root() {
  if [[ -L "$SITE_ROOT" ]]; then
    rm -f "$SITE_ROOT"
  elif [[ -d "$SITE_ROOT" ]]; then
    rmdir "$SITE_ROOT" 2>/dev/null \
      || err "SITE_ROOT $SITE_ROOT is a non-empty directory; refusing to replace"
  fi
  ln -snf "$RELEASES_DIR/current" "$SITE_ROOT"
  log "Site root updated"
}

deploy() {
  local artifact="$1"
  [[ -f "$artifact" ]] || err "Artifact not found: $artifact"

  local release_name
  release_name="$(date -u +%Y-%m-%d-%H%M%S)-$$-$RANDOM"
  local release_dir="$RELEASES_DIR/$release_name"

  log "Deploying release: $release_name"

  mkdir -p "$RELEASES_DIR"
  mkdir "$release_dir"
  tar -xzf "$artifact" -C "$release_dir"
  log "Artifact extracted to $release_dir"

  # Rotate symlinks
  if [[ -L "$RELEASES_DIR/current" ]]; then
    local current_target
    current_target=$(readlink "$RELEASES_DIR/current")
    ln -snf "$current_target" "$RELEASES_DIR/previous"
    log "Previous pointer updated to $current_target"
  fi

  ln -snf "$release_dir" "$RELEASES_DIR/current"
  log "Current pointer updated to $release_dir"

  # Update SITE_ROOT to point to current release
  link_site_root

  # Prune old releases
  prune_releases

  log "Deploy complete: $release_name"
}

rollback() {
  [[ -L "$RELEASES_DIR/previous" ]] || err "No previous release to roll back to"

  local previous_target current_target=""
  previous_target=$(readlink "$RELEASES_DIR/previous")
  if [[ -L "$RELEASES_DIR/current" ]]; then
    current_target=$(readlink "$RELEASES_DIR/current")
  fi
  log "Rolling back to $previous_target"

  ln -snf "$previous_target" "$RELEASES_DIR/current"
  # Swap the pointers so a second rollback rolls forward again instead of
  # repeating: previous now holds the release we just left.
  if [[ -n "$current_target" ]]; then
    ln -snf "$current_target" "$RELEASES_DIR/previous"
  fi
  link_site_root

  log "Rollback complete"
}

prune_releases() {
  [[ -n "$RELEASES_DIR" ]] || err "RELEASES_DIR is empty — refusing to prune"
  local count
  count=$(find "$RELEASES_DIR" -maxdepth 1 -mindepth 1 -type d | wc -l)
  if (( count > KEEP_RELEASES )); then
    log "Pruning old releases (keeping $KEEP_RELEASES, found $count)"
    local to_delete
    to_delete=$(find "$RELEASES_DIR" -maxdepth 1 -mindepth 1 -type d \
      | sort \
      | head -n $(( count - KEEP_RELEASES )))
    log "Deleting: $to_delete"
    echo "$to_delete" | xargs -d '\n' rm -rf
  fi
}

require_root

case "${1:-}" in
  deploy)
    [[ -n "${2:-}" ]] || err "Usage: $0 deploy <artifact.tar.gz>"
    deploy "$2"
    ;;
  rollback)
    rollback
    ;;
  *)
    echo "Usage: $0 {deploy <artifact.tar.gz>|rollback}"
    exit 1
    ;;
esac
