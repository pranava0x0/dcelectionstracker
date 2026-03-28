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
  eventLatest: (eventId: number) => `/api/events/${eventId}/latest`,
  eventHistory: (eventId: number) => `/api/events/${eventId}/history`,
  platformListings: (eventId: number, platform: string) =>
    `/api/events/${eventId}/platforms/${platform}`,
} as const;
