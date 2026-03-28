"""Tests for the database layer."""

import sqlite3
from datetime import datetime
from pathlib import Path

import pytest

from backend.database import Database, backfill, parse_markdown_scrapes
from backend.models import Listing


@pytest.fixture
def db(tmp_path: Path) -> Database:
    """Create a fresh in-memory-like DB for each test."""
    db_path = tmp_path / "test.db"
    database = Database(db_path=db_path)
    database.init_schema()
    return database


class TestDatabase:
    def test_init_schema(self, db: Database) -> None:
        conn = db.connect()
        tables = conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
        ).fetchall()
        table_names = [t["name"] for t in tables]
        assert "events" in table_names
        assert "scrapes" in table_names
        assert "listings" in table_names

    def test_upsert_event(self, db: Database) -> None:
        event_id = db.upsert_event("Test Event", "Test Venue", "2026-03-27")
        assert event_id == 1

        # Upsert same event → same ID
        event_id2 = db.upsert_event("Test Event", "Test Venue", "2026-03-27")
        assert event_id2 == 1

    def test_get_events(self, db: Database) -> None:
        db.upsert_event("Event A", "Venue A", "2026-03-27")
        db.upsert_event("Event B", "Venue B", "2026-04-01")

        events = db.get_events()
        assert len(events) == 2
        assert events[0].name == "Event A"

    def test_get_event_not_found(self, db: Database) -> None:
        assert db.get_event(999) is None

    def test_create_scrape(self, db: Database) -> None:
        event_id = db.upsert_event("Test", "Venue", "2026-03-27")
        now = datetime(2026, 3, 27, 20, 0, 0)
        scrape_id = db.create_scrape(event_id, now)
        assert scrape_id >= 1

    def test_insert_listings(self, db: Database) -> None:
        event_id = db.upsert_event("Test", "Venue", "2026-03-27")
        scrape_id = db.create_scrape(event_id, datetime.now())

        listings = [
            Listing(platform="tickpick", price=290, section="408", row="C", qty="2", fee_policy="No fees"),
            Listing(platform="vividseats", price=308, section="423", row="Q", qty="2", fee_policy="Included"),
        ]
        count = db.insert_listings(scrape_id, listings)
        assert count == 2

    def test_insert_duplicate_listing(self, db: Database) -> None:
        event_id = db.upsert_event("Test", "Venue", "2026-03-27")
        scrape_id = db.create_scrape(event_id, datetime.now())

        listing = Listing(platform="tickpick", price=290, section="408", row="C", qty="2")
        db.insert_listings(scrape_id, [listing])
        # Insert same listing again → should be ignored (INSERT OR IGNORE)
        db.insert_listings(scrape_id, [listing])

        conn = db.connect()
        count = conn.execute("SELECT COUNT(*) as c FROM listings").fetchone()["c"]
        assert count == 1

    def test_get_platform_summaries(self, db: Database) -> None:
        event_id = db.upsert_event("Test", "Venue", "2026-03-27")
        scrape_id = db.create_scrape(event_id, datetime.now())

        listings = [
            Listing(platform="tickpick", price=290, section="408", row="C", qty="2"),
            Listing(platform="tickpick", price=320, section="417", row="H", qty="2"),
            Listing(platform="vividseats", price=308, section="423", row="Q", qty="2"),
        ]
        db.insert_listings(scrape_id, listings)

        summaries = db.get_platform_summaries(scrape_id)
        assert len(summaries) == 2
        # Should be sorted by cheapest
        assert summaries[0].platform == "tickpick"
        assert summaries[0].cheapest_price == 290
        assert summaries[0].listing_count == 2

    def test_anomalies_excluded_from_summaries(self, db: Database) -> None:
        event_id = db.upsert_event("Test", "Venue", "2026-03-27")
        scrape_id = db.create_scrape(event_id, datetime.now())

        listings = [
            Listing(platform="gametime", price=5, section="999", row="Z", qty="2", is_anomaly=True),
            Listing(platform="gametime", price=300, section="417", row="H", qty="2"),
        ]
        db.insert_listings(scrape_id, listings)

        summaries = db.get_platform_summaries(scrape_id)
        assert len(summaries) == 1
        assert summaries[0].cheapest_price == 300  # anomaly excluded

    def test_get_latest_scrape(self, db: Database) -> None:
        event_id = db.upsert_event("Test", "Venue", "2026-03-27")
        db.create_scrape(event_id, datetime(2026, 3, 27, 19, 0, 0))
        db.create_scrape(event_id, datetime(2026, 3, 27, 20, 0, 0))

        latest = db.get_latest_scrape(event_id)
        assert latest is not None
        scrape_id, scraped_at = latest
        assert scraped_at.hour == 20

    def test_get_price_history(self, db: Database) -> None:
        event_id = db.upsert_event("Test", "Venue", "2026-03-27")

        # Two scrapes at different times
        s1 = db.create_scrape(event_id, datetime(2026, 3, 27, 19, 0, 0))
        db.insert_listings(s1, [
            Listing(platform="tickpick", price=300, section="408", row="C", qty="2"),
        ])

        s2 = db.create_scrape(event_id, datetime(2026, 3, 27, 20, 0, 0))
        db.insert_listings(s2, [
            Listing(platform="tickpick", price=290, section="408", row="C", qty="2"),
        ])

        history = db.get_price_history(event_id)
        assert len(history) == 2

    def test_get_stats(self, db: Database) -> None:
        event_id = db.upsert_event("Test", "Venue", "2026-03-27")
        scrape_id = db.create_scrape(event_id, datetime.now())
        db.insert_listings(scrape_id, [
            Listing(platform="tickpick", price=290, section="408", row="C", qty="2"),
        ])

        stats = db.get_stats()
        assert stats["events"] == 1
        assert stats["scrapes"] == 1
        assert stats["listings"] == 1
        assert stats["anomalies"] == 0


