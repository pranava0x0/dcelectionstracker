"use client";

import { useEffect, useState } from "react";
import { classifyViewport, type DeviceClass } from "./viewport";

// Client-side hook for the rare component that actually needs to branch on
// device class in JS rather than CSS. Prefer Tailwind's `sm:` / `md:` / `lg:`
// classes over this — they cost no JS and switch immediately on resize. This
// hook exists for layouts that can't be expressed in CSS (e.g. swapping
// between a desktop nav and a `<details>` mobile-nav at the same breakpoint
// used elsewhere).
//
// On the server (SSR / static export at build time) `window` is undefined, so
// we return `desktop` deterministically and re-classify on mount. The
// `resize` listener is the autodetection mechanism for "desktop windows
// resized" — CSS handles the rendered styles, this hook keeps any JS state
// in sync.
export function useViewport(): DeviceClass {
  const [device, setDevice] = useState<DeviceClass>("desktop");

  useEffect(() => {
    const update = (): void => setDevice(classifyViewport(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return device;
}
