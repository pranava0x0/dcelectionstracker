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
