#!/usr/bin/env bash
# Serves the static site over HTTP so you can open it from another device (e.g. phone on same Wi‑Fi).
# Usage: ./serve-local.sh
# Optional: PORT=9000 ./serve-local.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
PORT="${PORT:-8765}"

echo "Library of Time — static server"
echo "  This machine:  http://127.0.0.1:${PORT}/"
echo "  This machine:  http://localhost:${PORT}/"
if command -v hostname >/dev/null 2>&1; then
  for ip in $(hostname -I 2>/dev/null || true); do
    echo "  Same network:  http://${ip}:${PORT}/"
  done
fi
echo ""
echo "Press Ctrl+C to stop."
echo ""

exec python3 -m http.server "$PORT" --bind 0.0.0.0
