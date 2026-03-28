#!/usr/bin/env python3
"""
Ticket Price Scraper — NCAA East Regional Session 1
Duke vs St. John's & UConn vs Michigan St.
Capital One Arena — March 27, 2026

Scrapes the top 3 cheapest 2-ticket listings from 6 sites:
  TickPick, Vivid Seats, SeatGeek, Ticketmaster, StubHub, Gametime

Uses Selenium (headless Chrome) to render JS-heavy pages.

Usage:
    python3 scrape_tickets.py

Install deps:
    pip install selenium webdriver-manager requests beautifulsoup4 lxml
"""

import json
import logging
import re
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import requests
from bs4 import BeautifulSoup

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

SCRIPT_DIR = Path(__file__).parent
OUTPUT_FILE = SCRIPT_DIR / "ticket_prices.md"
TOP_N = 3  # cheapest per site
QTY = 2    # number of tickets

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

# ── Event URLs (discovered via browser session) ─────────────────────────
URLS = {
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
        "ncaa-basketball/2026-03-27-7-10-pm/17520419"
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


# ═══════════════════════════════════════════════════════════════════════════
#  Selenium helpers
# ═══════════════════════════════════════════════════════════════════════════

def _get_driver():
    """Create a headless Chrome driver."""
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options

    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--window-size=1280,900")
    opts.add_argument(f"--user-agent={HEADERS['User-Agent']}")
    # Anti-detection: disable automation flags so sites don't block us
    opts.add_argument("--disable-blink-features=AutomationControlled")
    opts.add_experimental_option("excludeSwitches", ["enable-automation"])
    opts.add_experimental_option("useAutomationExtension", False)
    try:
        driver = webdriver.Chrome(options=opts)
    except Exception:
        from selenium.webdriver.chrome.service import Service
        from webdriver_manager.chrome import ChromeDriverManager
        svc = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=svc, options=opts)
    # Remove webdriver flag to avoid bot detection
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"
    })
    return driver


def _safe_click(driver, xpath: str, timeout: int = 8) -> bool:
    """Click element by xpath, return True on success."""
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.support.ui import WebDriverWait
    try:
        el = WebDriverWait(driver, timeout).until(EC.element_to_be_clickable((By.XPATH, xpath)))
        el.click()
        return True
    except Exception:
        return False


# ═══════════════════════════════════════════════════════════════════════════
#  Per-site scrapers
# ═══════════════════════════════════════════════════════════════════════════

def scrape_tickpick(driver) -> List[Dict]:
    """
    TickPick navigation:
    1. Load page → quantity dialog appears with buttons "Select 2 tickets" etc.
    2. Click "Select 2 tickets"
    3. Click "Sort by Best Deals" → dropdown appears → click "Cheapest"
    4. Listings are <button> elements with aria-label="Buy tickets for Section X, Row Y, Quantity Z Tickets"
       Price is in a child element as "$NNN". TickPick = no hidden fees.
    """
    from selenium.webdriver.common.by import By

    logger.info("[TickPick] Loading...")
    driver.get(URLS["tickpick"])
    time.sleep(6)

    # 1. Select quantity — try both button formats
    if not _safe_click(driver, f"//button[contains(text(), 'Select {QTY} ticket')]", timeout=8):
        # Alternate: numbered buttons in "How many tickets?" dialog
        _safe_click(driver, f"//button[text()='{QTY}']", timeout=5)
    time.sleep(3)

    # 2. Sort by cheapest: click the sort button, then "Cheapest"
    _safe_click(driver, "//button[contains(text(), 'Sort by')]", timeout=5)
    time.sleep(1)
    _safe_click(driver, "//*[contains(text(), 'Cheapest') and not(contains(text(), 'Sort'))]", timeout=5)
    time.sleep(4)

    # 3. Extract listings from buttons with aria-label pattern
    listings = []
    buttons = driver.find_elements(By.XPATH, "//button[contains(@aria-label, 'Buy tickets for Section')]")
    for btn in buttons:
        try:
            label = btn.get_attribute("aria-label") or ""
            sec = re.search(r"Section\s+(\S+)", label)
            row = re.search(r"Row\s+(\S+)", label)
            qty = re.search(r"(\d+(?:-\d+)?)\s+Ticket", label)
            price_m = re.search(r"\$(\d[\d,]*)", btn.text)
            if sec and price_m:
                listings.append({
                    "price": int(price_m.group(1).replace(",", "")),
                    "section": sec.group(1),
                    "row": row.group(1) if row else "N/A",
                    "qty": qty.group(1) if qty else "N/A",
                    "fees": "No fees",
                })
        except Exception:
            pass

    # Fallback: parse page text for "Section NNN Row X · N Tickets $NNN ea"
    if not listings:
        page_text = driver.find_element(By.TAG_NAME, "body").text
        pattern = re.compile(
            r"Section\s+(\d+)\s+Row\s+(\w+)\s*[·•]\s*(\d+(?:-\d+)?)\s+Tickets?\s+"
            r".*?\$([\d,]+)\s*ea",
            re.DOTALL,
        )
        for m in pattern.finditer(page_text):
            listings.append({
                "price": int(m.group(4).replace(",", "")),
                "section": m.group(1),
                "row": m.group(2),
                "qty": m.group(3),
                "fees": "No fees",
            })

    logger.info(f"[TickPick] Found {len(listings)} listings")
    return listings


