#!/bin/bash
# Start only the Expo mobile dev server.
# Usage: ./start-mobile.sh
#
# Make sure the API is running first: ./start-backend.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/mobile"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting Expo dev server..."
echo "Scan QR code with Expo Go app."
echo ""
echo "NOTE: API must be running on http://localhost:8000"
echo "  If testing on physical device, update mobile/src/constants/api.ts"
echo "  with your machine's local IP address."
echo ""
npx expo start
