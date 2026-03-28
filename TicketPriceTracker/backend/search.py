"""Event search via SeatGeek API.

Requires a free SeatGeek client_id set as SEATGEEK_CLIENT_ID env var.
Get one at https://seatgeek.com/account/develop

Usage:
    python -m backend.search "duke basketball"
    python -m backend.search "duke" --date-from 2026-03-29 --date-to 2026-04-01
"""

import logging
import os
from typing import Dict, List, Optional

import requests

from backend.models import SearchResult

logger = logging.getLogger(__name__)

SEATGEEK_API_BASE = "https://api.seatgeek.com/2"


def get_client_id() -> str:
    """Read SeatGeek client_id from environment."""
    client_id = os.environ.get("SEATGEEK_CLIENT_ID", "")
    if not client_id:
        raise RuntimeError(
            "SEATGEEK_CLIENT_ID environment variable is not set. "
            "Get a free key at https://seatgeek.com/account/develop"
        )
    return client_id


def search_events(
    query: str,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    per_page: int = 15,
) -> List[SearchResult]:
    """Search for events on SeatGeek.

    Args:
        query: Search text (e.g. "duke basketball", "yankees").
        date_from: Filter events on or after this date (YYYY-MM-DD).
        date_to: Filter events on or before this date (YYYY-MM-DD).
        per_page: Max results to return.

    Returns:
        List of SearchResult objects.
    """
    client_id = get_client_id()

    params: Dict[str, str] = {
        "q": query,
        "per_page": str(per_page),
        "sort": "datetime_local.asc",
        "client_id": client_id,
    }
    if date_from:
        params["datetime_local.gte"] = f"{date_from}T00:00:00"
    if date_to:
        params["datetime_local.lte"] = f"{date_to}T23:59:59"

    url = f"{SEATGEEK_API_BASE}/events"
    logger.info(f"Searching SeatGeek: q={query}, date_from={date_from}, date_to={date_to}")

    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()

    results: List[SearchResult] = []
    for event in data.get("events", []):
        venue = event.get("venue", {})
        results.append(SearchResult(
            name=event.get("title", "Unknown Event"),
            venue=venue.get("name", "Unknown Venue"),
            city=venue.get("city", "Unknown City"),
            event_date=event.get("datetime_local", ""),
            seatgeek_url=event.get("url", ""),
            seatgeek_id=event.get("id", 0),
        ))

    logger.info(f"SeatGeek returned {len(results)} results")
    return results


# ── CLI ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

    if len(sys.argv) < 2:
        print("Usage: python -m backend.search <query> [--date-from YYYY-MM-DD] [--date-to YYYY-MM-DD]")
        sys.exit(1)

    query = sys.argv[1]
    date_from = None
    date_to = None

    if "--date-from" in sys.argv:
        idx = sys.argv.index("--date-from")
        date_from = sys.argv[idx + 1]
    if "--date-to" in sys.argv:
        idx = sys.argv.index("--date-to")
        date_to = sys.argv[idx + 1]

    results = search_events(query, date_from=date_from, date_to=date_to)
    for r in results:
        print(f"  {r.event_date[:10]}  {r.name}")
        print(f"    {r.venue}, {r.city}")
        print(f"    {r.seatgeek_url}")
        print()
