"""FastAPI backend for TicketPriceTracker mobile app.

Endpoints:
  GET  /api/health
  GET  /api/events
  GET  /api/events/tracked
  GET  /api/events/{event_id}/latest
  GET  /api/events/{event_id}/history
  GET  /api/events/{event_id}/platforms/{platform}
  GET  /api/events/{event_id}/urls
  PUT  /api/events/{event_id}/urls
  DELETE /api/events/{event_id}/urls/{platform}
  GET  /api/search
  POST /api/events/track

Run:
  uvicorn backend.api:app --host 0.0.0.0 --port 8000 --reload
"""

import logging
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.database import Database
from backend.models import (
    AddUrlRequest,
    ArbitrageResponse,
    Event,
    EventHistoryResponse,
    EventLatestResponse,
    EventWithUrls,
    Listing,
    PlatformSummary,
    PricePoint,
    SearchResult,
    TrackEventRequest,
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


@app.get("/api/events/tracked")
def list_tracked_events():
    """Return events that have platform URLs configured."""
    return db.list_tracked_events()


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


@app.get("/api/events/{event_id}/arbitrage", response_model=ArbitrageResponse)
def get_arbitrage(event_id: int, min_savings_pct: float = 15.0):
    """Detect cross-platform arbitrage opportunities for an event."""
    event = db.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    latest = db.get_latest_scrape(event_id)
    if not latest:
        raise HTTPException(status_code=404, detail="No scrape data found for this event")

    scrape_id, scraped_at = latest
    alerts = db.detect_arbitrage(scrape_id, min_savings_pct=min_savings_pct)

    return ArbitrageResponse(
        event=event,
        scraped_at=scraped_at,
        alerts=alerts,
        total_opportunities=len(alerts),
    )


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


# ── Event URL management ───────────────────────────────────────────────

@app.get("/api/events/{event_id}/urls")
def get_event_urls(event_id: int) -> Dict[str, str]:
    event = db.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return db.get_event_urls(event_id)


@app.put("/api/events/{event_id}/urls")
def add_event_url(event_id: int, req: AddUrlRequest):
    event = db.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.upsert_event_url(event_id, req.platform, req.url)
    return {"status": "ok", "platform": req.platform}


@app.delete("/api/events/{event_id}/urls/{platform}")
def delete_event_url(event_id: int, platform: str):
    event = db.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    deleted = db.delete_event_url(event_id, platform)
    if not deleted:
        raise HTTPException(status_code=404, detail="URL not found for this platform")
    return {"status": "ok"}


# ── Search + Track ─────────────────────────────────────────────────────

@app.get("/api/search", response_model=List[SearchResult])
def search_events_endpoint(
    q: str,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
):
    """Search for events via SeatGeek API."""
    from backend.search import search_events

    try:
        return search_events(q, date_from=date_from, date_to=date_to)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Search failed: {e}")
        raise HTTPException(status_code=502, detail="Search service unavailable")


@app.post("/api/events/track")
def track_event(req: TrackEventRequest):
    """Create a new tracked event with optional platform URLs."""
    event_id = db.upsert_event(req.name, req.venue, req.event_date)

    for platform, url in req.urls.items():
        db.upsert_event_url(event_id, platform, url)

    event = db.get_event(event_id)
    urls = db.get_event_urls(event_id)
    return {"event": event, "urls": urls}


@app.post("/api/events/{event_id}/scrape")
def trigger_scrape(event_id: int):
    """Trigger a scrape for a specific event (runs in foreground)."""
    event = db.get_event(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event_urls = db.get_event_urls(event_id)
    if not event_urls:
        raise HTTPException(status_code=400, detail="No URLs configured for this event")

    from backend.scraper import scrape_event as do_scrape

    try:
        results = do_scrape(event_id=event_id, db=db)
        total = sum(len(v) for v in results.values())
        return {
            "status": "ok",
            "listings_scraped": total,
            "platforms": {k: len(v) for k, v in results.items()},
        }
    except Exception as e:
        logger.error(f"Scrape failed for event {event_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Scrape failed: {str(e)}")