def scrape_vividseats(driver) -> List[Dict]:
    """
    Vivid Seats navigation:
    1. Load the event page — it renders listing cards via JS.
    2. The page text contains inline listing data in format:
       "Mezzanine Level 423 Row Q | 1–3 tickets ... Fees Incl. $308 ea"
    3. Default sort is by Deal Score; listings are all visible on page.
    4. Quantity defaults to "Any Quantity" — listings show qty available.
    """
    from selenium.webdriver.common.by import By

    logger.info("[VividSeats] Loading...")
    driver.get(URLS["vividseats"])
    time.sleep(5)

    # Extract from page text — Vivid Seats renders listing data inline
    page_text = driver.find_element(By.TAG_NAME, "body").text

    listings = []
    # Pattern: "Level/Section NNN Row X | N tickets ... $NNN ea"
    # The page shows listings like:
    #   "Mezzanine Level 423 Row Q | 1–3 tickets Lowest Price in Section 8.3 Great Fees Incl. $308 ea"
    pattern = re.compile(
        r"(?:Mezzanine Level|Lower Level|Club Level|Club|Upper)\s+"
        r"(\d+)\s+Row\s+(\w+)\s*\|\s*(\d+(?:[–-]\d+)?)\s+tickets?\s+"
        r".*?Fees Incl\.\s*\$(\d[\d,]*)",
        re.DOTALL,
    )
    for m in pattern.finditer(page_text):
        listings.append({
            "price": int(m.group(4).replace(",", "")),
            "section": m.group(1),
            "row": m.group(2),
            "qty": m.group(3),
            "fees": "Included",
        })

    # Fallback: try simpler pattern
    if not listings:
        simple = re.compile(r"(\d{3})\s+Row\s+(\w+).*?Fees Incl\.\s*\$(\d[\d,]*)")
        for m in simple.finditer(page_text):
            listings.append({
                "price": int(m.group(3).replace(",", "")),
                "section": m.group(1),
                "row": m.group(2),
                "qty": "N/A",
                "fees": "Included",
            })

    logger.info(f"[VividSeats] Found {len(listings)} listings")
    return listings


def scrape_seatgeek(driver) -> List[Dict]:
    """
    SeatGeek navigation:
    1. Load event page → quantity dialog pops up with buttons "1", "2", "3", etc.
    2. Click "2" button in the dialog.
    3. URL updates to ?quantity=2. Page shows listings sorted by "Deal score".
    4. Click "Sort by deal" dropdown → click "Price" option.
    5. Listings appear as cards: "Section 408 / Row C, 1-2 tickets / $335 incl. fees"
    """
    from selenium.webdriver.common.by import By

    logger.info("[SeatGeek] Loading...")
    driver.get(URLS["seatgeek"] + f"?quantity={QTY}")
    time.sleep(8)

    # 1. Dismiss quantity dialog if it appears (click the "2" button)
    _safe_click(driver, "//button[text()='2']", timeout=5)
    time.sleep(3)

    # 2. Sort by price: click sort dropdown, then "Price"
    _safe_click(driver, "//button[contains(text(), 'Sort by')]", timeout=5)
    time.sleep(1)
    _safe_click(driver, "//*[text()='Price']", timeout=3)
    time.sleep(4)

    # 3. Extract listings — they appear as button elements with aria-labels
    #    e.g., "Section 408, Row C, 1 to 2 tickets at $335 each, Deal Score 10"
    listings = []
    buttons = driver.find_elements(
        By.XPATH, "//button[contains(@aria-label, 'Section') and contains(@aria-label, 'tickets at')]"
    )
    for btn in buttons:
        try:
            label = btn.get_attribute("aria-label") or ""
            m = re.search(
                r"Section\s+(\d+),?\s*Row\s+(\w+),?\s*(\d+(?:\s+to\s+\d+)?)\s+tickets?\s+at\s+\$(\d[\d,]*)\s+each",
                label,
            )
            if m:
                listings.append({
                    "price": int(m.group(4).replace(",", "")),
                    "section": m.group(1),
                    "row": m.group(2),
                    "qty": m.group(3).replace(" to ", "-"),
                    "fees": "Included",
                })
        except Exception:
            pass

    # Fallback: parse page text
    if not listings:
        page_text = driver.find_element(By.TAG_NAME, "body").text

        pattern = re.compile(
            r"Section\s+(\d+)\s+Row\s+(\w+),?\s*(\d+(?:[–-]\d+)?)\s+tickets?\s+"
            r".*?\$(\d[\d,]+)\s*incl\.\s*fees",
            re.DOTALL,
        )
        for m in pattern.finditer(page_text):
            listings.append({
                "price": int(m.group(4).replace(",", "")),
                "section": m.group(1),
                "row": m.group(2),
                "qty": m.group(3),
                "fees": "Included",
            })

    # Fallback 2: broader capture
    if not listings:
        page_text = driver.find_element(By.TAG_NAME, "body").text
        blocks = re.findall(
            r"Section\s+(\d+).*?Row\s+(\w+).*?\$(\d[\d,]+).*?(?:incl|each)",
            page_text, re.DOTALL
        )
        for sec, row, price in blocks:
            listings.append({
                "price": int(price.replace(",", "")),
                "section": sec,
                "row": row,
                "qty": "N/A",
                "fees": "Included",
            })

    logger.info(f"[SeatGeek] Found {len(listings)} listings")
    return listings


