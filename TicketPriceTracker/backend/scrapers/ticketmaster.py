"""Ticketmaster scraper."""

import logging
import re
import time
from typing import List

from backend.models import Listing
from backend.scrapers.base import BaseScraper
from backend.scrapers.utils import safe_click

logger = logging.getLogger(__name__)


class TicketmasterScraper(BaseScraper):
    platform_name = "ticketmaster"

    def _extract_listings(self, driver) -> List[Listing]:
        from selenium.webdriver.common.by import By

        # Dismiss popups
        safe_click(driver, "//button[contains(text(), 'Accept & Continue')]", timeout=5)
        time.sleep(1)
        safe_click(driver, "//button[contains(text(), 'Reject All')]", timeout=3)
        time.sleep(1)

        # Click LOWEST PRICE tab
        safe_click(driver, "//tab[contains(text(), 'LOWEST PRICE')]", timeout=3)
        time.sleep(2)

        page_text = driver.find_element(By.TAG_NAME, "body").text
        listings = []

        # Pattern: "Sec 417 · Row J Verified Resale Ticket $368.90"
        pattern = re.compile(
            r"Sec\s+(\w+)\s*[•·]\s*Row\s+(\w+)\s+"
            r"(?:Verified Resale Ticket|Standard Admission)\s+"
            r"\$([\d,]+(?:\.\d{2})?)"
        )
        for m in pattern.finditer(page_text):
            listings.append(Listing(
                platform=self.platform_name,
                price=float(m.group(3).replace(",", "")),
                section=m.group(1),
                row=m.group(2),
                qty=str(self.qty),
                fee_policy="Included",
            ))

        return listings
