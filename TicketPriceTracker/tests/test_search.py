"""Tests for the SeatGeek search module."""

from unittest.mock import MagicMock, patch

import pytest

from backend.search import search_events


MOCK_SEATGEEK_RESPONSE = {
    "events": [
        {
            "id": 17520419,
            "title": "Duke vs UNC",
            "datetime_local": "2026-03-30T19:00:00",
            "url": "https://seatgeek.com/duke-vs-unc-tickets/17520419",
            "venue": {
                "name": "Cameron Indoor Stadium",
                "city": "Durham",
            },
        },
        {
            "id": 17520420,
            "title": "Duke vs NC State",
            "datetime_local": "2026-04-02T20:00:00",
            "url": "https://seatgeek.com/duke-vs-nc-state-tickets/17520420",
            "venue": {
                "name": "PNC Arena",
                "city": "Raleigh",
            },
        },
    ],
}


class TestSearchEvents:
    @patch.dict("os.environ", {"SEATGEEK_CLIENT_ID": "test_id"})
    @patch("backend.search.requests.get")
    def test_search_returns_results(self, mock_get: MagicMock) -> None:
        mock_response = MagicMock()
        mock_response.json.return_value = MOCK_SEATGEEK_RESPONSE
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        results = search_events("duke")
        assert len(results) == 2
        assert results[0].name == "Duke vs UNC"
        assert results[0].seatgeek_id == 17520419
        assert results[0].venue == "Cameron Indoor Stadium"
        assert results[0].city == "Durham"

    @patch.dict("os.environ", {"SEATGEEK_CLIENT_ID": "test_id"})
    @patch("backend.search.requests.get")
    def test_search_with_date_filters(self, mock_get: MagicMock) -> None:
        mock_response = MagicMock()
        mock_response.json.return_value = {"events": []}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        search_events("duke", date_from="2026-03-29", date_to="2026-04-01")

        call_kwargs = mock_get.call_args
        params = call_kwargs.kwargs.get("params") or call_kwargs[1].get("params")
        assert "datetime_local.gte" in params
        assert "datetime_local.lte" in params

    @patch.dict("os.environ", {"SEATGEEK_CLIENT_ID": "test_id"})
    @patch("backend.search.requests.get")
    def test_search_empty_results(self, mock_get: MagicMock) -> None:
        mock_response = MagicMock()
        mock_response.json.return_value = {"events": []}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response

        results = search_events("nonexistent event xyz")
        assert results == []

    @patch.dict("os.environ", {}, clear=True)
    def test_search_missing_api_key(self) -> None:
        with pytest.raises(RuntimeError, match="SEATGEEK_CLIENT_ID"):
            search_events("duke")
