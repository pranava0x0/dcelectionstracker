/**
 * Data fetching hook for ticket price API.
 */

import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL, ENDPOINTS } from '../constants/api';
import type { EventLatestResponse, Listing } from '../types';

interface UseTicketDataResult {
  data: EventLatestResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastRefreshed: Date | null;
}

export function useTicketData(eventId: number): UseTicketDataResult {
  const [data, setData] = useState<EventLatestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!eventId || eventId <= 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}${ENDPOINTS.eventLatest(eventId)}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const json: EventLatestResponse = await response.json();
      setData(json);
      setLastRefreshed(new Date());
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    // Don't clear data — keep stale data visible while new data loads
    // to avoid a flash of loading/empty state when switching events
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData, lastRefreshed };
}

interface UsePlatformListingsResult {
  listings: Listing[];
  loading: boolean;
  error: string | null;
}

export function usePlatformListings(
  eventId: number,
  platform: string,
): UsePlatformListingsResult {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}${ENDPOINTS.platformListings(eventId, platform)}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const json: Listing[] = await response.json();
        setListings(json);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch listings';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [eventId, platform]);

  return { listings, loading, error };
}
