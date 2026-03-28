#!/bin/bash
# TicketPriceTracker — Full Stack Launcher
# Usage: ./start.sh
#
# Starts:
#   1. Backfills DB from ticket_prices.md (if prices.db doesn't exist)
#   2. FastAPI backend on port 8000
#   3. Expo dev server for React Native app
#
# Ctrl+C kills all processes.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== TicketPriceTracker ===${NC}"
echo ""

# ── Check Python deps ─────────────────────────────────────────────────────
echo -e "${YELLOW}Checking Python dependencies...${NC}"
pip3 install -q fastapi uvicorn pydantic 2>/dev/null || {
    echo -e "${RED}Failed to install Python deps. Run: pip3 install -r backend/requirements.txt${NC}"
    exit 1
}

# ── Check Node deps ───────────────────────────────────────────────────────
if [ ! -d "mobile/node_modules" ]; then
    echo -e "${YELLOW}Installing Node dependencies...${NC}"
    (cd mobile && npm install)
fi

# ── Backfill DB if needed ─────────────────────────────────────────────────
if [ ! -f "prices.db" ]; then
    echo -e "${YELLOW}Backfilling database from ticket_prices.md...${NC}"
    python3 -m backend.database --backfill
    echo -e "${GREEN}Database ready.${NC}"
else
    echo -e "${GREEN}Database exists.${NC}"
    python3 -m backend.database --stats
fi

echo ""

# ── Trap Ctrl+C to kill both processes ────────────────────────────────────
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down...${NC}"
    kill $API_PID 2>/dev/null
    kill $EXPO_PID 2>/dev/null
    wait $API_PID 2>/dev/null
    wait $EXPO_PID 2>/dev/null
    echo -e "${GREEN}Done.${NC}"
    exit 0
}
trap cleanup SIGINT SIGTERM

# ── Start FastAPI backend ─────────────────────────────────────────────────
echo -e "${GREEN}Starting API server on http://localhost:8000 ...${NC}"
python3 -m uvicorn backend.api:app --host 0.0.0.0 --port 8000 --reload &
API_PID=$!
sleep 2

# Quick health check
if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}API is up!${NC}"
else
    echo -e "${YELLOW}API starting...${NC}"
fi

echo ""

# ── Start Expo dev server ─────────────────────────────────────────────────
echo -e "${GREEN}Starting Expo dev server...${NC}"
echo -e "${YELLOW}Scan the QR code with Expo Go to view on your phone.${NC}"
echo ""
(cd mobile && npx expo start) &
EXPO_PID=$!

# Wait for both
wait $API_PID $EXPO_PID
