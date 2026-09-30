"use client";
import { motion, useReducedMotion } from "motion/react";
import { EASE, viewportOnce } from "@/lib/motion";

const rise = {
  hidden: { opacity: 0, y: 48, rotate: 3 },
  // inherit: true so the per-card delay passed through `transition` is merged in
  visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.8, ease: EASE, inherit: true } },
};

/** A card that rises into place once, staggered by its index, so the row arrives as a wave. */
export function RiseLi({ index, className, children }: { index: number; className?: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.li className={className} variants={rise} initial={reduce ? false : "hidden"} whileInView="visible" viewport={viewportOnce} transition={{ delay: index * 0.14 }}>
      {children}
    </motion.li>
  );
}
