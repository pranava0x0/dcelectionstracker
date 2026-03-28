/**
 * Price History screen — line chart showing price trends over time.
 *
 * Pure React Native implementation using absolute-positioned views
 * to draw lines between data points. No charting library needed.
 */

import React, { useState } from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
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

const CHART_HEIGHT = 220;
const DOT_SIZE = 8;
const CHART_PADDING_TOP = 20;
const CHART_PADDING_BOTTOM = 30;
const Y_LABEL_WIDTH = 50;

export default function PriceHistoryScreen({ route }: Props) {
  const { eventId, eventName } = route.params;
  const { history, loading, error, refresh, allTimelow } =
    usePriceHistory(eventId);
  const [chartWidth, setChartWidth] = useState(0);

  const onChartLayout = (e: LayoutChangeEvent) => {
    setChartWidth(e.nativeEvent.layout.width);
  };

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
  const rawMin = allPrices.length > 0 ? Math.min(...allPrices) : 0;
  const rawMax = allPrices.length > 0 ? Math.max(...allPrices) : 1;
  // Add 5% padding so lines don't touch edges
  const padding = (rawMax - rawMin) * 0.05 || 10;
  const minPrice = rawMin - padding;
  const maxPrice = rawMax + padding;
  const priceRange = maxPrice - minPrice || 1;

  // All unique timestamps for x-axis
  const allTimes = Array.from(
    new Set(history.flatMap((h) => h.points.map((p) => p.time))),
  ).sort();

  const drawableWidth = chartWidth - Y_LABEL_WIDTH;
  const drawableHeight = CHART_HEIGHT - CHART_PADDING_TOP - CHART_PADDING_BOTTOM;

  // Convert data point to pixel coordinates
  const toX = (timeIdx: number) =>
    Y_LABEL_WIDTH + (allTimes.length <= 1 ? drawableWidth / 2 : (timeIdx / (allTimes.length - 1)) * drawableWidth);
  const toY = (price: number) =>
    CHART_PADDING_TOP + drawableHeight - ((price - minPrice) / priceRange) * drawableHeight;

  // Generate Y-axis tick values
  const yTicks = 4;
  const yLabels: number[] = [];
  for (let i = 0; i <= yTicks; i++) {
    yLabels.push(minPrice + (priceRange * i) / yTicks);
  }

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
        {history.map((h) => {
          const lastPoint = h.points[h.points.length - 1];
          return (
            <View key={h.platform} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: getPlatformColor(h.platform) },
                ]}
              />
              <Text style={styles.legendText}>
                {PLATFORM_NAMES[h.platform] || h.platform}
                {lastPoint ? ` $${lastPoint.price.toFixed(0)}` : ''}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Line Chart */}
      <View
        style={[styles.chartContainer, { height: CHART_HEIGHT }]}
        onLayout={onChartLayout}
      >
        {chartWidth > 0 && allTimes.length > 0 && (
          <>
            {/* Y-axis grid lines and labels */}
            {yLabels.map((price, i) => {
              const y = toY(price);
              return (
                <React.Fragment key={`y-${i}`}>
                  <View
                    style={[
                      styles.gridLine,
                      { top: y, left: Y_LABEL_WIDTH, width: drawableWidth },
                    ]}
                  />
                  <Text
                    style={[
                      styles.yLabel,
                      { top: y - 7, left: 0 },
                    ]}
                  >
                    ${price.toFixed(0)}
                  </Text>
                </React.Fragment>
              );
            })}

            {/* X-axis labels */}
            {allTimes.map((time, idx) => {
              const x = toX(idx);
              // Only show a few labels to avoid overlap
              const showLabel =
                allTimes.length <= 6 ||
                idx === 0 ||
                idx === allTimes.length - 1 ||
                idx % Math.ceil(allTimes.length / 5) === 0;
              if (!showLabel) return null;
              return (
                <Text
                  key={`x-${idx}`}
                  style={[
                    styles.xLabel,
                    { left: x - 30, top: CHART_HEIGHT - CHART_PADDING_BOTTOM + 4 },
                  ]}
                  numberOfLines={1}
                >
                  {formatShortTime(time)}
                </Text>
              );
            })}

            {/* Lines and dots for each platform */}
            {history.map((platformHistory) => {
              const color = getPlatformColor(platformHistory.platform);
              const points = platformHistory.points
                .map((p) => ({
                  x: toX(allTimes.indexOf(p.time)),
                  y: toY(p.price),
                  price: p.price,
                }))
                .filter((p) => !isNaN(p.x) && !isNaN(p.y));

              return (
                <React.Fragment key={platformHistory.platform}>
                  {/* Connecting lines */}
                  {points.map((point, idx) => {
                    if (idx === 0) return null;
                    const prev = points[idx - 1];
                    const dx = point.x - prev.x;
                    const dy = point.y - prev.y;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

                    return (
                      <View
                        key={`line-${platformHistory.platform}-${idx}`}
                        style={[
                          styles.line,
                          {
                            left: prev.x,
                            top: prev.y,
                            width: length,
                            backgroundColor: color,
                            transform: [{ rotate: `${angle}deg` }],
                          },
                        ]}
                      />
                    );
                  })}

                  {/* Data point dots */}
                  {points.map((point, idx) => {
                    const isLow = allTimelow?.price === point.price;
                    return (
                      <View
                        key={`dot-${platformHistory.platform}-${idx}`}
                        style={[
                          styles.dot,
                          {
                            left: point.x - DOT_SIZE / 2,
                            top: point.y - DOT_SIZE / 2,
                            backgroundColor: isLow ? COLORS.green : color,
                            borderColor: isLow ? COLORS.green : color,
                          },
                        ]}
                      />
                    );
                  })}
                </React.Fragment>
              );
            })}
          </>
        )}

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
            Range: ${rawMin.toFixed(0)} — ${rawMax.toFixed(0)}
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

function formatShortTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString.slice(5, 10);
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
  chartContainer: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: COLORS.border,
    opacity: 0.3,
  },
  yLabel: {
    position: 'absolute',
    width: Y_LABEL_WIDTH - 4,
    textAlign: 'right',
    ...FONTS.caption,
    fontSize: 10,
  },
  xLabel: {
    position: 'absolute',
    width: 60,
    textAlign: 'center',
    ...FONTS.caption,
    fontSize: 10,
  },
  line: {
    position: 'absolute',
    height: 2,
    transformOrigin: 'left center',
  },
  dot: {
    position: 'absolute',
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
  },
  emptyChart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  rangeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rangeText: {
    ...FONTS.caption,
  },
});
