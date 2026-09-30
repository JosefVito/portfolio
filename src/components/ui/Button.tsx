import Link from "next/link";
import { Magnetic } from "@/components/ui/Magnetic";

type Props = { href: string; children: React.ReactNode; variant?: "primary" | "ghost"; external?: boolean; className?: string };

export function Button({ href, children, variant = "primary", external, className = "" }: Props) {
  const base = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-colors";
  const look = variant === "primary"
    ? "bg-accent text-accent-ink shadow-[0_12px_32px_-12px_var(--color-accent-glow)] hover:brightness-110"
    : "border border-line text-fg hover:bg-surface-hover";
  const cls = `${base} ${look} ${className}`;
  const el = external
    ? <a href={href} target="_blank" rel="noreferrer" className={cls}>{children}</a>
    : <Link href={href} className={cls}>{children}</Link>;
  return <Magnetic>{el}</Magnetic>;
}
