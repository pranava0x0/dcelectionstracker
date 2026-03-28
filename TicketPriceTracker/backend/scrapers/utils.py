"""Shared utilities for scrapers: stealth driver, UA rotation, price validation."""

import logging
import random
import time
from pathlib import Path
from typing import List, Optional

from backend.models import Listing

logger = logging.getLogger(__name__)

# ── User-Agent rotation pool ──────────────────────────────────────────────

USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0",
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0",
]

VIEWPORT_SIZES = [
    (1280, 900),
    (1366, 768),
    (1440, 900),
    (1536, 864),
    (1920, 1080),
    (1280, 800),
    (1360, 768),
    (1400, 900),
]

COOKIE_DIR = Path(__file__).parent.parent.parent / ".cookies"


def get_random_ua() -> str:
    return random.choice(USER_AGENTS)


def get_random_viewport() -> tuple:
    base = random.choice(VIEWPORT_SIZES)
    # Add slight jitter to avoid fingerprinting
    return (base[0] + random.randint(-20, 20), base[1] + random.randint(-20, 20))


def jittered_delay(min_s: float = 1.5, max_s: float = 3.0) -> None:
    """Sleep for a random duration between min_s and max_s."""
    delay = random.uniform(min_s, max_s)
    time.sleep(delay)


# ── Stealth Chrome driver factory ─────────────────────────────────────────

def create_stealth_driver(headless: bool = True):
    """Create a stealth Chrome driver that avoids bot detection.

    Tries undetected-chromedriver first (best anti-detection),
    falls back to standard selenium with stealth patches.
    """
    ua = get_random_ua()
    vw, vh = get_random_viewport()

    try:
        import undetected_chromedriver as uc

        options = uc.ChromeOptions()
        if headless:
            options.add_argument("--headless=new")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument(f"--window-size={vw},{vh}")
        options.add_argument(f"--user-agent={ua}")

        driver = uc.Chrome(options=options)
        logger.info(f"Created stealth driver (undetected-chromedriver) viewport={vw}x{vh}")
        return driver

    except ImportError:
        logger.warning("undetected-chromedriver not installed, falling back to standard selenium")

    # Fallback: standard selenium with manual stealth patches
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options

    opts = Options()
    if headless:
        opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument(f"--window-size={vw},{vh}")
    opts.add_argument(f"--user-agent={ua}")
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

    # Remove webdriver flag
    driver.execute_cdp_cmd("Page.addScriptToEvaluateOnNewDocument", {
        "source": """
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            window.chrome = { runtime: {} };
            Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3, 4, 5]});
            Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications'
                    ? Promise.resolve({ state: Notification.permission })
                    : originalQuery(parameters)
            );
        """
    })

    logger.info(f"Created stealth driver (selenium+patches) viewport={vw}x{vh}")
    return driver


def safe_click(driver, xpath: str, timeout: int = 8) -> bool:
    """Click element by xpath, return True on success."""
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.support.ui import WebDriverWait
    try:
        el = WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable((By.XPATH, xpath))
        )
        el.click()
        return True
    except Exception:
        return False


# ── Price validation ──────────────────────────────────────────────────────

def validate_prices(listings: List[Listing], min_price: float = 20.0) -> List[Listing]:
    """Flag anomalous prices in listing data.

    Anomaly rules:
    - Price < min_price (default $20)
    - Price > 10x median of non-anomalous listings
    """
    if not listings:
        return listings

    valid_prices = [l.price for l in listings if l.price >= min_price]
    if not valid_prices:
        return listings

    valid_prices.sort()
    median = valid_prices[len(valid_prices) // 2]
    upper_bound = median * 10

    for listing in listings:
        if listing.price < min_price:
            listing.is_anomaly = True
            logger.warning(
                f"Anomaly: {listing.platform} ${listing.price} < ${min_price} "
                f"(Section {listing.section}, Row {listing.row})"
            )
        elif listing.price > upper_bound:
            listing.is_anomaly = True
            logger.warning(
                f"Anomaly: {listing.platform} ${listing.price} > 10x median ${median} "
                f"(Section {listing.section}, Row {listing.row})"
            )

    return listings


# ── Cookie persistence ────────────────────────────────────────────────────

def save_cookies(driver, platform: str) -> None:
    """Save browser cookies to disk for a platform."""
    import json
    COOKIE_DIR.mkdir(parents=True, exist_ok=True)
    cookie_file = COOKIE_DIR / f"{platform}.json"
    cookies = driver.get_cookies()
    cookie_file.write_text(json.dumps(cookies))
    logger.debug(f"Saved {len(cookies)} cookies for {platform}")


def load_cookies(driver, platform: str) -> bool:
    """Load saved cookies for a platform. Returns True if cookies were loaded."""
    import json
    cookie_file = COOKIE_DIR / f"{platform}.json"
    if not cookie_file.exists():
        return False
    try:
        cookies = json.loads(cookie_file.read_text())
        for cookie in cookies:
            # Remove problematic fields
            cookie.pop("sameSite", None)
            cookie.pop("expiry", None)
            try:
                driver.add_cookie(cookie)
            except Exception:
                pass
        logger.debug(f"Loaded {len(cookies)} cookies for {platform}")
        return True
    except Exception as e:
        logger.warning(f"Failed to load cookies for {platform}: {e}")
        return False
