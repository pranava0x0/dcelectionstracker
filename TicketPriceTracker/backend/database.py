"""SQLite database layer for TicketPriceTracker.

Schema:
  events(id, name, venue, event_date, created_at)
  event_urls(id, event_id, platform, url)
  scrapes(id, event_id, scraped_at)
  listings(id, scrape_id, platform, price, section, row, qty, fee_policy, is_anomaly, url)

Usage:
  python -m backend.database --backfill   # Parse ticket_prices.md into DB
  python -m backend.database --stats      # Print DB stats
"""

import logging
import re
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

from backend.models import ArbitrageAlert, Event, Listing, PlatformSummary, PricePoint, Scrape

logger = logging.getLogger(__name__)

DB_DIR = Path(__file__).parent.parent
DB_PATH = DB_DIR / "prices.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    venue TEXT NOT NULL,
    event_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(name, venue, event_date)
);

CREATE TABLE IF NOT EXISTS scrapes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES events(id),
    scraped_at TEXT NOT NULL,
    UNIQUE(event_id, scraped_at)
);

CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scrape_id INTEGER NOT NULL REFERENCES scrapes(id),
    platform TEXT NOT NULL,
    price REAL NOT NULL,
    section TEXT NOT NULL,
    row TEXT NOT NULL,
    qty TEXT DEFAULT 'N/A',
    fee_policy TEXT DEFAULT 'Included',
    is_anomaly INTEGER DEFAULT 0,
    is_multi_session INTEGER DEFAULT 0,
    url TEXT,
    UNIQUE(scrape_id, platform, section, row, price)
);

