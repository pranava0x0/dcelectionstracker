/**
 * Hook for searching events via the backend search API.
 */

import { useCallback, useState } from 'react';
import { API_BASE_URL, ENDPOINTS } from '../constants/api';
import type { SearchResult } from '../types';

interface UseEventSearchResult {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  search: (query: string, dateFrom?: string, dateTo?: string) => Promise<void>;
  clear: () => void;
}

export function useEventSearch(): UseEventSearchResult {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, dateFrom?: string, dateTo?: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ q: query });
      if (dateFrom) params.set('date_from', dateFrom);
      if (dateTo) params.set('date_to', dateTo);

      const url = `${API_BASE_URL}${ENDPOINTS.search}?${params.toString()}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(response.status === 503 ? 'Search API key not configured' : `Search failed: ${response.status}`);
      }

      const json: SearchResult[] = await response.json();
      setResults(json);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Search failed';
      setError(message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clear };
}
