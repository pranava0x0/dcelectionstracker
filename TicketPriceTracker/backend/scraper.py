"""Parallel scraper orchestrator.

Runs all platform scrapers concurrently with ThreadPoolExecutor,
saves results to SQLite, and generates the markdown report.

Usage:
    python -m backend.scraper                    # Scrape all platforms
    python -m backend.scraper --platforms tickpick vividseats  # Specific platforms
    python -m backend.scraper --dry-run          # Print results without saving
"""

import logging
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

from backend.database import Database
from backend.models import Listing
from backend.scrapers import ALL_SCRAPERS
from backend.scrapers.utils import create_stealth_driver, jittered_delay

logger = logging.getLogger(__name__)

# Event URLs — move to config file later (backlog item #4)
EVENT_URLS = {
    "tickpick": (
        "https://www.tickpick.com/buy-ncaa-mens-basketball-tournament-east-regional-"
        "duke-vs-st-johns-uconn-vs-michigan-st-session-1-tickets-capital-one-arena-"
        "3-27-26-7pm/7082959/"
    ),
    "vividseats": (
        "https://www.vividseats.com/ncaa-mens-east-regional-tickets-capital-one-arena-"
        "3-27-2026--sports-ncaa-basketball/production/5687589"
    ),
    "seatgeek": (
        "https://seatgeek.com/ncaa-mens-basketball-tournament-tickets/"
        "ncaa-basketball/2026-03-27-7-10-pm/17520419?quantity=2"
    ),
    "ticketmaster": (
        "https://www.ticketmaster.com/2026-ncaa-mens-basketball-championship-east-"
        "washington-district-of-columbia-03-27-2026/event/15006319F5654FC5"
    ),
    "stubhub": (
        "https://www.stubhub.com/march-madness-ncaa-division-i-men-s-basketball-tournament-"
        "washington-tickets-3-27-2026/event/158035202/"
    ),
    "gametime": (
        "https://gametime.co/college-basketball/ncaa-mens-east-regional-session-1-"
        "saint-johns-vs-duke-michigan-st-vs-uconn-tickets/3-27-2026-washington-dc-"
        "capital-one-arena/events/67f6baba8729281818a44ddb"
    ),
}

EVENT_META = {
    "name": "NCAA East Regional - Session 1 (Duke vs St. John's & UConn vs Michigan St.)",
    "venue": "Capital One Arena, Washington DC",
    "event_date": "Friday, March 27, 2026 @ 7:10 PM",
}

SCRAPER_MAP = {cls.platform_name: cls for cls in ALL_SCRAPERS}


def scrape_single_platform(platform_name: str, url: str, qty: int = 2) -> List[Listing]:
    """Scrape a single platform. Runs in its own thread with its own driver."""
    scraper_cls = SCRAPER_MAP.get(platform_name)
    if not scraper_cls:
        logger.error(f"No scraper found for platform: {platform_name}")
        return []

    scraper = scraper_cls(url=url, qty=qty)
    driver = create_stealth_driver()
    try:
        return scraper.scrape_all(driver=driver)
    finally:
        driver.quit()


def scrape_all_parallel(
    platforms: Optional[List[str]] = None,
    qty: int = 2,
    max_workers: int = 3,
) -> Dict[str, List[Listing]]:
    """Scrape all platforms in parallel using ThreadPoolExecutor.

    Args:
        platforms: List of platform names to scrape. None = all.
        qty: Number of tickets to search for.
        max_workers: Max concurrent browser instances. Keep low to avoid resource exhaustion.

    Returns:
        Dict mapping platform name to list of Listing objects.
    """
    if platforms is None:
        platforms = list(EVENT_URLS.keys())

    results: Dict[str, List[Listing]] = {}
    start = time.time()

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {}
        for platform in platforms:
            url = EVENT_URLS.get(platform)
            if not url:
                logger.warning(f"No URL configured for platform: {platform}")
                continue
            future = executor.submit(scrape_single_platform, platform, url, qty)
            futures[future] = platform

        for future in as_completed(futures):
            platform = futures[future]
            try:
                listings = future.result(timeout=120)
                results[platform] = listings
                logger.info(f"[{platform}] Completed: {len(listings)} listings")
            except Exception as e:
                logger.error(f"[{platform}] Failed: {e}")
                results[platform] = []

    elapsed = time.time() - start
    total = sum(len(v) for v in results.values())
    logger.info(f"Parallel scrape completed in {elapsed:.1f}s — {total} total listings from {len(results)} platforms")
    return results


def save_results_to_db(
    results: Dict[str, List[Listing]],
    db: Optional[Database] = None,
) -> None:
    """Save scrape results to the database."""
    if db is None:
        db = Database()
        db.init_schema()

    event_id = db.upsert_event(
        EVENT_META["name"], EVENT_META["venue"], EVENT_META["event_date"]
    )
    scrape_id = db.create_scrape(event_id, datetime.now())

    total = 0
    for platform, listings in results.items():
        count = db.insert_listings(scrape_id, listings)
        total += count

    logger.info(f"Saved {total} listings to DB (scrape_id={scrape_id})")


# ── CLI ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

    dry_run = "--dry-run" in sys.argv
    platforms = None

    if "--platforms" in sys.argv:
        idx = sys.argv.index("--platforms")
        platforms = sys.argv[idx + 1:]

    logger.info("=" * 60)
    logger.info("TicketPriceTracker — Parallel Scraper")
    logger.info("=" * 60)

    results = scrape_all_parallel(platforms=platforms)

    # Print summary
    print("\n--- Scrape Results ---")
    for platform, listings in sorted(results.items()):
        if listings:
            cheapest = min(listings, key=lambda l: l.price)
            print(f"  {platform}: {len(listings)} listings, cheapest ${cheapest.price:.0f} "
                  f"(Section {cheapest.section}, Row {cheapest.row})")
        else:
            print(f"  {platform}: No listings found")

    if not dry_run:
        save_results_to_db(results)
        print("\nResults saved to database.")
    else:
        print("\n(Dry run — results not saved)")
