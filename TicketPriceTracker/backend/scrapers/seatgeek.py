"""SeatGeek scraper — API-first with browser fallback.

Tries the SeatGeek API (requires SEATGEEK_CLIENT_ID env var) first
since it's fast and reliable. Falls back to browser scraping if the
API key is missing or the API call fails.
"""

import logging
import re
import time
from typing import List

from backend.models import Listing
from backend.scrapers.base import BaseScraper
from backend.scrapers.seatgeek_api import fetch_seatgeek_listings
from backend.scrapers.utils import safe_click

logger = logging.getLogger(__name__)


class SeatGeekScraper(BaseScraper):
    platform_name = "seatgeek"

    def _extract_listings(self, driver) -> List[Listing]:
        """Try API first, fall back to browser scraping."""
        # Try API-based fetching first (much more reliable)
        api_listings = fetch_seatgeek_listings(self.url, qty=self.qty)
        if api_listings:
            logger.info(f"[seatgeek] Got {len(api_listings)} listings via API")
            return api_listings

        logger.info("[seatgeek] API unavailable, falling back to browser scrape")
        return self._extract_from_browser(driver)

    def _extract_from_browser(self, driver) -> List[Listing]:
        """Browser-based extraction as fallback."""
        from selenium.webdriver.common.by import By

        # Dismiss quantity dialog
        safe_click(driver, f"//button[text()='{self.qty}']", timeout=5)
        time.sleep(3)

        # Sort by price
        safe_click(driver, "//button[contains(text(), 'Sort by')]", timeout=5)
        time.sleep(1)
        safe_click(driver, "//*[text()='Price']", timeout=3)
        time.sleep(4)

        listings = []

        # Primary: aria-label buttons
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
                    listings.append(Listing(
                        platform=self.platform_name,
                        price=int(m.group(4).replace(",", "")),
                        section=m.group(1),
                        row=m.group(2),
                        qty=m.group(3).replace(" to ", "-"),
                        fee_policy="Included",
                    ))
            except Exception:
                pass

        # Fallback: page text
        if not listings:
            page_text = driver.find_element(By.TAG_NAME, "body").text
            pattern = re.compile(
                r"Section\s+(\d+)\s+Row\s+(\w+),?\s*(\d+(?:[–-]\d+)?)\s+tickets?\s+"
                r".*?\$(\d[\d,]+)\s*incl\.\s*fees",
                re.DOTALL,
            )
            for m in pattern.finditer(page_text):
                listings.append(Listing(
                    platform=self.platform_name,
                    price=int(m.group(4).replace(",", "")),
                    section=m.group(1),
                    row=m.group(2),
                    qty=m.group(3),
                    fee_policy="Included",
                ))

        # Fallback 2: broader capture
        if not listings:
            page_text = driver.find_element(By.TAG_NAME, "body").text
            blocks = re.findall(
                r"Section\s+(\d+).*?Row\s+(\w+).*?\$(\d[\d,]+).*?(?:incl|each)",
                page_text, re.DOTALL,
            )
            for sec, row, price in blocks:
                listings.append(Listing(
                    platform=self.platform_name,
                    price=int(price.replace(",", "")),
                    section=sec,
                    row=row,
                    qty="N/A",
                    fee_policy="Included",
                ))

        return listings
