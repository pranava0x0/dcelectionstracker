#!/bin/bash
# Start only the FastAPI backend.
# Usage: ./start-backend.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

# Backfill if no DB
if [ ! -f "prices.db" ]; then
    echo "Backfilling database..."
    python3 -m backend.database --backfill
fi

echo "Starting API server on http://localhost:8000"
echo "Docs: http://localhost:8000/docs"
python3 -m uvicorn backend.api:app --host 0.0.0.0 --port 8000 --reload
