"""StubHub scraper."""

import logging
import re
import time
from typing import List

from backend.models import Listing
from backend.scrapers.base import BaseScraper
from backend.scrapers.utils import safe_click

logger = logging.getLogger(__name__)


class StubHubScraper(BaseScraper):
    platform_name = "stubhub"

    def _extract_listings(self, driver) -> List[Listing]:
        from selenium.webdriver.common.by import By

        # Click View Listings
        safe_click(driver, "//button[contains(text(), 'View')]", timeout=5)
        time.sleep(2)

        # Sort by Price
        safe_click(driver, "//label[contains(., 'Price')]//input[@type='radio']", timeout=3)
        time.sleep(2)

        page_text = driver.find_element(By.TAG_NAME, "body").text
        listings = []

        # Detect multi-session listings
        is_multi_session = "all sessions" in page_text.lower() or "all session" in page_text.lower()

        pattern = re.compile(
            r"Section\s+(\w+)\s+Row\s+(\w+)\s+"
            r".*?\$([\d,]+)\s*(?:incl\.\s*fees|Now)",
            re.DOTALL,
        )
        for m in pattern.finditer(page_text):
            price_str = m.group(3).replace(",", "")
            listings.append(Listing(
                platform=self.platform_name,
                price=int(price_str),
                section=m.group(1),
                row=m.group(2),
                qty=str(self.qty),
                fee_policy="Included" + (" (All Sessions)" if is_multi_session else ""),
            ))

        return listings
