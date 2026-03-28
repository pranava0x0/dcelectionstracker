/**
 * Main dashboard screen — sports-betting-style price overview.
 *
 * Shows:
 * - Event header with countdown
 * - Best deal hero banner
 * - Platform price cards sorted by cheapest
 * - Pull-to-refresh
 */

import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import BestDealBanner from '../components/BestDealBanner';
import EventHeader from '../components/EventHeader';
import PriceCard from '../components/PriceCard';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { useTicketData } from '../hooks/useTicketData';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const { data, loading, error, refresh, lastRefreshed } = useTicketData(1);

  const handlePlatformPress = useCallback(
    (platform: string) => {
      navigation.navigate('PlatformDetail', {
        eventId: data?.event.id ?? 1,
        platform,
      });
    },
    [navigation, data],
  );

  // Loading state
  if (loading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.green} />
        <Text style={styles.loadingText}>Loading prices...</Text>
      </View>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>!</Text>
        <Text style={styles.errorText}>Unable to connect</Text>
        <Text style={styles.errorDetail}>{error}</Text>
        <Text style={styles.retryHint}>Pull down to retry</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const sortedPlatforms = [...data.platforms].sort(
    (a, b) => a.cheapest_price - b.cheapest_price,
  );
  const bestPlatform = data.best_deal?.platform;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refresh}
          tintColor={COLORS.green}
          colors={[COLORS.green]}
        />
      }
    >
      {/* Event Info */}
      <EventHeader event={data.event} />

      {/* Best Deal Banner */}
      {data.best_deal && (
        <BestDealBanner bestDeal={data.best_deal} scrapedAt={data.scraped_at} />
      )}

      {/* Platform Cards */}
      <Text style={styles.sectionTitle}>ALL PLATFORMS</Text>

      {sortedPlatforms.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No listings found</Text>
        </View>
      ) : (
        sortedPlatforms.map((platform, index) => (
          <PriceCard
            key={platform.platform}
            platform={platform}
            isBestDeal={platform.platform === bestPlatform}
            rank={index + 1}
            onPress={() => handlePlatformPress(platform.platform)}
          />
        ))
      )}

      {/* Footer */}
      {lastRefreshed && (
        <Text style={styles.footer}>
          Last refreshed: {lastRefreshed.toLocaleTimeString()}
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
  centerContainer: {
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
  errorIcon: {
    fontSize: 48,
    color: COLORS.red,
    marginBottom: SPACING.md,
  },
  errorText: {
    ...FONTS.h2,
    color: COLORS.red,
    marginBottom: SPACING.sm,
  },
  errorDetail: {
    ...FONTS.body,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryHint: {
    ...FONTS.caption,
  },
  emptyText: {
    ...FONTS.body,
    textAlign: 'center',
  },
  emptyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  sectionTitle: {
    ...FONTS.badge,
    color: COLORS.textMuted,
    letterSpacing: 2,
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  footer: {
    ...FONTS.caption,
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
