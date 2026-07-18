"use client";

import useIsMobile from "@/lib/useIsMobile";
import CinemaSequence from "@/components/CinemaSequence";
import MobileCinema from "@/components/MobileCinema";

/**
 * Device gate for the homepage's second act. Desktop gets the pinned,
 * camera-driven cinema; mobile gets the dedicated scroll-native retelling.
 * Renders nothing until the device is known (the section is below the fold,
 * so the swap is never visible).
 */
export default function HomeCinema() {
  const mobile = useIsMobile();
  if (mobile === null) return null;
  return mobile ? <MobileCinema /> : <CinemaSequence />;
}
