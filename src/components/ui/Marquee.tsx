"use client";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { useRef } from "react";
import { marqueeSpeed, marqueeX } from "@/lib/marquee";

/** Faint outlined word crawling behind a section. Two identical rows; it wraps at one row width. */
export function Marquee({ word, position = "top", className = "" }: { word: string; position?: "top" | "bottom"; className?: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const distance = useRef(0);
  const velocity = useRef(0);
  const row = useRef<HTMLSpanElement>(null);
  useLenis(l => { velocity.current = l.velocity; });

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    distance.current += (marqueeSpeed(velocity.current) * delta) / 1000;
    x.set(marqueeX(distance.current, row.current?.offsetWidth ?? 0));
  });

  const text = Array.from({ length: 4 }, () => word).join(" · ");
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-x-0 overflow-hidden select-none ${position === "top" ? "top-[8%]" : "bottom-[-4%]"} ${className}`}>
      <motion.div className="marquee-track display stroke-faint text-[clamp(120px,20vw,280px)] font-bold" style={{ x }}>
        <span ref={row} className="pr-[1em]">{text}</span>
        <span className="pr-[1em]">{text}</span>
      </motion.div>
    </div>
  );
}
