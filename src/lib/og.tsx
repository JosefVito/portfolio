export const OG_SIZE = { width: 1200, height: 630 };

export function OgCard({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#0a0a0b", color: "#f2f1ec", fontFamily: "Helvetica, Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 28, fontWeight: 700 }}>
        <div style={{ width: 14, height: 14, borderRadius: 999, background: "#45f0b4" }} />JV
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 24, letterSpacing: 4, color: "#45f0b4", textTransform: "uppercase" }}>{eyebrow}</div>
        <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1, marginTop: 16, letterSpacing: -2 }}>{title}</div>
        <div style={{ fontSize: 30, color: "#8d8b84", marginTop: 20 }}>{sub}</div>
      </div>
    </div>
  );
}
