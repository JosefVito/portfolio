import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

// whatsappHref() reads this at render time; components that call it would throw without it.
process.env.NEXT_PUBLIC_WHATSAPP = "15550000000";

// jsdom has no IntersectionObserver or matchMedia; motion and our hooks need both.
class IO {
  constructor(private cb: IntersectionObserverCallback) {}
  observe(el: Element) {
    this.cb([{ isIntersecting: true, target: el } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
  root = null; rootMargin = ""; thresholds = [];
}
vi.stubGlobal("IntersectionObserver", IO);
// Node-environment tests (route handlers) have no window.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false, media: query, onchange: null,
      addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; },
    }),
  });
}
