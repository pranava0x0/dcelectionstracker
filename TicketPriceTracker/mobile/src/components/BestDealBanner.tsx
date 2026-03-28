/**
 * Hero banner showing the best deal across all platforms.
 * Big mono price number, sports-betting style.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  BORDER_RADIUS,
  COLORS,
  FONTS,
  getPlatformColor,
  PLATFORM_NAMES,
  SPACING,
} from '../constants/theme';
import type { PlatformSummary } from '../types';

interface BestDealBannerProps {
  bestDeal: PlatformSummary;
  scrapedAt: string;
}

function formatPrice(price: number): string {
  if (price === Math.floor(price)) {
    return `$${price.toLocaleString()}`;
  }
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function timeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

export default function BestDealBanner({ bestDeal, scrapedAt }: BestDealBannerProps) {
  const platformColor = getPlatformColor(bestDeal.platform);
  const displayName = PLATFORM_NAMES[bestDeal.platform] || bestDeal.platform;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>BEST PRICE</Text>

      <Text style={styles.price}>{formatPrice(bestDeal.cheapest_price)}</Text>
      <Text style={styles.perTicket}>per ticket</Text>

      <View style={styles.detailRow}>
        <View style={[styles.platformPill, { backgroundColor: platformColor + '30' }]}>
          <View style={[styles.dot, { backgroundColor: platformColor }]} />
          <Text style={[styles.platformText, { color: platformColor }]}>{displayName}</Text>
        </View>

        <Text style={styles.seatInfo}>
          Sec {bestDeal.section} · Row {bestDeal.row}
        </Text>
      </View>

      <Text style={styles.updated}>Updated {timeAgo(scrapedAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.green + '30',
  },
  label: {
    ...FONTS.badge,
    color: COLORS.green,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  price: {
    ...FONTS.priceHero,
    color: COLORS.green,
  },
  perTicket: {
    ...FONTS.caption,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  platformPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.xl,
    gap: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  platformText: {
    ...FONTS.badge,
    fontSize: 12,
  },
  seatInfo: {
    ...FONTS.body,
  },
  updated: {
    ...FONTS.caption,
    fontSize: 11,
  },
});
