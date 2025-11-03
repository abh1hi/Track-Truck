# Using Docker-outside-of-Docker (dood) feature
# No additional setup beyond dependency install
#!/usr/bin/env bash
set -e

if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
fi

echo "postCreate finished. You can now run: docker compose up -d --build"