CREATE TABLE IF NOT EXISTS event_urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES events(id),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    UNIQUE(event_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_listings_scrape ON listings(scrape_id);
CREATE INDEX IF NOT EXISTS idx_listings_platform ON listings(platform);
CREATE INDEX IF NOT EXISTS idx_scrapes_event ON scrapes(event_id);
CREATE INDEX IF NOT EXISTS idx_event_urls_event ON event_urls(event_id);
"""


class Database:
    """SQLite database wrapper for ticket price data."""

    def __init__(self, db_path: Optional[Path] = None) -> None:
        self.db_path = db_path or DB_PATH
        self._conn: Optional[sqlite3.Connection] = None

    def connect(self) -> sqlite3.Connection:
        if self._conn is None:
            self._conn = sqlite3.connect(str(self.db_path), check_same_thread=False)
            self._conn.row_factory = sqlite3.Row
            self._conn.execute("PRAGMA journal_mode=WAL")
            self._conn.execute("PRAGMA foreign_keys=ON")
        return self._conn

    def close(self) -> None:
        if self._conn:
            self._conn.close()
            self._conn = None

    def init_schema(self) -> None:
        conn = self.connect()
        conn.executescript(SCHEMA)
        self._migrate(conn)
        conn.commit()
        logger.info("Database schema initialized")

    def _migrate(self, conn: sqlite3.Connection) -> None:
        """Run lightweight migrations for schema changes."""
        # Add is_multi_session column if missing (added in multi-session detector feature)
        cols = [row[1] for row in conn.execute("PRAGMA table_info(listings)").fetchall()]
        if "is_multi_session" not in cols:
            conn.execute("ALTER TABLE listings ADD COLUMN is_multi_session INTEGER DEFAULT 0")
            logger.info("Migration: added is_multi_session column to listings")

    # ── Events ────────────────────────────────────────────────────────────

    def upsert_event(self, name: str, venue: str, event_date: str) -> int:
        conn = self.connect()
        conn.execute(
            "INSERT OR IGNORE INTO events (name, venue, event_date) VALUES (?, ?, ?)",
            (name, venue, event_date),
        )
        conn.commit()
        row = conn.execute(
            "SELECT id FROM events WHERE name=? AND venue=? AND event_date=?",
            (name, venue, event_date),
        ).fetchone()
        return row["id"]

    def get_events(self) -> List[Event]:
        conn = self.connect()
        rows = conn.execute("SELECT * FROM events ORDER BY event_date").fetchall()
        return [
            Event(
                id=r["id"],
                name=r["name"],
                venue=r["venue"],
                event_date=r["event_date"],
                created_at=datetime.fromisoformat(r["created_at"]) if r["created_at"] else None,
            )
            for r in rows
        ]

    def get_event(self, event_id: int) -> Optional[Event]:
        conn = self.connect()
        r = conn.execute("SELECT * FROM events WHERE id=?", (event_id,)).fetchone()
        if not r:
            return None
        return Event(
            id=r["id"],
            name=r["name"],
            venue=r["venue"],
            event_date=r["event_date"],
            created_at=datetime.fromisoformat(r["created_at"]) if r["created_at"] else None,
        )

    # ── Event URLs ──────────────────────────────────────────────────────────

    def upsert_event_url(self, event_id: int, platform: str, url: str) -> None:
        conn = self.connect()
        conn.execute(
            "INSERT OR REPLACE INTO event_urls (event_id, platform, url) VALUES (?, ?, ?)",
            (event_id, platform, url),
        )
        conn.commit()

    def get_event_urls(self, event_id: int) -> Dict[str, str]:
        conn = self.connect()
        rows = conn.execute(
            "SELECT platform, url FROM event_urls WHERE event_id=?",
            (event_id,),
        ).fetchall()
        return {r["platform"]: r["url"] for r in rows}

    def delete_event_url(self, event_id: int, platform: str) -> bool:
        conn = self.connect()
        cursor = conn.execute(
            "DELETE FROM event_urls WHERE event_id=? AND platform=?",
            (event_id, platform),
        )
        conn.commit()
        return cursor.rowcount > 0

    def list_tracked_events(self) -> List[Dict]:
        """Return events that have at least one platform URL configured."""
        conn = self.connect()
        rows = conn.execute(
            """SELECT e.*, COUNT(eu.id) as url_count
               FROM events e
               JOIN event_urls eu ON eu.event_id = e.id
               GROUP BY e.id
               ORDER BY e.event_date""",
        ).fetchall()
        return [
            {
                "id": r["id"],
                "name": r["name"],
                "venue": r["venue"],
                "event_date": r["event_date"],
                "created_at": r["created_at"],
                "url_count": r["url_count"],
            }
            for r in rows
        ]

    # ── Scrapes ───────────────────────────────────────────────────────────

    def create_scrape(self, event_id: int, scraped_at: datetime) -> int:
        conn = self.connect()
        ts = scraped_at.isoformat(sep=" ", timespec="seconds")
        try:
            conn.execute(
                "INSERT INTO scrapes (event_id, scraped_at) VALUES (?, ?)",
                (event_id, ts),
            )
            conn.commit()
        except sqlite3.IntegrityError:
            pass  # duplicate scrape timestamp
        row = conn.execute(
            "SELECT id FROM scrapes WHERE event_id=? AND scraped_at=?",
            (event_id, ts),
        ).fetchone()
        return row["id"]

    # ── Listings ──────────────────────────────────────────────────────────

    def insert_listings(self, scrape_id: int, listings: List[Listing]) -> int:
        conn = self.connect()
        inserted = 0
        for l in listings:
            try:
                conn.execute(
                    """INSERT OR IGNORE INTO listings
                       (scrape_id, platform, price, section, row, qty, fee_policy, is_anomaly, is_multi_session, url)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (scrape_id, l.platform, l.price, l.section, l.row,
                     l.qty, l.fee_policy, int(l.is_anomaly), int(l.is_multi_session), l.url),
                )
                inserted += 1
            except Exception as e:
                logger.warning(f"Failed to insert listing: {e}")
        conn.commit()
        return inserted

    # ── Queries ───────────────────────────────────────────────────────────

    def get_latest_scrape(self, event_id: int) -> Optional[Tuple[int, datetime]]:
        conn = self.connect()
        row = conn.execute(
            "SELECT id, scraped_at FROM scrapes WHERE event_id=? ORDER BY scraped_at DESC LIMIT 1",
            (event_id,),
        ).fetchone()
        if not row:
            return None
        return row["id"], datetime.fromisoformat(row["scraped_at"])

    def get_platform_summaries(self, scrape_id: int, include_multi_session: bool = False) -> List[PlatformSummary]:
        conn = self.connect()
        multi_filter = "" if include_multi_session else " AND is_multi_session=0"
        rows = conn.execute(
            f"""SELECT platform, MIN(price) as cheapest_price, section, row, qty, fee_policy,
                      COUNT(*) as listing_count, url
               FROM listings
               WHERE scrape_id=? AND is_anomaly=0{multi_filter}
               GROUP BY platform
               ORDER BY cheapest_price""",
            (scrape_id,),
        ).fetchall()

        results = []
        for r in rows:
            # Get the actual row with the min price for correct section/row
            detail = conn.execute(
                f"""SELECT section, row, qty, fee_policy, is_multi_session, url FROM listings
                   WHERE scrape_id=? AND platform=? AND price=? AND is_anomaly=0{multi_filter}
                   LIMIT 1""",
                (scrape_id, r["platform"], r["cheapest_price"]),
            ).fetchone()
            results.append(PlatformSummary(
                platform=r["platform"],
                cheapest_price=r["cheapest_price"],
                section=detail["section"] if detail else r["section"],
                row=detail["row"] if detail else r["row"],
                qty=detail["qty"] if detail else r["qty"],
                fee_policy=detail["fee_policy"] if detail else r["fee_policy"],
                listing_count=r["listing_count"],
                url=detail["url"] if detail else None,
                is_multi_session=bool(detail["is_multi_session"]) if detail else False,
            ))
        return results

    def get_listings_for_platform(self, scrape_id: int, platform: str) -> List[Listing]:
        conn = self.connect()
        rows = conn.execute(
            """SELECT * FROM listings
               WHERE scrape_id=? AND platform=? AND is_anomaly=0
               ORDER BY price LIMIT 10""",
            (scrape_id, platform),
        ).fetchall()
        return [
            Listing(
                id=r["id"], scrape_id=r["scrape_id"], platform=r["platform"],
                price=r["price"], section=r["section"], row=r["row"],
                qty=r["qty"], fee_policy=r["fee_policy"],
                is_anomaly=bool(r["is_anomaly"]),
                is_multi_session=bool(r["is_multi_session"]),
                url=r["url"],
            )
            for r in rows
        ]

    def get_price_history(self, event_id: int, limit: int = 100) -> List[PricePoint]:
        conn = self.connect()
        rows = conn.execute(
            """SELECT s.scraped_at, l.platform, MIN(l.price) as cheapest_price
               FROM scrapes s
               JOIN listings l ON l.scrape_id = s.id
               WHERE s.event_id=? AND l.is_anomaly=0
               GROUP BY s.scraped_at, l.platform
               ORDER BY s.scraped_at DESC
               LIMIT ?""",
            (event_id, limit),
        ).fetchall()
        return [
            PricePoint(
                scraped_at=datetime.fromisoformat(r["scraped_at"]),
                platform=r["platform"],
                cheapest_price=r["cheapest_price"],
            )
            for r in rows
        ]

    def detect_arbitrage(
        self, scrape_id: int, min_savings_pct: float = 15.0
    ) -> List[ArbitrageAlert]:
        """Find cross-platform arbitrage opportunities within a single scrape.

        Groups listings by (section, row) across platforms. Flags pairs where
        the price delta exceeds min_savings_pct.

        Args:
            scrape_id: The scrape to analyze.
            min_savings_pct: Minimum percentage difference to flag.

        Returns:
            List of ArbitrageAlert objects sorted by savings descending.
        """
        conn = self.connect()
        # Get all valid single-session listings grouped by location
        rows = conn.execute(
            """SELECT platform, price, section, row, url
               FROM listings
               WHERE scrape_id=? AND is_anomaly=0 AND is_multi_session=0
               ORDER BY section, row, price""",
            (scrape_id,),
        ).fetchall()

        # Group by (section, row)
        from collections import defaultdict
        groups: Dict[tuple, List[Dict]] = defaultdict(list)
        for r in rows:
            key = (r["section"].upper(), r["row"].upper())
            groups[key].append({
                "platform": r["platform"],
                "price": r["price"],
                "url": r["url"],
            })

        alerts: List[ArbitrageAlert] = []
        for (section, row), listings in groups.items():
            if len(listings) < 2:
                continue

            # Get unique platforms with their cheapest price
            platform_best: Dict[str, Dict] = {}
            for listing in listings:
                p = listing["platform"]
                if p not in platform_best or listing["price"] < platform_best[p]["price"]:
                    platform_best[p] = listing

            platforms = sorted(platform_best.values(), key=lambda x: x["price"])
            if len(platforms) < 2:
                continue

            cheapest = platforms[0]
            most_expensive = platforms[-1]

            if most_expensive["price"] <= 0:
                continue

            savings = most_expensive["price"] - cheapest["price"]
            savings_pct = (savings / most_expensive["price"]) * 100

            if savings_pct >= min_savings_pct:
                alerts.append(ArbitrageAlert(
                    section=section,
                    row=row,
                    cheap_platform=cheapest["platform"],
                    cheap_price=cheapest["price"],
                    expensive_platform=most_expensive["platform"],
                    expensive_price=most_expensive["price"],
                    savings=savings,
                    savings_pct=round(savings_pct, 1),
                    cheap_url=cheapest.get("url"),
                ))

        alerts.sort(key=lambda a: a.savings, reverse=True)
        return alerts

    def get_stats(self) -> Dict:
        conn = self.connect()
        events = conn.execute("SELECT COUNT(*) as c FROM events").fetchone()["c"]
        scrapes = conn.execute("SELECT COUNT(*) as c FROM scrapes").fetchone()["c"]
        listings = conn.execute("SELECT COUNT(*) as c FROM listings").fetchone()["c"]
        anomalies = conn.execute("SELECT COUNT(*) as c FROM listings WHERE is_anomaly=1").fetchone()["c"]
        return {"events": events, "scrapes": scrapes, "listings": listings, "anomalies": anomalies}


