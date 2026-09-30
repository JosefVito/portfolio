import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Josef Vito — home" className={`display inline-flex items-center gap-2 text-[15px] font-bold tracking-tight ${className}`}>
      <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent-glow)]" aria-hidden />
      JV
    </Link>
  );
}
