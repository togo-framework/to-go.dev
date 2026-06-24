#!/usr/bin/env bash
# Manual deploy (run on the togo host): pull latest from GitHub on the LXC + refresh the
# static container. CI does this automatically on every push (.github/workflows/deploy.yml).
set -euo pipefail
pct exec 201 -- bash -c '
  if [ -d /opt/to-go.dev/.git ]; then git -C /opt/to-go.dev pull --ff-only; else git clone https://github.com/togo-framework/to-go.dev /opt/to-go.dev; fi
  docker restart togo-web >/dev/null 2>&1 || true
'
echo "to-go.dev deployed."
