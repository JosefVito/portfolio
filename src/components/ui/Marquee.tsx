"use client";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useRef } from "react";

export function Marquee({ word, position = "top", className = "" }: { word: string; position?: "top" | "bottom"; className?: string }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const velocity = useRef(0);
  useLenis(l => { velocity.current = l.velocity; });

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const speed = 40 + Math.min(Math.abs(velocity.current), 40) * 4; // px per second
    base.set((base.get() - (speed * delta) / 1000) % 10000);
  });
  const x = useTransform(base, v => `${v % 50}%`); // ponytail: two copies of the word row; wrap at half width

  const row = Array.from({ length: 4 }, () => word).join(" ");
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 overflow-hidden select-none ${position === "top" ? "top-[10%]" : "bottom-[-4%]"} ${className}`}>
      <motion.div className="marquee-track display text-outline text-[clamp(120px,22vw,320px)] font-bold" style={{ x }}>
        <span className="pr-[1em]">{row}</span>
        <span className="pr-[1em]">{row}</span>
      </motion.div>
    </div>
  );
}
