// Viewport classification matches the Tailwind breakpoint contract used
// across the site. Mobile-first: anything narrower than `sm` (640px) is a
// phone; `sm` up to but excluding `lg` (1024px) is a tablet; `lg` and up is
// desktop. The same thresholds drive every responsive class on the site, so
// changing them here is a single-point edit.

export type DeviceClass = "mobile" | "tablet" | "desktop";

export const BREAKPOINTS = {
  tablet: 640,
  desktop: 1024,
} as const;

export function classifyViewport(width: number): DeviceClass {
  if (!Number.isFinite(width) || width < BREAKPOINTS.tablet) return "mobile";
  if (width < BREAKPOINTS.desktop) return "tablet";
  return "desktop";
}
