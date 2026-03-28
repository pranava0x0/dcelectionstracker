/**
 * API configuration.
 * Change API_BASE_URL to your server's IP when testing on a physical device.
 */

// For Expo Go on same machine, localhost works.
// For physical device, use your machine's local IP (e.g., 192.168.1.x)
export const API_BASE_URL = 'http://localhost:8000';

export const ENDPOINTS = {
  health: '/api/health',
  events: '/api/events',
  trackedEvents: '/api/events/tracked',
  eventLatest: (eventId: number) => `/api/events/${eventId}/latest`,
  eventHistory: (eventId: number) => `/api/events/${eventId}/history`,
  platformListings: (eventId: number, platform: string) =>
    `/api/events/${eventId}/platforms/${platform}`,
  eventUrls: (eventId: number) => `/api/events/${eventId}/urls`,
  eventArbitrage: (eventId: number) => `/api/events/${eventId}/arbitrage`,
  search: '/api/search',
  trackEvent: '/api/events/track',
} as const;
