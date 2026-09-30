export function formatStat(v: number, target: number): string {
  return Number.isInteger(target) ? String(Math.round(v)) : v.toFixed(1);
}