# ── Backfill from markdown ─────────────────────────────────────────────────

def parse_markdown_scrapes(md_path: Path) -> List[Dict]:
    """Parse ticket_prices.md into structured scrape data.

    Each scrape block starts with '# Ticket Prices:' and contains
    per-platform tables with price data.
    """
    if not md_path.exists():
        logger.warning(f"Markdown file not found: {md_path}")
        return []

    text = md_path.read_text()
    blocks = text.split("# Ticket Prices:")
    scrapes = []

    for block in blocks[1:]:  # skip content before first header
        scrape_data: Dict = {"listings": []}

        # Extract metadata
        ts_match = re.search(r"\*\*Scraped at:\*\*\s*(.+)", block)
        if ts_match:
            scrape_data["scraped_at"] = ts_match.group(1).strip()

        name_match = re.search(r"(.+?)(?:\n|$)", block)
        if name_match:
            scrape_data["name"] = "Ticket Prices: " + name_match.group(1).strip()

        venue_match = re.search(r"\*\*Venue:\*\*\s*(.+)", block)
        if venue_match:
            scrape_data["venue"] = venue_match.group(1).strip()

        date_match = re.search(r"\*\*Date:\*\*\s*(.+)", block)
        if date_match:
            scrape_data["event_date"] = date_match.group(1).strip()

        # Parse platform sections
        platform_map = {
            "Vivid Seats": "vividseats",
            "SeatGeek": "seatgeek",
            "Ticketmaster": "ticketmaster",
            "StubHub": "stubhub",
            "Gametime": "gametime",
            "TickPick": "tickpick",
        }

        for display_name, platform_key in platform_map.items():
            # Find the section for this platform
            pattern = re.compile(
                rf"###\s+{re.escape(display_name)}.*?\n(.*?)(?=###|\Z)",
                re.DOTALL,
            )
            match = pattern.search(block)
            if not match:
                continue

            section_text = match.group(1)
            if "No listings found" in section_text:
                continue

            fee_policy = "No fees" if platform_key == "tickpick" else "Included"

            # Parse table rows: | N | $XXX | Section | Row | Qty |
            row_pattern = re.compile(
                r"\|\s*\d+\s*\|\s*\$([\d,]+(?:\.\d+)?)\s*\|\s*(\S+)\s*\|\s*(\S+)\s*\|\s*(\S+)\s*\|"
            )
            for m in row_pattern.finditer(section_text):
                price = float(m.group(1).replace(",", ""))
                scrape_data["listings"].append({
                    "platform": platform_key,
                    "price": price,
                    "section": m.group(2),
                    "row": m.group(3),
                    "qty": m.group(4),
                    "fee_policy": fee_policy,
                    "is_anomaly": price < 20,
                })

        if scrape_data.get("scraped_at") and scrape_data["listings"]:
            scrapes.append(scrape_data)

    logger.info(f"Parsed {len(scrapes)} scrape blocks from markdown")
    return scrapes


