"""Modular ticket platform scrapers with anti-bot measures."""

from backend.scrapers.base import BaseScraper
from backend.scrapers.tickpick import TickPickScraper
from backend.scrapers.vividseats import VividSeatsScraper
from backend.scrapers.seatgeek import SeatGeekScraper
from backend.scrapers.ticketmaster import TicketmasterScraper
from backend.scrapers.stubhub import StubHubScraper
from backend.scrapers.gametime import GametimeScraper

ALL_SCRAPERS = [
    TickPickScraper,
    VividSeatsScraper,
    SeatGeekScraper,
    TicketmasterScraper,
    StubHubScraper,
    GametimeScraper,
]

__all__ = [
    "BaseScraper",
    "TickPickScraper",
    "VividSeatsScraper",
    "SeatGeekScraper",
    "TicketmasterScraper",
    "StubHubScraper",
    "GametimeScraper",
    "ALL_SCRAPERS",
]
