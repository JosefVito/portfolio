export function trackProgress(scrollLeft: number, scrollWidth: number, clientWidth: number, count: number) {
  const max = scrollWidth - clientWidth;
  const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, scrollLeft / max));
  const index = Math.round(ratio * (count - 1));
  return { ratio, index };
}
