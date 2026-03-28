"""Tests for the FastAPI endpoints."""

from datetime import datetime

import pytest
from fastapi.testclient import TestClient

from backend.database import Database
from backend.models import Listing


@pytest.fixture
def test_db(tmp_path) -> Database:
    """Create a populated test database."""
    db = Database(db_path=tmp_path / "test.db")
    db.init_schema()

    event_id = db.upsert_event(
        "NCAA East Regional", "Capital One Arena", "2026-03-27"
    )
    scrape_id = db.create_scrape(event_id, datetime(2026, 3, 27, 20, 0, 0))

    listings = [
        Listing(platform="tickpick", price=290, section="408", row="C", qty="2", fee_policy="No fees"),
        Listing(platform="tickpick", price=320, section="417", row="H", qty="2", fee_policy="No fees"),
        Listing(platform="vividseats", price=308, section="423", row="Q", qty="2", fee_policy="Included"),
        Listing(platform="stubhub", price=544, section="105", row="D", qty="2", fee_policy="Included"),
    ]
    db.insert_listings(scrape_id, listings)
    return db


@pytest.fixture
def client(test_db, monkeypatch) -> TestClient:
    """Create a test client using the test database."""
    # Monkeypatch the db in the api module
    import backend.api as api_module
    monkeypatch.setattr(api_module, "db", test_db)

    return TestClient(api_module.app)


class TestHealthEndpoint:
    def test_health_returns_ok(self, client: TestClient) -> None:
        r = client.get("/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert data["events"] >= 1


class TestEventsEndpoint:
    def test_list_events(self, client: TestClient) -> None:
        r = client.get("/api/events")
        assert r.status_code == 200
        events = r.json()
        assert len(events) >= 1
        assert events[0]["name"] == "NCAA East Regional"


class TestLatestEndpoint:
    def test_latest_returns_data(self, client: TestClient) -> None:
        r = client.get("/api/events/1/latest")
        assert r.status_code == 200
        data = r.json()
        assert data["event"]["id"] == 1
        assert len(data["platforms"]) >= 1
        assert data["best_deal"] is not None
        assert data["best_deal"]["cheapest_price"] == 290

    def test_latest_platforms_sorted(self, client: TestClient) -> None:
        r = client.get("/api/events/1/latest")
        platforms = r.json()["platforms"]
        prices = [p["cheapest_price"] for p in platforms]
        assert prices == sorted(prices)

    def test_latest_not_found(self, client: TestClient) -> None:
        r = client.get("/api/events/999/latest")
        assert r.status_code == 404


class TestHistoryEndpoint:
    def test_history_returns_data(self, client: TestClient) -> None:
        r = client.get("/api/events/1/history")
        assert r.status_code == 200
        data = r.json()
        assert len(data["history"]) >= 1

    def test_history_not_found(self, client: TestClient) -> None:
        r = client.get("/api/events/999/history")
        assert r.status_code == 404


class TestArbitrageEndpoint:
    def test_arbitrage_returns_data(self, client: TestClient) -> None:
        r = client.get("/api/events/1/arbitrage")
        assert r.status_code == 200
        data = r.json()
        assert "alerts" in data
        assert "total_opportunities" in data
        assert isinstance(data["alerts"], list)

    def test_arbitrage_not_found(self, client: TestClient) -> None:
        r = client.get("/api/events/999/arbitrage")
        assert r.status_code == 404


class TestPlatformEndpoint:
    def test_platform_listings(self, client: TestClient) -> None:
        r = client.get("/api/events/1/platforms/tickpick")
        assert r.status_code == 200
        listings = r.json()
        assert len(listings) == 2
        # Should be sorted by price
        assert listings[0]["price"] <= listings[1]["price"]

    def test_platform_no_listings(self, client: TestClient) -> None:
        r = client.get("/api/events/1/platforms/seatgeek")
        assert r.status_code == 200
        assert r.json() == []


class TestEventUrlEndpoints:
    def test_get_urls_empty(self, client: TestClient) -> None:
        r = client.get("/api/events/1/urls")
        assert r.status_code == 200
        assert r.json() == {}

    def test_add_and_get_url(self, client: TestClient) -> None:
        r = client.put("/api/events/1/urls", json={
            "platform": "seatgeek",
            "url": "https://seatgeek.com/event/123",
        })
        assert r.status_code == 200

        r = client.get("/api/events/1/urls")
        urls = r.json()
        assert urls["seatgeek"] == "https://seatgeek.com/event/123"

    def test_delete_url(self, client: TestClient) -> None:
        client.put("/api/events/1/urls", json={
            "platform": "stubhub",
            "url": "https://stubhub.com/event/456",
        })

        r = client.delete("/api/events/1/urls/stubhub")
        assert r.status_code == 200

        r = client.get("/api/events/1/urls")
        assert "stubhub" not in r.json()

    def test_delete_url_not_found(self, client: TestClient) -> None:
        r = client.delete("/api/events/1/urls/nonexistent")
        assert r.status_code == 404

    def test_url_not_found_event(self, client: TestClient) -> None:
        r = client.get("/api/events/999/urls")
        assert r.status_code == 404


class TestTrackEventEndpoint:
    def test_track_new_event(self, client: TestClient) -> None:
        r = client.post("/api/events/track", json={
            "name": "Duke vs UNC",
            "venue": "Cameron Indoor Stadium",
            "event_date": "2026-03-30",
            "urls": {"seatgeek": "https://seatgeek.com/duke-unc/123"},
        })
        assert r.status_code == 200
        data = r.json()
        assert data["event"]["name"] == "Duke vs UNC"
        assert "seatgeek" in data["urls"]

    def test_track_event_no_urls(self, client: TestClient) -> None:
        r = client.post("/api/events/track", json={
            "name": "Some Game",
            "venue": "Some Arena",
            "event_date": "2026-04-01",
        })
        assert r.status_code == 200
        data = r.json()
        assert data["urls"] == {}

    def test_track_event_idempotent(self, client: TestClient) -> None:
        payload = {
            "name": "Repeat Event",
            "venue": "Repeat Venue",
            "event_date": "2026-04-02",
            "urls": {"tickpick": "https://tp.com/1"},
        }
        r1 = client.post("/api/events/track", json=payload)
        r2 = client.post("/api/events/track", json=payload)
        assert r1.json()["event"]["id"] == r2.json()["event"]["id"]


class TestTrackedEventsEndpoint:
    def test_tracked_events_empty(self, client: TestClient) -> None:
        r = client.get("/api/events/tracked")
        assert r.status_code == 200
        assert r.json() == []

    def test_tracked_events_after_adding_urls(self, client: TestClient) -> None:
        client.put("/api/events/1/urls", json={
            "platform": "seatgeek",
            "url": "https://sg.com/1",
        })

        r = client.get("/api/events/tracked")
        assert r.status_code == 200
        tracked = r.json()
        assert len(tracked) >= 1
        assert tracked[0]["url_count"] >= 1
