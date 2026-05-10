const NUM_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
];

export function timeUntilPrimaryHeadline(
  targetIso: string,
  now: number = Date.now(),
): string {
  const ms = new Date(targetIso).getTime() - now;
  if (ms <= 0) return "The primary is here.";
  const days = Math.ceil(ms / (24 * 3600 * 1000));
  if (days < 7) {
    return days === 1
      ? "One day until the primary."
      : `${days} days until the primary.`;
  }
  const weeks = Math.round(days / 7);
  const word = NUM_WORDS[weeks] ?? `${weeks}`;
  return `${word} ${weeks === 1 ? "week" : "weeks"} until the primary.`;
}
