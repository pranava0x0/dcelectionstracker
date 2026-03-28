"""FastAPI backend for TicketPriceTracker mobile app.

Endpoints:
  GET /api/health
  GET /api/events
  GET /api/events/{event_id}/latest
  GET /api/events/{event_id}/history
  GET /api/events/{event_id}/platforms/{platform}

Run:
  uvicorn backend.api:app --host 0.0.0.0 --port 8000 --reload
"""

import logging
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Database
from backend.models import (
    Event,
    EventHistoryResponse,
    EventLatestResponse,
    Listing,
    PlatformSummary,
    PricePoint,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TicketPriceTracker API",
    description="Cross-platform ticket price comparison API",
    version="1.0.0",
)

# Allow React Native / Expo to connect from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Single DB instance for the app lifetime
db = Database()
db.init_schema()


@app.get("/api/health")
def health_check():
    stats = db.get_stats()
    return {"status": "ok", **stats}


@app.get("/api/events", response_model=List[Event])
def list_events():
    events = db.get_events()
    if not events:
        return []
    return events


@app.get("/api/events/{event_id}/latest", response_model=EventLatestResponse)
def get_latest_prices(event_id: int):
    event = db.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    latest = db.get_latest_scrape(event_id)
    if not latest:
        raise HTTPException(status_code=404, detail="No scrape data found for this event")

    scrape_id, scraped_at = latest
    platforms = db.get_platform_summaries(scrape_id)

    best_deal = None
    if platforms:
        best_deal = min(platforms, key=lambda p: p.cheapest_price)

    return EventLatestResponse(
        event=event,
        scraped_at=scraped_at,
        platforms=platforms,
        best_deal=best_deal,
    )


@app.get("/api/events/{event_id}/history", response_model=EventHistoryResponse)
def get_price_history(event_id: int, limit: int = 100):
    event = db.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    history = db.get_price_history(event_id, limit=limit)
    return EventHistoryResponse(event=event, history=history)


@app.get("/api/events/{event_id}/platforms/{platform}", response_model=List[Listing])
def get_platform_listings(event_id: int, platform: str):
    event = db.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    latest = db.get_latest_scrape(event_id)
    if not latest:
        raise HTTPException(status_code=404, detail="No scrape data found")

    scrape_id, _ = latest
    listings = db.get_listings_for_platform(scrape_id, platform)
    return listings
