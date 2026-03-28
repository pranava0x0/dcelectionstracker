"""Tests for scraper utilities (no network required)."""

import pytest

from backend.models import Listing
from backend.scrapers.utils import get_random_ua, get_random_viewport, validate_prices


class TestUserAgentRotation:
    def test_returns_string(self) -> None:
        ua = get_random_ua()
        assert isinstance(ua, str)
        assert len(ua) > 50  # Real UA strings are long

    def test_returns_different_values(self) -> None:
        """Over 100 calls, should see at least 2 different UAs."""
        uas = {get_random_ua() for _ in range(100)}
        assert len(uas) >= 2


class TestViewportRandomization:
    def test_returns_tuple(self) -> None:
        vw, vh = get_random_viewport()
        assert isinstance(vw, int)
        assert isinstance(vh, int)
        assert vw > 1000
        assert vh > 600

    def test_slight_variation(self) -> None:
        """Viewports should vary slightly due to jitter."""
        viewports = {get_random_viewport() for _ in range(50)}
        assert len(viewports) >= 2


class TestPriceValidation:
    def test_normal_prices_pass(self) -> None:
        listings = [
            Listing(platform="test", price=290, section="408", row="C"),
            Listing(platform="test", price=308, section="423", row="Q"),
        ]
        result = validate_prices(listings)
        assert all(not l.is_anomaly for l in result)

    def test_low_price_flagged(self) -> None:
        listings = [
            Listing(platform="test", price=5, section="999", row="Z"),
            Listing(platform="test", price=290, section="408", row="C"),
        ]
        result = validate_prices(listings)
        assert result[0].is_anomaly is True  # $5 is anomalous
        assert result[1].is_anomaly is False

    def test_high_price_flagged(self) -> None:
        listings = [
            Listing(platform="test", price=290, section="408", row="C"),
            Listing(platform="test", price=300, section="417", row="H"),
            Listing(platform="test", price=50000, section="100", row="A"),
        ]
        result = validate_prices(listings)
        assert result[2].is_anomaly is True  # $50k is > 10x median

    def test_empty_list(self) -> None:
        result = validate_prices([])
        assert result == []

    def test_all_low_prices(self) -> None:
        """If all prices are below threshold, they're all flagged."""
        listings = [
            Listing(platform="test", price=5, section="a", row="1"),
            Listing(platform="test", price=10, section="b", row="2"),
        ]
        result = validate_prices(listings)
        assert all(l.is_anomaly for l in result)


class TestListingModel:
    def test_valid_listing(self) -> None:
        l = Listing(platform="tickpick", price=290, section="408", row="C")
        assert l.price == 290

    def test_negative_price_rejected(self) -> None:
        with pytest.raises(ValueError):
            Listing(platform="tickpick", price=-10, section="408", row="C")

    def test_zero_price_rejected(self) -> None:
        with pytest.raises(ValueError):
            Listing(platform="tickpick", price=0, section="408", row="C")
