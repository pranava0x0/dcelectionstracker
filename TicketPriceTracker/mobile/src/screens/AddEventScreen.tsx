/**
 * Search and add new events to track.
 *
 * Searches via SeatGeek API, shows results, and lets the user
 * tap to start tracking an event.
 */

import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../constants/theme';
import { API_BASE_URL, ENDPOINTS } from '../constants/api';
import { useEventSearch } from '../hooks/useEventSearch';
import type { RootStackParamList } from '../navigation';
import type { SearchResult } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEvent'>;

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function AddEventScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const { results, loading, error, search, clear } = useEventSearch();
  const [tracking, setTracking] = useState<number | null>(null);

  const handleSearch = useCallback(() => {
    Keyboard.dismiss();
    if (query.trim()) {
      search(query.trim());
    } else {
      clear();
    }
  }, [query, search, clear]);

  const handleTrack = useCallback(async (result: SearchResult) => {
    setTracking(result.seatgeek_id);
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.trackEvent}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: result.name,
          venue: `${result.venue}, ${result.city}`,
          event_date: result.event_date,
          urls: { seatgeek: result.seatgeek_url },
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to track event: ${response.status}`);
      }

      navigation.goBack();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to track event';
      Alert.alert('Error', message);
    } finally {
      setTracking(null);
    }
  }, [navigation]);

  const renderResult = useCallback(({ item }: { item: SearchResult }) => {
    const isTracking = tracking === item.seatgeek_id;
    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() => handleTrack(item)}
        disabled={isTracking}
      >
        <View style={styles.resultContent}>
          <Text style={styles.resultName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.resultVenue}>
            {item.venue}, {item.city}
          </Text>
          <Text style={styles.resultDate}>{formatDate(item.event_date)}</Text>
        </View>
        <View style={styles.trackAction}>
          {isTracking ? (
            <ActivityIndicator size="small" color={COLORS.green} />
          ) : (
            <Text style={styles.trackText}>TRACK</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [handleTrack, tracking]);

  return (
    <View style={styles.screen}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search events (e.g. duke basketball)"
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoFocus
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.bg} />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Results */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.seatgeek_id)}
          renderItem={renderResult}
          contentContainerStyle={styles.listContent}
        />
      ) : !loading && query.length > 0 && results.length === 0 && !error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No events found</Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.hintText}>
            Search for a team, artist, or event name
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
    padding: SPACING.lg,
  },
  searchRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchButton: {
    backgroundColor: COLORS.green,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: COLORS.bg,
    fontWeight: '700',
    fontSize: 15,
  },
  listContent: {
    gap: SPACING.sm,
    paddingBottom: SPACING.xxxl,
  },
  resultCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  resultName: {
    ...FONTS.h2,
    marginBottom: 4,
  },
  resultVenue: {
    ...FONTS.body,
    marginBottom: 2,
  },
  resultDate: {
    ...FONTS.caption,
    color: COLORS.green,
  },
  trackAction: {
    minWidth: 60,
    alignItems: 'center',
  },
  trackText: {
    color: COLORS.green,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },
  errorContainer: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderRed,
    marginBottom: SPACING.md,
  },
  errorText: {
    ...FONTS.body,
    color: COLORS.red,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textMuted,
  },
  hintText: {
    ...FONTS.body,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
