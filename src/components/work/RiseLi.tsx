"use client";
import { motion } from "motion/react";
import { EASE } from "@/lib/motion";

const rise = {
  hidden: { opacity: 0, y: 48, rotate: 3 },
  // inherit: true so the per-card delay passed through `transition` is merged in
  visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.8, ease: EASE, inherit: true } },
};

/** A card that rises into place, staggered by its index, so the row arrives as a wave.
 * The parent track decides when (it owns whileInView): a per-card trigger left off-screen cards
 * parked 48px low, which made the track scroll vertically and clip the covers. */
export function RiseLi({ index, className, children }: { index: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.li className={className} variants={rise} transition={{ delay: index * 0.14 }}>
      {children}
    </motion.li>
  );
}
