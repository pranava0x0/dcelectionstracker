/**
 * TypeScript types matching backend Pydantic models.
 */

export interface Event {
  id: number;
  name: string;
  venue: string;
  event_date: string;
  created_at: string | null;
}

export interface PlatformSummary {
  platform: string;
  cheapest_price: number;
  section: string;
  row: string;
  qty: string;
  fee_policy: string;
  listing_count: number;
  url: string | null;
  is_multi_session: boolean;
}

export interface EventLatestResponse {
  event: Event;
  scraped_at: string;
  platforms: PlatformSummary[];
  best_deal: PlatformSummary | null;
}

export interface Listing {
  id: number;
  scrape_id: number;
  platform: string;
  price: number;
  section: string;
  row: string;
  qty: string;
  fee_policy: string;
  is_anomaly: boolean;
  is_multi_session: boolean;
  url: string | null;
}

export interface PricePoint {
  scraped_at: string;
  platform: string;
  cheapest_price: number;
}

export interface EventHistoryResponse {
  event: Event;
  history: PricePoint[];
}

export interface ArbitrageAlert {
  section: string;
  row: string;
  cheap_platform: string;
  cheap_price: number;
  expensive_platform: string;
  expensive_price: number;
  savings: number;
  savings_pct: number;
  cheap_url: string | null;
}

export interface ArbitrageResponse {
  event: Event;
  scraped_at: string;
  alerts: ArbitrageAlert[];
  total_opportunities: number;
}

export interface SearchResult {
  name: string;
  venue: string;
  city: string;
  event_date: string;
  seatgeek_url: string;
  seatgeek_id: number;
}

export interface TrackedEvent {
  id: number;
  name: string;
  venue: string;
  event_date: string;
  created_at: string | null;
  url_count: number;
}

export interface TrackEventRequest {
  name: string;
  venue: string;
  event_date: string;
  urls: Record<string, string>;
}
