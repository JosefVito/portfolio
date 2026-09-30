"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { hrefFor, NAV_LINKS } from "@/components/layout/nav-links";
import { Logo } from "@/components/ui/Logo";
import { SocialIcons } from "@/components/ui/SocialIcons";
import { profile } from "@/data/profile";

export function Footer() {
  const pathname = usePathname();
  const lenis = useLenis();
  return (
    <footer className="container-x border-t border-line py-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <Logo />
        <ul className="flex flex-wrap gap-5 label text-muted">
          {NAV_LINKS.map(l => <li key={l.href}><Link href={hrefFor(l, pathname)} className="hover:text-fg">{l.label}</Link></li>)}
        </ul>
        <SocialIcons />
        <button type="button" onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0 }))} className="label rounded-full border border-line px-4 py-3 text-muted hover:text-fg">↑ Top</button>
      </div>
      <p className="label mt-8 text-muted">© {new Date().getFullYear()} {profile.firstName} {profile.lastName}</p>
    </footer>
  );
}
