/**
 * Event header card with countdown timer.
 * Sports-betting style: bold event name, venue, live countdown.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BORDER_RADIUS, COLORS, FONTS, SPACING } from '../constants/theme';
import type { Event } from '../types';

interface EventHeaderProps {
  event: Event;
}

function getCountdown(eventDateStr: string): string {
  // Try to parse the date string
  // Format: "Friday, March 27, 2026 @ 7:10 PM"
  const cleaned = eventDateStr
    .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i, '')
    .replace('@', '')
    .trim();

  const target = new Date(cleaned);
  if (isNaN(target.getTime())) {
    return eventDateStr;
  }

  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return 'LIVE NOW';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

export default function EventHeader({ event }: EventHeaderProps) {
  const [countdown, setCountdown] = useState(() => getCountdown(event.event_date));

  useEffect(() => {
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
