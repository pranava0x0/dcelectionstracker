"""Gametime scraper."""

import logging
import re
import time
from typing import List

from backend.models import Listing
from backend.scrapers.base import BaseScraper
from backend.scrapers.utils import safe_click

logger = logging.getLogger(__name__)


class GametimeScraper(BaseScraper):
    platform_name = "gametime"

    def _extract_listings(self, driver) -> List[Listing]:
        from selenium.webdriver.common.by import By

        # Dismiss email popup
        safe_click(driver, "//button[contains(text(), 'No thanks')]", timeout=5)
        time.sleep(1)
        safe_click(driver, "//button[contains(text(), 'Close')]", timeout=2)
        time.sleep(1)

        # Set quantity
        safe_click(driver, "//button[contains(text(), 'Tickets')]", timeout=3)
        time.sleep(1)
        safe_click(driver, f"//button[contains(text(), '{self.qty} Ticket')]", timeout=3)
        time.sleep(3)

        page_text = driver.find_element(By.TAG_NAME, "body").text
        listings = []

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
            if (sec, row) not in seen:
                listings.append(Listing(
                    platform=self.platform_name,
                    price=price,
                    section=sec,
                    row=row,
                    qty=str(self.qty),
                    fee_policy="Included",
                ))
                seen.add((sec, row))

        # Fallback: simpler pattern
        if not listings:
            simple = re.compile(r"(\d{3}),\s*Row\s+(\w+).*?\$([\d,]+)\s*/ea")
            for m in simple.finditer(page_text):
                listings.append(Listing(
                    platform=self.platform_name,
                    price=int(m.group(3).replace(",", "")),
                    section=m.group(1),
                    row=m.group(2),
                    qty=str(self.qty),
                    fee_policy="Included",
                ))

        return listings
