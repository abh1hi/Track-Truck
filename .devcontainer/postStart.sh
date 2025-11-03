#!/usr/bin/env bash
set -e

# Start Docker (Docker-outside-of-Docker feature)
if ! docker info >/dev/null 2>&1; then
  sudo /usr/local/share/docker-init.sh || true
  sleep 2
fi

echo "Docker engine status:"
docker --version || true
docker compose version || true

echo "Installing project dependencies..."
if [ -d backend ]; then
  (cd backend && npm ci || npm install)
fi
if [ -d owner-dashboard ]; then
  (cd owner-dashboard && npm ci || npm install)
fi

echo "Devcontainer postStart complete."