def backfill(db: Database, md_path: Optional[Path] = None) -> int:
    """Backfill database from ticket_prices.md."""
    md_path = md_path or (DB_DIR / "ticket_prices.md")
    scrapes = parse_markdown_scrapes(md_path)

    if not scrapes:
        logger.warning("No scrapes found to backfill")
        return 0

    db.init_schema()
    total_listings = 0

    for scrape_data in scrapes:
        event_name = scrape_data.get("name", "Unknown Event")
        venue = scrape_data.get("venue", "Unknown Venue")
        event_date = scrape_data.get("event_date", "Unknown Date")

        event_id = db.upsert_event(event_name, venue, event_date)

        try:
            scraped_at = datetime.strptime(scrape_data["scraped_at"], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            logger.warning(f"Could not parse timestamp: {scrape_data['scraped_at']}")
            continue

        scrape_id = db.create_scrape(event_id, scraped_at)

        listings = [
            Listing(
                platform=l["platform"],
                price=l["price"],
                section=l["section"],
                row=l["row"],
                qty=l["qty"],
                fee_policy=l["fee_policy"],
                is_anomaly=l.get("is_anomaly", False),
            )
            for l in scrape_data["listings"]
        ]

        count = db.insert_listings(scrape_id, listings)
        total_listings += count

    logger.info(f"Backfilled {total_listings} listings from {len(scrapes)} scrapes")
    return total_listings


# ── Migration: hardcoded URLs → event_urls table ─────────────────────────

LEGACY_EVENT_URLS = {
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


def migrate_hardcoded_urls(db: Database) -> int:
    """Migrate the hardcoded event URLs into the event_urls table for event_id=1."""
    event = db.get_event(1)
    if not event:
        logger.warning("No event with id=1 found — skipping URL migration")
        return 0

    count = 0
    for platform, url in LEGACY_EVENT_URLS.items():
        db.upsert_event_url(1, platform, url)
        count += 1
        logger.info(f"Migrated URL for {platform}")

    return count


# ── CLI ────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import sys

    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

    db = Database()
    db.init_schema()

    if "--backfill" in sys.argv:
        count = backfill(db)
        print(f"Backfilled {count} listings")
    elif "--stats" in sys.argv:
        stats = db.get_stats()
        for k, v in stats.items():
            print(f"  {k}: {v}")
    elif "--migrate-urls" in sys.argv:
        count = migrate_hardcoded_urls(db)
        print(f"Migrated {count} URLs")
    else:
        print("Usage: python -m backend.database [--backfill | --stats | --migrate-urls]")

    db.close()
