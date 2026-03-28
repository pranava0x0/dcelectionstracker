/**
 * Price History screen — shows price trends over time per platform.
 *
 * Pure React Native implementation (no charting library needed).
 * Renders a horizontal bar chart per scrape time, color-coded by platform.
 */

import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  COLORS,
  FONTS,
  PLATFORM_NAMES,
  SPACING,
  getPlatformColor,
} from '../constants/theme';
import { usePriceHistory } from '../hooks/usePriceHistory';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PriceHistory'>;

export default function PriceHistoryScreen({ route }: Props) {
  const { eventId, eventName } = route.params;
  const { history, loading, error, refresh, allTimelow } =
    usePriceHistory(eventId);

  if (loading && history.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.green} />
        <Text style={styles.loadingText}>Loading price history...</Text>
      </View>
    );
  }

  if (error && history.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No price history yet</Text>
        <Text style={styles.body}>
          Run the scraper a few times to build up history data
        </Text>
      </View>
    );
  }

  // Compute chart bounds
  const allPrices = history.flatMap((h) => h.points.map((p) => p.price));
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 1;
  const priceRange = maxPrice - minPrice || 1;

  // Get all unique timestamps for the x-axis
  const allTimes = Array.from(
    new Set(history.flatMap((h) => h.points.map((p) => p.time))),
  ).sort();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refresh}
          tintColor={COLORS.green}
        />
      }
    >
      <Text style={styles.title}>{eventName}</Text>
      <Text style={styles.subtitle}>PRICE HISTORY</Text>

      {/* All-time low banner */}
      {allTimelow && (
        <View style={styles.allTimeLow}>
          <Text style={styles.allTimeLowLabel}>ALL-TIME LOW</Text>
          <Text style={styles.allTimeLowPrice}>
            ${allTimelow.price.toFixed(0)}
          </Text>
          <Text style={styles.allTimeLowDetail}>
            {PLATFORM_NAMES[allTimelow.platform] || allTimelow.platform} —{' '}
            {formatTime(allTimelow.date)}
          </Text>
        </View>
      )}

      {/* Platform legend */}
      <View style={styles.legend}>
        {history.map((h) => (
          <View key={h.platform} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: getPlatformColor(h.platform) },
              ]}
            />
            <Text style={styles.legendText}>
              {PLATFORM_NAMES[h.platform] || h.platform}
            </Text>
          </View>
        ))}
      </View>

      {/* Chart: vertical bars per time, grouped by platform */}
      <View style={styles.chart}>
        {allTimes.map((time, timeIdx) => (
          <View key={time} style={styles.chartRow}>
            <Text style={styles.timeLabel}>{formatTime(time)}</Text>
            <View style={styles.barsContainer}>
              {history.map((platformHistory) => {
                const point = platformHistory.points.find(
                  (p) => p.time === time,
                );
                if (!point) return null;

                const widthPct =
                  ((point.price - minPrice) / priceRange) * 80 + 20; // min 20%
                const color = getPlatformColor(platformHistory.platform);
                const isLowest = allTimelow?.price === point.price;

                return (
                  <View key={platformHistory.platform} style={styles.barRow}>
                    <View
                      style={[
                        styles.bar,
                        {
                          width: `${widthPct}%`,
                          backgroundColor: color,
                          borderColor: isLowest ? COLORS.green : 'transparent',
                          borderWidth: isLowest ? 1 : 0,
                        },
                      ]}
                    >
                      <Text style={styles.barPrice}>
                        ${point.price.toFixed(0)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        {allTimes.length === 0 && (
          <View style={styles.emptyChart}>
            <Text style={styles.body}>
              No history data yet. Prices will appear here after multiple scrape
              runs.
            </Text>
          </View>
        )}
      </View>

      {/* Price range footer */}
      {allPrices.length > 0 && (
        <View style={styles.rangeFooter}>
          <Text style={styles.rangeText}>
            Range: ${minPrice.toFixed(0)} — ${maxPrice.toFixed(0)}
          </Text>
          <Text style={styles.rangeText}>
            {allTimes.length} scrape{allTimes.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoString.slice(0, 16);
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    ...FONTS.body,
    marginTop: SPACING.md,
  },
  errorText: {
    ...FONTS.h2,
    color: COLORS.red,
    marginBottom: SPACING.sm,
  },
  body: {
    ...FONTS.body,
    textAlign: 'center',
  },
  title: {
    ...FONTS.h1,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...FONTS.badge,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: SPACING.lg,
  },
  allTimeLow: {
    backgroundColor: COLORS.bgHighlight,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.green,
    borderRadius: 8,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  allTimeLowLabel: {
    ...FONTS.badge,
    color: COLORS.green,
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  allTimeLowPrice: {
    ...FONTS.priceLarge,
    color: COLORS.green,
  },
  allTimeLowDetail: {
    ...FONTS.caption,
    marginTop: SPACING.xs,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.xs,
  },
  legendText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  chart: {
    marginBottom: SPACING.lg,
  },
  chartRow: {
    marginBottom: SPACING.lg,
  },
  timeLabel: {
    ...FONTS.caption,
    marginBottom: SPACING.xs,
  },
  barsContainer: {
    gap: SPACING.xs,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
    minWidth: 60,
  },
  barPrice: {
    ...FONTS.badge,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  emptyChart: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  rangeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    ...FONTS.caption,
  },
});
