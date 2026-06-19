#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/calebesaraiva/suhconcept.git}"
APP_DIR="${APP_DIR:-/var/www/suhconcept/app}"
BRANCH="${BRANCH:-main}"
STAMP_FILE="${STAMP_FILE:-/root/.suhconcept_last_deploy_commit}"

mkdir -p "$(dirname "$APP_DIR")"

if [ ! -d "$APP_DIR/.git" ]; then
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"

git fetch origin "$BRANCH"
REMOTE_COMMIT="$(git rev-parse "origin/$BRANCH")"
LOCAL_COMMIT="$(git rev-parse HEAD 2>/dev/null || echo '')"
LAST_DEPLOYED="$(cat "$STAMP_FILE" 2>/dev/null || echo '')"

if [ "$REMOTE_COMMIT" = "$LOCAL_COMMIT" ] && [ "$REMOTE_COMMIT" = "$LAST_DEPLOYED" ]; then
  exit 0
fi

bash deploy/vps/deploy.sh
echo "$REMOTE_COMMIT" > "$STAMP_FILE"
