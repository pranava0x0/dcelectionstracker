/**
 * Platform detail screen — shows all listings for a single platform.
 * Includes "Buy" button that opens the platform URL.
 */

import React from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  BORDER_RADIUS,
  COLORS,
  FONTS,
  getPlatformColor,
  PLATFORM_NAMES,
  SPACING,
} from '../constants/theme';
import { usePlatformListings } from '../hooks/useTicketData';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PlatformDetail'>;

function formatPrice(price: number): string {
  if (price === Math.floor(price)) {
    return `$${price.toLocaleString()}`;
  }
  return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PlatformDetailScreen({ route }: Props) {
  const { eventId, platform } = route.params;
  const { listings, loading, error } = usePlatformListings(eventId, platform);

  const platformColor = getPlatformColor(platform);
  const displayName = PLATFORM_NAMES[platform] || platform;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.green} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      {/* Platform header */}
      <View style={styles.header}>
        <View style={[styles.platformDot, { backgroundColor: platformColor }]} />
        <Text style={styles.platformName}>{displayName}</Text>
      </View>

      <Text style={styles.subtitle}>
        {listings.length} listing{listings.length !== 1 ? 's' : ''} available
      </Text>

      {/* Listings table */}
      {listings.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No listings found for this platform</Text>
        </View>
      ) : (
        <>
          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.cellPrice]}>Price/ea</Text>
            <Text style={[styles.headerCell, styles.cellSection]}>Section</Text>
            <Text style={[styles.headerCell, styles.cellRow]}>Row</Text>
            <Text style={[styles.headerCell, styles.cellQty]}>Qty</Text>
          </View>

          {/* Listing rows */}
          {listings.map((listing, index) => (
            <View
              key={listing.id}
              style={[
                styles.listingRow,
                index === 0 && styles.bestRow,
              ]}
            >
              <Text style={[
                styles.cell,
                styles.cellPrice,
                styles.priceText,
                index === 0 && styles.bestPriceText,
              ]}>
                {formatPrice(listing.price)}
              </Text>
              <Text style={[styles.cell, styles.cellSection]}>{listing.section}</Text>
              <Text style={[styles.cell, styles.cellRow]}>{listing.row}</Text>
              <Text style={[styles.cell, styles.cellQty]}>{listing.qty}</Text>
            </View>
          ))}
        </>
      )}

      {/* Buy button */}
      {listings.length > 0 && listings[0].url && (
        <TouchableOpacity
          style={[styles.buyButton, { backgroundColor: platformColor }]}
          onPress={() => {
            if (listings[0].url) {
              Linking.openURL(listings[0].url);
            }
          }}
        >
          <Text style={styles.buyButtonText}>Buy on {displayName}</Text>
        </TouchableOpacity>
      )}

      {/* Fee policy note */}
      {listings.length > 0 && (
        <Text style={styles.feeNote}>
          {listings[0].fee_policy === 'No fees'
            ? 'Prices shown are final — no additional fees'
            : 'Prices include all fees'}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...FONTS.body,
    color: COLORS.red,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xs,
  },
  platformDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  platformName: {
    ...FONTS.h1,
  },
  subtitle: {
    ...FONTS.body,
    marginBottom: SPACING.xl,
  },
  emptyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...FONTS.body,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  headerCell: {
    ...FONTS.badge,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  listingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '40',
  },
  bestRow: {
    backgroundColor: COLORS.bgHighlight,
    borderRadius: BORDER_RADIUS.sm,
    marginHorizontal: -SPACING.xs,
    paddingHorizontal: SPACING.xs,
  },
  cell: {
    ...FONTS.body,
    color: COLORS.textPrimary,
  },
  cellPrice: {
    flex: 3,
  },
  cellSection: {
    flex: 2,
    textAlign: 'center',
  },
  cellRow: {
    flex: 1.5,
    textAlign: 'center',
  },
  cellQty: {
    flex: 1,
    textAlign: 'right',
  },
  priceText: {
    fontFamily: 'Courier',
    fontSize: 18,
    fontWeight: '700',
  },
  bestPriceText: {
    color: COLORS.green,
  },
  buyButton: {
    marginTop: SPACING.xl,
    paddingVertical: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  buyButtonText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  feeNote: {
    ...FONTS.caption,
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
