/**
 * Pure utility functions for date parsing and display.
 * Extracted from components for testability.
 */

const DAY_OF_WEEK_RE = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i;
const TBD_TIME_RE = /@?\s*TBD\s*$/i;
const MONTH_DAY_RE = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})/i;
const SHORT_MONTHS: Record<string, string> = {
  january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr',
  may: 'May', june: 'Jun', july: 'Jul', august: 'Aug',
  september: 'Sep', october: 'Oct', november: 'Nov', december: 'Dec',
};

/**
 * Clean an event date string for Date parsing.
 * Strips day-of-week prefix and handles "@ TBD" time markers.
 * Returns { cleaned, isTBD }.
 */
export function cleanEventDate(eventDateStr: string): { cleaned: string; isTBD: boolean } {
  let cleaned = eventDateStr.replace(DAY_OF_WEEK_RE, '').trim();
  const isTBD = TBD_TIME_RE.test(cleaned);
  if (isTBD) {
    cleaned = cleaned.replace(TBD_TIME_RE, '').trim();
  }
  // Replace remaining "@" with space for Date parsing
  cleaned = cleaned.replace('@', ' ').trim();
  return { cleaned, isTBD };
}

/**
 * Compute countdown text for an event date.
 *
 * - Future date with known time → "Xd Xh Xm"
 * - Past date → "LIVE NOW"
 * - TBD time → formatted date string (no countdown possible)
 * - Unparseable → original string as-is
 */
export function getCountdown(eventDateStr: string, now?: Date): string {
  const { cleaned, isTBD } = cleanEventDate(eventDateStr);

  const target = new Date(cleaned);
  if (isNaN(target.getTime())) {
    // Completely unparseable — return original string
    return eventDateStr;
  }

  if (isTBD) {
    // We know the date but not the time — show formatted date, not a countdown
    return target.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  const currentTime = now ?? new Date();
  const diff = target.getTime() - currentTime.getTime();

  if (diff <= 0) {
    return 'LIVE NOW';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

/**
 * Format an event date string into a short "Mon DD" display.
 * Handles freeform strings like "Friday, March 27, 2026 @ 7:10 PM".
 */
export function formatShortDate(dateStr: string): string {
  const { cleaned } = cleanEventDate(dateStr);

  // Try standard Date parsing first
  const date = new Date(cleaned);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Fallback: extract "Month Day" via regex from original string
  const match = dateStr.match(MONTH_DAY_RE);
  if (match) {
    const shortMonth = SHORT_MONTHS[match[1].toLowerCase()] ?? match[1].slice(0, 3);
    return `${shortMonth} ${match[2]}`;
  }

  // Last resort: return first 10 chars (better than nothing)
  return dateStr.slice(0, 10);
}

/**
 * Truncate long event names for pill display.
 */
export function shortName(name: string): string {
  if (name.length <= 35) return name;
  return name.slice(0, 32) + '...';
}
