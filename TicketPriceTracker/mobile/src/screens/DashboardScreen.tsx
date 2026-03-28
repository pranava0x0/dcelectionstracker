/**
 * Main dashboard screen — sports-betting-style price overview.
 *
 * Shows:
 * - Event picker (horizontal pills)
 * - Event header with countdown
 * - Best deal hero banner
 * - Platform price cards sorted by cheapest
 * - Pull-to-refresh
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import BestDealBanner from '../components/BestDealBanner';
import EventHeader from '../components/EventHeader';
import EventPicker from '../components/EventPicker';
import PriceCard from '../components/PriceCard';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { useTicketData } from '../hooks/useTicketData';
import { useTrackedEvents } from '../hooks/useTrackedEvents';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const { events, refresh: refreshEvents } = useTrackedEvents();
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Auto-select the first event when events load
  useEffect(() => {
    if (events.length > 0 && selectedEventId === null) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  // Re-fetch events when screen focuses (e.g. returning from AddEvent)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshEvents();
    });
    return unsubscribe;
  }, [navigation, refreshEvents]);

  const { data, loading, error, refresh, lastRefreshed } = useTicketData(
    selectedEventId ?? 0,
  );

  const handlePlatformPress = useCallback(
    (platform: string) => {
      navigation.navigate('PlatformDetail', {
        eventId: selectedEventId ?? 1,
        platform,
      });
    },
    [navigation, selectedEventId],
  );

  const handleAddEvent = useCallback(() => {
    navigation.navigate('AddEvent');
  }, [navigation]);

  const handlePriceHistory = useCallback(() => {
    if (data?.event) {
      navigation.navigate('PriceHistory', {
        eventId: data.event.id,
        eventName: data.event.name,
      });
    }
  }, [navigation, data]);

  const handleRefresh = useCallback(async () => {
    await refreshEvents();
    await refresh();
  }, [refreshEvents, refresh]);

  // No events at all — show add prompt
  if (events.length === 0 && !loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No Events Tracked</Text>
        <Text style={styles.emptyText}>
          Search for games to start tracking prices
        </Text>
        <EventPicker
          events={[]}
          selectedId={null}
          onSelect={() => {}}
          onAddPress={handleAddEvent}
        />
      </View>
    );
  }

  // Loading state (no data yet)
  if (loading && !data && selectedEventId !== null) {
    return (
      <View style={styles.centerContainer}>
        <EventPicker
          events={events}
          selectedId={selectedEventId}
          onSelect={setSelectedEventId}
          onAddPress={handleAddEvent}
        />
        <ActivityIndicator size="large" color={COLORS.green} />
        <Text style={styles.loadingText}>Loading prices...</Text>
      </View>
    );
  }

  // Error state
  if (error && !data) {
    return (
      <View style={styles.centerContainer}>
        <EventPicker
          events={events}
          selectedId={selectedEventId}
          onSelect={setSelectedEventId}
          onAddPress={handleAddEvent}
        />
        <Text style={styles.errorIcon}>!</Text>
        <Text style={styles.errorText}>No price data yet</Text>
        <Text style={styles.errorDetail}>
          Run the scraper to fetch prices for this event
        </Text>
        <Text style={styles.retryHint}>Pull down to retry</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centerContainer}>
        <EventPicker
          events={events}
          selectedId={selectedEventId}
          onSelect={setSelectedEventId}
          onAddPress={handleAddEvent}
        />
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
          onRefresh={handleRefresh}
          tintColor={COLORS.green}
          colors={[COLORS.green]}
        />
      }
    >
      {/* Event Picker */}
      <EventPicker
        events={events}
        selectedId={selectedEventId}
        onSelect={setSelectedEventId}
        onAddPress={handleAddEvent}
      />

      {/* Event Info */}
      <EventHeader event={data.event} />

      {/* Best Deal Banner */}
      {data.best_deal && (
        <BestDealBanner bestDeal={data.best_deal} scrapedAt={data.scraped_at} />
      )}

      {/* Price History Button */}
      <TouchableOpacity style={styles.historyButton} onPress={handlePriceHistory}>
        <Text style={styles.historyButtonText}>VIEW PRICE HISTORY</Text>
      </TouchableOpacity>

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
  emptyTitle: {
    ...FONTS.h1,
    marginBottom: SPACING.sm,
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
    marginBottom: SPACING.lg,
  },
  emptyCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    padding: SPACING.xl,
    alignItems: 'center',
  },
  historyButton: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  historyButtonText: {
    ...FONTS.badge,
    color: COLORS.blue,
    letterSpacing: 2,
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
