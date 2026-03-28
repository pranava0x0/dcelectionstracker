import { cleanEventDate, getCountdown, formatShortDate, shortName } from '../dateUtils';

describe('cleanEventDate', () => {
  it('strips day-of-week prefix', () => {
    const result = cleanEventDate('Friday, March 27, 2026 @ 7:10 PM');
    expect(result.cleaned).toContain('March 27, 2026');
    expect(result.cleaned).toContain('7:10 PM');
    expect(result.isTBD).toBe(false);
  });

  it('detects TBD time and strips it', () => {
    const result = cleanEventDate('Sunday, March 29, 2026 @ TBD');
    expect(result.cleaned).toBe('March 29, 2026');
    expect(result.isTBD).toBe(true);
  });

  it('handles string without day-of-week prefix', () => {
    const result = cleanEventDate('March 29, 2026 @ 7:00 PM');
    expect(result.cleaned).toContain('March 29, 2026');
    expect(result.cleaned).toContain('7:00 PM');
    expect(result.isTBD).toBe(false);
  });

  it('handles ISO date strings', () => {
    const result = cleanEventDate('2026-03-29T19:00:00');
    expect(result.cleaned).toBe('2026-03-29T19:00:00');
    expect(result.isTBD).toBe(false);
  });
});

describe('getCountdown', () => {
  it('returns countdown for parseable future date', () => {
    // Set "now" to a known time well before the event
    const now = new Date('2026-03-27T12:00:00');
    const result = getCountdown('Friday, March 28, 2026 @ 7:10 PM', now);
    // Should contain "d" or "h" for days/hours
    expect(result).toMatch(/\d+[dh]/);
  });

  it('returns "LIVE NOW" for parseable past date', () => {
    const now = new Date('2026-03-28T22:00:00');
    const result = getCountdown('Friday, March 28, 2026 @ 7:10 PM', now);
    expect(result).toBe('LIVE NOW');
  });

  it('returns formatted date (not "LIVE NOW") for TBD time', () => {
    // Even if the date is "today", TBD time should NOT show LIVE NOW
    const now = new Date('2026-03-29T15:00:00');
    const result = getCountdown('Sunday, March 29, 2026 @ TBD', now);
    expect(result).not.toBe('LIVE NOW');
    // Should contain the month/day in some readable format
    expect(result).toMatch(/Mar/i);
    expect(result).toMatch(/29/);
  });

  it('returns original string for completely unparseable date', () => {
    const result = getCountdown('TBA - check back later');
    expect(result).toBe('TBA - check back later');
  });

  it('returns countdown string with days, hours, minutes', () => {
    const now = new Date('2026-03-26T12:00:00');
    const result = getCountdown('Friday, March 28, 2026 @ 7:10 PM', now);
    expect(result).toMatch(/2d \d+h \d+m/);
  });

  it('returns hours and minutes only when less than a day', () => {
    const now = new Date('2026-03-28T14:00:00');
    const result = getCountdown('Friday, March 28, 2026 @ 7:10 PM', now);
    expect(result).toMatch(/^\d+h \d+m$/);
  });
});

describe('formatShortDate', () => {
  it('formats ISO date string', () => {
    // Note: "2026-03-27" is interpreted as UTC midnight, which may be Mar 26 in local tz
    const result = formatShortDate('2026-03-27T12:00:00');
    expect(result).toMatch(/Mar\s+27/);
  });

  it('formats "Friday, March 27, 2026 @ 7:10 PM"', () => {
    const result = formatShortDate('Friday, March 27, 2026 @ 7:10 PM');
    expect(result).toMatch(/Mar\s+27/);
  });

  it('formats "Sunday, March 29, 2026 @ TBD" — does NOT produce "Sunday, Ma"', () => {
    const result = formatShortDate('Sunday, March 29, 2026 @ TBD');
    expect(result).toMatch(/Mar\s+29/);
    expect(result).not.toBe('Sunday, Ma');
  });

  it('extracts month/day from freeform string via regex fallback', () => {
    const result = formatShortDate('Game on January 15 sometime');
    expect(result).toMatch(/Jan\s+15/);
  });

  it('returns truncated string for completely unparseable input', () => {
    const result = formatShortDate('no date here');
    // Should return something, not crash
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThanOrEqual(10);
  });
});

describe('shortName', () => {
  it('returns short names unchanged', () => {
    expect(shortName('Duke vs UNC')).toBe('Duke vs UNC');
  });

  it('returns names at threshold unchanged', () => {
    const name = 'A'.repeat(35);
    expect(shortName(name)).toBe(name);
  });

  it('truncates names over 35 chars', () => {
    const name = 'Ticket Prices: Duke vs St. John\'s Men\'s Basketball';
    const result = shortName(name);
    expect(result.endsWith('...')).toBe(true);
    expect(result.length).toBe(35);
  });

  it('preserves meaningful prefix when truncating', () => {
    const name = 'NCAA East Regional - Session 2 (Elite Eight)';
    const result = shortName(name);
    expect(result).toContain('NCAA East Regional');
    expect(result.endsWith('...')).toBe(true);
  });
});
