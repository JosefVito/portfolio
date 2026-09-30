/** px per second: a calm 40 at rest, up to 120 while the page is being scrolled fast. */
export function marqueeSpeed(scrollVelocity: number): number {
  return 40 + Math.min(Math.abs(scrollVelocity), 40) * 2;
}

/** translateX in px for a distance travelled, wrapped to one row width so the loop never jumps. */
export function marqueeX(distance: number, rowWidth: number): number {
  return rowWidth > 0 ? -(distance % rowWidth) || 0 : 0;
}
