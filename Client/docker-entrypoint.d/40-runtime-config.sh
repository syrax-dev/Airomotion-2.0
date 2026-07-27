#!/bin/sh
set -eu

# VITE_API_URL is intentionally public: it is the browser-facing API origin,
# not a credential. Render supplies it as a runtime environment variable.
# API URLs cannot contain quotes; reject them rather than emitting invalid JS.
case "${VITE_API_URL:-}" in
  *'"'*|*"'"*|*$'\n'*|*$'\r'*)
    echo "VITE_API_URL contains unsupported characters" >&2
    exit 1
    ;;
esac

printf 'window.__APP_CONFIG__ = { VITE_API_URL: "%s" };\n' "${VITE_API_URL:-}" \
  > /usr/share/nginx/html/runtime-config.js
