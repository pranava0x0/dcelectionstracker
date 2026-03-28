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
