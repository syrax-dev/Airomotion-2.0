#!/bin/bash
set -e

echo "Updating ClamAV database..."
freshclam || true

echo "Starting ClamAV..."
mkdir -p /run/clamav

clamd &

echo "Waiting for ClamAV..."
sleep 5

echo "Starting Node server..."
exec npm start