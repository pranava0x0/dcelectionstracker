/**
 * Hook for fetching tracked events from the backend.
 */

import { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL, ENDPOINTS } from '../constants/api';
import type { TrackedEvent } from '../types';

interface UseTrackedEventsResult {
  events: TrackedEvent[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useTrackedEvents(): UseTrackedEventsResult {
  const [events, setEvents] = useState<TrackedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_BASE_URL}${ENDPOINTS.trackedEvents}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const json: TrackedEvent[] = await response.json();
      setEvents(json);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refresh: fetchEvents };
}
