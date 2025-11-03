#!/usr/bin/env bash
set -e

# Install dependencies
if [ -d backend ]; then
  cd backend && npm ci || npm install && cd -
fi
if [ -d owner-dashboard ]; then
  cd owner-dashboard && npm ci || npm install && cd -
fi

# Show helpful info
echo "\nDev container ready. Useful commands:"
echo "- docker compose up -d    # start services"
echo "- curl http://localhost:5000/api/health"
echo "- open http://localhost:3000"
