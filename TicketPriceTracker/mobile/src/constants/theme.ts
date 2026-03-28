/**
 * Sports-betting-inspired dark theme constants.
 */

export const COLORS = {
  // Backgrounds
  bg: '#0D1117',
  bgCard: '#161B22',
  bgCardHover: '#1C2128',
  bgHighlight: '#1A2332',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#8B949E',
  textMuted: '#484F58',

  // Accents
  green: '#00FF87',
  greenDim: '#00CC6A',
  red: '#FF4757',
  redDim: '#CC3945',
  yellow: '#FFD93D',
  blue: '#58A6FF',

  // Platform brand colors
  platforms: {
    vividseats: '#8B5CF6',    // Purple
    stubhub: '#3B82F6',       // Blue
    ticketmaster: '#1E3A5F',  // Navy
    seatgeek: '#10B981',      // Emerald
    gametime: '#F97316',      // Orange
    tickpick: '#06B6D4',      // Cyan
  } as Record<string, string>,

  // Borders
  border: '#30363D',
  borderGreen: '#00FF87',
  borderRed: '#FF4757',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FONTS = {
  // Price displays - large mono numbers
  priceHero: {
    fontFamily: 'Courier',
    fontSize: 48,
    fontWeight: '800' as const,
    color: COLORS.textPrimary,
  },
  priceLarge: {
    fontFamily: 'Courier',
    fontSize: 28,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
  },
  priceMedium: {
    fontFamily: 'Courier',
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
  },
  // Regular text
  h1: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: COLORS.textMuted,
  },
  badge: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
} as const;

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
} as const;

// Platform display names
export const PLATFORM_NAMES: Record<string, string> = {
  vividseats: 'Vivid Seats',
  stubhub: 'StubHub',
  ticketmaster: 'Ticketmaster',
  seatgeek: 'SeatGeek',
  gametime: 'Gametime',
  tickpick: 'TickPick',
};

export const getPlatformColor = (platform: string): string => {
  return COLORS.platforms[platform] || COLORS.blue;
};
