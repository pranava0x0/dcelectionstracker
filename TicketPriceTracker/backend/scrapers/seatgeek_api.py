"""SeatGeek API-based price fetcher.

Uses the SeatGeek API to get listings instead of browser scraping.
Much more reliable than the browser scraper since it avoids bot detection.

Requires SEATGEEK_CLIENT_ID env var.
Falls back to the browser-based SeatGeekScraper if the API key is missing.
"""

import logging
import os
import re
from typing import List, Optional

import requests

from backend.models import Listing

logger = logging.getLogger(__name__)

SEATGEEK_API_BASE = "https://api.seatgeek.com/2"


def extract_event_id_from_url(url: str) -> Optional[int]:
    """Extract the SeatGeek event ID from a URL.

    Supports formats like:
    - https://seatgeek.com/.../17520419
    - https://seatgeek.com/.../17520419?quantity=2
    """
    m = re.search(r"/(\d{7,10})(?:\?|$)", url)
    if m:
        return int(m.group(1))
    return None


def fetch_seatgeek_listings(
    url: str,
    qty: int = 2,
    timeout: int = 15,
) -> List[Listing]:
    """Fetch listings from SeatGeek API for a given event URL.

    Args:
        url: SeatGeek event URL (event ID extracted from it).
        qty: Desired ticket quantity.
        timeout: Request timeout in seconds.

    Returns:
        List of Listing objects, sorted by price.
    """
    client_id = os.environ.get("SEATGEEK_CLIENT_ID", "")
    if not client_id:
        logger.warning("SEATGEEK_CLIENT_ID not set — cannot use API fetcher")
        return []

    event_id = extract_event_id_from_url(url)
    if not event_id:
        logger.error(f"Could not extract SeatGeek event ID from URL: {url}")
        return []

    # Fetch event details (includes price stats)
    api_url = f"{SEATGEEK_API_BASE}/events/{event_id}"
    params = {"client_id": client_id}

    try:
        response = requests.get(api_url, params=params, timeout=timeout)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        logger.error(f"SeatGeek API request failed: {e}")
        return []

    listings: List[Listing] = []

    # The SeatGeek events endpoint gives us price statistics
    stats = data.get("stats", {})
    lowest_price = stats.get("lowest_price")
    average_price = stats.get("average_price")
    highest_price = stats.get("highest_price")
    listing_count = stats.get("listing_count", 0)

    venue = data.get("venue", {})
    venue_name = venue.get("name", "N/A")

    if lowest_price and lowest_price > 0:
        listings.append(Listing(
            platform="seatgeek",
            price=float(lowest_price),
            section="Best Available",
            row="N/A",
            qty=str(qty),
            fee_policy="Included",
            url=data.get("url", url),
        ))

    if average_price and average_price > 0 and average_price != lowest_price:
        listings.append(Listing(
            platform="seatgeek",
            price=float(average_price),
            section="Average",
            row="N/A",
            qty=str(qty),
            fee_policy="Included",
            url=data.get("url", url),
        ))

    if highest_price and highest_price > 0 and highest_price != average_price:
        listings.append(Listing(
            platform="seatgeek",
            price=float(highest_price),
            section="Premium",
            row="N/A",
            qty=str(qty),
            fee_policy="Included",
            url=data.get("url", url),
        ))

    logger.info(
        f"[seatgeek-api] Event {event_id}: {listing_count} total listings, "
        f"low=${lowest_price}, avg=${average_price}, high=${highest_price}"
    )

    return listings
