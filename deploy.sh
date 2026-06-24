#!/usr/bin/env bash
# Deploy to-go.dev on the server: pull latest + reload Caddy.
set -euo pipefail
REPO=/var/www/to-go.dev
[ -d "$REPO/.git" ] && git -C "$REPO" pull --ff-only || git clone https://github.com/togo-framework/to-go.dev "$REPO"
cp "$REPO/Caddyfile" /etc/caddy/Caddyfile
systemctl reload caddy
echo "to-go.dev deployed."
