"""Automated scrape scheduler.

Runs scrapes for all tracked events on a configurable interval.
Uses a simple polling loop — no external dependencies required.

Usage:
    python -m backend.scheduler                        # Default: every 15 minutes
    python -m backend.scheduler --interval 30          # Every 30 minutes
    python -m backend.scheduler --event-id 1           # Only scrape event 1
    python -m backend.scheduler --once                 # Run once and exit
"""

import logging
import signal
import sys
import time
from datetime import datetime
from typing import List, Optional

from backend.database import Database
from backend.scraper import scrape_event

logger = logging.getLogger(__name__)

DEFAULT_INTERVAL_MINUTES = 15
_shutdown = False


def _handle_signal(signum: int, frame) -> None:
    """Handle SIGTERM/SIGINT gracefully."""
    global _shutdown
    logger.info(f"Received signal {signum}, shutting down after current scrape...")
    _shutdown = True


def run_scheduled_scrapes(
    db: Database,
    event_ids: Optional[List[int]] = None,
    max_workers: int = 3,
) -> int:
    """Run one round of scrapes for tracked events.

    Args:
        db: Database instance.
        event_ids: Specific events to scrape. None = all tracked.
        max_workers: Max concurrent browser instances per event.

    Returns:
        Total number of listings scraped.
    """
    if event_ids:
        events = [{"id": eid} for eid in event_ids]
    else:
        events = db.list_tracked_events()

    if not events:
        logger.warning("No tracked events found to scrape")
        return 0

    total_listings = 0
    for evt in events:
        if _shutdown:
            break

        event_id = evt["id"]
        event = db.get_event(event_id)
        name = event.name if event else f"Event {event_id}"

        logger.info(f"Scraping: {name} (id={event_id})")
        try:
            results = scrape_event(
                event_id=event_id,
                db=db,
                max_workers=max_workers,
            )
            event_total = sum(len(v) for v in results.values())
            total_listings += event_total
            logger.info(f"  -> {event_total} listings from {len(results)} platforms")
        except Exception as e:
            logger.error(f"  -> Failed to scrape event {event_id}: {e}")

    return total_listings


def run_scheduler(
    interval_minutes: int = DEFAULT_INTERVAL_MINUTES,
    event_ids: Optional[List[int]] = None,
    once: bool = False,
) -> None:
    """Run the scheduler loop.

    Args:
        interval_minutes: Minutes between scrape runs.
        event_ids: Specific events to scrape. None = all tracked.
        once: If True, run one round and exit.
    """
    global _shutdown

    signal.signal(signal.SIGTERM, _handle_signal)
    signal.signal(signal.SIGINT, _handle_signal)

    db = Database()
    db.init_schema()

    logger.info("=" * 60)
    logger.info("TicketPriceTracker — Automated Scheduler")
    logger.info(f"  Interval: {interval_minutes} minutes")
    logger.info(f"  Events: {event_ids or 'all tracked'}")
    logger.info(f"  Mode: {'single run' if once else 'continuous'}")
    logger.info("=" * 60)

    run_count = 0
    while not _shutdown:
        run_count += 1
        start = time.time()
        logger.info(f"\n--- Run #{run_count} at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} ---")

        total = run_scheduled_scrapes(db, event_ids=event_ids)
        elapsed = time.time() - start
        logger.info(f"Run #{run_count} complete: {total} listings in {elapsed:.1f}s")

        if once:
            break

        if not _shutdown:
            next_run = datetime.now().timestamp() + (interval_minutes * 60)
            next_time = datetime.fromtimestamp(next_run).strftime("%H:%M:%S")
            logger.info(f"Next run at {next_time} (sleeping {interval_minutes}m)")

            # Sleep in small increments so we can respond to shutdown signals
            sleep_until = time.time() + (interval_minutes * 60)
            while time.time() < sleep_until and not _shutdown:
                time.sleep(min(5, sleep_until - time.time()))

    logger.info("Scheduler stopped.")
    db.close()


# ── CLI ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
    )

    interval = DEFAULT_INTERVAL_MINUTES
    event_ids = None
    once = "--once" in sys.argv

    if "--interval" in sys.argv:
        idx = sys.argv.index("--interval")
        interval = int(sys.argv[idx + 1])

    if "--event-id" in sys.argv:
        idx = sys.argv.index("--event-id")
        event_ids = [int(sys.argv[idx + 1])]

    run_scheduler(
        interval_minutes=interval,
        event_ids=event_ids,
        once=once,
    )
