"""TickPick scraper — no-fee marketplace."""

import logging
import re
import time
from typing import List

from backend.models import Listing
from backend.scrapers.base import BaseScraper
from backend.scrapers.utils import safe_click

logger = logging.getLogger(__name__)


class TickPickScraper(BaseScraper):
    platform_name = "tickpick"

    def _extract_listings(self, driver) -> List[Listing]:
        from selenium.webdriver.common.by import By

        # Select quantity
        if not safe_click(driver, f"//button[contains(text(), 'Select {self.qty} ticket')]", timeout=8):
            safe_click(driver, f"//button[text()='{self.qty}']", timeout=5)
        time.sleep(3)

        # Sort by cheapest
        safe_click(driver, "//button[contains(text(), 'Sort by')]", timeout=5)
        time.sleep(1)
        safe_click(driver, "//*[contains(text(), 'Cheapest') and not(contains(text(), 'Sort'))]", timeout=5)
        time.sleep(4)

        listings = []

        # Primary: aria-label buttons
        buttons = driver.find_elements(By.XPATH, "//button[contains(@aria-label, 'Buy tickets for Section')]")
        for btn in buttons:
            try:
                label = btn.get_attribute("aria-label") or ""
                sec = re.search(r"Section\s+(\S+)", label)
                row = re.search(r"Row\s+(\S+)", label)
                qty = re.search(r"(\d+(?:-\d+)?)\s+Ticket", label)
                price_m = re.search(r"\$(\d[\d,]*)", btn.text)
                if sec and price_m:
                    listings.append(Listing(
                        platform=self.platform_name,
                        price=int(price_m.group(1).replace(",", "")),
                        section=sec.group(1),
                        row=row.group(1) if row else "N/A",
                        qty=qty.group(1) if qty else "N/A",
                        fee_policy="No fees",
                    ))
            except Exception:
                pass

        # Fallback: page text pattern
        if not listings:
            page_text = driver.find_element(By.TAG_NAME, "body").text
            pattern = re.compile(
                r"Section\s+(\d+)\s+Row\s+(\w+)\s*[·•]\s*(\d+(?:-\d+)?)\s+Tickets?\s+"
                r".*?\$([\d,]+)\s*ea",
                re.DOTALL,
            )
            for m in pattern.finditer(page_text):
                listings.append(Listing(
                    platform=self.platform_name,
                    price=int(m.group(4).replace(",", "")),
                    section=m.group(1),
                    row=m.group(2),
                    qty=m.group(3),
                    fee_policy="No fees",
                ))

        return listings
