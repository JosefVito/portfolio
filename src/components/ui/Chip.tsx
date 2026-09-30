export function Chip({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span className={`label inline-block rounded-md border px-2.5 py-1 text-[11.5px] tracking-[0.08em] ${accent ? "border-accent text-accent" : "border-line text-muted"}`}>
      {children}
    </span>
  );
}