def scrape_ticketmaster(driver) -> List[Dict]:
    """
    Ticketmaster navigation:
    1. Load event page → may show privacy/cookie dialog and "What You Need To Know" popup.
    2. Click "Accept & Continue" on popup, "Allow All"/"Reject All" on cookie banner.
    3. Quantity dropdown defaults to 2. "LOWEST PRICE" tab is available.
    4. Listings are in a <menu role="menu"> with <menuitem> elements containing:
       "Sec 417 • Row J", "Verified Resale Ticket", "$368.90"
    5. Prices already include fees (stated at top: "Prices include fees").
    """
    from selenium.webdriver.common.by import By

    logger.info("[Ticketmaster] Loading...")
    driver.get(URLS["ticketmaster"])
    time.sleep(6)

    # Dismiss popups
    _safe_click(driver, "//button[contains(text(), 'Accept & Continue')]", timeout=5)
    time.sleep(1)
    _safe_click(driver, "//button[contains(text(), 'Reject All')]", timeout=3)
    time.sleep(1)

    # Click "LOWEST PRICE" tab if not already selected
    _safe_click(driver, "//tab[contains(text(), 'LOWEST PRICE')]", timeout=3)
    time.sleep(2)

    # Extract listings from menuitem elements
    page_text = driver.find_element(By.TAG_NAME, "body").text
    listings = []

    # Pattern: "Sec 417 • Row J Verified Resale Ticket $368.90"
    pattern = re.compile(
        r"Sec\s+(\w+)\s*[•·]\s*Row\s+(\w+)\s+"
        r"(?:Verified Resale Ticket|Standard Admission)\s+"
        r"\$([\d,]+(?:\.\d{2})?)"
    )
    for m in pattern.finditer(page_text):
        listings.append({
            "price": float(m.group(3).replace(",", "")),
            "section": m.group(1),
            "row": m.group(2),
            "qty": str(QTY),
            "fees": "Included",
        })

    logger.info(f"[Ticketmaster] Found {len(listings)} listings")
    return listings


def scrape_stubhub(driver) -> List[Dict]:
    """
    StubHub navigation:
    1. Load event page → shows seating chart with listings on the side.
    2. Quantity dropdown defaults to "2 tickets".
    3. May need to click "View N Listings" button if listings panel is collapsed.
    4. Sort by "Price" radio button in sort options.
    5. Listings as button/card elements: "Section 100 / Row H / 2 tickets together / $5,389 incl. fees"
    NOTE: URL now points to Session 1 only (event/158035202).
    """
    from selenium.webdriver.common.by import By

    logger.info("[StubHub] Loading...")
    driver.get(URLS["stubhub"])
    time.sleep(6)

    # Set quantity to 2 if needed (usually default)
    # Click "View Listings" if present
    _safe_click(driver, "//button[contains(text(), 'View')]", timeout=5)
    time.sleep(2)

    # Sort by Price
    _safe_click(driver, "//label[contains(., 'Price')]//input[@type='radio']", timeout=3)
    time.sleep(2)

    page_text = driver.find_element(By.TAG_NAME, "body").text
    listings = []

    # Pattern: "Section NNN Row X 2 tickets together ... $N,NNN incl. fees"
    pattern = re.compile(
        r"Section\s+(\w+)\s+Row\s+(\w+)\s+"
        r".*?\$([\d,]+)\s*(?:incl\.\s*fees|Now)",
        re.DOTALL,
    )
    for m in pattern.finditer(page_text):
        price_str = m.group(3).replace(",", "")
        listings.append({
            "price": int(price_str),
            "section": m.group(1),
            "row": m.group(2),
            "qty": str(QTY),
            "fees": "Included",
            "note": "Session 1 only",
        })

    logger.info(f"[StubHub] Found {len(listings)} listings")
    return listings