class TestMarkdownParsing:
    def test_parse_markdown_scrapes(self, tmp_path: Path) -> None:
        md_content = """# Ticket Prices: Test Event

**Event:** Test Event
**Venue:** Test Venue
**Date:** Friday, March 27, 2026 @ 7:10 PM
**Scraped at:** 2026-03-27 20:00:00
**Filter:** 2 Tickets, Sorted by Cheapest

---

## Top 3 Cheapest Per Site

### Vivid Seats
*Fees included in listed price*

| # | Price/ea | Section | Row | Qty |
|--:|--------:|---------|-----|:---:|
| 1 | $291 | 423 | Q | 2 |
| 2 | $315 | 408 | C | 1 |

### TickPick
*No service fees*

| # | Price/ea | Section | Row | Qty |
|--:|--------:|---------|-----|:---:|
| 1 | $321 | 417 | H | 2 |
"""
        md_path = tmp_path / "test_prices.md"
        md_path.write_text(md_content)

        scrapes = parse_markdown_scrapes(md_path)
        assert len(scrapes) == 1
        assert len(scrapes[0]["listings"]) == 3  # 2 vivid + 1 tickpick

    def test_parse_missing_file(self, tmp_path: Path) -> None:
        scrapes = parse_markdown_scrapes(tmp_path / "nonexistent.md")
        assert scrapes == []

    def test_backfill(self, tmp_path: Path) -> None:
        md_content = """# Ticket Prices: Test

**Venue:** Venue
**Date:** 2026-03-27
**Scraped at:** 2026-03-27 20:00:00

### Vivid Seats
*Fees included*

| # | Price/ea | Section | Row | Qty |
|--:|--------:|---------|-----|:---:|
| 1 | $291 | 423 | Q | 2 |
"""
        md_path = tmp_path / "prices.md"
        md_path.write_text(md_content)

        db = Database(db_path=tmp_path / "test.db")
        db.init_schema()
        count = backfill(db, md_path)
        assert count >= 1
