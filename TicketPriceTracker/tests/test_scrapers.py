"""Tests for scraper utilities (no network required)."""

from unittest.mock import MagicMock, patch

import pytest

from backend.models import Listing
from backend.scrapers.seatgeek_api import extract_event_id_from_url, fetch_seatgeek_listings
from backend.scrapers.utils import (
    detect_multi_session,
    flag_multi_session_listings,
    get_random_ua,
    get_random_viewport,
    validate_prices,
)


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


class TestMultiSessionDetection:
    def test_all_sessions_detected(self) -> None:
        assert detect_multi_session("All Sessions (3/27 & 3/29)")
        assert detect_multi_session("all session tickets")

    def test_session_combo_detected(self) -> None:
        assert detect_multi_session("Session 1 & 2")
        assert detect_multi_session("Session 1 + 2")

    def test_multi_game_detected(self) -> None:
        assert detect_multi_session("2-game pack")
        assert detect_multi_session("multi-game package")

    def test_package_deal_detected(self) -> None:
        assert detect_multi_session("package deal included")

    def test_normal_listing_not_flagged(self) -> None:
        assert not detect_multi_session("Section 408 Row C $290")
        assert not detect_multi_session("General Admission - Floor")

    def test_flag_multi_session_listings(self) -> None:
        listings = [
            Listing(platform="stubhub", price=287, section="105", row="D"),
            Listing(platform="stubhub", price=320, section="417", row="H"),
        ]
        page_text = "StubHub - All Sessions (3/27 & 3/29) - Capital One Arena"
        result = flag_multi_session_listings(listings, page_text)
        assert all(l.is_multi_session for l in result)

    def test_flag_normal_page_not_flagged(self) -> None:
        listings = [
            Listing(platform="stubhub", price=287, section="105", row="D"),
        ]
        page_text = "StubHub - NCAA East Regional - Section 105 Row D"
        result = flag_multi_session_listings(listings, page_text)
        assert not any(l.is_multi_session for l in result)


class TestSeatGeekApiExtractor:
    def test_extract_event_id_from_url(self) -> None:
        url = "https://seatgeek.com/ncaa-mens-basketball-tournament-tickets/ncaa-basketball/2026-03-27-7-10-pm/17520419?quantity=2"
        assert extract_event_id_from_url(url) == 17520419

    def test_extract_event_id_no_params(self) -> None:
        url = "https://seatgeek.com/some-event/17520419"
        assert extract_event_id_from_url(url) == 17520419

    def test_extract_event_id_invalid(self) -> None:
        assert extract_event_id_from_url("https://seatgeek.com/events") is None

    @patch.dict("os.environ", {"SEATGEEK_CLIENT_ID": "test_id"})
    @patch("backend.scrapers.seatgeek_api.requests.get")
    def test_fetch_listings_success(self, mock_get: MagicMock) -> None:
        mock_response = MagicMock()
        mock_response.json.return_value = {
            "stats": {
                "lowest_price": 150,
                "average_price": 250,
                "highest_price": 500,
                "listing_count": 42,
            },
            "url": "https://seatgeek.com/event/17520419",
            "venue": {"name": "Arena"},
        }
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        listings = fetch_seatgeek_listings(
            "https://seatgeek.com/event/17520419", qty=2
        )
        assert len(listings) == 3
        assert listings[0].price == 150
        assert listings[0].platform == "seatgeek"

    @patch.dict("os.environ", {}, clear=True)
    def test_fetch_listings_no_api_key(self) -> None:
        listings = fetch_seatgeek_listings("https://seatgeek.com/event/17520419")
        assert listings == []


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
