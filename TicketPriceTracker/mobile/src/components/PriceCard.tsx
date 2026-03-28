/**
 * Platform price card — sports-betting-style horizontal card.
 * Shows platform badge, price, section/row, and trend indicator.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  BORDER_RADIUS,
  COLORS,
  FONTS,
  getPlatformColor,
  PLATFORM_NAMES,
  SPACING,
} from '../constants/theme';
import type { PlatformSummary } from '../types';

interface PriceCardProps {
  platform: PlatformSummary;
  isBestDeal: boolean;
  rank: number;
  onPress: () => void;
}

function formatPrice(price: number): string {
  if (price === Math.floor(price)) {
    return `$${price.toLocaleString()}`;
  }
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PriceCard({ platform, isBestDeal, rank, onPress }: PriceCardProps) {
  const platformColor = getPlatformColor(platform.platform);
  const displayName = PLATFORM_NAMES[platform.platform] || platform.platform;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isBestDeal && styles.bestDealContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Left accent bar */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: isBestDeal ? COLORS.green : platformColor },
        ]}
      />

      <View style={styles.content}>
        {/* Top row: platform badge + price */}
        <View style={styles.topRow}>
          <View style={styles.platformInfo}>
            <View style={[styles.platformDot, { backgroundColor: platformColor }]} />
            <Text style={styles.platformName}>{displayName}</Text>
            {isBestDeal && (
              <View style={styles.bestBadge}>
                <Text style={styles.bestBadgeText}>BEST</Text>
              </View>
            )}
          </View>

          <Text style={[
            styles.price,
            isBestDeal && styles.bestPrice,
          ]}>
            {formatPrice(platform.cheapest_price)}
          </Text>
        </View>

        {/* Bottom row: section/row details + listing count */}
        <View style={styles.bottomRow}>
          <Text style={styles.seatInfo}>
            Sec {platform.section} · Row {platform.row}
          </Text>
          <Text style={styles.listingCount}>
            {platform.listing_count} listing{platform.listing_count !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Fee policy */}
        <Text style={styles.feePolicy}>
          {platform.fee_policy === 'No fees' ? 'No fees' : 'Fees included'}
        </Text>
      </View>

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  bestDealContainer: {
    borderColor: COLORS.green + '40',
    backgroundColor: COLORS.bgHighlight,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    padding: SPACING.md,
    paddingLeft: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  platformDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  platformName: {
    ...FONTS.h2,
    fontSize: 15,
  },
  bestBadge: {
    backgroundColor: COLORS.green + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  bestBadgeText: {
    ...FONTS.badge,
    color: COLORS.green,
    fontSize: 10,
  },
  price: {
    ...FONTS.priceMedium,
  },
  bestPrice: {
    color: COLORS.green,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  seatInfo: {
    ...FONTS.body,
    fontSize: 13,
  },
  listingCount: {
    ...FONTS.caption,
  },
  feePolicy: {
    ...FONTS.caption,
    fontSize: 11,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textMuted,
    paddingRight: SPACING.md,
  },
});