def scrape_gametime(driver) -> List[Dict]:
    """
    Gametime navigation:
    1. Load event page → may show email signup popup.
    2. Dismiss popup by clicking "No thanks, I'll pay full price" or close button.
    3. Page shows "Top Deals on Gametime" with listing cards.
    4. Each listing card is a <link> element containing:
       - Level label: "Upper" / "Club" / "Main"
       - Section and Row: "422, Row K"
       - Deal tag: "CHEAPEST" / "SUPER DEAL" / "AMAZING DEAL"
       - Price: "Includes Fees $343/ea"
    5. Quantity button shows "2 Tickets" — set before loading via UI.
    """
    from selenium.webdriver.common.by import By

    logger.info("[Gametime] Loading...")
    driver.get(URLS["gametime"])
    time.sleep(5)

    # Dismiss email popup
    _safe_click(driver, "//button[contains(text(), 'No thanks')]", timeout=5)
    time.sleep(1)
    # Also try close button
    _safe_click(driver, "//button[contains(text(), 'Close')]", timeout=2)
    time.sleep(1)

    # Set quantity to 2 if needed
    _safe_click(driver, "//button[contains(text(), 'Tickets')]", timeout=3)
    time.sleep(1)
    _safe_click(driver, f"//button[contains(text(), '{QTY} Ticket')]", timeout=3)
    time.sleep(3)

    page_text = driver.find_element(By.TAG_NAME, "body").text
    listings = []

    # Pattern: "NNN, Row X ... Includes Fees $NNN/ea" or "$NNN" (both are per-ticket)
    # Verified: Gametime always shows per-ticket prices. Featured cards just omit "/ea".
    pattern = re.compile(
        r"(\d{3}),\s*Row\s+(\w+)\s+"
        r".*?(?:Includes Fees|Fees Incl\.?)\s*"
        r"\$([\d,]+)\s*(?:/ea)?",
        re.DOTALL,
    )
    seen = set()
    for m in pattern.finditer(page_text):
        sec, row = m.group(1), m.group(2)
        price = int(m.group(3).replace(",", ""))
        # Sanity check: skip prices under $50 (likely regex misparse)
        if price < 50:
            continue
        if (sec, row) not in seen:
            listings.append({
                "price": price,
                "section": sec,
                "row": row,
                "qty": str(QTY),
                "fees": "Included",
            })
            seen.add((sec, row))

    # Fallback: simpler pattern
    if not listings:
        simple = re.compile(r"(\d{3}),\s*Row\s+(\w+).*?\$([\d,]+)\s*/ea")
        for m in simple.finditer(page_text):
            listings.append({
                "price": int(m.group(3).replace(",", "")),
                "section": m.group(1),
                "row": m.group(2),
                "qty": str(QTY),
                "fees": "Included",
            })

    logger.info(f"[Gametime] Found {len(listings)} listings")
    return listings


# ═══════════════════════════════════════════════════════════════════════════
#  Output
# ═══════════════════════════════════════════════════════════════════════════

def fmt(price) -> str:
    """Format price as dollar string."""
    try:
        v = float(price)
        if v == int(v):
            return f"${int(v):,}"
        return f"${v:,.2f}"
    except (ValueError, TypeError):
        return str(price)


