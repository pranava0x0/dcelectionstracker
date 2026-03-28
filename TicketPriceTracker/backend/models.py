"""Pydantic models for TicketPriceTracker data layer."""

from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field, validator


class Listing(BaseModel):
    """A single ticket listing from a platform."""
    id: Optional[int] = None
    scrape_id: Optional[int] = None
    platform: str
    price: float
    section: str
    row: str
    qty: str = "N/A"
    fee_policy: str = "Included"
    is_anomaly: bool = False
    is_multi_session: bool = False
    url: Optional[str] = None

    @validator("price")
    def price_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Price must be positive")
        return v


class Scrape(BaseModel):
    """A single scrape run across all platforms."""
    id: Optional[int] = None
    event_id: int
    scraped_at: datetime
    listings: List[Listing] = Field(default_factory=list)


class Event(BaseModel):
    """A tracked event."""
    id: Optional[int] = None
    name: str
    venue: str
    event_date: str
    created_at: Optional[datetime] = None


class PlatformSummary(BaseModel):
    """Cheapest listing per platform for API responses."""
    platform: str
    cheapest_price: float
    section: str
    row: str
    qty: str
    fee_policy: str
    listing_count: int
    url: Optional[str] = None
    is_multi_session: bool = False


class EventLatestResponse(BaseModel):
    """API response for latest scrape data."""
    event: Event
    scraped_at: datetime
    platforms: List[PlatformSummary]
    best_deal: Optional[PlatformSummary] = None


class PricePoint(BaseModel):
    """A single price point in history."""
    scraped_at: datetime
    platform: str
    cheapest_price: float


class EventHistoryResponse(BaseModel):
    """API response for price history."""
    event: Event
    history: List[PricePoint]


class EventUrl(BaseModel):
    """A platform-specific URL for an event."""
    event_id: int
    platform: str
    url: str


class EventWithUrls(BaseModel):
    """An event with its per-platform URLs."""
    id: Optional[int] = None
    name: str
    venue: str
    event_date: str
    created_at: Optional[datetime] = None
    url_count: int = 0
    urls: Dict[str, str] = Field(default_factory=dict)


class ArbitrageAlert(BaseModel):
    """A cross-platform price arbitrage opportunity."""
    section: str
    row: str
    cheap_platform: str
    cheap_price: float
    expensive_platform: str
    expensive_price: float
    savings: float
    savings_pct: float
    cheap_url: Optional[str] = None


class ArbitrageResponse(BaseModel):
    """API response for arbitrage detection."""
    event: Event
    scraped_at: datetime
    alerts: List["ArbitrageAlert"]
    total_opportunities: int


class SearchResult(BaseModel):
    """A search result from SeatGeek."""
    name: str
    venue: str
    city: str
    event_date: str
    seatgeek_url: str
    seatgeek_id: int


class TrackEventRequest(BaseModel):
    """Request to start tracking a new event."""
    name: str
    venue: str
    event_date: str
    urls: Dict[str, str] = Field(default_factory=dict)


class AddUrlRequest(BaseModel):
    """Request to add/update a platform URL for an event."""
    platform: str
    url: str
