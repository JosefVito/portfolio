"use client";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { hrefFor, NAV_LINKS } from "@/components/layout/nav-links";
import { EASE } from "@/lib/motion";
import { profile } from "@/data/profile";
import { whatsappHref } from "@/lib/whatsapp";

export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog" aria-modal="true" aria-label="Menu"
          className="fixed inset-0 z-40 flex flex-col justify-between bg-bg/95 px-6 pb-8 pt-24 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25, ease: EASE }}
        >
          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((l, i) => (
              <motion.li key={l.href} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 * i, ease: EASE }}>
                <Link href={hrefFor(l, pathname)} onClick={onClose} className="display block py-3 text-[clamp(40px,10vw,64px)] font-bold">{l.label}</Link>
              </motion.li>
            ))}
          </ul>
          <div className="flex flex-col gap-4">
            <a href={whatsappHref()} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-6 py-4 text-center font-medium text-accent-ink">Chat on WhatsApp</a>
            <div className="flex gap-6 label text-muted">
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
