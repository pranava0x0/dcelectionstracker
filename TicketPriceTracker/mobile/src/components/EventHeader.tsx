/**
 * Event header card with countdown timer.
 * Sports-betting style: bold event name, venue, live countdown.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../constants/theme';
import { getCountdown } from '../utils/dateUtils';
import type { Event } from '../types';

interface EventHeaderProps {
  event: Event;
}

export default function EventHeader({ event }: EventHeaderProps) {
  const [countdown, setCountdown] = useState(() => getCountdown(event.event_date));

  useEffect(() => {
    // Immediately update when event changes (fixes stale state on switch)
    setCountdown(getCountdown(event.event_date));

    const interval = setInterval(() => {
      setCountdown(getCountdown(event.event_date));
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [event.event_date]);

  // Parse teams from event name
  const name = event.name;

  return (
    <View style={styles.container}>
      <View style={styles.liveIndicator}>
        <View style={styles.dot} />
        <Text style={styles.liveText}>TRACKING</Text>
      </View>

      <Text style={styles.eventName} numberOfLines={2}>
        {name}
      </Text>

      <Text style={styles.venue}>{event.venue}</Text>

      <View style={styles.countdownRow}>
        <Text style={styles.countdownLabel}>STARTS IN</Text>
        <Text style={styles.countdownValue}>{countdown}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bgCard,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green,
    marginRight: SPACING.xs,
  },
  liveText: {
    ...FONTS.badge,
    color: COLORS.green,
    textTransform: 'uppercase',
  },
  eventName: {
    ...FONTS.h1,
    marginBottom: SPACING.xs,
  },
  venue: {
    ...FONTS.body,
    marginBottom: SPACING.md,
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
  },
  countdownLabel: {
    ...FONTS.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  countdownValue: {
    fontFamily: 'Courier',
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.yellow,
  },
});
