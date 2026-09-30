"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { hrefFor, NAV_LINKS } from "@/components/layout/nav-links";
import { Logo } from "@/components/ui/Logo";
import { LocalTime } from "@/components/ui/LocalTime";
import { profile } from "@/data/profile";

export function Footer() {
  const pathname = usePathname();
  const lenis = useLenis();
  return (
    <footer className="container-x border-t border-line py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Logo />
        <ul className="flex flex-wrap gap-4 label text-muted">
          {NAV_LINKS.map(l => <li key={l.href}><Link href={hrefFor(l, pathname)} className="hover:text-fg">{l.label}</Link></li>)}
        </ul>
        <p className="label text-muted">
          © {new Date().getFullYear()} {profile.firstName} {profile.lastName} · {profile.city.split(" · ")[0]} · <LocalTime timeZone={profile.timeZone} /> · Built with Next.js
        </p>
        <button type="button" onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0 }))} className="label rounded-full border border-line px-3 py-2 text-muted hover:text-fg">↑ Top</button>
      </div>
    </footer>
  );
}
