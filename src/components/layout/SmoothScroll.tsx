"use client";
import { ReactLenis } from "lenis/react";

// Touch falls through to native scrolling (syncTouch is off by default). Anchors offset for the floating nav.
export function SmoothScroll() {
  return <ReactLenis root options={{ duration: 1.1, anchors: { offset: -96 } }} />;
}
