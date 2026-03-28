"""Base scraper class — all platform scrapers inherit from this."""

import logging
import time
from abc import ABC, abstractmethod
from typing import List, Optional

from backend.models import Listing
from backend.scrapers.utils import (
    create_stealth_driver,
    jittered_delay,
    load_cookies,
    save_cookies,
    validate_prices,
)

MAX_RETRIES = 2
RETRY_BACKOFF_BASE = 10  # seconds

logger = logging.getLogger(__name__)


class BaseScraper(ABC):
    """Abstract base for platform scrapers.

    Each subclass must implement:
      - platform_name: str
      - scrape(driver) -> List[Listing]
    """

    platform_name: str = "unknown"
    url: str = ""
    top_n: int = 3
    qty: int = 2

    def __init__(self, url: Optional[str] = None, qty: int = 2, top_n: int = 3) -> None:
        if url:
            self.url = url
        self.qty = qty
        self.top_n = top_n

    @abstractmethod
    def _extract_listings(self, driver) -> List[Listing]:
        """Platform-specific extraction logic. Returns raw listings."""
        ...

    def scrape(self, driver=None) -> List[Listing]:
        """Run the full scrape pipeline: load page, extract, validate, sort, return top N.

        If driver is None, creates and manages its own driver.
        """
        own_driver = driver is None
        if own_driver:
            driver = create_stealth_driver()

        try:
            listings = self._scrape_with_retry(driver)

            # Validate and filter
            listings = validate_prices(listings)
            valid = [l for l in listings if not l.is_anomaly]
            valid.sort(key=lambda x: x.price)

            logger.info(
                f"[{self.platform_name}] Found {len(listings)} total, "
                f"{len(valid)} valid, returning top {self.top_n}"
            )
            return valid[:self.top_n]

        except Exception as e:
            logger.error(f"[{self.platform_name}] Scrape failed: {e}")
            return []
        finally:
            if own_driver:
                driver.quit()

    def scrape_all(self, driver=None) -> List[Listing]:
        """Same as scrape() but returns ALL valid listings, not just top N."""
        own_driver = driver is None
        if own_driver:
            driver = create_stealth_driver()

        try:
            listings = self._scrape_with_retry(driver)
            listings = validate_prices(listings)
            valid = [l for l in listings if not l.is_anomaly]
            valid.sort(key=lambda x: x.price)

            logger.info(f"[{self.platform_name}] Found {len(valid)} valid listings")
            return valid

        except Exception as e:
            logger.error(f"[{self.platform_name}] Scrape failed: {e}")
            return []
        finally:
            if own_driver:
                driver.quit()

    def _scrape_with_retry(self, driver) -> List[Listing]:
        """Load page and extract listings with retry on failure."""
        for attempt in range(MAX_RETRIES + 1):
            try:
                logger.info(f"[{self.platform_name}] Loading {self.url} (attempt {attempt + 1})")
                driver.get(self.url)

                if load_cookies(driver, self.platform_name):
                    driver.refresh()
                    time.sleep(2)

                time.sleep(5)
                listings = self._extract_listings(driver)
                save_cookies(driver, self.platform_name)

                # Check for blocked/empty response
                if not listings and attempt < MAX_RETRIES:
                    page_text = ""
                    try:
                        from selenium.webdriver.common.by import By
                        page_text = driver.find_element(By.TAG_NAME, "body").text.lower()
                    except Exception:
                        pass

                    blocked_signals = ["access denied", "blocked", "captcha", "verify you are human"]
                    if any(sig in page_text for sig in blocked_signals):
                        wait = RETRY_BACKOFF_BASE * (2 ** attempt)
                        logger.warning(
                            f"[{self.platform_name}] Blocked detected, retrying in {wait}s"
                        )
                        time.sleep(wait)
                        continue

                return listings
            except Exception as e:
                if attempt < MAX_RETRIES:
                    wait = RETRY_BACKOFF_BASE * (2 ** attempt)
                    logger.warning(
                        f"[{self.platform_name}] Attempt {attempt + 1} failed: {e}, retrying in {wait}s"
                    )
                    time.sleep(wait)
                else:
                    raise
        return []
