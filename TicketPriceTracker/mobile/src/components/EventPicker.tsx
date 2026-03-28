/**
 * Horizontal pill-style event selector.
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../constants/theme';
import { formatShortDate, shortName } from '../utils/dateUtils';
import type { TrackedEvent } from '../types';

interface EventPickerProps {
  events: TrackedEvent[];
  selectedId: number | null;
  onSelect: (eventId: number) => void;
  onAddPress: () => void;
}

export default function EventPicker({
  events,
  selectedId,
  onSelect,
  onAddPress,
}: EventPickerProps) {
  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Text style={styles.addButtonText}>+ Add Event</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      {events.map((event) => {
        const isSelected = event.id === selectedId;
        return (
          <TouchableOpacity
            key={event.id}
            style={[styles.pill, isSelected && styles.pillSelected]}
            onPress={() => onSelect(event.id)}
          >
            <Text
              style={[styles.pillText, isSelected && styles.pillTextSelected]}
              numberOfLines={1}
            >
              {shortName(event.name)}
            </Text>
            <Text
              style={[styles.pillDate, isSelected && styles.pillDateSelected]}
            >
              {formatShortDate(event.event_date)}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.addPill} onPress={onAddPress}>
        <Text style={styles.addPillText}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  scrollContent: {
    paddingRight: SPACING.lg,
    gap: SPACING.sm,
  },
  pill: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxWidth: 260,
  },
  pillSelected: {
    backgroundColor: COLORS.bgHighlight,
    borderColor: COLORS.green,
  },
  pillText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  pillTextSelected: {
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  pillDate: {
    ...FONTS.caption,
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  pillDateSelected: {
    color: COLORS.green,
  },
  addPill: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPillText: {
    color: COLORS.green,
    fontSize: 20,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.green,
    alignSelf: 'center',
  },
  addButtonText: {
    ...FONTS.h2,
    color: COLORS.green,
  },
});
