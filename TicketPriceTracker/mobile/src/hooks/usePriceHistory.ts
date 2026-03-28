/**
 * Hook for fetching price history data.
 */

import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL, ENDPOINTS } from '../constants/api';
import type { EventHistoryResponse, PricePoint } from '../types';

interface PlatformHistory {
  platform: string;
  points: { time: string; price: number }[];
}

interface UsePriceHistoryResult {
  history: PlatformHistory[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  allTimelow: { platform: string; price: number; date: string } | null;
}

export function usePriceHistory(eventId: number): UsePriceHistoryResult {
  const [history, setHistory] = useState<PlatformHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTimeLow, setAllTimeLow] = useState<{
    platform: string;
    price: number;
    date: string;
  } | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!eventId || eventId <= 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}${ENDPOINTS.eventHistory(eventId)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const json: EventHistoryResponse = await response.json();

      // Group history points by platform
      const grouped: Record<string, { time: string; price: number }[]> = {};
      let lowest: { platform: string; price: number; date: string } | null =
        null;

      for (const point of json.history) {
        const platform = point.platform;
        if (!grouped[platform]) {
          grouped[platform] = [];
        }
        grouped[platform].push({
          time: point.scraped_at,
          price: point.cheapest_price,
        });

        if (!lowest || point.cheapest_price < lowest.price) {
          lowest = {
            platform: point.platform,
            price: point.cheapest_price,
            date: point.scraped_at,
          };
        }
      }

      // Sort each platform's points chronologically
      const result: PlatformHistory[] = Object.entries(grouped).map(
        ([platform, points]) => ({
          platform,
          points: points.sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
          ),
        }),
      );

      setHistory(result);
      setAllTimeLow(lowest);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch history';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refresh: fetchHistory, allTimelow: allTimeLow };
}
