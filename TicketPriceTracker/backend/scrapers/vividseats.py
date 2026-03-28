"""Vivid Seats scraper."""

import logging
import re
from typing import List

from backend.models import Listing
from backend.scrapers.base import BaseScraper

logger = logging.getLogger(__name__)


class VividSeatsScraper(BaseScraper):
    platform_name = "vividseats"

    def _extract_listings(self, driver) -> List[Listing]:
        from selenium.webdriver.common.by import By

        page_text = driver.find_element(By.TAG_NAME, "body").text
        listings = []

        # Pattern: "Mezzanine Level 423 Row Q | 1-3 tickets ... Fees Incl. $308 ea"
        pattern = re.compile(
            r"(?:Mezzanine Level|Lower Level|Club Level|Club|Upper)\s+"
            r"(\d+)\s+Row\s+(\w+)\s*\|\s*(\d+(?:[–-]\d+)?)\s+tickets?\s+"
            r".*?Fees Incl\.\s*\$(\d[\d,]*)",
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

        # Fallback: simpler pattern
        if not listings:
            simple = re.compile(r"(\d{3})\s+Row\s+(\w+).*?Fees Incl\.\s*\$(\d[\d,]*)")
            for m in simple.finditer(page_text):
                listings.append(Listing(
                    platform=self.platform_name,
                    price=int(m.group(3).replace(",", "")),
                    section=m.group(1),
                    row=m.group(2),
                    qty="N/A",
                    fee_policy="Included",
                ))

        return listings