def generate_markdown(results: Dict[str, List[Dict]]) -> str:
    """Build the full markdown report."""
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = [
        "# Ticket Prices: Duke vs St. John's Men's Basketball",
        "",
        "**Event:** NCAA East Regional - Session 1 (#1 Duke vs #5 St. John's & #2 UConn vs #3 Michigan St.)",
        "**Venue:** Capital One Arena, Washington DC",
        "**Date:** Friday, March 27, 2026 @ 7:10 PM",
        f"**Scraped at:** {ts}",
        f"**Filter:** {QTY} Tickets, Sorted by Cheapest",
        "**All prices per ticket, include fees unless noted**",
        "",
        "---",
        "",
        "## Top 3 Cheapest Per Site",
        "",
    ]

    site_labels = {
        "vividseats": ("Vivid Seats", "Fees included in listed price"),
        "seatgeek": ("SeatGeek", "Fees included in listed price"),
        "ticketmaster": ("Ticketmaster", "Fees included in listed price"),
        "stubhub": ("StubHub", "Fees included in listed price"),
        "gametime": ("Gametime", "Fees included in listed price"),
        "tickpick": ("TickPick", "No service fees — listed price = total price"),
    }

    cheapest_per_site = {}

    for site_key in ["vividseats", "seatgeek", "ticketmaster", "stubhub", "gametime", "tickpick"]:
        label, fee_note = site_labels[site_key]
        site_listings = results.get(site_key, [])
        sorted_l = sorted(site_listings, key=lambda x: float(x.get("price", 999999)))
        top = sorted_l[:TOP_N]

        lines.append(f"### {label}")
        lines.append(f"*{fee_note}*")
        lines.append("")

        if top:
            cheapest_per_site[label] = top[0]
            lines.append("| # | Price/ea | Section | Row | Qty |")
            lines.append("|--:|--------:|---------|-----|:---:|")
            for i, l in enumerate(top, 1):
                lines.append(
                    f"| {i} | {fmt(l['price'])} | {l['section']} | {l['row']} | {l.get('qty', 'N/A')} |"
                )
        else:
            lines.append("*No listings found — site may have blocked scraping or changed layout.*")

        lines.append("")

    # Cross-site comparison
    lines.extend([
        "---",
        "",
        "## Cross-Site Comparison (Cheapest Per Site)",
        "",
        "| Site | Cheapest/ea | Section | Row | Fee Policy |",
        "|------|------------:|---------|-----|------------|",
    ])
    for label, info in sorted(cheapest_per_site.items(), key=lambda x: float(x[1]["price"])):
        fee_pol = info.get("fees", "Included")
        lines.append(
            f"| {label} | {fmt(info['price'])} | {info['section']} | {info['row']} | {fee_pol} |"
        )

    if cheapest_per_site:
        best_site = min(cheapest_per_site.items(), key=lambda x: float(x[1]["price"]))
        best_label, best_info = best_site
        total = float(best_info["price"]) * QTY
        lines.extend([
            "",
            f"> **Best deal: {best_label} — Section {best_info['section']}, "
            f"Row {best_info['row']} at {fmt(best_info['price'])}/ticket "
            f"({fmt(total)} total for {QTY})**",
        ])

    lines.extend(["", "---", "*Generated by TicketPriceTracker*"])
    return "\n".join(lines)


def save_markdown(content: str) -> Path:
    """Save markdown, prepending new scrape and keeping history."""
    if OUTPUT_FILE.exists():
        existing = OUTPUT_FILE.read_text()
        content = content + "\n\n---\n\n" + existing
    OUTPUT_FILE.write_text(content)
    logger.info(f"Saved to {OUTPUT_FILE}")
    return OUTPUT_FILE


# ═══════════════════════════════════════════════════════════════════════════
#  Main
# ═══════════════════════════════════════════════════════════════════════════

def main() -> int:
    logger.info("=" * 60)
    logger.info("Ticket Price Scraper — 6 Sites")
    logger.info("NCAA East Regional @ Capital One Arena — March 27, 2026")
    logger.info("=" * 60)

    try:
        from selenium import webdriver  # noqa: F401
    except ImportError:
        logger.error("Selenium is required. Run: pip install selenium webdriver-manager")
        return 1

    driver = _get_driver()
    results: Dict[str, List[Dict]] = {}

    scrapers = [
        ("tickpick", scrape_tickpick),
        ("vividseats", scrape_vividseats),
        ("seatgeek", scrape_seatgeek),
        ("ticketmaster", scrape_ticketmaster),
        ("stubhub", scrape_stubhub),
        ("gametime", scrape_gametime),
    ]

    for site_key, scraper_fn in scrapers:
        try:
            listings = scraper_fn(driver)
            results[site_key] = listings
        except Exception as e:
            logger.error(f"[{site_key}] Scraper failed: {e}")
            results[site_key] = []
        time.sleep(2)  # polite delay between sites

    driver.quit()

    total = sum(len(v) for v in results.values())
    logger.info(f"Total listings collected: {total}")

    md = generate_markdown(results)
    save_markdown(md)
    print("\n" + md)
    return 0


if __name__ == "__main__":
    sys.exit(main())
