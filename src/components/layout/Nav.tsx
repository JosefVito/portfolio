"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { hrefFor, NAV_LINKS } from "@/components/layout/nav-links";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { EASE } from "@/lib/motion";

export function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > last && y > 80 && !open);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (!isHome) return;
    const sections = NAV_LINKS.map(l => document.getElementById(l.href.slice(1))).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(`#${e.target.id}`); });
    }, { threshold: 0.5 });
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [isHome]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-6 z-50 flex justify-center px-4"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: hidden ? -96 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <nav aria-label="Primary" className="flex items-center gap-1 rounded-full border border-line bg-bg/70 py-2 pl-6 pr-2 backdrop-blur-md">
          <Logo className="mr-3" />
          {!isHome && <Link href="/#work" className="hidden md:inline px-4 py-2 text-base text-muted hover:text-fg">All work</Link>}
          <ul className="hidden md:flex items-center">
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <Link href={hrefFor(l, pathname)} className="relative px-4 py-2 text-base text-muted transition-colors hover:text-fg" aria-current={active === l.href ? "location" : undefined}>
                  {active === l.href && <span aria-hidden className="absolute left-0.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-accent" />}
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Magnetic className="hidden md:inline-block ml-1">
            <Link href={isHome ? "#contact" : "/#contact"} className="inline-flex rounded-full bg-accent px-6 py-3 text-base font-medium text-accent-ink shadow-[0_8px_24px_-8px_var(--color-accent-glow)]">Hire me</Link>
          </Magnetic>
          <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(o => !o)} className="md:hidden ml-1 inline-flex size-12 items-center justify-center rounded-full border border-line">
            {/* three real bars in a column: equal width, one left edge, even gaps */}
            <span aria-hidden className="flex flex-col gap-[6px]">
              <span data-bar className="block h-[2px] w-5 bg-fg" />
              <span data-bar className="block h-[2px] w-5 bg-fg" />
              <span data-bar className="block h-[2px] w-5 bg-fg" />
            </span>
          </button>
        </nav>
      </motion.header>
      <MobileMenu open={open} onClose={close} pathname={pathname} />
    </>
  );
}
