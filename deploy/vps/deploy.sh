#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/zayeh/app"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"

git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

docker compose -f docker-compose.prod.yml up -d --build
docker image prune -f >/dev/null 2>&1 || true
